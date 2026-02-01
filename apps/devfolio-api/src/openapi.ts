/**
 * OpenAPI 3.1 Specification for DevFolio API
 * 
 * Documentation for the portfolio backend API endpoints.
 */

export const openApiSpec = {
    openapi: '3.1.0',
    info: {
        title: 'DevFolio API',
        version: '0.0.1',
        description: `
Portfolio backend API for managing projects, profile, contact forms, and AI chat.

## Features
- **Projects**: CRUD operations for portfolio projects
- **Profile**: Developer profile and skills
- **Contact**: Contact form submissions
- **Chat**: AI-powered portfolio assistant (GPT-4o-mini)

## Authentication
This API is public and does not require authentication for read operations.
        `,
        contact: {
            name: 'Edy Cu',
            url: 'https://edycu.dev',
        },
    },
    servers: [
        {
            url: 'http://localhost:8787',
            description: 'Local development',
        },
        {
            url: 'https://portfolio-full-devfolio-api.vercel.app',
            description: 'Production',
        },
    ],
    tags: [
        { name: 'Health', description: 'API health check' },
        { name: 'Projects', description: 'Portfolio projects management' },
        { name: 'Profile', description: 'Developer profile and skills' },
        { name: 'Contact', description: 'Contact form submissions' },
        { name: 'Chat', description: 'AI-powered portfolio assistant' },
    ],
    paths: {
        '/': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                description: 'Returns API health status and version information',
                responses: {
                    '200': {
                        description: 'API is healthy',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HealthResponse' },
                                example: {
                                    name: 'DevFolio API',
                                    version: '0.0.1',
                                    status: 'healthy',
                                    timestamp: '2024-01-15T12:00:00.000Z',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/projects': {
            get: {
                tags: ['Projects'],
                summary: 'List all projects',
                description: 'Retrieve all portfolio projects with optional filtering',
                parameters: [
                    {
                        name: 'category',
                        in: 'query',
                        description: 'Filter by project category',
                        schema: {
                            type: 'string',
                            enum: ['web', 'mobile', 'backend', 'ai', 'web3', 'devops'],
                        },
                    },
                    {
                        name: 'featured',
                        in: 'query',
                        description: 'Filter featured projects only',
                        schema: { type: 'string', enum: ['true', 'false'] },
                    },
                ],
                responses: {
                    '200': {
                        description: 'List of projects',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ProjectListResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/projects/{slug}': {
            get: {
                tags: ['Projects'],
                summary: 'Get project by slug',
                description: 'Retrieve a specific project by its URL slug',
                parameters: [
                    {
                        name: 'slug',
                        in: 'path',
                        required: true,
                        description: 'Project URL slug',
                        schema: { type: 'string' },
                        example: 'devfolio-ai',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Project details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ProjectResponse' },
                            },
                        },
                    },
                    '404': {
                        description: 'Project not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/projects/meta/categories': {
            get: {
                tags: ['Projects'],
                summary: 'Get category counts',
                description: 'Get all project categories with their counts',
                responses: {
                    '200': {
                        description: 'Category counts',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    data: { web: 3, ai: 2, backend: 4 },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/projects/meta/tech-stack': {
            get: {
                tags: ['Projects'],
                summary: 'Get all technologies',
                description: 'Get unique list of all technologies used across projects',
                responses: {
                    '200': {
                        description: 'Technology list',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    data: ['Go', 'TypeScript', 'React', 'Rust', 'Python'],
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/profile': {
            get: {
                tags: ['Profile'],
                summary: 'Get developer profile',
                description: 'Retrieve the developer profile including skills grouped by category',
                responses: {
                    '200': {
                        description: 'Profile data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ProfileResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/profile/skills': {
            get: {
                tags: ['Profile'],
                summary: 'Get skills',
                description: 'Get all skills grouped by category',
                responses: {
                    '200': {
                        description: 'Skills grouped by category',
                    },
                },
            },
        },
        '/api/profile/resume': {
            get: {
                tags: ['Profile'],
                summary: 'Get resume URL',
                description: 'Get URL to download the resume PDF',
                responses: {
                    '200': {
                        description: 'Resume URL',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    data: {
                                        url: '/resume.pdf',
                                        filename: 'Developer_Resume.pdf',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/contact': {
            post: {
                tags: ['Contact'],
                summary: 'Submit contact form',
                description: 'Submit a contact form message',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ContactRequest' },
                            example: {
                                name: 'John Doe',
                                email: 'john@example.com',
                                subject: 'Job Opportunity',
                                message: 'Hi, I would like to discuss a potential opportunity...',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Message sent successfully',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    message: 'Thank you for your message! I will get back to you soon.',
                                    id: 'uuid-here',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/contact/stats': {
            get: {
                tags: ['Contact'],
                summary: 'Get contact stats',
                description: 'Get contact form submission statistics',
                responses: {
                    '200': {
                        description: 'Contact statistics',
                        content: {
                            'application/json': {
                                example: {
                                    success: true,
                                    data: { total: 42, thisMonth: 5 },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/chat': {
            post: {
                tags: ['Chat'],
                summary: 'Send chat message',
                description: 'Send a message to the AI portfolio assistant powered by GPT-4o-mini',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChatRequest' },
                            example: {
                                message: 'What projects have you built with Go?',
                                conversationId: 'optional-conversation-id',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'AI response',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ChatResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/chat/{conversationId}': {
            get: {
                tags: ['Chat'],
                summary: 'Get conversation history',
                description: 'Retrieve the history of a specific conversation',
                parameters: [
                    {
                        name: 'conversationId',
                        in: 'path',
                        required: true,
                        description: 'Conversation ID',
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Conversation history',
                    },
                    '404': {
                        description: 'Conversation not found',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            HealthResponse: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    version: { type: 'string' },
                    status: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                },
            },
            Project: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' },
                    longDescription: { type: 'string' },
                    techStack: { type: 'array', items: { type: 'string' } },
                    category: { type: 'string', enum: ['web', 'mobile', 'backend', 'ai', 'web3', 'devops'] },
                    status: { type: 'string', enum: ['completed', 'in-progress', 'planned'] },
                    githubUrl: { type: 'string' },
                    liveUrl: { type: 'string' },
                    imageUrl: { type: 'string' },
                    featured: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            ProjectListResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Project' } },
                    total: { type: 'integer' },
                },
            },
            ProjectResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Project' },
                },
            },
            ProfileResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            title: { type: 'string' },
                            bio: { type: 'string' },
                            location: { type: 'string' },
                            email: { type: 'string' },
                            skills: { type: 'object' },
                        },
                    },
                },
            },
            ContactRequest: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                    name: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    subject: { type: 'string', minLength: 5 },
                    message: { type: 'string', minLength: 20 },
                },
            },
            ChatRequest: {
                type: 'object',
                required: ['message'],
                properties: {
                    message: { type: 'string', minLength: 1 },
                    conversationId: { type: 'string' },
                },
            },
            ChatResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: {
                        type: 'object',
                        properties: {
                            response: { type: 'string' },
                            conversationId: { type: 'string' },
                            sources: { type: 'array', items: { type: 'string' } },
                        },
                    },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', default: false },
                    error: { type: 'string' },
                },
            },
        },
    },
}
