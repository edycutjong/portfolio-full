'use client'

import { useState } from 'react'

const projects = [
    {
        id: '1',
        name: 'DevFolio AI',
        slug: 'devfolio-ai',
        description: 'AI-powered portfolio with chatbot that answers questions about my work 24/7',
        techStack: ['Next.js', 'TypeScript', 'Hono', 'OpenAI', 'Tailwind'],
        category: 'web',
        status: 'in-progress',
        featured: true,
        icon: '🤖',
    },
    {
        id: '2',
        name: 'DocuMind AI',
        slug: 'documind-ai',
        description: 'Upload documents, ask questions, get instant cited answers using RAG',
        techStack: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'React'],
        category: 'ai',
        status: 'planned',
        featured: true,
        icon: '📄',
    },
    {
        id: '3',
        name: 'LinkSnap',
        slug: 'linksnap',
        description: 'High-performance URL shortener handling 100K+ redirects/sec',
        techStack: ['Go', 'Fiber', 'Redis', 'PostgreSQL', 'Prometheus'],
        category: 'backend',
        status: 'planned',
        featured: true,
        icon: '🔗',
    },
    {
        id: '4',
        name: 'SolMint',
        slug: 'solmint',
        description: 'No-code NFT minting platform on Solana blockchain',
        techStack: ['Rust', 'Anchor', 'Solana', 'Next.js', 'TypeScript'],
        category: 'web3',
        status: 'planned',
        featured: false,
        icon: '💎',
    },
    {
        id: '5',
        name: 'SpendWise',
        slug: 'spendwise',
        description: 'Beautiful offline-first expense tracker that respects your privacy',
        techStack: ['React Native', 'Expo', 'SQLite', 'Zustand'],
        category: 'mobile',
        status: 'planned',
        featured: false,
        icon: '💰',
    },
    {
        id: '6',
        name: 'InfraHub',
        slug: 'infrahub',
        description: 'Production-ready DevOps templates for one-command deployment',
        techStack: ['Terraform', 'Kubernetes', 'GitHub Actions', 'Docker'],
        category: 'devops',
        status: 'planned',
        featured: false,
        icon: '🚀',
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

    const filteredProjects =
        activeCategory === 'all'
            ? projects
            : projects.filter((p) => p.category === activeCategory)

    return (
        <section id="projects" className="py-24 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Section header */}
                <div className="text-center mb-12">
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
                            className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                                    : 'glass text-gray-300 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Projects grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <article
                            key={project.id}
                            className="glass-card p-6 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl">{project.icon}</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'in-progress'
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
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
