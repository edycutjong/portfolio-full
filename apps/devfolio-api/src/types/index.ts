import { z } from 'zod'

// Project schema
export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    techStack: z.array(z.string()),
    category: z.enum(['web', 'mobile', 'backend', 'ai', 'web3', 'devops']),
    status: z.enum(['completed', 'in-progress', 'planned']),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    imageUrl: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

export type Project = z.infer<typeof ProjectSchema>

// Profile schema
export const ProfileSchema = z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    location: z.string(),
    email: z.string().email(),
    links: z.object({
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
        website: z.string().url().optional(),
    }),
    skills: z.array(
        z.object({
            category: z.string(),
            items: z.array(z.string()),
        })
    ),
    experience: z.array(
        z.object({
            company: z.string(),
            role: z.string(),
            period: z.string(),
            description: z.string(),
            techStack: z.array(z.string()),
        })
    ),
})

export type Profile = z.infer<typeof ProfileSchema>

// Contact schema
export const ContactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type Contact = z.infer<typeof ContactSchema>

// Chat schema
export const ChatMessageSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    conversationId: z.string().optional(),
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const ChatResponseSchema = z.object({
    response: z.string(),
    conversationId: z.string(),
    sources: z.array(z.string()).optional(),
})

export type ChatResponse = z.infer<typeof ChatResponseSchema>
