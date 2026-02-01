'use client'

const skillCategories = [
    {
        title: 'Backend',
        skills: ['Python', 'Node.js', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'GraphQL'],
    },
    {
        title: 'AI/ML',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'NLP', 'Computer Vision', 'LLMs', 'Data Analysis'],
    },
    {
        title: 'Frontend',
        skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Svelte', 'Tailwind CSS', 'HTML5', 'CSS3', 'JavaScript', 'Redux'],
    },
    {
        title: 'DevOps',
        skills: ['AWS', 'Azure', 'GCP', 'CI/CD', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'Git', 'Linux'],
    },
]

export function Skills() {
    return (
        <section id="skills" className="section-padding bg-zinc-900/40">
            <div className="container-wide">
                {/* Section header - centered per mockup */}
                <div className="text-center mb-12 animate-fade-in">
                    <p className="text-sm text-muted uppercase tracking-wider mb-2">Skills Section</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3">Skills</h2>
                    <p className="text-lg text-muted">My Technical Expertise & Toolkit</p>
                </div>

                {/* Skills grid - 4 columns per mockup */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                    {skillCategories.map((category) => (
                        <div key={category.title} className="card flex flex-col h-full">
                            <h3 className="font-bold text-lg mb-5">{category.title}</h3>
                            <div className="flex flex-wrap gap-[var(--chip-gap)]">
                                {category.skills.map((skill) => (
                                    <span key={skill} className="chip text-sm">
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
