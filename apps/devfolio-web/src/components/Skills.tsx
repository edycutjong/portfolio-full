'use client'

const specializations = [
    {
        title: 'Backend & Systems',
        skills: ['Python', 'Go', 'Rust', 'FastAPI', 'PostgreSQL', 'Redis'],
        color: 'cyan',
    },
    {
        title: 'AI & Machine Learning',
        skills: ['LangChain', 'OpenAI', 'RAG', 'Pinecone', 'Vector DBs'],
        color: 'violet',
    },
    {
        title: 'Frontend & Web',
        skills: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Vercel'],
        color: 'blue',
    },
    {
        title: 'DevOps & Cloud',
        skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GitHub Actions'],
        color: 'green',
    },
]

export function Skills() {
    return (
        <section id="skills" className="section-padding bg-zinc-900/30">
            <div className="container-wide">
                {/* Section header */}
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills</h2>
                    <p className="text-lg text-muted max-w-2xl">
                        Full-stack capabilities across multiple tech stacks
                    </p>
                </div>

                {/* Skills grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                    {specializations.map((spec) => (
                        <div key={spec.title} className="card flex flex-col h-full">
                            <h3 className="font-semibold mb-5 text-[0.9375rem]">{spec.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {spec.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="chip text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
