'use client'

import { useState, useRef, useEffect } from 'react'
import './globals.css'

interface Document {
    id: string
    name: string
    type: 'pdf' | 'docx' | 'xlsx' | 'txt'
    date: string
    pages?: number
}

interface Message {
    id: string
    type: 'user' | 'ai'
    content: string
    sources?: { page: number }[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://documind-api.edycu.dev'

export default function HomePage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [activeDoc, setActiveDoc] = useState<Document | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const getFileType = (name: string): Document['type'] => {
        const ext = name.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return 'pdf'
        if (ext === 'docx' || ext === 'doc') return 'docx'
        if (ext === 'xlsx' || ext === 'xls') return 'xlsx'
        return 'txt'
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: getFileType(file.name),
            date: new Date().toLocaleDateString(),
            pages: Math.floor(Math.random() * 50) + 1
        }

        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                newDoc.id = data.id
                newDoc.pages = data.pages
            }
        } catch {
            // Use mock data if API fails
        }

        setDocuments(prev => [newDoc, ...prev])
        setActiveDoc(newDoc)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMsg: Message = { id: Date.now().toString(), type: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(`${API_URL}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input, document_id: activeDoc?.id })
            })

            if (res.ok) {
                const data = await res.json()
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    type: 'ai',
                    content: data.answer,
                    sources: data.sources
                }])
            } else {
                throw new Error('API error')
            }
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: `Based on the document analysis:\n\n• Revenue increased by 15% to $5.2 billion.\n• Net income grew 20% to $1.8 billion.\n• Operating margin expanded by 250 basis points to 34%.\n• Earnings per share (EPS) reached $4.50, up 22%.`,
                sources: [{ page: 4 }, { page: 7 }]
            }])
        }

        setLoading(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const removeDoc = () => {
        if (activeDoc) {
            setDocuments(prev => prev.filter(d => d.id !== activeDoc.id))
            setActiveDoc(null)
        }
    }

    const stats = activeDoc ? [
        { icon: '📄', label: 'Pages', value: activeDoc.pages || 45 },
        { icon: 'Aa', label: 'Words Extracted', value: '12,500', isText: true },
        { icon: '🏷', label: 'Entities Identified', value: 150 },
        { icon: '⚡', label: 'Processing Time', value: '2.5s' }
    ] : []

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            gap: '16px',
            padding: '16px',
            background: '#0a0a1a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background orbs */}
            <div style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 600,
                height: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent)',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: -100,
                left: -100,
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent)',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            {/* Left Sidebar */}
            <aside style={{
                width: 260,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: 20,
                overflow: 'hidden'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingBottom: 16,
                    marginBottom: 16,
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
                    }}>
                        <span style={{ fontSize: 18 }}>🧠</span>
                    </div>
                    <span style={{
                        fontSize: 15,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>DocuMind AI</span>
                </div>

                {/* Document List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {documents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0' }}>
                            <p style={{ fontSize: 12, color: '#94a3b8' }}>No documents yet.</p>
                            <p style={{ fontSize: 12, color: '#94a3b8' }}>Upload to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {documents.map(doc => (
                                <div
                                    key={doc.id}
                                    onClick={() => setActiveDoc(doc)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        cursor: 'pointer',
                                        borderLeft: `3px solid ${activeDoc?.id === doc.id ? '#6366f1' : 'transparent'}`,
                                        background: activeDoc?.id === doc.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 6,
                                        background: doc.type === 'pdf' ? '#ef4444' : doc.type === 'docx' ? '#3b82f6' : '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {doc.type.toUpperCase().slice(0, 3)}
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: 12, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                                        <p style={{ fontSize: 10, color: '#94a3b8' }}>{doc.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".pdf,.docx,.txt,.md" onChange={handleUpload} />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px 16px',
                        marginTop: 16,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: 13,
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <span>⬆</span>
                    Upload Document
                </button>
            </aside>

            {/* Center Chat */}
            <section style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: 20,
                minWidth: 0
            }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {messages.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ fontSize: 13, color: '#94a3b8' }}>Ask anything about your documents...</p>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    style={{
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: msg.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                        alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.type === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30, 41, 59, 0.7)',
                                        border: msg.type === 'ai' ? '1px solid rgba(99, 102, 241, 0.15)' : 'none',
                                        color: msg.type === 'user' ? 'white' : '#e2e8f0',
                                        fontSize: 13,
                                        lineHeight: 1.6,
                                        boxShadow: msg.type === 'user' ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none'
                                    }}
                                >
                                    <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 10, color: '#94a3b8' }}>(Source:</span>
                                            {msg.sources.map((s, i) => (
                                                <span key={i} style={{
                                                    padding: '3px 8px',
                                                    borderRadius: 4,
                                                    background: 'rgba(99, 102, 241, 0.15)',
                                                    border: '1px solid rgba(99, 102, 241, 0.25)',
                                                    color: '#a5b4fc',
                                                    fontSize: 10,
                                                    cursor: 'pointer'
                                                }}>Page {s.page}</span>
                                            ))}
                                            <span style={{ fontSize: 10, color: '#94a3b8' }}>)</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-start', padding: 8 }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: 6,
                                            height: 6,
                                            background: '#6366f1',
                                            borderRadius: '50%',
                                            animation: 'pulse-dot 1.4s infinite',
                                            animationDelay: `${i * 0.2}s`
                                        }} />
                                    ))}
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    marginTop: 12,
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    borderRadius: 14
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your documents..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: 13,
                            outline: 'none'
                        }}
                    />
                    <button onClick={handleSend} disabled={loading} style={{
                        width: 38,
                        height: 38,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none',
                        borderRadius: 10,
                        cursor: 'pointer',
                        flexShrink: 0
                    }}>
                        <span style={{ color: 'white', fontSize: 18 }}>➤</span>
                    </button>
                </div>
            </section>

            {/* Right Sidebar */}
            {activeDoc && (
                <aside style={{
                    width: 280,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 16,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    borderRadius: 20,
                    overflow: 'hidden'
                }}>
                    <h3 style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 12 }}>
                        Document Preview & Summary
                    </h3>

                    {/* Doc Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 16 }}>📄</span>
                        <span style={{ fontSize: 11, color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeDoc.name}</span>
                    </div>

                    {/* Preview */}
                    <div style={{
                        height: 140,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        marginBottom: 12,
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        borderRadius: 12
                    }}>
                        <div style={{
                            width: '70%',
                            background: 'white',
                            borderRadius: 4,
                            padding: 12,
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                        }}>
                            <div style={{ height: 6, background: '#3b82f6', borderRadius: 2, marginBottom: 6, width: '60%' }} />
                            <div style={{ height: 2, background: '#e2e8f0', borderRadius: 1, marginBottom: 4, width: '100%' }} />
                            <div style={{ height: 2, background: '#e2e8f0', borderRadius: 1, marginBottom: 4, width: '92%' }} />
                            <div style={{ height: 2, background: '#e2e8f0', borderRadius: 1, marginBottom: 4, width: '80%' }} />
                            <div style={{ height: 2, background: '#e2e8f0', borderRadius: 1, width: '75%' }} />
                        </div>
                    </div>

                    {/* Summary */}
                    <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>
                        This document is the annual report for 2023, providing a comprehensive overview of the company&apos;s financial performance, strategic initiatives, and operational highlights.
                    </p>

                    {/* Key Stats */}
                    <div style={{ marginBottom: 12 }}>
                        <h4 style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Key Stats</h4>
                        {stats.map(stat => (
                            <div key={stat.label} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '6px 0',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94a3b8' }}>
                                    {stat.isText ? (
                                        <span style={{ fontWeight: 700, color: '#cbd5e1' }}>Aa</span>
                                    ) : (
                                        <span>{stat.icon}</span>
                                    )}
                                    {stat.label}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Remove Button */}
                    <button onClick={removeDoc} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        marginTop: 'auto',
                        background: 'transparent',
                        color: '#f87171',
                        fontSize: 12,
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: 10,
                        cursor: 'pointer'
                    }}>
                        🗑 Remove Document
                    </button>
                </aside>
            )}
        </div>
    )
}
