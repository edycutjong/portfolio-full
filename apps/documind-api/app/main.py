"""
DocuMind AI - Intelligent Document Q&A API

A FastAPI-based RAG (Retrieval-Augmented Generation) system for 
answering questions about uploaded documents.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime

from app.services.document import DocumentService
from app.services.rag import RAGService

app = FastAPI(
    title="DocuMind AI",
    description="Upload documents, ask questions, get instant cited answers",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://documind.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services (would use dependency injection in production)
document_service = DocumentService()
rag_service = RAGService()


# Pydantic models
class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str


class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    pages: int
    status: str
    message: str


class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)
    document_id: Optional[str] = None
    collection_id: Optional[str] = None


class AnswerResponse(BaseModel):
    answer: str
    sources: list[dict]
    confidence: float
    document_id: Optional[str]


class DocumentInfo(BaseModel):
    id: str
    filename: str
    pages: int
    uploaded_at: str
    status: str


# Routes
@app.get("/", response_model=HealthResponse)
async def health_check():
    """API health check endpoint."""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        timestamp=datetime.utcnow().isoformat(),
    )


@app.post("/api/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document for processing.
    
    Supports: PDF, DOCX, TXT files
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    allowed_extensions = {".pdf", ".docx", ".txt", ".md"}
    extension = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        result = await document_service.process_document(file)
        return DocumentUploadResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/documents", response_model=list[DocumentInfo])
async def list_documents():
    """List all uploaded documents."""
    return document_service.list_documents()


@app.get("/api/documents/{document_id}", response_model=DocumentInfo)
async def get_document(document_id: str):
    """Get information about a specific document."""
    doc = document_service.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document and its embeddings."""
    success = document_service.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@app.post("/api/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Ask a question about uploaded documents.
    
    Uses RAG (Retrieval-Augmented Generation) to find relevant 
    context and generate accurate, cited answers.
    """
    try:
        result = await rag_service.answer_question(
            question=request.question,
            document_id=request.document_id,
            collection_id=request.collection_id,
        )
        return AnswerResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Collections endpoints
class CollectionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class Collection(BaseModel):
    id: str
    name: str
    description: Optional[str]
    document_count: int
    created_at: str


@app.post("/api/collections", response_model=Collection)
async def create_collection(data: CollectionCreate):
    """Create a new document collection."""
    collection = document_service.create_collection(data.name, data.description)
    return Collection(**collection)


@app.get("/api/collections", response_model=list[Collection])
async def list_collections():
    """List all document collections."""
    return document_service.list_collections()


@app.post("/api/collections/{collection_id}/documents/{document_id}")
async def add_document_to_collection(collection_id: str, document_id: str):
    """Add a document to a collection."""
    success = document_service.add_to_collection(collection_id, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Collection or document not found")
    return {"message": "Document added to collection"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
