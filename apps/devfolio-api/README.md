# DevFolio API

AI-powered portfolio backend built with Hono and Bun.

## Features

- 🚀 **Ultra-fast** - Hono framework running on Bun runtime
- 🤖 **AI Chat** - Chatbot that answers questions about your portfolio
- 📊 **Projects API** - CRUD operations with filtering and categorization
- 👤 **Profile API** - Skills, experience, and resume download tracking
- 📧 **Contact Form** - Validated submissions with email notifications
- ✅ **Fully Tested** - Comprehensive unit tests with Bun test runner

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Validation**: Zod
- **Testing**: Bun Test

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## API Endpoints

### Health Check
```
GET /
```

### Projects
```
GET    /api/projects                 # List all projects
GET    /api/projects?category=web    # Filter by category
GET    /api/projects?featured=true   # Filter featured
GET    /api/projects/:slug           # Get by slug
GET    /api/projects/meta/categories # Get category counts
GET    /api/projects/meta/tech-stack # Get all tech stack items
```

### Profile
```
GET    /api/profile                  # Get profile info
GET    /api/profile/skills           # Get skills by category
GET    /api/profile/experience       # Get work experience
GET    /api/profile/resume           # Track resume download
```

### Contact
```
POST   /api/contact                  # Submit contact form
GET    /api/contact/stats            # Get submission stats (admin)
```

### Chat (AI)
```
POST   /api/chat                     # Send message to AI
GET    /api/chat/:conversationId     # Get conversation history
```

## Request/Response Examples

### Submit Contact Form
```bash
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Job Opportunity",
    "message": "I am interested in discussing a position..."
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What experience do you have with Go?"
  }'
```

## Environment Variables

```env
PORT=8787              # Server port (default: 8787)
OPENAI_API_KEY=...     # OpenAI API key (for production AI chat)
```

## Project Structure

```
apps/devfolio-api/
├── src/
│   ├── index.ts       # Entry point, middleware, routes
│   ├── types/         # Zod schemas and TypeScript types
│   ├── data/          # Mock data (replace with DB in prod)
│   └── routes/        # API route handlers
│       ├── projects.ts
│       ├── profile.ts
│       ├── contact.ts
│       └── chat.ts
├── tests/
│   └── api.test.ts    # Integration tests
├── package.json
└── tsconfig.json
```

## License

MIT
