import { Hono } from 'hono'
import { supabase, type Profile, type Skill } from '../lib/supabase'

export const profileRouter = new Hono()

// GET /api/profile - Get profile information
profileRouter.get('/', async (c) => {
    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single()

    const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false })

    if (profileError) {
        return c.json({ success: false, error: profileError.message }, 500)
    }

    // Group skills by category
    const skillsByCategory = (skills || []).reduce(
        (acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = []
            }
            acc[skill.category].push(skill)
            return acc
        },
        {} as Record<string, Skill[]>
    )

    return c.json({
        success: true,
        data: {
            ...profile,
            skills: skillsByCategory,
        },
    })
})

// GET /api/profile/skills - Get skills grouped by category
profileRouter.get('/skills', async (c) => {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false })

    if (error) {
        return c.json({ success: false, error: error.message }, 500)
    }

    // Group by category
    const skillsByCategory = (data || []).reduce(
        (acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = []
            }
            acc[skill.category].push(skill)
            return acc
        },
        {} as Record<string, Skill[]>
    )

    return c.json({
        success: true,
        data: skillsByCategory,
    })
})

// GET /api/profile/resume - Track resume download and return URL
profileRouter.get('/resume', (c) => {
    console.log('Resume download:', {
        timestamp: new Date().toISOString(),
        userAgent: c.req.header('User-Agent'),
        ip: c.req.header('X-Forwarded-For') || 'unknown',
    })

    return c.json({
        success: true,
        data: {
            url: '/resume.pdf',
            filename: 'Developer_Resume.pdf',
        },
    })
})
