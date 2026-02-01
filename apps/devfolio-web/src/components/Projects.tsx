'use client'

import { useState, useEffect } from 'react'

const projects = [
    {
        id: '1',
        name: 'DevFolio AI',
        slug: 'devfolio-ai',
        description: 'AI-powered portfolio with chatbot that answers questions about my work 24/7',
        longDescription: 'A modern portfolio website featuring a 24/7 AI chatbot powered by GPT-4o-mini. Built with Next.js 15 and deployed on Vercel with custom domain.',
        techStack: ['Next.js', 'TypeScript', 'Hono', 'OpenAI', 'Tailwind'],
        category: 'web',
        status: 'completed',
        featured: true,
        icon: '🤖',
        github: 'https://github.com/edycutjong/portfolio-full',
        demo: 'https://edycu.dev',
    },
    {
        id: '2',
        name: 'DocuMind AI',
        slug: 'documind-ai',
        description: 'Upload documents, ask questions, get instant cited answers using RAG',
        longDescription: 'Enterprise-ready document intelligence using LangChain RAG with real OpenAI GPT-4o-mini integration. Supports PDF, DOCX, and TXT files.',
        techStack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'React'],
        category: 'ai',
        status: 'completed',
        featured: true,
        icon: '📄',
        github: 'https://github.com/edycutjong/portfolio-full',
        demo: 'https://documind-api.edycu.dev',
    },
    {
        id: '3',
        name: 'FlowState',
        slug: 'flowstate',
        description: 'Real-time collaborative editing with WebSocket presence indicators',
        longDescription: 'High-performance WebSocket server for real-time collaboration. Features document editing, cursor tracking, and typing indicators.',
        techStack: ['Go', 'WebSocket', 'Gorilla', 'Redis'],
        category: 'backend',
        status: 'completed',
        featured: true,
        icon: '⚡',
        github: 'https://github.com/edycutjong/portfolio-full',
        demo: 'https://flowstate-api.edycu.dev',
    },
    {
        id: '4',
        name: 'DataPulse Analytics',
        slug: 'datapulse',
        description: 'High-performance streaming analytics engine processing 100K+ events/sec',
        longDescription: 'Blazing-fast analytics pipeline built with Rust and Axum. Features real-time event ingestion, windowed aggregations, and metrics export.',
        techStack: ['Rust', 'Axum', 'Tokio', 'Kafka'],
        category: 'backend',
        status: 'completed',
        featured: true,
        icon: '📊',
        github: 'https://github.com/edycutjong/portfolio-full',
        demo: 'https://datapulse-api.edycu.dev',
    },
    {
        id: '5',
        name: 'SolStake',
        slug: 'solstake',
        description: 'Decentralized staking protocol on Solana blockchain',
        longDescription: 'Solana staking platform with on-chain rewards distribution. Built with Anchor framework for secure smart contract development.',
        techStack: ['Rust', 'Anchor', 'Solana', 'TypeScript'],
        category: 'web3',
        status: 'completed',
        featured: false,
        icon: '💎',
        github: 'https://github.com/edycutjong/portfolio-full',
    },
    {
        id: '6',
        name: 'InfraHub',
        slug: 'infrahub',
        description: 'Production-ready DevOps templates for one-command deployment',
        longDescription: 'Battle-tested infrastructure templates for AWS, GCP, and Azure. Deploy production-grade Kubernetes clusters in minutes.',
        techStack: ['Terraform', 'Kubernetes', 'GitHub Actions', 'Docker'],
        category: 'devops',
        status: 'completed',
        featured: false,
        icon: '🚀',
        github: 'https://github.com/edycutjong/portfolio-full',
    },
]


const categories = [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'backend', label: 'Backend' },
    { id: 'web3', label: 'Web3' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'devops', label: 'DevOps' },
]

export function Projects() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [animationKey, setAnimationKey] = useState(0)

    const filteredProjects =
        activeCategory === 'all'
            ? projects
            : projects.filter((p) => p.category === activeCategory)

    // Trigger re-animation when filter changes
    useEffect(() => {
        setAnimationKey((prev) => prev + 1)
    }, [activeCategory])

    return (
        <section id="projects" className="py-24 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Section header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
                    <p className="text-xl text-gray-400">
                        Solving real problems with modern technology
                    </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${activeCategory === cat.id
                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                                : 'glass text-gray-300 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Projects grid with animation */}
                <div key={animationKey} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
                    {filteredProjects.map((project) => (
                        <article
                            key={project.id}
                            className={`glass-card p-6 flex flex-col hover-lift ${project.featured ? 'glow-on-hover' : ''}`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl transform hover:scale-125 transition-transform cursor-default">{project.icon}</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${project.status === 'in-progress'
                                        ? 'bg-primary-500/20 text-primary-400'
                                        : project.status === 'completed'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                >
                                    {project.status === 'in-progress'
                                        ? 'In Progress'
                                        : project.status === 'completed'
                                            ? 'Completed'
                                            : 'Planned'}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                            <p className="text-gray-400 mb-4 flex-grow">{project.description}</p>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
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
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
