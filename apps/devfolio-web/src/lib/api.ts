const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.edycu.dev'

interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

interface Project {
    id: string
    name: string
    slug: string
    description: string
    longDescription?: string
    techStack: string[]
    category: string
    status: string
    githubUrl?: string
    liveUrl?: string
    imageUrl?: string
    featured: boolean
    order: number
}

interface Profile {
    name: string
    title: string
    bio: string
    avatar?: string
    location: string
    email: string
    links: {
        github?: string
        linkedin?: string
        twitter?: string
        website?: string
    }
    skills: Array<{
        category: string
        items: string[]
    }>
    experience: Array<{
        company: string
        role: string
        period: string
        description: string
        techStack: string[]
    }>
}

interface ChatResponse {
    response: string
    conversationId: string
    sources?: string[]
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })
    return res.json()
}

export async function getProjects(params?: {
    category?: string
    featured?: boolean
}): Promise<Project[]> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.set('category', params.category)
    if (params?.featured) queryParams.set('featured', 'true')

    const query = queryParams.toString()
    const endpoint = `/api/projects${query ? `?${query}` : ''}`

    const res = await fetchApi<Project[]>(endpoint)
    return res.data || []
}

export async function getProject(slug: string): Promise<Project | null> {
    const res = await fetchApi<Project>(`/api/projects/${slug}`)
    return res.data || null
}

export async function getProfile(): Promise<Profile | null> {
    const res = await fetchApi<Profile>('/api/profile')
    return res.data || null
}

export async function getSkills(): Promise<Profile['skills']> {
    const res = await fetchApi<Profile['skills']>('/api/profile/skills')
    return res.data || []
}

export async function submitContact(data: {
    name: string
    email: string
    subject: string
    message: string
}): Promise<{ success: boolean; message?: string }> {
    const res = await fetchApi<{ id: string }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return { success: res.success, message: res.message }
}

export async function sendChatMessage(
    message: string,
    conversationId?: string
): Promise<ChatResponse | null> {
    const res = await fetchApi<ChatResponse>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversationId }),
    })
    return res.data || null
}

export type { Project, Profile, ChatResponse }
