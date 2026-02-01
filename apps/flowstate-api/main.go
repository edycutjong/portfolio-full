// Package main is the entry point for FlowState real-time collaboration API.
//
// FlowState provides WebSocket-based real-time features for:
// - Live document collaboration with CRDT
// - User presence detection
// - Cursor and focus tracking
// - Typing indicators
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

// Message types for WebSocket communication
const (
	MessageTypeJoin     = "join"
	MessageTypeLeave    = "leave"
	MessageTypeCursor   = "cursor"
	MessageTypeFocus    = "focus"
	MessageTypeEdit     = "edit"
	MessageTypePresence = "presence"
	MessageTypeTyping   = "typing"
	MessageTypeSync     = "sync"
	MessageTypeError    = "error"
)

// Client represents a connected user
type Client struct {
	ID       string          `json:"id"`
	Name     string          `json:"name"`
	Color    string          `json:"color"`
	Conn     *websocket.Conn `json:"-"`
	RoomID   string          `json:"-"`
	LastSeen time.Time       `json:"lastSeen"`
}

// Room represents a collaboration session
type Room struct {
	ID       string             `json:"id"`
	Name     string             `json:"name"`
	Clients  map[string]*Client `json:"-"`
	Document *Document          `json:"-"`
	mutex    sync.RWMutex
}

// Document represents the shared document state
type Document struct {
	ID      string    `json:"id"`
	Content string    `json:"content"`
	Version int       `json:"version"`
	Updated time.Time `json:"updated"`
}

// Message is the WebSocket message envelope
type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
	From    string          `json:"from,omitempty"`
	Room    string          `json:"room,omitempty"`
}

// Hub manages all rooms and connections
type Hub struct {
	rooms   map[string]*Room
	clients map[string]*Client
	mutex   sync.RWMutex
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	return &Hub{
		rooms:   make(map[string]*Room),
		clients: make(map[string]*Client),
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in dev
	},
}

var hub = NewHub()

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handleHealth)
	mux.HandleFunc("/health", handleHealth)

	// API Documentation
	mux.HandleFunc("/openapi.json", handleOpenAPI)
	mux.HandleFunc("/docs", handleDocs)

	// REST endpoints
	mux.HandleFunc("/api/rooms", handleRooms)
	mux.HandleFunc("/api/rooms/", handleRoomByID)

	// WebSocket endpoint
	mux.HandleFunc("/ws", handleWebSocket)

	// CORS middleware
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://flowstate.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(mux)

	port := ":8001"
	log.Printf("🚀 FlowState API running on http://localhost%s", port)
	log.Printf("📡 WebSocket: ws://localhost%s/ws", port)

	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "flowstate",
		"version":   "0.1.0",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func handleOpenAPI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	openAPISpec := map[string]interface{}{
		"openapi": "3.1.0",
		"info": map[string]interface{}{
			"title":       "FlowState API",
			"version":     "0.1.0",
			"description": "Real-time collaboration API with WebSocket support for live document editing, cursor tracking, and presence detection.",
		},
		"servers": []map[string]string{
			{"url": "http://localhost:8001", "description": "Local development"},
			{"url": "https://flowstate-api.railway.app", "description": "Production"},
		},
		"tags": []map[string]string{
			{"name": "Health", "description": "API health check"},
			{"name": "Rooms", "description": "Collaboration room management"},
			{"name": "WebSocket", "description": "Real-time communication"},
		},
		"paths": map[string]interface{}{
			"/": map[string]interface{}{
				"get": map[string]interface{}{
					"tags":        []string{"Health"},
					"summary":     "Health check",
					"description": "Returns API health status",
					"responses": map[string]interface{}{
						"200": map[string]interface{}{"description": "API is healthy"},
					},
				},
			},
			"/api/rooms": map[string]interface{}{
				"get": map[string]interface{}{
					"tags":        []string{"Rooms"},
					"summary":     "List all rooms",
					"description": "Get all active collaboration rooms",
					"responses": map[string]interface{}{
						"200": map[string]interface{}{"description": "List of rooms"},
					},
				},
				"post": map[string]interface{}{
					"tags":        []string{"Rooms"},
					"summary":     "Create a room",
					"description": "Create a new collaboration room",
					"responses": map[string]interface{}{
						"201": map[string]interface{}{"description": "Room created"},
					},
				},
			},
			"/api/rooms/{roomId}": map[string]interface{}{
				"get": map[string]interface{}{
					"tags":        []string{"Rooms"},
					"summary":     "Get room details",
					"description": "Get room info including connected clients and document state",
					"responses": map[string]interface{}{
						"200": map[string]interface{}{"description": "Room details"},
						"404": map[string]interface{}{"description": "Room not found"},
					},
				},
				"delete": map[string]interface{}{
					"tags":        []string{"Rooms"},
					"summary":     "Delete a room",
					"description": "Delete a collaboration room",
					"responses": map[string]interface{}{
						"200": map[string]interface{}{"description": "Room deleted"},
					},
				},
			},
			"/ws": map[string]interface{}{
				"get": map[string]interface{}{
					"tags":        []string{"WebSocket"},
					"summary":     "WebSocket connection",
					"description": "Upgrade to WebSocket for real-time collaboration. Message types: join, leave, cursor, focus, edit, presence, typing, sync",
				},
			},
		},
	}
	json.NewEncoder(w).Encode(openAPISpec)
}

