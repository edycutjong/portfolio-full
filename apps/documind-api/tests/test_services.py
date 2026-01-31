"""
Tests for DocuMind services - Document and RAG.
"""

import pytest
from io import BytesIO
from unittest.mock import MagicMock, AsyncMock
from app.services.document import DocumentService
from app.services.rag import RAGService


class TestDocumentService:
    """Tests for DocumentService."""

    def test_list_documents_empty(self):
        """Test getting documents when none exist."""
        service = DocumentService()
        docs = service.list_documents()
        assert docs == []

    def test_get_document_not_found(self):
        """Test getting a non-existent document."""
        service = DocumentService()
        doc = service.get_document("nonexistent")
        assert doc is None

    def test_delete_document_not_found(self):
        """Test deleting a non-existent document."""
        service = DocumentService()
        result = service.delete_document("nonexistent")
        assert result is False

    def test_list_collections_empty(self):
        """Test getting collections when none exist."""
        service = DocumentService()
        collections = service.list_collections()
        assert collections == []

    def test_create_collection(self):
        """Test creating a collection."""
        service = DocumentService()
        collection = service.create_collection(
            name="Test Collection",
            description="A test collection"
        )
        assert collection["name"] == "Test Collection"
        assert collection["description"] == "A test collection"
        assert "id" in collection
        assert collection["document_count"] == 0

    def test_create_collection_without_description(self):
        """Test creating a collection without description."""
        service = DocumentService()
        collection = service.create_collection(name="Test")
        assert collection["name"] == "Test"

    def test_chunk_text(self):
        """Test text chunking."""
        service = DocumentService()
        text = "This is a test. " * 100
        chunks = service._chunk_text(text, chunk_size=100, overlap=20)
        
        assert len(chunks) >= 1

    def test_chunk_short_text(self):
        """Test chunking text shorter than chunk size."""
        service = DocumentService()
        text = "Short text."
        chunks = service._chunk_text(text, chunk_size=100, overlap=20)
        
        assert len(chunks) == 1
        assert "Short text" in chunks[0]

    def test_chunk_empty_text(self):
        """Test chunking empty text."""
        service = DocumentService()
        chunks = service._chunk_text("", chunk_size=100, overlap=20)
        assert chunks == []

    @pytest.mark.anyio
    async def test_process_document_txt(self):
        """Test processing a text file."""
        service = DocumentService()
        
        # Create a mock UploadFile
        mock_file = MagicMock()
        mock_file.filename = "test.txt"
        content = b"This is a test document with content."
        mock_file.read = AsyncMock(return_value=content)
        
        result = await service.process_document(mock_file)
        
        assert result["status"] == "processed"
        assert result["filename"] == "test.txt"
        assert "id" in result

    @pytest.mark.anyio
    async def test_process_document_md(self):
        """Test processing a markdown file."""
        service = DocumentService()
        
        mock_file = MagicMock()
        mock_file.filename = "readme.md"
        content = b"# Hello World\n\nThis is markdown content."
        mock_file.read = AsyncMock(return_value=content)
        
        result = await service.process_document(mock_file)
        
        assert result["status"] == "processed"
        assert result["filename"] == "readme.md"

    def test_get_document_after_create(self):
        """Test that document can be retrieved after creation."""
        service = DocumentService()
        
        # Manually add a document
        doc_id = "test-123"
        service._documents[doc_id] = {
            "id": doc_id,
            "filename": "test.txt",
            "status": "processed"
        }
        
        doc = service.get_document(doc_id)
        assert doc is not None
        assert doc["id"] == doc_id
        assert doc["filename"] == "test.txt"

    def test_delete_document_success(self):
        """Test successfully deleting a document."""
        service = DocumentService()
        
        # Manually add a document
        doc_id = "test-456"
        service._documents[doc_id] = {
            "id": doc_id,
            "filename": "delete-me.txt"
        }
        
        result = service.delete_document(doc_id)
        assert result is True
        
        # Verify it's gone
        assert service.get_document(doc_id) is None


class TestRAGService:
    """Tests for RAGService."""

    @pytest.mark.anyio
    async def test_answer_general_question(self):
        """Test answering a general question."""
        service = RAGService()
        result = await service.answer_question("What is machine learning?")
        
        assert "answer" in result
        assert "sources" in result
        assert "confidence" in result
        assert result["confidence"] > 0

    @pytest.mark.anyio
    async def test_answer_with_document_id(self):
        """Test answering with specific document context."""
        service = RAGService()
        result = await service.answer_question(
            "What is in this document?",
            document_id="test-doc-123"
        )
        
        assert "answer" in result

    @pytest.mark.anyio
    async def test_answer_with_collection_id(self):
        """Test answering with collection context."""
        service = RAGService()
        result = await service.answer_question(
            "What topics are covered?",
            collection_id="test-collection-123"
        )
        
        assert "answer" in result

    @pytest.mark.anyio
    async def test_confidence_range(self):
        """Test that confidence is within valid range."""
        service = RAGService()
        result = await service.answer_question("What is Python?")
        
        assert 0 <= result["confidence"] <= 1.0

    @pytest.mark.anyio
    async def test_sources_is_list(self):
        """Test that sources is always a list."""
        service = RAGService()
        result = await service.answer_question("Explain testing")
        
        assert isinstance(result["sources"], list)
