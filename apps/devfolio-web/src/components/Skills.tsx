const skillCategories = [
    {
        category: 'Languages',
        icon: '💻',
        items: ['TypeScript', 'Python', 'Go', 'Rust', 'Kotlin'],
    },
    {
        category: 'Frontend',
        icon: '🎨',
        items: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'Expo'],
    },
    {
        category: 'Backend',
        icon: '⚙️',
        items: ['Node.js', 'Hono', 'FastAPI', 'Fiber', 'PostgreSQL', 'Redis'],
    },
    {
        category: 'Cloud & DevOps',
        icon: '☁️',
        items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    },
    {
        category: 'AI/ML',
        icon: '🤖',
        items: ['LangChain', 'OpenAI', 'RAG', 'Pinecone', 'Embeddings'],
    },
    {
        category: 'Web3',
        icon: '🔗',
        items: ['Solana', 'Anchor', 'Smart Contracts', 'IPFS'],
    },
]

export function Skills() {
    return (
        <section id="skills" className="py-24 px-6 bg-black/30">
            <div className="container mx-auto max-w-6xl">
                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
                    <p className="text-xl text-gray-400">
                        Technologies I use to bring ideas to life
                    </p>
                </div>

                {/* Skills grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillCategories.map((skill) => (
                        <div key={skill.category} className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{skill.icon}</span>
                                <h3 className="text-xl font-bold">{skill.category}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item) => (
                                    <span
                                        key={item}
                                        className="skill-badge px-3 py-1.5 rounded-full text-sm transition-colors"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { value: '6+', label: 'Projects' },
                        { value: '10+', label: 'Technologies' },
                        { value: '3+', label: 'Years Experience' },
                        { value: '24/7', label: 'AI Assistant' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass p-6">
                            <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                            <div className="text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
