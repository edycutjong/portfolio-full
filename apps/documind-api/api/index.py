"""
DocuMind AI - Vercel Serverless Handler
Minimal deployment for portfolio showcase
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os

app = FastAPI(
    title="DocuMind AI",
    description="Intelligent Document Q&A API with RAG pipeline",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://documind.vercel.app",
        "https://edycu.dev",
        "https://www.edycu.dev",
        "https://documind.edycu.dev",
        "*",  # Allow all for demo
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    message: str


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        timestamp=datetime.utcnow().isoformat(),
        message="DocuMind AI API is running. Full RAG features coming soon!"
    )


@app.get("/api/health", response_model=HealthResponse)
async def api_health():
    """API health check"""
    return await health_check()
