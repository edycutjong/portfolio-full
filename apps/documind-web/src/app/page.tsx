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
            csv: { bg: '#22c55e', label: 'CSV' },
            json: { bg: '#f59e0b', label: 'JSON' }
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

    // Glass card style - MORE TRANSPARENT like mockup
    const glassCard = {
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        borderRadius: '24px',
    }

    return (
        <div style={{
            height: '100vh',
            background: '#0a0a1a',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Background Glow Effects */}
            <div style={{
                position: 'absolute',
                top: '-30%',
                left: '5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '15%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                filter: 'blur(120px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '-10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            {/* Left Sidebar - Documents */}
            <div style={{ ...glassCard, width: '260px', minWidth: '260px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}>
                        <span style={{ fontSize: '16px' }}>🧠</span>
                    </div>
                    <span style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>DocuMind AI</span>
                </div>

                {/* Document List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {documents.map(doc => {
                        const icon = getFileIcon(doc.name)
                        const isActive = activeDoc?.id === doc.id
                        return (
                            <button
                                key={doc.id}
                                onClick={() => setActiveDoc(doc)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    marginBottom: '6px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
                                    background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    backgroundColor: icon.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '8px',
                                    fontWeight: 700,
                                    color: 'white',
                                    flexShrink: 0
                                }}>{icon.label}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '12px', color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{doc.name}</p>
                                    <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0 0' }}>{formatDate(doc.uploadedAt)}</p>
                                </div>
                            </button>
                        )
                    })}
                    {documents.length === 0 && (
                        <p style={{ color: '#64748b', fontSize: '11px', textAlign: 'center', padding: '30px 0', lineHeight: 1.6 }}>
                            No documents yet.<br />Upload to get started.
                        </p>
                    )}
                </div>

                {/* Upload Button */}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md,.xlsx,.csv,.json" onChange={handleUpload} style={{ display: 'none' }} />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                        marginTop: '12px'
                    }}
                >
                    <span style={{ fontSize: '14px' }}>⬆</span> Upload Document
                </button>
            </div>

            {/* Center - Chat */}
            <div style={{ ...glassCard, flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', minWidth: 0 }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
                    {messages.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#64748b', fontSize: '13px' }}>Ask anything about your documents...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.type === 'user' ? (
                                        <div style={{
                                            maxWidth: '75%',
                                            padding: '10px 14px',
                                            borderRadius: '14px 14px 4px 14px',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: 'white',
                                            fontSize: '12px',
                                            lineHeight: 1.5,
                                            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                                        }}>{msg.content}</div>
                                    ) : (
                                        <div style={{
                                            maxWidth: '85%',
                                            padding: '12px 14px',
                                            borderRadius: '14px 14px 14px 4px',
                                            background: 'rgba(30, 41, 59, 0.7)',
                                            border: '1px solid rgba(99, 102, 241, 0.15)',
                                        }}>
                                            <p style={{ color: '#e2e8f0', fontSize: '12px', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '10px', color: '#64748b' }}>(Source:</span>
                                                    {msg.sources.map((s, i) => (
                                                        <button key={i} style={{
                                                            padding: '3px 8px',
                                                            borderRadius: '4px',
                                                            background: 'rgba(99, 102, 241, 0.15)',
                                                            border: '1px solid rgba(99, 102, 241, 0.25)',
                                                            color: '#a5b4fc',
                                                            fontSize: '10px',
                                                            cursor: 'pointer'
                                                        }}>Page {s.page}</button>
                                                    ))}
                                                    <span style={{ fontSize: '10px', color: '#64748b' }}>)</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: '#6366f1',
                                                opacity: 0.6
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
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(99, 102, 241, 0.15)'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything about your documents..."
                        style={{
                            flex: 1,
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '12px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: input.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99, 102, 241, 0.25)',
                            border: 'none',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            transition: 'all 0.15s'
                        }}
                    >➤</button>
                </div>
            </div>

            {/* Right Sidebar - Document Preview */}
            {activeDoc && (
                <div style={{ ...glassCard, width: '260px', minWidth: '260px', padding: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <h3 style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'white',
                        marginBottom: '12px'
                    }}>Document Preview & Summary</h3>

                    {/* Document Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '16px' }}>📄</span>
                        <span style={{ fontSize: '11px', color: 'white', fontWeight: 500 }}>{activeDoc.name}</span>
                    </div>

                    {/* Preview - compact like mockup */}
                    <div style={{
                        height: '140px',
                        borderRadius: '8px',
                        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: '70%',
                            background: 'white',
                            borderRadius: '3px',
                            padding: '10px 8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ height: '6px', background: '#3b82f6', borderRadius: '1px', marginBottom: '6px', width: '60%' }} />
                            <div style={{ height: '2px', background: '#e2e8f0', borderRadius: '1px', marginBottom: '3px' }} />
                            <div style={{ height: '2px', background: '#e2e8f0', borderRadius: '1px', marginBottom: '3px', width: '90%' }} />
                            <div style={{ height: '2px', background: '#e2e8f0', borderRadius: '1px', marginBottom: '3px', width: '80%' }} />
                            <div style={{ height: '2px', background: '#e2e8f0', borderRadius: '1px', width: '70%' }} />
                        </div>
                    </div>

                    {/* Summary text */}
                    <p style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '10px' }}>
                        This document covers the company&apos;s financial performance, strategic initiatives, and market outlook for the fiscal year 2023, highlighting growth in revenue and profitability.
                    </p>

                    {/* Key Stats - no background like mockup */}
                    <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Key Stats</h4>
                        {[
                            { icon: '📄', label: 'Pages', value: activeDoc.pages || 45 },
                            { icon: 'Aa', label: 'Words Extracted', value: '12,500', isText: true },
                            { icon: '🏷', label: 'Entities Identified', value: 150 },
                            { icon: '⚡', label: 'Processing Time', value: '2.5s' }
                        ].map((stat, idx) => (
                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>
                                    {'isText' in stat ? <span style={{ fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>Aa</span> : <span style={{ marginRight: '4px' }}>{stat.icon}</span>}
                                    {stat.label}
                                </span>
                                <span style={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Remove button */}
                    <button
                        onClick={() => { setDocuments(prev => prev.filter(d => d.id !== activeDoc.id)); setActiveDoc(null) }}
                        style={{
                            padding: '8px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            fontSize: '11px',
                            cursor: 'pointer',
                            marginTop: 'auto'
                        }}
                    >🗑 Remove Document</button>
                </div>
            )}

        </div>
    )
}
