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
