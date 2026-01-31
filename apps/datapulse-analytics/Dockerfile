# Build stage
FROM rust:1.84-bookworm as builder

WORKDIR /app

# Copy manifests first for dependency caching
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

# Verify binary exists and show info
RUN ls -la target/release/datapulse && file target/release/datapulse

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary
COPY --from=builder /app/target/release/datapulse /app/datapulse

# Verify binary is copied and executable
RUN chmod +x /app/datapulse && ls -la /app/datapulse

# Set environment variables
ENV PORT=8080
ENV RUST_LOG=info
ENV RUST_BACKTRACE=1

EXPOSE 8080

# Run binary directly
ENTRYPOINT ["/app/datapulse"]
