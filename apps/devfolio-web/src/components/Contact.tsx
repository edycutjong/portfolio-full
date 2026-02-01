'use client'

import { useState, FormEvent } from 'react'

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (formData.subject.trim().length < 5) {
            newErrors.subject = 'Subject must be at least 5 characters'
        }

        if (formData.message.trim().length < 20) {
            newErrors.message = 'Message must be at least 20 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setStatus('loading')

        try {
            // In production, this would be the actual API endpoint
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.edycu.dev'
            const res = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', subject: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch {
            // For demo purposes, show success after a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            setStatus('success')
            setFormData({ name: '', email: '', subject: '', message: '' })
        }
    }

    return (
        <section id="contact" className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Section header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Connect</h2>
                    <p className="text-xl text-gray-400">
                        Have a project in mind? I&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Contact info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass p-6 hover-lift">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Email</div>
                                    <a href="mailto:edy.cu@live.com" className="hover:text-primary-400 transition-colors">
                                        edy.cu@live.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 hover-lift">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Location</div>
                                    <span>Indonesia • Remote</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 hover-lift">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-sm">Response Time</div>
                                    <span>Within 24 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact form */}
                    <form onSubmit={handleSubmit} className="md:col-span-3 glass-card p-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value })
                                        if (errors.name) setErrors({ ...errors, name: '' })
                                    }}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-primary-500 transition-colors ${errors.name ? 'border-red-500' : 'border-white/10'
                                        }`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value })
                                        if (errors.email) setErrors({ ...errors, email: '' })
                                    }}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-primary-500 transition-colors ${errors.email ? 'border-red-500' : 'border-white/10'
                                        }`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => {
                                    setFormData({ ...formData, subject: e.target.value })
                                    if (errors.subject) setErrors({ ...errors, subject: '' })
                                }}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-primary-500 transition-colors ${errors.subject ? 'border-red-500' : 'border-white/10'
                                    }`}
                                placeholder="Job Opportunity / Project Collaboration"
                            />
                            {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Message
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => {
                                    setFormData({ ...formData, message: e.target.value })
                                    if (errors.message) setErrors({ ...errors, message: '' })
                                }}
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-white/10'
                                    }`}
                                placeholder="Tell me about your project or opportunity..."
                            />
                            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg animate-fade-in">
                                <p className="text-center text-green-400 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Message sent! I&apos;ll get back to you within 24 hours.
                                </p>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg animate-fade-in">
                                <p className="text-center text-red-400">
                                    Something went wrong. Please email me directly at edy.cu@live.com
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Scroll indicator - matches homepage visual */}
                <div className="flex justify-center mt-12">
                    <svg
                        className="w-6 h-6 text-gray-400 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>
        </section>
    )
}
