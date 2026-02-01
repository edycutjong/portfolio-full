"""
DocuMind AI - Vercel Serverless Handler
Exposes the full FastAPI application for Vercel deployment
"""

from app.main import app

# Export app for Vercel
handler = app
