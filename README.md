# PortfolioFull — Multi-Stack Portfolio Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Go](https://img.shields.io/badge/Go-WebSocket-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-Axum-000000?style=for-the-badge&logo=rust)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**A production-ready monorepo showcasing 5 full-stack projects across 4 tech stacks**

[**🌐 Live Demo**](https://edycu.dev) · [**📄 API Docs**](https://documind-api.edycu.dev/docs) · [**🔗 All Projects**](#-live-deployments)

</div>

---

## 🌐 Live Deployments

| Project | Tech Stack | Live URL | Status |
|---------|------------|----------|--------|
| **DevFolio Web** | Next.js 15, TypeScript | [edycu.dev](https://edycu.dev) | ✅ Live |
| **DevFolio API** | Bun, Hono | [Vercel](https://portfolio-full-devfolio-api.vercel.app) | ✅ Live |
| **DocuMind API** | Python, FastAPI, RAG | [documind-api.edycu.dev](https://documind-api.edycu.dev) | ✅ Live |
| **FlowState API** | Go, WebSocket | [flowstate-api.edycu.dev](https://flowstate-api.edycu.dev) | ✅ Live |
| **DataPulse Analytics** | Rust, Axum | [datapulse-api.edycu.dev](https://datapulse-api.edycu.dev) | ✅ Live |
| **DocuMind Web** | Next.js 15 | [documind.edycu.dev](https://documind.edycu.dev) | 🔄 Deploying |

---

## 🚀 Featured Projects

### 🧠 DocuMind AI — Intelligent Document Q&A
> **Upload documents, ask questions, get cited answers using RAG technology**

**Tech:** Python · FastAPI · LangChain · OpenAI GPT-4o-mini · Pinecone Vector DB

**Key Features:**
- PDF, DOCX, TXT document processing
- Retrieval-Augmented Generation (RAG) pipeline
- Smart chunking with source citations
- RESTful API with OpenAPI docs

🔗 [API Docs](https://documind-api.edycu.dev/docs) · [Live Demo](https://documind.edycu.dev)

---

### ⚡ FlowState API — Real-time Collaboration Engine
> **WebSocket-powered state synchronization for collaborative apps**

**Tech:** Go · Gorilla WebSocket · In-memory pub/sub

**Key Features:**
- Sub-millisecond message broadcasting
- Room-based collaboration
- Horizontal scaling support
- Health monitoring endpoint

🔗 [Live](https://flowstate-api.edycu.dev)

---

### 📊 DataPulse Analytics — High-Performance Analytics Engine
> **Real-time streaming analytics built for speed**

**Tech:** Rust · Axum · Tokio async runtime

**Key Features:**
- Memory-safe concurrent processing
- Zero-cost abstractions
- Docker-optimized deployment
- JSON REST API

🔗 [Live](https://datapulse-api.edycu.dev)

---

## 📁 Project Structure

```
📦 portfolio-full
├── 🌐 apps/
│   ├── devfolio-web/        # Portfolio frontend (Next.js 15)
│   ├── devfolio-api/        # Portfolio API (Bun + Hono)
│   ├── documind-web/        # AI SaaS frontend (Next.js)
│   ├── documind-api/        # RAG backend (Python + FastAPI)
│   ├── flowstate-api/       # WebSocket server (Go)
│   └── datapulse-analytics/ # Analytics engine (Rust)
├── 📦 packages/             # Shared code
│   ├── ui/                  # React components
│   └── config/              # ESLint, TypeScript configs
└── 🔧 infra/                # DevOps templates
    ├── terraform/
    └── kubernetes/
```

## 🛠️ Quick Start

```bash
# Clone
git clone https://github.com/edycutjong/portfolio-full.git
cd portfolio-full

# Install dependencies (Bun)
bun install

# Start any project
cd apps/devfolio-web && bun dev   # Next.js on :3000
cd apps/documind-api && uv run fastapi dev   # Python on :8000
cd apps/flowstate-api && go run .    # Go on :8080
cd apps/datapulse-analytics && cargo run   # Rust on :8080
```

## 📊 Tech Stack Overview

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Python/FastAPI, Go, Rust/Axum, Bun/Hono |
| **AI/ML** | OpenAI GPT-4o-mini, LangChain, Pinecone |
| **Databases** | Supabase (PostgreSQL), Redis |
| **DevOps** | Vercel, Railway, Docker, GitHub Actions |
| **Monitoring** | UptimeRobot, Vercel Analytics |

## 🚀 Deployment

All projects are deployed across **Vercel** (Node.js/Python) and **Railway** (Go/Rust):

- **Vercel**: devfolio-web, devfolio-api, documind-api, documind-web
- **Railway**: flowstate-api, datapulse-analytics

See individual project READMEs for deployment instructions.

## 👨‍💻 About

Built by **Edy Cu** — Full-stack engineer focused on building scalable, production-ready applications.

- 🌐 Portfolio: [edycu.dev](https://edycu.dev)
- 💼 LinkedIn: [edycutjong](https://linkedin.com/in/edycutjong)
- 🐙 GitHub: [edycutjong](https://github.com/edycutjong)

## 📄 License

MIT © 2026 Edy Cu
