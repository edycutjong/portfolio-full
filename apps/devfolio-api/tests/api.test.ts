import { describe, expect, it, beforeAll } from 'bun:test'
import app from '../src/index'

describe('DevFolio API', () => {
    describe('GET /', () => {
        it('should return health check', async () => {
            const res = await app.fetch(new Request('http://localhost/'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.name).toBe('DevFolio API')
            expect(json.status).toBe('healthy')
        })
    })

    describe('GET /api/projects', () => {
        it('should return all projects', async () => {
            const res = await app.fetch(new Request('http://localhost/api/projects'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.success).toBe(true)
            expect(Array.isArray(json.data)).toBe(true)
            expect(json.total).toBeGreaterThan(0)
        })

        it('should filter by category', async () => {
            const res = await app.fetch(new Request('http://localhost/api/projects?category=web'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.data.every((p: any) => p.category === 'web')).toBe(true)
        })

        it('should filter featured projects', async () => {
            const res = await app.fetch(new Request('http://localhost/api/projects?featured=true'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.data.every((p: any) => p.featured === true)).toBe(true)
        })
    })

    describe('GET /api/projects/:slug', () => {
        it('should return project by slug', async () => {
            const res = await app.fetch(new Request('http://localhost/api/projects/devfolio-ai'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.success).toBe(true)
            expect(json.data.slug).toBe('devfolio-ai')
        })

        it('should return 404 for non-existent project', async () => {
            const res = await app.fetch(new Request('http://localhost/api/projects/non-existent'))
            const json = await res.json()

            expect(res.status).toBe(404)
            expect(json.success).toBe(false)
        })
    })

    describe('GET /api/profile', () => {
        it('should return profile information', async () => {
            const res = await app.fetch(new Request('http://localhost/api/profile'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.success).toBe(true)
            expect(json.data.name).toBeDefined()
            expect(json.data.skills).toBeDefined()
        })

        it('should return skills', async () => {
            const res = await app.fetch(new Request('http://localhost/api/profile/skills'))
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(Array.isArray(json.data)).toBe(true)
        })
    })

    describe('POST /api/contact', () => {
        it('should accept valid contact form', async () => {
            const res = await app.fetch(
                new Request('http://localhost/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test@example.com',
                        subject: 'Test Subject Here',
                        message: 'This is a test message that is long enough to pass validation.',
                    }),
                })
            )
            const json = await res.json()

            expect(res.status).toBe(201)
            expect(json.success).toBe(true)
            expect(json.id).toBeDefined()
        })

        it('should reject invalid email', async () => {
            const res = await app.fetch(
                new Request('http://localhost/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'invalid-email',
                        subject: 'Test Subject',
                        message: 'This is a test message that is long enough.',
                    }),
                })
            )

            expect(res.status).toBe(400)
        })
    })

    describe('POST /api/chat', () => {
        it('should respond to chat message', async () => {
            const res = await app.fetch(
                new Request('http://localhost/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'What are your skills?',
                    }),
                })
            )
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.success).toBe(true)
            expect(json.data.response).toBeDefined()
            expect(json.data.conversationId).toBeDefined()
        })

        it('should maintain conversation history', async () => {
            // First message
            const res1 = await app.fetch(
                new Request('http://localhost/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Hello' }),
                })
            )
            const json1 = await res1.json()
            const convId = json1.data.conversationId

            // Second message with same conversation
            const res2 = await app.fetch(
                new Request('http://localhost/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'What projects do you have?',
                        conversationId: convId,
                    }),
                })
            )
            const json2 = await res2.json()

            expect(json2.data.conversationId).toBe(convId)
        })
    })

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const res = await app.fetch(new Request('http://localhost/api/unknown'))
            const json = await res.json()

            expect(res.status).toBe(404)
            expect(json.error).toBe('Not Found')
        })
    })
})
