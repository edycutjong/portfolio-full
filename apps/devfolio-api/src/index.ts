import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { apiReference } from '@scalar/hono-api-reference'
import { projectsRouter } from './routes/projects'
import { profileRouter } from './routes/profile'
import { contactRouter } from './routes/contact'
import { chatRouter } from './routes/chat'
import { openApiSpec } from './openapi'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
    '*',
    cors({
        origin: '*',  // Allow all origins for portfolio demo
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    })
)

// Health check
app.get('/', (c) => {
    return c.json({
        name: 'DevFolio API',
        version: '0.0.1',
        status: 'healthy',
        timestamp: new Date().toISOString(),
    })
})

// OpenAPI spec endpoint
app.get('/openapi.json', (c) => {
    return c.json(openApiSpec)
})

// API Documentation (Scalar)
app.get(
    '/docs',
    apiReference({
        theme: 'kepler',
        url: '/openapi.json',
        pageTitle: 'DevFolio API Documentation',
    })
)

// Routes
app.route('/api/projects', projectsRouter)
app.route('/api/profile', profileRouter)
app.route('/api/contact', contactRouter)
app.route('/api/chat', chatRouter)

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

// Error handler
app.onError((err, c) => {
    console.error('Error:', err)
    return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

const port = Number(process.env.PORT) || 8787

console.log(`🚀 DevFolio API running at http://localhost:${port}`)

export default {
    port,
    fetch: app.fetch,
}
