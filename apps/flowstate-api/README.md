# FlowState API

Real-time collaboration backend built with Go and WebSockets.

## Features

- 🔌 **WebSocket Connections** - Bidirectional real-time communication
- 👥 **Presence Tracking** - See who's online in each room
- 📝 **Live Editing** - Document changes sync instantly
- 🎯 **Cursor Sync** - See other users' cursor positions
- ⌨️ **Typing Indicators** - Know when others are typing

## Tech Stack

- **Language**: Go 1.22
- **WebSocket**: Gorilla WebSocket
- **Routing**: net/http (stdlib)
- **CORS**: rs/cors
- **IDs**: Google UUID

## Getting Started

```bash
# Download dependencies
go mod download

# Run server
go run main.go

# Run tests
go test -v
```

## API Endpoints

### REST

```
GET  /               # Health check
GET  /api/rooms      # List all rooms
POST /api/rooms      # Create a room
GET  /api/rooms/{id} # Get room details
DELETE /api/rooms/{id} # Delete a room
```

### WebSocket

Connect to `ws://localhost:8001/ws`

#### Message Types

| Type | Description |
|------|-------------|
| `join` | Join a collaboration room |
| `leave` | Leave current room |
| `cursor` | Update cursor position |
| `focus` | Update focused element |
| `typing` | Typing indicator |
| `edit` | Document edit |
| `sync` | Request document state |
| `presence` | User join/leave events |

#### Join Room
```json
{
  "type": "join",
  "payload": {
    "roomId": "room-uuid",
    "name": "John Doe",
    "color": "#22c55e"
  }
}
```

#### Cursor Update
```json
{
  "type": "cursor",
  "payload": {
    "x": 150,
    "y": 300,
    "selection": {"start": 0, "end": 10}
  }
}
```

#### Edit Document
```json
{
  "type": "edit",
  "payload": {
    "content": "Updated content",
    "version": 5
  }
}
```

## Architecture

```
Client A ──WebSocket──┐
                      │
Client B ──WebSocket──┼──▶ Hub ──▶ Room ──▶ Document
                      │
Client C ──WebSocket──┘
```

## Project Structure

```
apps/flowstate-api/
├── main.go          # Server, handlers, Hub
├── main_test.go     # Unit tests
├── go.mod           # Dependencies
└── README.md
```

## License

MIT
