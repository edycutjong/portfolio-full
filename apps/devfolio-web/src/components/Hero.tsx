'use client'

export function Hero() {
    return (
        <section className="min-h-[90vh] flex items-center px-6 pt-24 pb-16">
            <div className="container-narrow">
                {/* Available badge */}
                <div className="flex items-center gap-2.5 mb-8 animate-fade-in">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm text-emerald-400 font-medium">Available for opportunities</span>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-slide-up leading-[1.1]">
                    <span className="text-gradient">Full-Stack Engineer</span>
                    <br />
                    <span className="text-zinc-400">& AI Specialist</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted max-w-xl mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
                    I build production systems that scale — from RAG pipelines and real-time WebSockets
                    to cloud-native infrastructure. Python, Go, Rust, and TypeScript.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <a href="#projects" className="btn-primary">
                        View My Work
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                    <a href="#contact" className="btn-secondary">
                        Get in Touch
                    </a>
                </div>

                {/* Tech stack - Clean inline list */}
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-sm text-muted mb-4 font-mono uppercase tracking-wider">Tech I work with</p>
                    <div className="flex flex-wrap gap-3">
                        {['Python', 'Go', 'Rust', 'TypeScript', 'Next.js', 'LangChain', 'Docker', 'Kubernetes'].map((tech) => (
                            <span key={tech} className="chip">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
