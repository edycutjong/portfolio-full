# DocuMind AI

Intelligent Document Q&A API using RAG (Retrieval-Augmented Generation).

## Features

- 📄 **Document Upload** - Support for PDF, DOCX, TXT, MD files
- 💬 **Natural Language Q&A** - Ask questions, get cited answers
- 🔍 **Semantic Search** - Vector similarity search across documents
- 📚 **Collections** - Organize documents into searchable groups
- ⚡ **Fast** - Python FastAPI with async processing

## Tech Stack

- **Framework**: FastAPI
- **AI/ML**: LangChain, OpenAI Embeddings
- **Vector DB**: ChromaDB (local) / Pinecone (production)
- **Document Processing**: PyPDF, python-docx
- **Testing**: pytest, pytest-asyncio

## Getting Started

```bash
# Install dependencies with uv (recommended)
uv sync

# Or with pip
pip install -e ".[dev]"

# Set environment variables
export OPENAI_API_KEY=your-key-here

# Run development server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

## API Endpoints

### Health
```
GET /                           # Health check
```

### Documents
```
POST   /api/documents/upload    # Upload a document
GET    /api/documents           # List all documents
GET    /api/documents/{id}      # Get document info
DELETE /api/documents/{id}      # Delete a document
```

### Q&A
```
POST   /api/ask                 # Ask a question
```

Request body:
```json
{
  "question": "What are the key findings?",
  "document_id": "optional-doc-id",
  "collection_id": "optional-collection-id"
}
```

### Collections
```
POST   /api/collections                             # Create collection
GET    /api/collections                             # List collections
POST   /api/collections/{id}/documents/{doc_id}     # Add doc to collection
```

## RAG Pipeline

```
┌─────────────┐     ┌───────────────┐     ┌────────────┐
│   Upload    │ ──▶ │  Text Extract │ ──▶ │  Chunking  │
│  Document   │     │  (PDF/DOCX)   │     │ (1000 char)│
└─────────────┘     └───────────────┘     └────────────┘
                                                 │
                                                 ▼
┌─────────────┐     ┌───────────────┐     ┌────────────┐
│   Answer    │ ◀── │   LLM Call    │ ◀── │  Embedding │
│  + Sources  │     │   (GPT-4o)    │     │  + Store   │
└─────────────┘     └───────────────┘     └────────────┘
```

## Project Structure

```
apps/documind-api/
├── app/
│   ├── main.py              # FastAPI application
│   └── services/
│       ├── document.py      # Document processing
│       └── rag.py           # RAG pipeline
├── tests/
│   └── test_api.py          # API tests
├── pyproject.toml           # Dependencies
└── README.md
```

## Environment Variables

```env
OPENAI_API_KEY=sk-...        # Required for production
CHROMA_HOST=localhost        # Optional: ChromaDB host
CHROMA_PORT=8000             # Optional: ChromaDB port
```

## License

MIT
