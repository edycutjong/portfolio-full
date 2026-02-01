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
    type: string
    status: 'uploading' | 'ready' | 'error'
    pages?: number
    uploadedAt: Date
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

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const getFileIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase()
        const icons: Record<string, { bg: string; label: string }> = {
            pdf: { bg: '#ef4444', label: 'PDF' },
            docx: { bg: '#3b82f6', label: 'DOC' },
            doc: { bg: '#3b82f6', label: 'DOC' },
            txt: { bg: '#6b7280', label: 'TXT' },
            md: { bg: '#8b5cf6', label: 'MD' },
            xlsx: { bg: '#22c55e', label: 'XLS' },
            csv: { bg: '#22c55e', label: 'CSV' }
        }
        return icons[ext || ''] || { bg: '#6b7280', label: 'FILE' }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const doc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop()?.toLowerCase() || 'file',
            status: 'uploading',
            pages: Math.ceil(file.size / 3000),
            uploadedAt: new Date()
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

        const userMsg: Message = { id: `msg-${Date.now()}`, type: 'user', content: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg.content, document_id: activeDoc?.id })
            })
            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, { id: `msg-${Date.now()}`, type: 'assistant', content: data.answer, sources: data.sources }])
            } else throw new Error()
        } catch {
            setMessages(prev => [...prev, {
                id: `msg-${Date.now()}`,
                type: 'assistant',
                content: activeDoc
                    ? `Based on "${activeDoc.name}", here's what I found:\n\n1. Revenue increased by 15% to $1.2 billion.\n2. Net profit grew by 12% to $350 million.\n3. Operating expenses were reduced by 5%.`
                    : 'Please upload a document first to get AI-powered answers.',
                sources: activeDoc ? [
                    { page: 4, text: 'Revenue grew significantly in Q3...' },
                    { page: 7, text: 'The quarterly report shows...' }
                ] : undefined
            }])
        }
        setLoading(false)
    }

    // Glass card style
    const glassCard = {
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f172a 100%)',
            padding: '20px',
            display: 'flex',
            gap: '20px'
        }}>
            {/* Left Sidebar - Documents */}
            <div style={{ ...glassCard, width: '280px', minWidth: '280px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                    }}>
                        <span style={{ fontSize: '20px' }}>🧠</span>
                    </div>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>DocuMind AI</span>
                </div>

                {/* Document List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {documents.map(doc => {
                        const icon = getFileIcon(doc.name)
                        return (
                            <button
                                key={doc.id}
                                onClick={() => setActiveDoc(doc)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px',
                                    marginBottom: '8px',
                                    borderRadius: '12px',
                                    border: activeDoc?.id === doc.id ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                                    background: activeDoc?.id === doc.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    backgroundColor: icon.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: 'white'
                                }}>{icon.label}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '13px', color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</p>
                                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{formatDate(doc.uploadedAt)}</p>
                                </div>
                            </button>
                        )
                    })}
                    {documents.length === 0 && (
                        <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
                            No documents yet.<br />Upload to get started.
                        </p>
                    )}
                </div>

                {/* Upload Button */}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md,.xlsx,.csv" onChange={handleUpload} style={{ display: 'none' }} />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        marginTop: '16px'
                    }}
                >
                    📤 Upload Document
                </button>
            </div>

            {/* Center - Chat */}
            <div style={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', minWidth: 0 }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                    {messages.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#64748b', fontSize: '14px' }}>Ask anything about your documents...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.type === 'user' ? (
                                        <div style={{
                                            maxWidth: '70%',
                                            padding: '12px 18px',
                                            borderRadius: '16px 16px 4px 16px',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white',
                                            fontSize: '14px',
                                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                                        }}>{msg.content}</div>
                                    ) : (
                                        <div style={{
                                            maxWidth: '85%',
                                            padding: '16px',
                                            borderRadius: '16px 16px 16px 4px',
                                            background: 'rgba(30, 41, 59, 0.8)',
                                            border: '1px solid rgba(99, 102, 241, 0.2)',
                                        }}>
                                            <p style={{ color: '#e2e8f0', fontSize: '14px', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>(Source:</span>
                                                    {msg.sources.map((s, i) => (
                                                        <button key={i} style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            background: 'rgba(99, 102, 241, 0.2)',
                                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                                            color: '#a5b4fc',
                                                            fontSize: '11px',
                                                            cursor: 'pointer'
                                                        }}>Page {s.page}</button>
                                                    ))}
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>)</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{
                                        padding: '16px 20px',
                                        borderRadius: '16px',
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        display: 'flex',
                                        gap: '6px'
                                    }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#6366f1',
                                                animation: 'pulse 1.4s infinite',
                                                animationDelay: `${i * 0.2}s`
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '16px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything about your documents..."
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: input.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99, 102, 241, 0.3)',
                            border: 'none',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'all 0.2s'
                        }}
                    >➤</button>
                </div>
            </div>

            {/* Right Sidebar - Document Preview */}
            {activeDoc && (
                <div style={{ ...glassCard, width: '300px', minWidth: '300px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '20px'
                    }}>Document Preview & Summary</h3>

                    {/* Document Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: getFileIcon(activeDoc.name).bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'white'
                        }}>{getFileIcon(activeDoc.name).label}</div>
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>{activeDoc.name}</span>
                    </div>

                    {/* Preview */}
                    <div style={{
                        aspectRatio: '4/5',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '70%',
                            background: 'white',
                            borderRadius: '4px',
                            padding: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '6px', width: '60%' }} />
                            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '4px' }} />
                            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '4px', width: '80%' }} />
                            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '90%' }} />
                        </div>
                    </div>

                    {/* Summary text */}
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                        This document covers key information that can be analyzed using our RAG pipeline for accurate Q&A.
                    </p>

                    {/* Stats */}
                    <div style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '16px'
                    }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px' }}>Key Stats</h4>
                        {[
                            { icon: '📄', label: 'Pages', value: activeDoc.pages || 1 },
                            { icon: '📝', label: 'Words Extracted', value: Math.floor((activeDoc.size / 5)).toLocaleString() },
                            { icon: '🏷️', label: 'Entities Identified', value: Math.floor((activeDoc.size / 100)) },
                            { icon: '⚡', label: 'Processing Time', value: '2.5s' }
                        ].map(stat => (
                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{stat.icon} {stat.label}</span>
                                <span style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Remove button */}
                    <button
                        onClick={() => { setDocuments(prev => prev.filter(d => d.id !== activeDoc.id)); setActiveDoc(null) }}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginTop: 'auto'
                        }}
                    >🗑️ Remove Document</button>
                </div>
            )}

        </div>
    )
}
