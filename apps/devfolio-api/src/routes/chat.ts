import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ChatMessageSchema, type ChatResponse } from '../types'
import { profile, projects } from '../data'
import OpenAI from 'openai'

export const chatRouter = new Hono()

// Store conversations (in production, use database/Redis)
const conversations = new Map<string, Array<{ role: 'user' | 'assistant' | 'system'; content: string }>>()

// Response cache for common questions (saves API calls)
const responseCache = new Map<string, { response: string; timestamp: number }>()
const CACHE_TTL_MS = 1000 * 60 * 60 // 1 hour cache

// Rate limiting per IP (prevents abuse)
const rateLimits = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10 // 10 requests per minute
const RATE_LIMIT_WINDOW_MS = 1000 * 60 // 1 minute

// Initialize OpenAI client (only if API key is available)
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

// System prompt for the AI chatbot
const SYSTEM_PROMPT = `You are an AI assistant for a developer's portfolio website. 
Your job is to answer questions about the developer based on the following information:

PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Bio: ${profile.bio}
Location: ${profile.location}

SKILLS:
${profile.skills.map((s) => `${s.category}: ${s.items.join(', ')}`).join('\n')}

PROJECTS:
${projects.map((p) => `- ${p.name}: ${p.description} (Tech: ${p.techStack.join(', ')})`).join('\n')}

EXPERIENCE:
${profile.experience.map((e) => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n')}

Guidelines:
- Be helpful and professional
- Answer questions about skills, projects, and experience
- If asked something you don't know, suggest contacting the developer directly
- Keep responses concise but informative (2-3 sentences max)
- Highlight relevant projects when discussing skills`

// Helper: Normalize message for caching
function normalizeMessage(msg: string): string {
    return msg.toLowerCase().trim().replace(/[^\w\s]/g, '').slice(0, 100)
}

// Helper: Check and update rate limit
function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const limit = rateLimits.get(ip)

    if (!limit || now > limit.resetTime) {
        rateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
        return true
    }

    if (limit.count >= RATE_LIMIT_MAX) {
        return false // Rate limited
    }

    limit.count++
    return true
}

// POST /api/chat - Send a message to the AI chatbot
chatRouter.post('/', zValidator('json', ChatMessageSchema), async (c) => {
    const { message, conversationId } = c.req.valid('json')

    // Rate limiting
    const clientIP = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
    if (!checkRateLimit(clientIP)) {
        // Fall back to mock response instead of error
        const mockResponse = generateMockResponse(message)
        return c.json({
            success: true,
            data: {
                response: mockResponse,
                conversationId: conversationId || crypto.randomUUID(),
                sources: findRelevantSources(message),
            } as ChatResponse,
        })
    }

    // Get or create conversation
    const convId = conversationId || crypto.randomUUID()
    const history = conversations.get(convId) || []

    // Add user message to history
    history.push({ role: 'user', content: message })

    let response: string
    const cacheKey = normalizeMessage(message)
    const cached = responseCache.get(cacheKey)

    // Check cache first (for common questions)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        response = cached.response
    } else if (openai) {
        // Use OpenAI if available
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history.slice(-10) // Keep last 10 messages for context
                ],
                max_tokens: 300,
                temperature: 0.7,
            })
            response = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

            // Cache the response for similar future questions
            responseCache.set(cacheKey, { response, timestamp: Date.now() })

            // Clean old cache entries (keep under 100)
            if (responseCache.size > 100) {
                const oldest = [...responseCache.entries()]
                    .sort((a, b) => a[1].timestamp - b[1].timestamp)
                    .slice(0, 20)
                oldest.forEach(([key]) => responseCache.delete(key))
            }
        } catch (error) {
            console.error('OpenAI API error:', error)
            response = generateMockResponse(message)
        }
    } else {
        response = generateMockResponse(message)
    }

    // Add assistant response to history
    history.push({ role: 'assistant', content: response })

    // Store conversation (keep only last 20 messages)
    conversations.set(convId, history.slice(-20))

    const chatResponse: ChatResponse = {
        response,
        conversationId: convId,
        sources: findRelevantSources(message),
    }

    return c.json({
        success: true,
        data: chatResponse,
    })
})

// GET /api/chat/:conversationId - Get conversation history
chatRouter.get('/:conversationId', (c) => {
    const convId = c.req.param('conversationId')
    const history = conversations.get(convId)

    if (!history) {
        return c.json({ success: false, error: 'Conversation not found' }, 404)
    }

    return c.json({
        success: true,
        data: history,
    })
})

// Helper: Generate mock response based on keywords
function generateMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
        return `I have experience as a ${profile.title}. ${profile.experience[0]?.description || 'Currently building a portfolio of production-ready applications.'}`
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
        const allSkills = profile.skills.flatMap((s) => s.items)
        return `My technical skills include: ${allSkills.slice(0, 10).join(', ')}, and more.`
    }

    if (lowerMessage.includes('project')) {
        const featured = projects.filter((p) => p.featured)
        return `Here are my featured projects: ${featured.map((p) => p.name).join(', ')}. Each showcases different technologies and problem-solving approaches.`
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('reach')) {
        return `You can reach me at ${profile.email} or through the contact form on this website. I'm open to remote opportunities!`
    }

    if (lowerMessage.includes('go') || lowerMessage.includes('golang')) {
        const goProject = projects.find((p) => p.techStack.includes('Go'))
        return goProject
            ? `Yes! I'm building ${goProject.name} with Go. ${goProject.description}`
            : "I'm skilled in Go/Golang for high-performance backend systems."
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning') || lowerMessage.includes('langchain')) {
        return "I work with AI/ML technologies including LangChain, OpenAI, and vector databases. My DocuMind AI project demonstrates RAG pipelines for intelligent document Q&A."
    }

    return `Thanks for your question! ${profile.bio} Feel free to ask about my skills, projects, or experience.`
}

// Helper: Find relevant sources based on message
function findRelevantSources(message: string): string[] {
    const lowerMessage = message.toLowerCase()
    const sources: string[] = []

    projects.forEach((project) => {
        if (
            lowerMessage.includes(project.name.toLowerCase()) ||
            project.techStack.some((tech) => lowerMessage.includes(tech.toLowerCase()))
        ) {
            sources.push(project.slug)
        }
    })

    return sources.slice(0, 3)
}
