"""
Tests for DocuMind API endpoints.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.mark.anyio
async def test_health_check(client: AsyncClient):
    """Test health endpoint returns correctly."""
    response = await client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "0.1.0"


@pytest.mark.anyio
async def test_list_documents_empty(client: AsyncClient):
    """Test listing documents when none exist."""
    response = await client.get("/api/documents")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
async def test_list_collections_empty(client: AsyncClient):
    """Test listing collections when none exist."""
    response = await client.get("/api/collections")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
async def test_ask_question(client: AsyncClient):
    """Test asking a question."""
    response = await client.post(
        "/api/ask",
        json={"question": "What is the main topic?"}
    )
    assert response.status_code == 200
    
    data = response.json()
    assert "answer" in data
    assert "sources" in data
    assert "confidence" in data
    assert data["confidence"] > 0


@pytest.mark.anyio
async def test_ask_question_with_document(client: AsyncClient):
    """Test asking a question about a specific document."""
    response = await client.post(
        "/api/ask",
        json={
            "question": "How does this process work?",
            "document_id": "test-doc-123"
        }
    )
    assert response.status_code == 200
    
    data = response.json()
    assert "answer" in data
    assert len(data["sources"]) > 0


@pytest.mark.anyio
async def test_ask_question_validation(client: AsyncClient):
    """Test question validation."""
    response = await client.post(
        "/api/ask",
        json={"question": "ab"}  # Too short
    )
    assert response.status_code == 422  # Validation error


@pytest.mark.anyio
async def test_create_collection(client: AsyncClient):
    """Test creating a collection."""
    response = await client.post(
        "/api/collections",
        json={
            "name": "Test Collection",
            "description": "A test collection"
        }
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "Test Collection"
    assert data["document_count"] == 0
    assert "id" in data


@pytest.mark.anyio
async def test_get_document_not_found(client: AsyncClient):
    """Test getting a non-existent document."""
    response = await client.get("/api/documents/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_delete_document_not_found(client: AsyncClient):
    """Test deleting a non-existent document."""
    response = await client.delete("/api/documents/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_upload_invalid_file_type(client: AsyncClient):
    """Test uploading an unsupported file type."""
    response = await client.post(
        "/api/documents/upload",
        files={"file": ("test.xyz", b"content", "application/octet-stream")}
    )
    assert response.status_code == 400


@pytest.mark.anyio
async def test_upload_txt_file(client: AsyncClient):
    """Test uploading a text file."""
    content = b"This is a test document with some content for testing."
    response = await client.post(
        "/api/documents/upload",
        files={"file": ("test.txt", content, "text/plain")}
    )
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "processed"
    assert "id" in data
    assert data["filename"] == "test.txt"
