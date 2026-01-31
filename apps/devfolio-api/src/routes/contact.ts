import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { ContactSchema } from '../types'
import { supabase, type ContactSubmission } from '../lib/supabase'

export const contactRouter = new Hono()

// POST /api/contact - Submit contact form
contactRouter.post('/', zValidator('json', ContactSchema), async (c) => {
    const data = c.req.valid('json')

    const submission: ContactSubmission = {
        name: data.name,
        email: data.email,
        subject: data.subject || 'General Inquiry',
        message: data.message,
    }

    const { data: inserted, error } = await supabase
        .from('contact_submissions')
        .insert(submission)
        .select()
        .single()

    if (error) {
        console.error('Contact form error:', error)
        return c.json({ success: false, error: 'Failed to send message' }, 500)
    }

    console.log('Contact form submission:', inserted)

    return c.json(
        {
            success: true,
            message: 'Thank you for your message! I will get back to you soon.',
            id: inserted.id,
        },
        201
    )
})

// GET /api/contact/stats - Get contact form stats (admin only)
contactRouter.get('/stats', async (c) => {
    const { count: total } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { count: thisMonth } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)

    return c.json({
        success: true,
        data: {
            total: total || 0,
            thisMonth: thisMonth || 0,
        },
    })
})
