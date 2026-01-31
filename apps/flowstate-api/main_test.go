package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthEndpoint(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()

	handleHealth(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	json.NewDecoder(w.Body).Decode(&resp)

	if resp["status"] != "healthy" {
		t.Errorf("expected status healthy, got %v", resp["status"])
	}

	if resp["service"] != "flowstate" {
		t.Errorf("expected service flowstate, got %v", resp["service"])
	}
}

func TestListRoomsEmpty(t *testing.T) {
	// Reset hub for test
	hub = NewHub()

	req := httptest.NewRequest(http.MethodGet, "/api/rooms", nil)
	w := httptest.NewRecorder()

	handleRooms(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var rooms []interface{}
	json.NewDecoder(w.Body).Decode(&rooms)

	if len(rooms) != 0 {
		t.Errorf("expected empty rooms list, got %d", len(rooms))
	}
}

func TestCreateRoom(t *testing.T) {
	hub = NewHub()

	body := strings.NewReader(`{"name":"Test Room"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/rooms", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handleRooms(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("expected status 201, got %d", w.Code)
	}

	var room map[string]interface{}
	json.NewDecoder(w.Body).Decode(&room)

	if room["name"] != "Test Room" {
		t.Errorf("expected name 'Test Room', got %v", room["name"])
	}

	if room["id"] == nil || room["id"] == "" {
		t.Error("expected room to have an ID")
	}
}

func TestListRoomsAfterCreate(t *testing.T) {
	hub = NewHub()

	// Create a room first
	body := strings.NewReader(`{"name":"Test Room"}`)
	createReq := httptest.NewRequest(http.MethodPost, "/api/rooms", body)
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handleRooms(createW, createReq)

	// List rooms
	listReq := httptest.NewRequest(http.MethodGet, "/api/rooms", nil)
	listW := httptest.NewRecorder()
	handleRooms(listW, listReq)

	var rooms []map[string]interface{}
	json.NewDecoder(listW.Body).Decode(&rooms)

	if len(rooms) != 1 {
		t.Errorf("expected 1 room, got %d", len(rooms))
	}

	if rooms[0]["name"] != "Test Room" {
		t.Errorf("expected name 'Test Room', got %v", rooms[0]["name"])
	}
}

func TestGetRoomNotFound(t *testing.T) {
	hub = NewHub()

	req := httptest.NewRequest(http.MethodGet, "/api/rooms/nonexistent", nil)
	w := httptest.NewRecorder()

	handleRoomByID(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("expected status 404, got %d", w.Code)
	}
}

func TestDeleteRoom(t *testing.T) {
	hub = NewHub()

	// Create a room
	createBody := strings.NewReader(`{"name":"To Delete"}`)
	createReq := httptest.NewRequest(http.MethodPost, "/api/rooms", createBody)
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handleRooms(createW, createReq)

	var created map[string]interface{}
	json.NewDecoder(createW.Body).Decode(&created)
	roomID := created["id"].(string)

	// Delete the room
	deleteReq := httptest.NewRequest(http.MethodDelete, "/api/rooms/"+roomID, nil)
	deleteW := httptest.NewRecorder()
	handleRoomByID(deleteW, deleteReq)

	if deleteW.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", deleteW.Code)
	}

	// Verify deleted
	getReq := httptest.NewRequest(http.MethodGet, "/api/rooms/"+roomID, nil)
	getW := httptest.NewRecorder()
	handleRoomByID(getW, getReq)

	if getW.Code != http.StatusNotFound {
		t.Errorf("expected status 404 after delete, got %d", getW.Code)
	}
}

func TestNewHub(t *testing.T) {
	h := NewHub()

	if h == nil {
		t.Error("expected hub to not be nil")
	}

	if h.rooms == nil {
		t.Error("expected rooms map to be initialized")
	}

	if h.clients == nil {
		t.Error("expected clients map to be initialized")
	}
}

func TestCreateRoomInvalidJSON(t *testing.T) {
	hub = NewHub()

	body := strings.NewReader(`{invalid json}`)
	req := httptest.NewRequest(http.MethodPost, "/api/rooms", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handleRooms(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", w.Code)
	}
}

func TestHandleRoomsMethodNotAllowed(t *testing.T) {
	hub = NewHub()

	req := httptest.NewRequest(http.MethodPut, "/api/rooms", nil)
	w := httptest.NewRecorder()

	handleRooms(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("expected status 405, got %d", w.Code)
	}
}

func TestGetRoom(t *testing.T) {
	hub = NewHub()

	// Create a room first
	body := strings.NewReader(`{"name":"Get Test Room"}`)
	createReq := httptest.NewRequest(http.MethodPost, "/api/rooms", body)
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handleRooms(createW, createReq)

	var created map[string]interface{}
	json.NewDecoder(createW.Body).Decode(&created)
	roomID := created["id"].(string)

	// Get the room
	getReq := httptest.NewRequest(http.MethodGet, "/api/rooms/"+roomID, nil)
	getW := httptest.NewRecorder()
	handleRoomByID(getW, getReq)

	if getW.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", getW.Code)
	}

	var room map[string]interface{}
	json.NewDecoder(getW.Body).Decode(&room)

	if room["name"] != "Get Test Room" {
		t.Errorf("expected name 'Get Test Room', got %v", room["name"])
	}
}

func TestHandleRoomByIDEmptyID(t *testing.T) {
	hub = NewHub()

	req := httptest.NewRequest(http.MethodGet, "/api/rooms/", nil)
	w := httptest.NewRecorder()

	handleRoomByID(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", w.Code)
	}
}

func TestHandleRoomByIDMethodNotAllowed(t *testing.T) {
	hub = NewHub()

	// Create a room first
	body := strings.NewReader(`{"name":"Method Test"}`)
	createReq := httptest.NewRequest(http.MethodPost, "/api/rooms", body)
	createReq.Header.Set("Content-Type", "application/json")
	createW := httptest.NewRecorder()
	handleRooms(createW, createReq)

	var created map[string]interface{}
	json.NewDecoder(createW.Body).Decode(&created)
	roomID := created["id"].(string)

	// Try PUT method
	putReq := httptest.NewRequest(http.MethodPut, "/api/rooms/"+roomID, nil)
	putW := httptest.NewRecorder()
	handleRoomByID(putW, putReq)

	if putW.Code != http.StatusMethodNotAllowed {
		t.Errorf("expected status 405, got %d", putW.Code)
	}
}

func TestBroadcastToRoom(t *testing.T) {
	hub = NewHub()

	room := &Room{
		ID:      "test-room",
		Name:    "Test Room",
		Clients: make(map[string]*Client),
		Document: &Document{
			ID:      "doc-1",
			Content: "",
			Version: 0,
		},
	}

	msg := Message{
		Type:    MessageTypeCursor,
		Payload: json.RawMessage(`{"x":100,"y":200}`),
	}

	// Should not panic with empty room
	broadcastToRoom(room, "sender-id", msg)
}

func TestHandleClientLeave(t *testing.T) {
	hub = NewHub()

	room := &Room{
		ID:      "test-room",
		Name:    "Test Room",
		Clients: make(map[string]*Client),
		Document: &Document{
			ID:      "doc-1",
			Content: "",
			Version: 0,
		},
	}

	client := &Client{
		ID:     "client-1",
		Name:   "Test User",
		Color:  "#ff0000",
		RoomID: room.ID,
	}

	room.Clients[client.ID] = client
	hub.clients[client.ID] = client

	// Should not panic
	handleClientLeave(room, client.ID)

	if _, exists := room.Clients[client.ID]; exists {
		t.Error("expected client to be removed from room")
	}

	if _, exists := hub.clients[client.ID]; exists {
		t.Error("expected client to be removed from hub")
	}
}

func TestHandleClientLeaveNonexistent(t *testing.T) {
	hub = NewHub()

	room := &Room{
		ID:      "test-room",
		Name:    "Test Room",
		Clients: make(map[string]*Client),
	}

	// Should not panic when client doesn't exist
	handleClientLeave(room, "nonexistent-client")
}

func TestHandleEdit(t *testing.T) {
	hub = NewHub()

	room := &Room{
		ID:      "test-room",
		Name:    "Test Room",
		Clients: make(map[string]*Client),
		Document: &Document{
			ID:      "doc-1",
			Content: "",
			Version: 0,
		},
	}

	msg := Message{
		Type:    MessageTypeEdit,
		Payload: json.RawMessage(`{"content":"Hello World","version":1}`),
	}

	handleEdit(room, "client-1", msg)

	if room.Document.Content != "Hello World" {
		t.Errorf("expected content 'Hello World', got '%s'", room.Document.Content)
	}

	if room.Document.Version != 1 {
		t.Errorf("expected version 1, got %d", room.Document.Version)
	}
}

func TestDocumentModel(t *testing.T) {
	doc := &Document{
		ID:      "test-doc",
		Content: "Test content",
		Version: 5,
	}

	if doc.ID != "test-doc" {
		t.Errorf("expected ID 'test-doc', got '%s'", doc.ID)
	}

	if doc.Content != "Test content" {
		t.Errorf("expected content 'Test content', got '%s'", doc.Content)
	}

	if doc.Version != 5 {
		t.Errorf("expected version 5, got %d", doc.Version)
	}
}

func TestMessageModel(t *testing.T) {
	msg := Message{
		Type:    MessageTypeJoin,
		Payload: json.RawMessage(`{"roomId":"room-1"}`),
		From:    "user-1",
		Room:    "room-1",
	}

	if msg.Type != MessageTypeJoin {
		t.Errorf("expected type 'join', got '%s'", msg.Type)
	}
}

func TestClientModel(t *testing.T) {
	client := &Client{
		ID:     "client-1",
		Name:   "Test User",
		Color:  "#ff0000",
		RoomID: "room-1",
	}

	if client.ID != "client-1" {
		t.Errorf("expected ID 'client-1', got '%s'", client.ID)
	}

	if client.Color != "#ff0000" {
		t.Errorf("expected color '#ff0000', got '%s'", client.Color)
	}
}

func TestRoomModel(t *testing.T) {
	room := &Room{
		ID:      "room-1",
		Name:    "Test Room",
		Clients: make(map[string]*Client),
		Document: &Document{
			ID:      "doc-1",
			Content: "",
			Version: 0,
		},
	}

	if room.ID != "room-1" {
		t.Errorf("expected ID 'room-1', got '%s'", room.ID)
	}

	if room.Document == nil {
		t.Error("expected document to not be nil")
	}
}

func TestMessageTypes(t *testing.T) {
	if MessageTypeJoin != "join" {
		t.Error("MessageTypeJoin should be 'join'")
	}
	if MessageTypeLeave != "leave" {
		t.Error("MessageTypeLeave should be 'leave'")
	}
	if MessageTypeCursor != "cursor" {
		t.Error("MessageTypeCursor should be 'cursor'")
	}
	if MessageTypeFocus != "focus" {
		t.Error("MessageTypeFocus should be 'focus'")
	}
	if MessageTypeEdit != "edit" {
		t.Error("MessageTypeEdit should be 'edit'")
	}
	if MessageTypePresence != "presence" {
		t.Error("MessageTypePresence should be 'presence'")
	}
	if MessageTypeTyping != "typing" {
		t.Error("MessageTypeTyping should be 'typing'")
	}
	if MessageTypeSync != "sync" {
		t.Error("MessageTypeSync should be 'sync'")
	}
	if MessageTypeError != "error" {
		t.Error("MessageTypeError should be 'error'")
	}
}
