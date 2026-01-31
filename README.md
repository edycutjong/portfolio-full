# PortfolioFull — Multi-Stack Portfolio Workspace

A monorepo containing 6 full-stack projects targeting high-paying remote positions ($120K-$300K+).

## 🌐 Live Deployments

| Project | Tech Stack | Live URL |
|---------|------------|----------|
| DevFolio Web | Next.js 15, TypeScript | [edycu.dev](https://edycu.dev) |
| DevFolio API | Bun, Hono | [Vercel](https://devfolio-api.vercel.app) |
| DocuMind API | Python, FastAPI | [documind-api.edycu.dev](https://documind-api.edycu.dev) |
| FlowState API | Go, WebSocket | [flowstate-api.edycu.dev](https://flowstate-api.edycu.dev) |
| DataPulse Analytics | Rust, Axum | [datapulse-api.edycu.dev](https://datapulse-api.edycu.dev) |
| SolStake Protocol | Rust, Anchor | ❌ Blocked (LLVM) |

## 🚀 Projects


| Project | Description | Tech Stack | Status |
|---------|-------------|------------|--------|
| [DevFolio AI](./apps/devfolio-web) | AI-powered portfolio with chatbot | Next.js, Hono, OpenAI | 🔨 In Progress |
| [DocuMind AI](./apps/documind-web) | Intelligent document Q&A | FastAPI, LangChain, Pinecone | 📋 Planned |
| [LinkSnap](./apps/linksnap) | High-performance URL shortener | Go, Redis, Prometheus | 📋 Planned |
| [SolMint](./apps/solmint-web) | No-code NFT minting platform | Rust, Anchor, Solana | 📋 Planned |
| [SpendWise](./apps/spendwise) | Offline-first expense tracker | React Native, SQLite | 📋 Planned |
| [InfraHub](./infra) | Reusable DevOps templates | Terraform, K8s, GitHub Actions | 📋 Planned |

## 📁 Structure

```
├── apps/                    # Deployable applications
│   ├── devfolio-web/        # Portfolio frontend (Next.js)
│   ├── devfolio-api/        # Portfolio API (Hono + Bun)
│   ├── documind-web/        # AI SaaS frontend
│   ├── documind-api/        # AI SaaS backend (FastAPI)
│   ├── linksnap/            # URL shortener (Go)
│   ├── solmint-web/         # NFT DApp frontend
│   ├── solmint-contracts/   # Solana programs (Rust)
│   └── spendwise/           # Mobile app (React Native)
├── packages/                # Shared code
│   ├── ui/                  # Shared React components
│   ├── config/              # ESLint, Prettier, TypeScript configs
│   └── utils/               # Shared utilities
├── infra/                   # DevOps & Infrastructure
│   ├── terraform/           # IaC templates
│   ├── kubernetes/          # K8s manifests
│   └── docker/              # Shared Dockerfiles
└── docs/                    # Documentation
```

## 🛠️ Setup

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development (specific project)
cd apps/devfolio-web && bun dev
```

## 🚀 Deployment (Vercel)

### Prerequisites
- GitHub account with code pushed to a repository
- Vercel account (free tier works)
- Supabase project (for database)

### Deploy Frontend (devfolio-web)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `apps/devfolio-web`
   - **Framework**: Next.js
   - **Build Command**: `bun run build`
   - **Install Command**: `bun install`
4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-api-project.vercel.app` |
5. Click **Deploy**

### Deploy API (devfolio-api)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the **same** GitHub repository
3. Configure:
   - **Root Directory**: `apps/devfolio-api`
   - **Framework**: Other
4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | `https://xxx.supabase.co` |
   | `SUPABASE_ANON_KEY` | `your-anon-key` |
5. Click **Deploy**

### Live URLs

| Project | URL |
|---------|-----|
| Frontend | https://portfolio-full-devfolio-web.vercel.app |
| API | https://portfolio-full-devfolio-api.vercel.app |

### Custom Domain (Optional)

1. Go to Project → **Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS at your registrar:
   ```
   CNAME  @  cname.vercel-dns.com
   CNAME  www  cname.vercel-dns.com
   ```
4. SSL is automatic and free ✅

## 📄 License

MIT
