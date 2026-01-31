import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ContactSchema } from '../types'

export const contactRouter = new Hono()

// Store for contact submissions (in production, use database)
const contactSubmissions: Array<{
    id: string
    data: typeof ContactSchema._type
    createdAt: string
}> = []

// POST /api/contact - Submit contact form
contactRouter.post('/', zValidator('json', ContactSchema), async (c) => {
    const data = c.req.valid('json')

    const submission = {
        id: crypto.randomUUID(),
        data,
        createdAt: new Date().toISOString(),
    }

    contactSubmissions.push(submission)

    // In production, this would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Potentially add to CRM

    console.log('Contact form submission:', submission)

    return c.json(
        {
            success: true,
            message: 'Thank you for your message! I will get back to you soon.',
            id: submission.id,
        },
        201
    )
})

// GET /api/contact/stats - Get contact form stats (admin only)
contactRouter.get('/stats', (c) => {
    // In production, this would require authentication

    return c.json({
        success: true,
        data: {
            total: contactSubmissions.length,
            thisMonth: contactSubmissions.filter((s) => {
                const date = new Date(s.createdAt)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length,
        },
    })
})
