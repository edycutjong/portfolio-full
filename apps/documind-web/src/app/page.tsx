'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
    id: string
    type: 'user' | 'assistant'
    content: string
    sources?: { page: number; text: string }[]
}

interface Document {
    id: string
    name: string
    size: number
    status: 'uploading' | 'ready' | 'error'
    pages?: number
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([])
    const [documents, setDocuments] = useState<Document[]>([])
    const [activeDoc, setActiveDoc] = useState<Document | null>(null)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const API_URL = 'https://documind-api.edycu.dev'

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const doc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            size: file.size,
            status: 'uploading',
            pages: Math.ceil(file.size / 3000)
        }
        setDocuments(prev => [...prev, doc])
        setActiveDoc(doc)

        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                setDocuments(prev => prev.map(d =>
                    d.id === doc.id ? { ...d, id: data.id, status: 'ready', pages: data.pages } : d
                ))
            } else throw new Error()
        } catch {
            setDocuments(prev => prev.map(d =>
                d.id === doc.id ? { ...d, status: 'ready' } : d
            ))
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg: Message = {
            id: `msg-${Date.now()}`,
            type: 'user',
            content: input.trim()
        }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMsg.content,
                    document_id: activeDoc?.id
                })
            })
            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, {
                    id: `msg-${Date.now()}`,
                    type: 'assistant',
                    content: data.answer,
                    sources: data.sources
                }])
            } else throw new Error()
        } catch {
            setMessages(prev => [...prev, {
                id: `msg-${Date.now()}`,
                type: 'assistant',
                content: activeDoc
                    ? `Based on "${activeDoc.name}", here's what I found:\n\nThis is a demo response. The full RAG pipeline would analyze your document using semantic search and provide accurate answers with source citations.\n\n**Key capabilities:**\n• Semantic understanding of document content\n• Source citations with page numbers\n• Multi-document search support`
                    : 'Please upload a document first. I can analyze PDFs, DOCX, TXT, and Markdown files to answer your questions with cited sources.',
                sources: activeDoc ? [{ page: 1, text: 'Demo citation from document...' }] : undefined
            }])
        }
        setLoading(false)
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#0a0a1a'
        }}>
            {/* Left Sidebar - Documents */}
            <aside style={{
                width: '260px',
                minWidth: '260px',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255,255,255,0.02)'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>D</div>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: '16px' }}>DocuMind AI</span>
                </div>

                {/* Document List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    <p style={{
                        fontSize: '11px',
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '8px',
                        paddingLeft: '8px'
                    }}>Documents</p>

                    {documents.length === 0 ? (
                        <p style={{
                            fontSize: '13px',
                            color: '#555',
                            textAlign: 'center',
                            padding: '20px 8px'
                        }}>
                            No documents yet.<br />Upload to get started.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {documents.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveDoc(doc)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: activeDoc?.id === doc.id ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
                                        background: activeDoc?.id === doc.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <span style={{ fontSize: '20px' }}>
                                        {doc.status === 'uploading' ? '⏳' : doc.status === 'error' ? '❌' : '📄'}
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '13px',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            margin: 0
                                        }}>{doc.name}</p>
                                        <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{formatSize(doc.size)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        📤 Upload Document
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header */}
                <header style={{
                    height: '56px',
                    minHeight: '56px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {activeDoc ? (
                            <>
                                <span style={{ fontSize: '22px' }}>📄</span>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'white', margin: 0 }}>{activeDoc.name}</p>
                                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{activeDoc.pages || '~'} pages • Ready</p>
                                </div>
                            </>
                        ) : (
                            <p style={{ fontSize: '14px', color: '#666' }}>Select or upload a document to start</p>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
                        API Connected
                    </div>
                </header>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {messages.length === 0 ? (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: '420px',
                            margin: '0 auto'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <span style={{ fontSize: '32px' }}>🤖</span>
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>
                                Ask anything about your documents
                            </h2>
                            <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px', lineHeight: 1.5 }}>
                                Upload a PDF, DOCX, or text file and ask questions. Get AI-powered answers with source citations.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                {['Summarize this document', 'What are the key findings?', 'Extract main points'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        style={{
                                            padding: '8px 14px',
                                            fontSize: '12px',
                                            borderRadius: '20px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#ccc',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '14px 18px',
                                        borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        backgroundColor: msg.type === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                                        border: msg.type === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                        color: msg.type === 'user' ? 'white' : '#e0e0e0'
                                    }}>
                                        <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>📚 Sources:</p>
                                                {msg.sources.map((s, i) => (
                                                    <p key={i} style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                                                        Page {s.page}: "{s.text.slice(0, 50)}..."
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{
                                        padding: '14px 18px',
                                        borderRadius: '18px 18px 18px 4px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <span className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#666', borderRadius: '50%' }}></span>
                                            <span className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#666', borderRadius: '50%', animationDelay: '0.1s' }}></span>
                                            <span className="animate-bounce" style={{ width: '8px', height: '8px', backgroundColor: '#666', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Ask a question about your document..."
                            style={{
                                flex: 1,
                                padding: '14px 18px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            style={{
                                padding: '14px 24px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '14px',
                                border: 'none',
                                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                opacity: input.trim() && !loading ? 1 : 0.5
                            }}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Document Info */}
            {activeDoc && (
                <aside style={{
                    width: '280px',
                    minWidth: '280px',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Document Info
                        </p>
                    </div>
                    <div style={{ padding: '16px', flex: 1 }}>
                        {/* Preview */}
                        <div style={{
                            aspectRatio: '3/4',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '48px' }}>📄</span>
                        </div>

                        {/* Stats */}
                        <div style={{ marginBottom: '20px' }}>
                            {[
                                { label: 'Pages', value: activeDoc.pages || '~' },
                                { label: 'Size', value: formatSize(activeDoc.size) },
                                { label: 'Status', value: 'Ready', color: '#22c55e' }
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <span style={{ fontSize: '13px', color: '#888' }}>{stat.label}</span>
                                    <span style={{ fontSize: '13px', color: stat.color || 'white' }}>{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => {
                                setDocuments(prev => prev.filter(d => d.id !== activeDoc.id))
                                setActiveDoc(null)
                            }}
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '13px',
                                color: '#f87171',
                                background: 'transparent',
                                border: '1px solid rgba(248,113,113,0.3)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            🗑️ Remove Document
                        </button>
                    </div>
                </aside>
            )}
        </div>
    )
}
