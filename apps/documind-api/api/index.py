"""
DocuMind AI - Vercel Serverless Handler
Exposes the full FastAPI application for Vercel deployment
"""

# Import the FastAPI app
from app.main import app

# Vercel uses 'app' as the entry point for ASGI applications
# The variable name 'app' is what Vercel looks for automatically
