import { Hono } from 'hono'
import { profile } from '../data'

export const profileRouter = new Hono()

// GET /api/profile - Get profile information
profileRouter.get('/', (c) => {
    return c.json({
        success: true,
        data: profile,
    })
})

// GET /api/profile/skills - Get skills grouped by category
profileRouter.get('/skills', (c) => {
    return c.json({
        success: true,
        data: profile.skills,
    })
})

// GET /api/profile/experience - Get work experience
profileRouter.get('/experience', (c) => {
    return c.json({
        success: true,
        data: profile.experience,
    })
})

// GET /api/profile/resume - Track resume download and return URL
profileRouter.get('/resume', (c) => {
    // In production, this would:
    // 1. Log the download with timestamp and user agent
    // 2. Return a signed URL from cloud storage
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
