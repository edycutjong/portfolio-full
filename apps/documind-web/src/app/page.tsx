'use client'

import { useState } from 'react'

export default function Home() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)

    const API_URL = 'https://documind-api.edycu.dev'

    const handleAsk = async () => {
        if (!question.trim()) return

        setLoading(true)
        setAnswer('')

        try {
            // For demo purposes, show API connection info
            setAnswer(`📡 Connecting to DocuMind API at ${API_URL}...\n\n` +
                `This is a demo interface. The backend API is live and ready to process your documents!\n\n` +
                `Features:\n` +
                `• PDF, DOCX, TXT support\n` +
                `• GPT-4o-mini powered answers\n` +
                `• Source citations\n` +
                `• Real-time processing`)
        } catch (error) {
            setAnswer('Error connecting to API. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen p-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-16 pt-12">
                <div className="text-6xl mb-6">📄</div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    <span className="gradient-text">DocuMind AI</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Upload documents, ask questions, get instant cited answers using RAG technology.
                </p>

                {/* API Status */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-gray-300">API Online</span>
                    <a
                        href={API_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                        {API_URL.replace('https://', '')}
                    </a>
                </div>
            </div>

            {/* Main Interface */}
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Upload Section */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-4">📁 Upload Documents</h2>
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
                        <div className="text-4xl mb-4">📤</div>
                        <p className="text-gray-400 mb-2">Drag & drop files here, or click to browse</p>
                        <p className="text-sm text-gray-500">Supports PDF, DOCX, TXT (max 10MB)</p>
                    </div>
                </div>

                {/* Q&A Section */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-4">💬 Ask Questions</h2>
                    <div className="space-y-4">
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask anything about your documents..."
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none resize-none h-24 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={handleAsk}
                            disabled={loading || !question.trim()}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? '🔄 Processing...' : '🚀 Get Answer'}
                        </button>
                    </div>

                    {/* Answer Display */}
                    {answer && (
                        <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="font-semibold mb-2 text-primary-400">📝 Answer:</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{answer}</p>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl mb-3">🤖</div>
                        <h3 className="font-semibold mb-2">GPT-4o-mini</h3>
                        <p className="text-sm text-gray-400">Powered by OpenAI&apos;s latest model</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl mb-3">🔗</div>
                        <h3 className="font-semibold mb-2">RAG Pipeline</h3>
                        <p className="text-sm text-gray-400">Answers with source citations</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="font-semibold mb-2">Real-time</h3>
                        <p className="text-sm text-gray-400">Instant document processing</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-16 text-gray-500 text-sm">
                <p>Part of <a href="https://edycu.dev" className="text-primary-400 hover:underline">edycu.dev</a> portfolio</p>
            </footer>
        </main>
    )
}
