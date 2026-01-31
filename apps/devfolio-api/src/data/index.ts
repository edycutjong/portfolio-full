import type { Project, Profile } from '../types'

// Mock data for portfolio projects
export const projects: Project[] = [
    {
        id: '1',
        name: 'DevFolio AI',
        slug: 'devfolio-ai',
        description: 'AI-powered developer portfolio with chatbot',
        longDescription:
            'A portfolio website with an AI chatbot that answers recruiter questions 24/7. Built with Next.js, Hono, and OpenAI.',
        techStack: ['Next.js', 'TypeScript', 'Hono', 'OpenAI', 'Tailwind CSS'],
        category: 'web',
        status: 'in-progress',
        githubUrl: 'https://github.com/edycu/devfolio-ai',
        featured: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'DocuMind AI',
        slug: 'documind-ai',
        description: 'Intelligent document Q&A with RAG pipeline',
        longDescription:
            'Upload any document, ask questions in natural language, get instant cited answers. Built with FastAPI, LangChain, and Pinecone.',
        techStack: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'React'],
        category: 'ai',
        status: 'planned',
        featured: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'LinkSnap',
        slug: 'linksnap',
        description: 'High-performance URL shortener with analytics',
        longDescription:
            'A blazing-fast URL shortener handling 100K+ redirects/sec with detailed click analytics. Built with Go and Redis.',
        techStack: ['Go', 'Fiber', 'Redis', 'PostgreSQL', 'Prometheus'],
        category: 'backend',
        status: 'planned',
        featured: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'SolMint',
        slug: 'solmint',
        description: 'No-code NFT minting platform on Solana',
        longDescription:
            'A simple web interface to create, mint, and manage NFT collections on Solana. Built with Rust, Anchor, and Next.js.',
        techStack: ['Rust', 'Anchor', 'Solana', 'Next.js', 'TypeScript'],
        category: 'web3',
        status: 'planned',
        featured: false,
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'SpendWise',
        slug: 'spendwise',
        description: 'Offline-first expense tracker mobile app',
        longDescription:
            'A beautiful, privacy-first mobile app that works offline and syncs when connected. Built with React Native and SQLite.',
        techStack: ['React Native', 'Expo', 'SQLite', 'Zustand', 'TypeScript'],
        category: 'mobile',
        status: 'planned',
        featured: false,
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '6',
        name: 'InfraHub',
        slug: 'infrahub',
        description: 'Reusable DevOps infrastructure templates',
        longDescription:
            'Production-ready infrastructure templates with one-command deployment. Terraform, Kubernetes, and GitHub Actions.',
        techStack: ['Terraform', 'Kubernetes', 'GitHub Actions', 'Docker', 'Prometheus'],
        category: 'devops',
        status: 'planned',
        featured: false,
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

// Mock profile data
export const profile: Profile = {
    name: 'Edy Cu',
    title: 'Full-Stack Engineer | AI/ML | Cloud Architecture',
    bio: 'Passionate full-stack developer specializing in high-performance systems, AI integration, and cloud-native applications. Building products that solve real problems.',
    location: 'Remote',
    email: 'hello@edycu.dev',
    links: {
        github: 'https://github.com/developer',
        linkedin: 'https://linkedin.com/in/developer',
        twitter: 'https://twitter.com/developer',
    },
    skills: [
        {
            category: 'Languages',
            items: ['TypeScript', 'Python', 'Go', 'Rust', 'Kotlin'],
        },
        {
            category: 'Frontend',
            items: ['React', 'Next.js', 'React Native', 'Tailwind CSS'],
        },
        {
            category: 'Backend',
            items: ['Node.js', 'Hono', 'FastAPI', 'Fiber', 'PostgreSQL', 'Redis'],
        },
        {
            category: 'Cloud & DevOps',
            items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
        },
        {
            category: 'AI/ML',
            items: ['LangChain', 'OpenAI', 'RAG', 'Vector Databases'],
        },
    ],
    experience: [
        {
            company: 'Self-Employed',
            role: 'Full-Stack Developer',
            period: '2024 - Present',
            description:
                'Building a portfolio of production-ready applications demonstrating expertise in modern web development, AI integration, and cloud architecture.',
            techStack: ['TypeScript', 'Python', 'Go', 'React', 'AWS'],
        },
    ],
}
