'use client'

import { useState } from 'react'

export function Contact() {
    const [copied, setCopied] = useState(false)
    const email = 'edycutjong@gmail.com'

    const copyEmail = () => {
        navigator.clipboard.writeText(email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section id="contact" className="section-padding px-6">
            <div className="container-narrow text-center">
                {/* Section header */}
                <div className="mb-10 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Let&apos;s Work Together</h2>
                    <p className="text-base text-muted max-w-xl mx-auto">
                        Open to remote opportunities worldwide.
                        Prefer async communication and timezone flexibility.
                    </p>
                </div>

                {/* Primary CTA - Email */}
                <div className="mb-6 animate-slide-up">
                    <button
                        onClick={copyEmail}
                        className="group inline-flex items-center gap-3 px-5 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition-all"
                    >
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-mono">{email}</span>
                        <span className="text-xs text-muted group-hover:text-cyan-400 transition-colors">
                            {copied ? '✓ Copied!' : 'Click to copy'}
                        </span>
                    </button>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <a
                        href="https://github.com/edycutjong"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/edy-cu-tjong"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                    </a>
                </div>

                {/* Resume download */}
                <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <a
                        href="/resume.pdf"
                        download
                        className="btn-secondary inline-flex"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Resume
                    </a>
                </div>

                {/* Availability note */}
                <div className="terminal-box max-w-sm mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="terminal-header">
                        <span className="terminal-dot terminal-dot-red"></span>
                        <span className="terminal-dot terminal-dot-yellow"></span>
                        <span className="terminal-dot terminal-dot-green"></span>
                        <span className="text-xs text-muted ml-3">availability.txt</span>
                    </div>
                    <div className="terminal-body text-sm text-left space-y-1">
                        <div className="text-muted">
                            <span className="text-cyan-400">status:</span> Available for new opportunities
                        </div>
                        <div className="text-muted">
                            <span className="text-cyan-400">type:</span> Full-time remote
                        </div>
                        <div className="text-muted">
                            <span className="text-cyan-400">timezone:</span> UTC+7 (flexible)
                        </div>
                        <div className="text-muted">
                            <span className="text-cyan-400">response:</span> Within 24 hours
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