func handleDocs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	html := `<!DOCTYPE html>
<html>
<head>
    <title>FlowState API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: "/openapi.json",
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
            layout: "BaseLayout"
        });
    </script>
</body>
</html>`
	w.Write([]byte(html))
}

func handleRooms(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		// List all rooms
		hub.mutex.RLock()
		rooms := make([]map[string]interface{}, 0, len(hub.rooms))
		for _, room := range hub.rooms {
			rooms = append(rooms, map[string]interface{}{
				"id":          room.ID,
				"name":        room.Name,
				"clientCount": len(room.Clients),
			})
		}
		hub.mutex.RUnlock()
		json.NewEncoder(w).Encode(rooms)

	case http.MethodPost:
		// Create a room
		var req struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		room := &Room{
			ID:      uuid.New().String(),
			Name:    req.Name,
			Clients: make(map[string]*Client),
			Document: &Document{
				ID:      uuid.New().String(),
				Content: "",
				Version: 0,
				Updated: time.Now().UTC(),
			},
		}

		hub.mutex.Lock()
		hub.rooms[room.ID] = room
		hub.mutex.Unlock()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":   room.ID,
			"name": room.Name,
		})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleRoomByID(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Path[len("/api/rooms/"):]
	if roomID == "" {
		http.Error(w, "Room ID required", http.StatusBadRequest)
		return
	}

	hub.mutex.RLock()
	room, exists := hub.rooms[roomID]
	hub.mutex.RUnlock()

	if !exists {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		room.mutex.RLock()
		clients := make([]map[string]interface{}, 0, len(room.Clients))
		for _, c := range room.Clients {
			clients = append(clients, map[string]interface{}{
				"id":    c.ID,
				"name":  c.Name,
				"color": c.Color,
			})
		}
		room.mutex.RUnlock()

		json.NewEncoder(w).Encode(map[string]interface{}{
			"id":       room.ID,
			"name":     room.Name,
			"clients":  clients,
			"document": room.Document,
		})

	case http.MethodDelete:
		hub.mutex.Lock()
		delete(hub.rooms, roomID)
		hub.mutex.Unlock()

		json.NewEncoder(w).Encode(map[string]string{
			"message": "Room deleted",
		})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}
	defer conn.Close()

	clientID := uuid.New().String()
	var currentRoom *Room

	for {
		var msg Message
		if err := conn.ReadJSON(&msg); err != nil {
			log.Printf("Read error: %v", err)
			// Handle disconnect
			if currentRoom != nil {
				handleClientLeave(currentRoom, clientID)
			}
			break
		}

		switch msg.Type {
		case MessageTypeJoin:
			currentRoom = handleJoin(conn, clientID, msg)

		case MessageTypeLeave:
			if currentRoom != nil {
				handleClientLeave(currentRoom, clientID)
				currentRoom = nil
			}

		case MessageTypeCursor:
			if currentRoom != nil {
				broadcastToRoom(currentRoom, clientID, msg)
			}

		case MessageTypeFocus:
			if currentRoom != nil {
				broadcastToRoom(currentRoom, clientID, msg)
			}

		case MessageTypeTyping:
			if currentRoom != nil {
				broadcastToRoom(currentRoom, clientID, msg)
			}

		case MessageTypeEdit:
			if currentRoom != nil {
				handleEdit(currentRoom, clientID, msg)
			}

		case MessageTypeSync:
			if currentRoom != nil {
				sendDocumentState(conn, currentRoom)
			}
		}
	}
}

