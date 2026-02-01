'use client'

const specializations = [
    {
        title: 'Backend & Systems',
        icon: '⚙️',
        color: 'cyan',
        skills: ['Python', 'Go', 'Rust', 'FastAPI', 'Axum', 'PostgreSQL', 'Redis'],
    },
    {
        title: 'AI & ML',
        icon: '🧠',
        color: 'violet',
        skills: ['LangChain', 'OpenAI', 'RAG', 'Pinecone', 'Vector DBs', 'Embeddings'],
    },
    {
        title: 'Frontend & Web',
        icon: '🌐',
        color: 'blue',
        skills: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Vercel'],
    },
    {
        title: 'DevOps & Cloud',
        icon: '☁️',
        color: 'green',
        skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Railway'],
    },
]

export function Skills() {
    return (
        <section id="skills" className="section-padding px-6 bg-zinc-900/30">
            <div className="container-wide">
                {/* Section header */}
                <div className="text-center mb-14 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Expertise</h2>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Full-stack capabilities across modern tech stacks
                    </p>
                </div>

                {/* Specialization grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                    {specializations.map((spec) => (
                        <div key={spec.title} className="card p-6 h-full">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-2xl">{spec.icon}</span>
                                <h3 className="font-semibold">{spec.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {spec.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className={`chip text-xs ${spec.color === 'cyan' ? 'hover:border-cyan-500 hover:text-cyan-400' :
                                            spec.color === 'violet' ? 'hover:border-violet-500 hover:text-violet-400' :
                                                spec.color === 'blue' ? 'hover:border-blue-500 hover:text-blue-400' :
                                                    'hover:border-green-500 hover:text-green-400'
                                            }`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Languages summary */}
                <div className="mt-14 text-center">
                    <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-muted font-mono">
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            Python
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                            Go
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                            Rust
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                            TypeScript
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
