# DevFolio Web

AI-powered developer portfolio website built with Next.js 15 and Tailwind CSS.

## Features

- 🎨 **Premium Glassmorphism Design** - Modern dark theme with glass effects
- 🤖 **AI Chat Bot** - Floating chatbot that answers questions about you
- ⚡ **Next.js 15** - Server-side rendering for SEO
- 📱 **Fully Responsive** - Mobile-first design
- 🎬 **Smooth Animations** - Fade-in, slide-up, and hover effects

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: Connects to DevFolio API

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Components

| Component | Description |
|-----------|-------------|
| `Header` | Fixed navbar with glass effect on scroll |
| `Hero` | Full-screen landing with animated badge |
| `Projects` | Filterable project cards with categories |
| `Skills` | Skill chips grouped by category |
| `Contact` | Form with validation and API submission |
| `ChatBot` | Floating AI chat with conversation history |
| `Footer` | Social links and copyright |

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8787   # DevFolio API URL
```

## Project Structure

```
apps/devfolio-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   ├── ChatBot.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── api.ts          # API client
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Design System

- **Background**: Dark gradient (#0f0f0f → #1a1a2e)
- **Primary**: Green (#22c55e)
- **Accent**: Purple (#a855f7)
- **Glass**: rgba(255,255,255,0.05) with blur(20px)

## License

MIT
