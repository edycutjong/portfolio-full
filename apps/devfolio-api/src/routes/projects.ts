import { Hono } from 'hono'
import { supabase, type Project } from '../lib/supabase'

export const projectsRouter = new Hono()

// GET /api/projects - List all projects
projectsRouter.get('/', async (c) => {
    const category = c.req.query('category')
    const featured = c.req.query('featured')

    let query = supabase.from('projects').select('*')

    if (category) {
        query = query.eq('category', category)
    }

    if (featured === 'true') {
        query = query.eq('featured', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
        return c.json({ success: false, error: error.message }, 500)
    }

    return c.json({
        success: true,
        data: data as Project[],
        total: data?.length || 0,
    })
})

// GET /api/projects/:slug - Get project by slug
projectsRouter.get('/:slug', async (c) => {
    const slug = c.req.param('slug')

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !data) {
        return c.json({ success: false, error: 'Project not found' }, 404)
    }

    return c.json({
        success: true,
        data: data as Project,
    })
})

// GET /api/projects/meta/categories - Get all categories with counts
projectsRouter.get('/meta/categories', async (c) => {
    const { data, error } = await supabase.from('projects').select('category')

    if (error) {
        return c.json({ success: false, error: error.message }, 500)
    }

    const categories = (data || []).reduce(
        (acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1
            return acc
        },
        {} as Record<string, number>
    )

    return c.json({
        success: true,
        data: categories,
    })
})

// GET /api/projects/meta/tech-stack - Get all unique tech stack items
projectsRouter.get('/meta/tech-stack', async (c) => {
    const { data, error } = await supabase.from('projects').select('technologies')

    if (error) {
        return c.json({ success: false, error: error.message }, 500)
    }

    const techStack = [...new Set((data || []).flatMap((p) => p.technologies))].sort()

    return c.json({
        success: true,
        data: techStack,
    })
})
