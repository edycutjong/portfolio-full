import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Resume | DevFolio',
    description: 'Full-Stack Developer Resume - Edy Cu',
}

const experiences = [
    {
        title: 'Senior Full-Stack Developer',
        company: 'Available for Remote Opportunities',
        period: '2026 - Present',
        description: 'Seeking challenging remote positions in AI/ML, high-performance systems, and cloud-native applications.',
        technologies: ['TypeScript', 'Python', 'Go', 'Rust'],
    },
]

const skills = {
    'Backend': [
        { name: 'TypeScript', level: 95 },
        { name: 'Python', level: 90 },
        { name: 'Go', level: 85 },
        { name: 'Rust', level: 80 },
    ],
    'Frontend': [
        { name: 'React/Next.js', level: 92 },
        { name: 'Tailwind CSS', level: 90 },
    ],
    'Database': [
        { name: 'PostgreSQL', level: 88 },
        { name: 'Supabase', level: 85 },
    ],
    'DevOps': [
        { name: 'Docker', level: 85 },
        { name: 'Kubernetes', level: 75 },
    ],
}

const education = [
    {
        degree: 'Bachelor of Computer Science',
        school: 'University',
        year: '2020',
    },
]

export default function ResumePage() {
    return (
        <main className="min-h-screen py-24">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="glass p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold gradient-text mb-2">Edy Cu</h1>
                            <p className="text-xl text-gray-300">Full-Stack Developer</p>
                            <p className="text-gray-400 mt-2">Indonesia • Available for Remote</p>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href="/resume.pdf"
                                download
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </a>
                            <Link
                                href="/#contact"
                                className="px-6 py-3 border border-white/20 rounded-full font-semibold hover:bg-white/10 transition-colors"
                            >
                                Contact Me
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <section className="glass p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Summary</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Passionate full-stack developer with expertise in TypeScript, Python, Go, and Rust.
                        Specializing in AI/ML integration, high-performance systems, and cloud-native applications.
                        Building scalable applications with modern architectures and best practices.
                    </p>
                </section>

                {/* Skills */}
                <section className="glass p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Skills</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {Object.entries(skills).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-primary-400 mb-4">{category}</h3>
                                <div className="space-y-3">
                                    {items.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-gray-300">{skill.name}</span>
                                                <span className="text-gray-500">{skill.level}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="glass p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary-500 pl-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                                    <span className="text-gray-500 text-sm">{exp.period}</span>
                                </div>
                                <p className="text-primary-400 mb-2">{exp.company}</p>
                                <p className="text-gray-300 mb-3">{exp.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech) => (
                                        <span key={tech} className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section className="glass p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                            <div key={index} className="border-l-2 border-accent-500 pl-6">
                                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                                <p className="text-gray-400">{edu.school} • {edu.year}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects CTA */}
                <section className="glass p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Want to see my work?</h2>
                    <p className="text-gray-300 mb-6">Check out my portfolio projects featuring AI, Web, and DevOps solutions.</p>
                    <Link
                        href="/#projects"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold hover:opacity-90 transition-opacity"
                    >
                        View Projects
                    </Link>
                </section>
            </div>
        </main>
    )
}
