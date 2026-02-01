# DevFolio AI — Case Study

## 🎯 Problem

Job seekers face a critical challenge in standing out:

- **Recruiters spend ~6 seconds** scanning each portfolio
- **Static portfolios** can't answer specific questions
- **Time zone differences** mean missed opportunities
- **Generic templates** don't showcase technical depth

**The goal:** Create a portfolio that's available 24/7 and can intelligently answer recruiter questions.

---

## 💡 Solution

Built **DevFolio AI** — an AI-powered portfolio with an embedded chatbot that answers questions about my experience, projects, and availability.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Glassmorphism design |
| Backend API | Bun, Hono (edge-optimized) |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel (edge functions) |
| Domain | Custom `.dev` TLD |

### Architecture

```
┌─────────────────────────────────────────────────┐
│              DevFolio Web (Next.js 15)          │
│  ┌─────────┐  ┌──────────┐  ┌───────────────┐   │
│  │  Hero   │  │ Projects │  │    Contact    │   │
│  └─────────┘  └──────────┘  └───────────────┘   │
│                    │                             │
│              ┌─────▼─────┐                       │
│              │  ChatBot  │ ◄── AI-powered        │
│              └─────┬─────┘                       │
└────────────────────┼────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────┐
│              DevFolio API (Hono)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ /projects│  │ /profile │  │   /chat      │   │
│  └──────────┘  └──────────┘  └──────┬───────┘   │
│                                     │           │
│                              ┌──────▼───────┐   │
│                              │ OpenAI API   │   │
│                              └──────────────┘   │
└─────────────────────────────────────────────────┘
```

### Key Features

1. **AI Chatbot** — Answers questions about skills, experience, availability
2. **Project Showcase** — Filterable grid with live demo links
3. **Contact Form** — Direct email integration
4. **Responsive Design** — Mobile-first, glassmorphism aesthetic
5. **Performance** — 90+ Lighthouse scores

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Hono over Express** | Edge-compatible, smaller bundle, faster cold starts |
| **GPT-4o-mini** | Cost-effective, fast responses, sufficient for FAQ |
| **Bun runtime** | 3x faster than Node.js, native TypeScript |
| **Glassmorphism** | Modern, premium feel that stands out |
| **Custom domain** | `.dev` TLD signals technical credibility |

---

## 📊 Results

| Metric | Value |
|--------|-------|
| Lighthouse Performance | 95+ |
| First Contentful Paint | < 1.5s |
| API Response Time | < 200ms |
| Chatbot Response | < 2s |
| Mobile Responsive | ✅ |

### Recruiter Experience

- **24/7 availability** — Chatbot answers instantly, any timezone
- **Specific answers** — "What's your Go experience?" gets a tailored response
- **Professional presence** — Custom domain builds credibility
- **Easy contact** — Form submits directly to email

### Technical Highlights

- **Type-safe API** — Full TypeScript from frontend to backend
- **OpenAPI spec** — Self-documenting API endpoints
- **Edge deployment** — Global CDN for fast loads
- **Modern stack** — Next.js 15, React 19, Bun

### Lessons Learned

- **AI chatbots add real value** — recruiters actually use them
- **Performance matters** — fast sites get more engagement
- **Custom domains are worth it** — `.dev` signals professionalism
- **Hono + Bun is production-ready** — fast, stable, great DX

---

## 🔗 Links

- **Live Portfolio**: [edycu.dev](https://edycu.dev)
- **API**: [api.edycu.dev](https://api.edycu.dev)
- **Source Code**: [GitHub](https://github.com/edycutjong/portfolio-full)
