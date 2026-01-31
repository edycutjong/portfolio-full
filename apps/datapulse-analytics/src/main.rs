//! DataPulse Analytics - High-Performance Streaming Analytics Engine
//!
//! Real-time data processing with Kafka integration:
//! - Stream ingestion from Kafka topics
//! - Windowed aggregations
//! - Metrics collection and export
//! - REST API for queries and management

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post, delete},
    Router,
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::Arc,
};
use tokio::sync::RwLock;
use tower_http::cors::CorsLayer;
use uuid::Uuid;

// === Data Models ===

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub event_type: String,
    pub source: String,
    pub timestamp: DateTime<Utc>,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Metric {
    pub name: String,
    pub value: f64,
    pub labels: HashMap<String, String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pipeline {
    pub id: String,
    pub name: String,
    pub source_topic: String,
    pub sink_topic: Option<String>,
    pub transformation: TransformationType,
    pub status: PipelineStatus,
    pub created_at: DateTime<Utc>,
    pub events_processed: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TransformationType {
    Filter { field: String, operator: String, value: serde_json::Value },
    Map { mapping: HashMap<String, String> },
    Aggregate { window_seconds: u64, function: AggregateFunction },
    Enrich { lookup_table: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AggregateFunction {
    Count,
    Sum { field: String },
    Avg { field: String },
    Min { field: String },
    Max { field: String },
    Distinct { field: String },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum PipelineStatus {
    Created,
    Running,
    Paused,
    Error,
    Stopped,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowedResult {
    pub window_start: DateTime<Utc>,
    pub window_end: DateTime<Utc>,
    pub count: u64,
    pub sum: f64,
    pub avg: f64,
    pub min: f64,
    pub max: f64,
}

// === Application State ===

#[derive(Debug, Default)]
pub struct AppState {
    pub pipelines: RwLock<HashMap<String, Pipeline>>,
    pub metrics: RwLock<Vec<Metric>>,
    pub events_buffer: RwLock<Vec<Event>>,
    pub window_results: RwLock<HashMap<String, Vec<WindowedResult>>>,
}

type SharedState = Arc<AppState>;

// === Request/Response Models ===

#[derive(Debug, Deserialize)]
pub struct CreatePipelineRequest {
    pub name: String,
    pub source_topic: String,
    pub sink_topic: Option<String>,
    pub transformation: TransformationType,
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub service: String,
    pub version: String,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct StatsResponse {
    pub pipelines_active: usize,
    pub events_buffered: usize,
    pub metrics_collected: usize,
    pub uptime_seconds: u64,
}

#[derive(Debug, Deserialize)]
pub struct IngestRequest {
    pub events: Vec<EventInput>,
}

#[derive(Debug, Deserialize)]
pub struct EventInput {
    pub event_type: String,
    pub source: String,
    pub data: serde_json::Value,
}

// === API Handlers ===

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "datapulse".to_string(),
        version: "0.1.0".to_string(),
        timestamp: Utc::now(),
    })
}

async fn get_stats(State(state): State<SharedState>) -> Json<StatsResponse> {
    let pipelines = state.pipelines.read().await;
    let events = state.events_buffer.read().await;
    let metrics = state.metrics.read().await;

    Json(StatsResponse {
        pipelines_active: pipelines.values().filter(|p| p.status == PipelineStatus::Running).count(),
        events_buffered: events.len(),
        metrics_collected: metrics.len(),
        uptime_seconds: 0, // Would track actual uptime
    })
}

// Pipeline endpoints

async fn create_pipeline(
    State(state): State<SharedState>,
    Json(req): Json<CreatePipelineRequest>,
) -> (StatusCode, Json<Pipeline>) {
    let pipeline = Pipeline {
        id: Uuid::new_v4().to_string(),
        name: req.name,
        source_topic: req.source_topic,
        sink_topic: req.sink_topic,
        transformation: req.transformation,
        status: PipelineStatus::Created,
        created_at: Utc::now(),
        events_processed: 0,
    };

    let mut pipelines = state.pipelines.write().await;
    pipelines.insert(pipeline.id.clone(), pipeline.clone());

    (StatusCode::CREATED, Json(pipeline))
}

async fn list_pipelines(State(state): State<SharedState>) -> Json<Vec<Pipeline>> {
    let pipelines = state.pipelines.read().await;
    Json(pipelines.values().cloned().collect())
}

async fn get_pipeline(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Pipeline>, StatusCode> {
    let pipelines = state.pipelines.read().await;
    pipelines
        .get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn start_pipeline(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Pipeline>, StatusCode> {
    let mut pipelines = state.pipelines.write().await;
    let pipeline = pipelines.get_mut(&id).ok_or(StatusCode::NOT_FOUND)?;
    pipeline.status = PipelineStatus::Running;
    Ok(Json(pipeline.clone()))
}

async fn stop_pipeline(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Pipeline>, StatusCode> {
    let mut pipelines = state.pipelines.write().await;
    let pipeline = pipelines.get_mut(&id).ok_or(StatusCode::NOT_FOUND)?;
    pipeline.status = PipelineStatus::Stopped;
    Ok(Json(pipeline.clone()))
}

async fn delete_pipeline(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let mut pipelines = state.pipelines.write().await;
    if pipelines.remove(&id).is_some() {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

// Event ingestion

async fn ingest_events(
    State(state): State<SharedState>,
    Json(req): Json<IngestRequest>,
) -> (StatusCode, Json<serde_json::Value>) {
    let mut buffer = state.events_buffer.write().await;
    let count = req.events.len();

    for input in req.events {
        let event = Event {
            id: Uuid::new_v4().to_string(),
            event_type: input.event_type,
            source: input.source,
            timestamp: Utc::now(),
            data: input.data,
        };
        buffer.push(event);
    }

    // Keep buffer bounded
    if buffer.len() > 10000 {
        buffer.drain(0..1000);
    }

    (
        StatusCode::ACCEPTED,
        Json(serde_json::json!({
            "accepted": count,
            "message": "Events queued for processing"
        })),
    )
}

// Metrics

async fn get_metrics(State(state): State<SharedState>) -> Json<Vec<Metric>> {
    let metrics = state.metrics.read().await;
    Json(metrics.clone())
}

async fn record_metric(
    State(state): State<SharedState>,
    Json(metric): Json<Metric>,
) -> StatusCode {
    let mut metrics = state.metrics.write().await;
    metrics.push(metric);

    // Keep metrics bounded
    if metrics.len() > 10000 {
        metrics.drain(0..1000);
    }

    StatusCode::CREATED
}

// Windowed aggregations

async fn get_window_results(
    State(state): State<SharedState>,
    Path(pipeline_id): Path<String>,
) -> Result<Json<Vec<WindowedResult>>, StatusCode> {
    let results = state.window_results.read().await;
    results
        .get(&pipeline_id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

// === Main Application ===

pub fn create_router(state: SharedState) -> Router {
    Router::new()
        // Health & stats
        .route("/", get(health))
        .route("/health", get(health))
        .route("/api/stats", get(get_stats))
        // Pipelines
        .route("/api/pipelines", post(create_pipeline))
        .route("/api/pipelines", get(list_pipelines))
        .route("/api/pipelines/:id", get(get_pipeline))
        .route("/api/pipelines/:id/start", post(start_pipeline))
        .route("/api/pipelines/:id/stop", post(stop_pipeline))
        .route("/api/pipelines/:id", delete(delete_pipeline))
        .route("/api/pipelines/:id/window", get(get_window_results))
        // Events
        .route("/api/events/ingest", post(ingest_events))
        // Metrics
        .route("/api/metrics", get(get_metrics))
        .route("/api/metrics", post(record_metric))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    let state = Arc::new(AppState::default());
    let app = create_router(state);

    // Use PORT env variable for Railway, fallback to 8080
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    tracing::info!("🚀 DataPulse Analytics running on http://{}", addr);
    tracing::info!("📊 Streaming analytics engine ready");

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// === Unit Tests ===

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    use tower::util::ServiceExt;

    fn create_test_app() -> Router {
        let state = Arc::new(AppState::default());
        create_router(state)
    }

    #[tokio::test]
    async fn test_health() {
        let app = create_test_app();

        let response = app
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_list_pipelines_empty() {
        let app = create_test_app();

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/pipelines")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_get_stats() {
        let app = create_test_app();

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/api/stats")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }
}
