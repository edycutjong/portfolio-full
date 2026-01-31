# DataPulse Analytics

High-performance streaming analytics engine built with Rust.

## Features

- 📡 **Stream Processing** - Real-time event ingestion
- 🔄 **Data Pipelines** - Configurable transformation chains
- 📊 **Windowed Aggregations** - Count, sum, avg, min, max
- 📈 **Metrics Collection** - Time-series metrics storage
- 🚀 **High Performance** - Rust + Tokio async runtime

## Tech Stack

- **Language**: Rust
- **Runtime**: Tokio async
- **Web**: Axum
- **Messaging**: Kafka (rdkafka)
- **Serialization**: Serde

## Getting Started

```bash
# Build
cargo build --release

# Run
cargo run

# Test
cargo test
```

## API Endpoints

### Health & Stats
```
GET  /                    # Health check
GET  /api/stats           # System statistics
```

### Pipelines
```
POST   /api/pipelines             # Create pipeline
GET    /api/pipelines             # List pipelines
GET    /api/pipelines/{id}        # Get pipeline
POST   /api/pipelines/{id}/start  # Start pipeline
POST   /api/pipelines/{id}/stop   # Stop pipeline
DELETE /api/pipelines/{id}        # Delete pipeline
GET    /api/pipelines/{id}/window # Get window results
```

### Events
```
POST   /api/events/ingest   # Ingest events
```

### Metrics
```
GET    /api/metrics         # Get all metrics
POST   /api/metrics         # Record a metric
```

## Pipeline Transformations

| Type | Description |
|------|-------------|
| `filter` | Filter events by field condition |
| `map` | Transform field names |
| `aggregate` | Windowed aggregations |
| `enrich` | Join with lookup tables |

### Example: Create Pipeline

```bash
curl -X POST http://localhost:8003/api/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user-analytics",
    "source_topic": "user-events",
    "sink_topic": "processed-events",
    "transformation": {
      "aggregate": {
        "window_seconds": 60,
        "function": { "count": null }
      }
    }
  }'
```

### Example: Ingest Events

```bash
curl -X POST http://localhost:8003/api/events/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "event_type": "page_view",
        "source": "web",
        "data": {"page": "/home", "user_id": "123"}
      }
    ]
  }'
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Kafka     │ ──▶ │   Pipeline  │ ──▶ │   Window    │
│   Source    │     │   Process   │     │   Aggregate │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Metrics   │
                    │   Storage   │
                    └─────────────┘
```

## Project Structure

```
apps/datapulse-analytics/
├── Cargo.toml           # Dependencies
├── src/
│   └── main.rs          # API + pipeline logic
└── README.md
```

## Performance

- Async I/O with Tokio
- Zero-copy message parsing
- Bounded buffers (10K events/metrics)
- Lock-free reads where possible

## License

MIT
