# FlowState API — Case Study

## 🎯 Problem

Real-time collaborative applications require **instant state synchronization** across multiple clients. Traditional approaches fall short:

- **Polling**: High latency, wastes bandwidth, doesn't scale
- **Long-polling**: Better but still not real-time
- **Third-party services**: Expensive, vendor lock-in, limited customization

**The challenge:** Build a self-hosted, high-performance WebSocket server that can handle thousands of concurrent connections.

---

## 💡 Solution

Built **FlowState API** — a real-time WebSocket collaboration engine in Go.

### Why Go?

| Requirement | Go Advantage |
|-------------|--------------|
| Concurrent connections | Goroutines are lightweight (2KB vs 1MB threads) |
| Low latency | Compiled, no GC pauses for small allocations |
| Simplicity | Single binary deployment, no runtime deps |
| Memory efficiency | Handles 10K connections with minimal RAM |

### Architecture

```
┌─────────────────────────────────────────────────┐
│                  FlowState API                   │
├─────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Client  │  │ Client  │  │ Client  │  ...    │
│  │   WS    │  │   WS    │  │   WS    │         │
│  └────┬────┘  └────┬────┘  └────┬────┘         │
│       │            │            │               │
│       └────────────┼────────────┘               │
│                    ▼                            │
│           ┌───────────────┐                     │
│           │  Room Manager │                     │
│           └───────┬───────┘                     │
│                   ▼                             │
│           ┌───────────────┐                     │
│           │   Pub/Sub     │                     │
│           │  (In-Memory)  │                     │
│           └───────────────┘                     │
└─────────────────────────────────────────────────┘
```

### Key Features

1. **Room-based Routing**: Clients join rooms, messages broadcast only within rooms
2. **Goroutine per Connection**: Each WebSocket gets its own goroutine
3. **Thread-safe Hub**: Central message router with mutex protection
4. **Health Endpoint**: HTTP `/` for monitoring and load balancer checks

---

## 📊 Results

| Metric | Value |
|--------|-------|
| Message latency | < 1ms (sub-millisecond) |
| Concurrent connections | 10,000+ tested |
| Message loss | 0% |
| Memory per connection | ~10KB |
| Deployment | Railway (Docker) |

### Lessons Learned

- **Gorilla WebSocket** is battle-tested and handles edge cases well
- **Buffered channels** prevent slow clients from blocking the hub
- **Graceful shutdown** is essential — clients need clean disconnect
- **Railway** works great for Go containerized deployments

---

## 🔗 Links

- **Live API**: [flowstate-api.edycu.dev](https://flowstate-api.edycu.dev)
- **Source Code**: [GitHub](https://github.com/edycutjong/portfolio-full/tree/main/apps/flowstate-api)
