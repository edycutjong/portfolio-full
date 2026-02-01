'use client'

import { useState } from 'react'

const projects = [
    {
        id: 'documind',
        name: 'DocuMind AI',
        tagline: 'Intelligent Document Q&A',
        description: 'Upload documents, ask questions, get cited answers using RAG technology. Enterprise-ready AI document intelligence.',
        impact: 'Real OpenAI GPT-4o-mini integration with production RAG pipeline',
        techStack: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'Pinecone'],
        category: 'ai',
        featured: true,
        icon: '🧠',
        github: 'https://github.com/edycutjong/portfolio-full/tree/main/apps/documind-api',
        demo: 'https://documind.edycu.dev',
        docs: 'https://documind-api.edycu.dev/docs',
    },
    {
        id: 'flowstate',
        name: 'FlowState',
        tagline: 'Real-time Collaboration Engine',
        description: 'WebSocket-powered state synchronization for collaborative apps. Sub-millisecond message broadcasting with room-based architecture.',
        impact: 'High-performance Go server with horizontal scaling support',
        techStack: ['Go', 'WebSocket', 'Gorilla', 'Redis'],
        category: 'backend',
        featured: true,
        icon: '⚡',
        github: 'https://github.com/edycutjong/portfolio-full/tree/main/apps/flowstate-api',
        demo: 'https://flowstate-api.edycu.dev',
    },
    {
        id: 'datapulse',
        name: 'DataPulse Analytics',
        tagline: 'High-Performance Analytics Engine',
        description: 'Real-time streaming analytics built for speed. Memory-safe concurrent processing with zero-cost abstractions.',
        impact: 'Built with Rust for blazing-fast event processing',
        techStack: ['Rust', 'Axum', 'Tokio', 'PostgreSQL'],
        category: 'backend',
        featured: true,
        icon: '📊',
        github: 'https://github.com/edycutjong/portfolio-full/tree/main/apps/datapulse-analytics',
        demo: 'https://datapulse-api.edycu.dev',
    },
    {
        id: 'devfolio',
        name: 'DevFolio',
        tagline: 'AI-Powered Portfolio',
        description: 'This very site! Modern portfolio with 24/7 AI chatbot powered by GPT-4o-mini. Built with Next.js 15 and deployed on Vercel.',
        impact: 'Full-stack Next.js with Hono API integration',
        techStack: ['Next.js', 'TypeScript', 'Hono', 'OpenAI', 'Tailwind'],
        category: 'web',
        featured: false,
        icon: '🤖',
        github: 'https://github.com/edycutjong/portfolio-full',
        demo: 'https://edycu.dev',
    },
    {
        id: 'solstake',
        name: 'SolStake Protocol',
        tagline: 'Decentralized Staking',
        description: 'Solana staking platform with on-chain rewards distribution. Built with Anchor framework for secure smart contract development.',
        impact: 'Complete Web3 staking protocol on Solana',
        techStack: ['Rust', 'Anchor', 'Solana', 'TypeScript'],
        category: 'web3',
        featured: false,
        icon: '💎',
        github: 'https://github.com/edycutjong/portfolio-full/tree/main/apps/solstake-protocol',
    },
    {
        id: 'infrahub',
        name: 'InfraHub',
        tagline: 'DevOps Templates',
        description: 'Production-ready infrastructure templates for AWS, GCP, and Azure. Deploy production-grade Kubernetes clusters in minutes.',
        impact: 'Battle-tested IaC for rapid deployment',
        techStack: ['Terraform', 'Kubernetes', 'Docker', 'GitHub Actions'],
        category: 'devops',
        featured: false,
        icon: '🚀',
        github: 'https://github.com/edycutjong/portfolio-full/tree/main/infra',
    },
]

const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'backend', label: 'Backend' },
    { id: 'web', label: 'Web' },
    { id: 'web3', label: 'Web3' },
    { id: 'devops', label: 'DevOps' },
]

export function Projects() {
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter((p) => p.category === activeCategory)

    const featuredProjects = filteredProjects.filter(p => p.featured)
    const otherProfiles = filteredProjects.filter(p => !p.featured)

    return (
        <section id="projects" className="section-padding px-6">
            <div className="container-wide">
                {/* Section header */}
                <div className="text-center mb-6 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Production Projects</h2>
                    <p className="text-base text-muted max-w-2xl mx-auto">
                        Real applications deployed and running. Built with modern tech stacks for scale and performance.
                    </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap justify-center gap-2 mt-4 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-linear-to-r from-cyan-500 to-violet-500 text-white'
                                : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Featured projects - Large cards */}
                {featuredProjects.length > 0 && (
                    <div className="grid md:grid-cols-3 gap-6 mb-8 stagger">
                        {featuredProjects.map((project) => (
                            <article
                                key={project.id}
                                className="card card-featured p-6 flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-2xl">{project.icon}</span>
                                    <span className="badge badge-accent text-xs">Featured</span>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                                <p className="text-cyan-400 text-sm mb-3">{project.tagline}</p>
                                <p className="text-muted text-sm mb-4 grow leading-relaxed">{project.description}</p>

                                {/* Impact */}
                                <div className="text-xs text-violet-400 mb-4 font-mono">
                                    → {project.impact}
                                </div>

                                {/* Tech stack */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className="chip text-xs">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-4 mt-auto pt-4 border-t border-zinc-800">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            Code
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm text-muted hover:text-cyan-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Live
                                        </a>
                                    )}
                                    {project.docs && (
                                        <a
                                            href={project.docs}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm text-muted hover:text-violet-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Docs
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Other projects - Smaller grid */}
                {otherProfiles.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                        {otherProfiles.map((project) => (
                            <article
                                key={project.id}
                                className="card p-5 flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xl">{project.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-sm">{project.name}</h3>
                                        <p className="text-xs text-muted">{project.tagline}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-muted mb-4 grow leading-relaxed">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.techStack.slice(0, 4).map((tech) => (
                                        <span key={tech} className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-auto pt-3 border-t border-zinc-800">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted hover:text-white transition-colors"
                                        >
                                            GitHub →
                                        </a>
                                    )}
                                    {project.demo && (
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted hover:text-cyan-400 transition-colors"
                                        >
                                            Live Demo →
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
