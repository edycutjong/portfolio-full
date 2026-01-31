import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ChatMessageSchema, type ChatResponse } from '../types'
import { profile, projects } from '../data'
import OpenAI from 'openai'

export const chatRouter = new Hono()

// Store conversations (in production, use database/Redis)
const conversations = new Map<string, Array<{ role: 'user' | 'assistant' | 'system'; content: string }>>()

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

// POST /api/chat - Send a message to the AI chatbot
chatRouter.post('/', zValidator('json', ChatMessageSchema), async (c) => {
    const { message, conversationId } = c.req.valid('json')

    // Get or create conversation
    const convId = conversationId || crypto.randomUUID()
    const history = conversations.get(convId) || []

    // Add user message to history
    history.push({ role: 'user', content: message })

    let response: string

    // Use OpenAI if available, otherwise fall back to mock
    if (openai) {
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
