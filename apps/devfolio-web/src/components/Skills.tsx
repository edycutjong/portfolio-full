'use client'

const skillCategories = [
    {
        title: 'Backend',
        skills: ['Python', 'Node.js', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'Docker', 'GraphQL'],
    },
    {
        title: 'AI/ML',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'LLMs', 'NLP'],
    },
    {
        title: 'Frontend',
        skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript'],
    },
    {
        title: 'DevOps',
        skills: ['AWS', 'Azure', 'GCP', 'CI/CD', 'Terraform', 'Kubernetes', 'Prometheus', 'Git'],
    },
]

export function Skills() {
    return (
        <section id="skills" className="section-padding bg-zinc-900/40">
            <div className="container-wide">
                {/* Section header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills</h2>
                    <p className="text-lg text-muted">My Technical Expertise & Toolkit</p>
                </div>

                {/* Skills grid - 4 columns */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                    {skillCategories.map((category) => (
                        <div key={category.title} className="card flex flex-col h-full">
                            <h3 className="font-bold text-xl mb-6 text-center">{category.title}</h3>
                            <div className="flex flex-wrap justify-center gap-2">
                                {category.skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1.5 text-sm bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-zinc-300">
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
