'use client'

export function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
            <div className="container-narrow">
                {/* Available badge */}
                <div className="flex items-center gap-2 mb-6 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-sm text-muted font-mono">Available for remote opportunities</span>
                </div>

                {/* Impact metrics */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 font-mono text-sm text-muted animate-slide-up">
                    <span>5 Production Apps</span>
                    <span className="hidden sm:inline text-zinc-600">•</span>
                    <span>4 Tech Stacks</span>
                    <span className="hidden sm:inline text-zinc-600">•</span>
                    <span>100% Test Coverage</span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
                    <span className="text-gradient">Full-Stack Engineer</span>
                    <br />
                    <span className="text-zinc-400">with AI/ML Expertise</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted max-w-2xl mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.15s' }}>
                    Building production systems that scale. Python + Go + Rust + TypeScript.
                    <br className="hidden md:block" />
                    Specialized in RAG pipelines, real-time systems, and cloud-native architecture.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <a href="#projects" className="btn-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                        </svg>
                        View Projects
                    </a>
                    <a href="#contact" className="btn-secondary">
                        Get in Touch
                    </a>
                </div>

                {/* Tech stack - Terminal style */}
                <div className="terminal-box max-w-xl animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    <div className="terminal-header">
                        <span className="terminal-dot terminal-dot-red"></span>
                        <span className="terminal-dot terminal-dot-yellow"></span>
                        <span className="terminal-dot terminal-dot-green"></span>
                        <span className="text-xs text-muted ml-3">tech_stack.sh</span>
                    </div>
                    <div className="terminal-body text-sm space-y-2">
                        <div>
                            <span className="text-cyan-400">$</span>
                            <span className="text-muted ml-2">backend:</span>
                            <span className="text-zinc-300 ml-2">Python · Go · Rust</span>
                        </div>
                        <div>
                            <span className="text-cyan-400">$</span>
                            <span className="text-muted ml-2">frontend:</span>
                            <span className="text-zinc-300 ml-2">Next.js · TypeScript</span>
                        </div>
                        <div>
                            <span className="text-cyan-400">$</span>
                            <span className="text-muted ml-2">ai:</span>
                            <span className="text-zinc-300 ml-2">LangChain · OpenAI · RAG</span>
                        </div>
                        <div>
                            <span className="text-cyan-400">$</span>
                            <span className="text-muted ml-2">infra:</span>
                            <span className="text-zinc-300 ml-2">Docker · K8s · Terraform</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
