'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface UploadedDoc {
    id: string
    name: string
    size: string
    status: 'uploading' | 'ready' | 'error'
}

export default function Home() {
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [documents, setDocuments] = useState<UploadedDoc[]>([])
    const [activeDocId, setActiveDocId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const API_URL = 'https://documind-api.edycu.dev'

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const tempId = `doc-${Date.now()}`
        const newDoc: UploadedDoc = {
            id: tempId,
            name: file.name,
            size: formatFileSize(file.size),
            status: 'uploading'
        }

        setDocuments(prev => [...prev, newDoc])

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const data = await response.json()
                setDocuments(prev => prev.map(d =>
                    d.id === tempId ? { ...d, id: data.id, status: 'ready' } : d
                ))
                setActiveDocId(data.id)
            } else {
                setDocuments(prev => prev.map(d =>
                    d.id === tempId ? { ...d, status: 'error' } : d
                ))
            }
        } catch {
            // Demo mode - simulate success
            setDocuments(prev => prev.map(d =>
                d.id === tempId ? { ...d, status: 'ready' } : d
            ))
            setActiveDocId(tempId)
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDropzoneClick = () => {
        fileInputRef.current?.click()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (file && fileInputRef.current) {
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            fileInputRef.current.files = dataTransfer.files
            handleFileSelect({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const handleAsk = async () => {
        if (!question.trim()) return

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            type: 'user',
            content: question,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setQuestion('')
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMessage.content,
                    document_id: activeDocId
                }),
            })

            let answerText = ''
            if (response.ok) {
                const data = await response.json()
                answerText = data.answer || 'No answer received.'
                if (data.sources?.length) {
                    answerText += '\n\n📚 Sources:\n' + data.sources.map((s: { page?: number; text?: string }) =>
                        `• Page ${s.page}: "${s.text?.slice(0, 100)}..."`
                    ).join('\n')
                }
            } else {
                throw new Error('API error')
            }

            const assistantMessage: Message = {
                id: `msg-${Date.now()}`,
                type: 'assistant',
                content: answerText,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMessage])
        } catch {
            // Demo mode
            const demoAnswer = documents.length > 0
                ? `Based on "${documents[0]?.name}", I found relevant information about your question.\n\nThis is a demo response. In production, the RAG pipeline would analyze your document and provide accurate, cited answers using GPT-4o-mini.\n\n📚 Features:\n• Semantic search across documents\n• Source citations with page numbers\n• Multi-document Q&A support`
                : `Please upload a document first to get AI-powered answers with citations.\n\nSupported formats: PDF, DOCX, TXT, MD`

            const assistantMessage: Message = {
                id: `msg-${Date.now()}`,
                type: 'assistant',
                content: demoAnswer,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAsk()
        }
    }

    return (
        <main className="min-h-screen flex flex-col">
            {/* Compact Header */}
            <header className="py-6 px-8 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">📄</span>
                        <h1 className="text-2xl font-bold">
                            <span className="gradient-text">DocuMind AI</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-gray-400">API Online</span>
                    </div>
                </div>
            </header>

            {/* Main Content - Side by Side */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-6">
                <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-180px)]">

                    {/* Left Panel - Documents */}
                    <div className="glass-card flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                📁 Documents
                                {documents.length > 0 && (
                                    <span className="text-xs bg-primary-500/30 text-primary-300 px-2 py-0.5 rounded-full">
                                        {documents.length}
                                    </span>
                                )}
                            </h2>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf,.docx,.txt,.md"
                                className="hidden"
                            />
                            <div
                                onClick={handleDropzoneClick}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-primary-500 hover:bg-primary-500/5 transition-all cursor-pointer"
                            >
                                <div className="text-4xl mb-3">📤</div>
                                <p className="text-gray-300 mb-1">Drop files here or click to upload</p>
                                <p className="text-xs text-gray-500">PDF, DOCX, TXT, MD (max 10MB)</p>
                            </div>
                        </div>

                        {/* Document List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            {documents.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p className="text-sm">No documents uploaded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setActiveDocId(doc.id)}
                                            className={`p-3 rounded-lg cursor-pointer transition-all ${activeDocId === doc.id
                                                ? 'bg-primary-500/20 border border-primary-500/50'
                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">
                                                    {doc.status === 'uploading' ? '⏳' : doc.status === 'error' ? '❌' : '📄'}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.size}</p>
                                                </div>
                                                {activeDocId === doc.id && (
                                                    <span className="text-xs text-primary-400">Active</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Chat */}
                    <div className="glass-card flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                💬 Ask Questions
                            </h2>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                    <span className="text-5xl mb-4">🤖</span>
                                    <p className="text-lg font-medium text-gray-300 mb-2">Ask anything about your documents</p>
                                    <p className="text-sm max-w-sm">
                                        Upload a document and ask questions. Get AI-powered answers with source citations.
                                    </p>
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white/10 text-gray-200'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-3">
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask a question about your documents..."
                                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none resize-none text-white placeholder-gray-500 text-sm"
                                    rows={2}
                                />
                                <button
                                    onClick={handleAsk}
                                    disabled={loading || !question.trim()}
                                    className="px-6 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? '...' : '🚀'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="max-w-7xl mx-auto px-6 pb-8">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-5 text-center">
                        <div className="text-2xl mb-2">🤖</div>
                        <h3 className="font-semibold text-sm mb-1">GPT-4o-mini</h3>
                        <p className="text-xs text-gray-400">Powered by OpenAI</p>
                    </div>
                    <div className="glass-card p-5 text-center">
                        <div className="text-2xl mb-2">🔗</div>
                        <h3 className="font-semibold text-sm mb-1">RAG Pipeline</h3>
                        <p className="text-xs text-gray-400">Cited answers</p>
                    </div>
                    <div className="glass-card p-5 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="font-semibold text-sm mb-1">Real-time</h3>
                        <p className="text-xs text-gray-400">Instant processing</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-4 text-gray-500 text-xs border-t border-white/5">
                <p>Part of <a href="https://edycu.dev" className="text-primary-400 hover:underline">edycu.dev</a> portfolio</p>
            </footer>
        </main>
    )
}
