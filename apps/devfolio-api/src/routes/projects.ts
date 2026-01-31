import { Hono } from 'hono'
import { projects } from '../data'

export const projectsRouter = new Hono()

// GET /api/projects - List all projects
projectsRouter.get('/', (c) => {
    const category = c.req.query('category')
    const featured = c.req.query('featured')
    const status = c.req.query('status')

    let filtered = [...projects]

    if (category) {
        filtered = filtered.filter((p) => p.category === category)
    }

    if (featured === 'true') {
        filtered = filtered.filter((p) => p.featured)
    }

    if (status) {
        filtered = filtered.filter((p) => p.status === status)
    }

    // Sort by order
    filtered.sort((a, b) => a.order - b.order)

    return c.json({
        success: true,
        data: filtered,
        total: filtered.length,
    })
})

// GET /api/projects/:slug - Get project by slug
projectsRouter.get('/:slug', (c) => {
    const slug = c.req.param('slug')
    const project = projects.find((p) => p.slug === slug)

    if (!project) {
        return c.json({ success: false, error: 'Project not found' }, 404)
    }

    return c.json({
        success: true,
        data: project,
    })
})

// GET /api/projects/categories - Get all categories with counts
projectsRouter.get('/meta/categories', (c) => {
    const categories = projects.reduce(
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

// GET /api/projects/tech-stack - Get all unique tech stack items
projectsRouter.get('/meta/tech-stack', (c) => {
    const techStack = [...new Set(projects.flatMap((p) => p.techStack))].sort()

    return c.json({
        success: true,
        data: techStack,
    })
})
