'use client'

export function Hero() {
    const techStack = [
        'Python', 'Go', 'Rust', 'TypeScript', 'React', 'Node.js',
        'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS'
    ]

    return (
        <section className="min-h-[85vh] flex items-center justify-center px-6 md:px-12 pt-28 pb-20">
            <div className="max-w-4xl text-center">
                {/* Availability Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fade-in">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-emerald-400 font-medium">Available for opportunities</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-slide-up leading-[1.1]">
                    <span className="text-gradient">Full-Stack Engineer</span>
                    <br />
                    <span className="text-zinc-400">& AI Specialist</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
                    Specialized in building scalable web applications, data-driven systems,
                    and integrating artificial intelligence solutions.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-14 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <a href="#projects" className="btn-primary text-base px-8 py-4">
                        View Projects
                    </a>
                    <a href="#contact" className="btn-secondary text-base px-8 py-4">
                        Contact Me
                    </a>
                </div>

                {/* Tech Stack */}
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <p className="text-sm text-muted mb-5 font-medium uppercase tracking-wider">Tech Stack</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {techStack.map((tech) => (
                            <span key={tech} className="px-4 py-2 text-sm bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
