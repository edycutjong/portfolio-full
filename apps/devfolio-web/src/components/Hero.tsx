'use client'

import { TypeWriter } from './TypeWriter'

export function Hero() {
    const roles = [
        'Full-Stack Developer',
        'AI/ML Engineer',
        'Cloud Architect',
        'Open Source Contributor',
    ]

    return (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="container mx-auto max-w-4xl text-center">
                {/* Animated badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500 pulse-glow"></span>
                    </span>
                    <span className="text-sm text-gray-300">Available for remote opportunities</span>
                </div>

                {/* Main heading with typewriter */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                    <TypeWriter
                        texts={roles}
                        typingSpeed={80}
                        deletingSpeed={40}
                        pauseDuration={2500}
                    />
                    <br />
                    <span className="gradient-text">Building the Future</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Specializing in AI/ML, high-performance systems, and cloud-native applications.
                    Let&apos;s build something amazing together.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <a
                        href="#projects"
                        className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 hover-lift"
                    >
                        View Projects
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-all hover:scale-105"
                    >
                        Get in Touch
                    </a>
                </div>

                {/* Tech stack chips with stagger animation */}
                <div className="mt-16 flex flex-wrap justify-center gap-3 animate-stagger">
                    {['TypeScript', 'Python', 'Go', 'React', 'Next.js', 'Node.js', 'AWS', 'Docker'].map(
                        (tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 glass text-sm text-gray-300 hover:text-white hover:border-white/30 hover:scale-110 transition-all cursor-default"
                            >
                                {tech}
                            </span>
                        )
                    )}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-6 h-6 text-gray-400"
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
