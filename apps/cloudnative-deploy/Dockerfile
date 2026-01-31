FROM python:3.11-slim

WORKDIR /app

# Install uv for fast package management
RUN pip install uv

# Copy dependencies
COPY pyproject.toml .

# Install dependencies
RUN uv sync --no-dev

# Copy application
COPY app/ app/

# Expose port
EXPOSE 8002

# Run uvicorn
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
