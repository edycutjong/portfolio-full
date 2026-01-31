"""
Document processing service.

Handles file uploads, text extraction, and chunking for the RAG pipeline.
"""

import uuid
from datetime import datetime
from typing import Optional
from fastapi import UploadFile


class DocumentService:
    """Service for document management and processing."""
    
    def __init__(self):
        # In production, use a database
        self._documents: dict[str, dict] = {}
        self._collections: dict[str, dict] = {}
    
    async def process_document(self, file: UploadFile) -> dict:
        """
        Process an uploaded document.
        
        1. Save the file
        2. Extract text based on file type
        3. Chunk the text
        4. Generate embeddings (placeholder)
        5. Store in vector database (placeholder)
        
        Args:
            file: Uploaded file
            
        Returns:
            Document metadata
        """
        doc_id = str(uuid.uuid4())
        content = await file.read()
        
        # Extract text based on file type
        filename = file.filename or "unknown"
        extension = filename.split(".")[-1].lower() if "." in filename else ""
        
        text = ""
        pages = 1
        
        if extension == "pdf":
            text, pages = self._extract_pdf(content)
        elif extension == "docx":
            text = self._extract_docx(content)
        elif extension in ("txt", "md"):
            text = content.decode("utf-8")
        
        # Chunk the text for embeddings
        chunks = self._chunk_text(text)
        
        # Store document metadata
        self._documents[doc_id] = {
            "id": doc_id,
            "filename": filename,
            "pages": pages,
            "uploaded_at": datetime.utcnow().isoformat(),
            "status": "processed",
            "chunk_count": len(chunks),
            "text_length": len(text),
        }
        
        return {
            "id": doc_id,
            "filename": filename,
            "pages": pages,
            "status": "processed",
            "message": f"Document processed successfully. {len(chunks)} chunks created.",
        }
    
    def _extract_pdf(self, content: bytes) -> tuple[str, int]:
        """Extract text from PDF file."""
        try:
            from pypdf import PdfReader
            import io
            
            reader = PdfReader(io.BytesIO(content))
            pages = len(reader.pages)
            text = ""
            
            for page in reader.pages:
                text += page.extract_text() or ""
                text += "\n\n"
            
            return text, pages
        except Exception:
            return "", 0
    
    def _extract_docx(self, content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            from docx import Document
            import io
            
            doc = Document(io.BytesIO(content))
            text = "\n\n".join(para.text for para in doc.paragraphs if para.text)
            return text
        except Exception:
            return ""
    
    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
        """
        Split text into overlapping chunks for embedding.
        
        Args:
            text: Full document text
            chunk_size: Maximum characters per chunk
            overlap: Overlap between chunks for context
            
        Returns:
            List of text chunks
        """
        if not text:
            return []
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                period_idx = text.rfind(".", start, end)
                if period_idx > start + chunk_size // 2:
                    end = period_idx + 1
            
            chunks.append(text[start:end].strip())
            start = end - overlap if end < len(text) else len(text)
        
        return [c for c in chunks if c]
    
    def list_documents(self) -> list[dict]:
        """Get all documents."""
        return list(self._documents.values())
    
    def get_document(self, doc_id: str) -> Optional[dict]:
        """Get a specific document."""
        return self._documents.get(doc_id)
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document."""
        if doc_id in self._documents:
            del self._documents[doc_id]
            return True
        return False
    
    def create_collection(self, name: str, description: Optional[str] = None) -> dict:
        """Create a document collection."""
        collection_id = str(uuid.uuid4())
        collection = {
            "id": collection_id,
            "name": name,
            "description": description,
            "document_count": 0,
            "created_at": datetime.utcnow().isoformat(),
            "document_ids": [],
        }
        self._collections[collection_id] = collection
        return collection
    
    def list_collections(self) -> list[dict]:
        """Get all collections."""
        return [
            {k: v for k, v in c.items() if k != "document_ids"}
            for c in self._collections.values()
        ]
    
    def add_to_collection(self, collection_id: str, document_id: str) -> bool:
        """Add a document to a collection."""
        if collection_id not in self._collections or document_id not in self._documents:
            return False
        
        collection = self._collections[collection_id]
        if document_id not in collection["document_ids"]:
            collection["document_ids"].append(document_id)
            collection["document_count"] += 1
        return True
