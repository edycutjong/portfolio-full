# Build stage
FROM rust:1.84-bookworm as builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to cache dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy actual source code
COPY src ./src

# Touch to update timestamp and force rebuild
RUN touch src/main.rs

# Build for release
RUN cargo build --release

# Verify binary exists
RUN ls -la target/release/datapulse

# Runtime stage - use slim with glibc
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary
COPY --from=builder /app/target/release/datapulse /app/datapulse

# Make executable
RUN chmod +x /app/datapulse

# Set PORT env (Railway overrides this)
ENV PORT=8080
ENV RUST_LOG=info

EXPOSE 8080

# Run the binary
CMD ["/app/datapulse"]