func handleJoin(conn *websocket.Conn, clientID string, msg Message) *Room {
	var payload struct {
		RoomID string `json:"roomId"`
		Name   string `json:"name"`
		Color  string `json:"color"`
	}
	json.Unmarshal(msg.Payload, &payload)

	hub.mutex.RLock()
	room, exists := hub.rooms[payload.RoomID]
	hub.mutex.RUnlock()

	if !exists {
		conn.WriteJSON(Message{
			Type:    MessageTypeError,
			Payload: json.RawMessage(`{"error":"Room not found"}`),
		})
		return nil
	}

	client := &Client{
		ID:       clientID,
		Name:     payload.Name,
		Color:    payload.Color,
		Conn:     conn,
		RoomID:   room.ID,
		LastSeen: time.Now().UTC(),
	}

	room.mutex.Lock()
	room.Clients[clientID] = client
	room.mutex.Unlock()

	hub.mutex.Lock()
	hub.clients[clientID] = client
	hub.mutex.Unlock()

	// Notify others
	presence := map[string]interface{}{
		"userId": clientID,
		"name":   payload.Name,
		"color":  payload.Color,
		"action": "joined",
	}
	presenceJSON, _ := json.Marshal(presence)

	broadcastToRoom(room, clientID, Message{
		Type:    MessageTypePresence,
		Payload: presenceJSON,
	})

	// Send current state to new client
	sendDocumentState(conn, room)

	log.Printf("Client %s joined room %s", clientID[:8], room.ID[:8])
	return room
}

func handleClientLeave(room *Room, clientID string) {
	room.mutex.Lock()
	client, exists := room.Clients[clientID]
	if exists {
		delete(room.Clients, clientID)
	}
	room.mutex.Unlock()

	hub.mutex.Lock()
	delete(hub.clients, clientID)
	hub.mutex.Unlock()

	if client != nil {
		presence := map[string]interface{}{
			"userId": clientID,
			"name":   client.Name,
			"action": "left",
		}
		presenceJSON, _ := json.Marshal(presence)

		broadcastToRoom(room, clientID, Message{
			Type:    MessageTypePresence,
			Payload: presenceJSON,
		})

		log.Printf("Client %s left room %s", clientID[:8], room.ID[:8])
	}
}

func handleEdit(room *Room, clientID string, msg Message) {
	var edit struct {
		Content string `json:"content"`
		Version int    `json:"version"`
	}
	json.Unmarshal(msg.Payload, &edit)

	room.mutex.Lock()
	// Simple last-writer-wins for demo
	// In production, use CRDT or OT
	room.Document.Content = edit.Content
	room.Document.Version++
	room.Document.Updated = time.Now().UTC()
	room.mutex.Unlock()

	broadcastToRoom(room, clientID, msg)
}

func sendDocumentState(conn *websocket.Conn, room *Room) {
	room.mutex.RLock()
	clients := make([]map[string]interface{}, 0, len(room.Clients))
	for _, c := range room.Clients {
		clients = append(clients, map[string]interface{}{
			"id":    c.ID,
			"name":  c.Name,
			"color": c.Color,
		})
	}
	doc := room.Document
	room.mutex.RUnlock()

	state := map[string]interface{}{
		"document": doc,
		"clients":  clients,
	}
	stateJSON, _ := json.Marshal(state)

	conn.WriteJSON(Message{
		Type:    MessageTypeSync,
		Payload: stateJSON,
	})
}

func broadcastToRoom(room *Room, senderID string, msg Message) {
	msg.From = senderID
	msg.Room = room.ID

	room.mutex.RLock()
	defer room.mutex.RUnlock()

	for id, client := range room.Clients {
		if id != senderID {
			client.Conn.WriteJSON(msg)
		}
	}
}
