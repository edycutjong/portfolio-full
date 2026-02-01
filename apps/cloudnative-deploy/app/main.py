"""
CloudNative Deploy - Kubernetes Deployment Orchestrator

A FastAPI application for managing Kubernetes deployments, 
services, and infrastructure as code.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid
import asyncio

app = FastAPI(
    title="CloudNative Deploy",
    description="""
## Kubernetes Deployment Orchestration API

Manage Kubernetes deployments, services, and infrastructure with ease.

### Features
- 🚀 **Deployments**: Create, update, and scale Kubernetes deployments
- 🔧 **Services**: Expose deployments with ClusterIP, NodePort, or LoadBalancer
- 📦 **Pods**: Monitor pod status and health
- 🌐 **Namespaces**: Organize workloads across namespaces
- 📊 **Cluster Info**: View cluster-wide metrics and status

### Getting Started
1. Create a deployment via `POST /api/deployments`
2. Create a service to expose it via `POST /api/services`
3. Monitor status via `GET /api/deployments/{id}/pods`
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Health", "description": "API health check"},
        {"name": "Deployments", "description": "Kubernetes deployment management"},
        {"name": "Services", "description": "Kubernetes service management"},
        {"name": "Namespaces", "description": "Namespace operations"},
        {"name": "Cluster", "description": "Cluster-wide information"},
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Data Models ===

class DeploymentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=63)
    image: str
    replicas: int = Field(default=1, ge=1, le=100)
    namespace: str = "default"
    env: dict[str, str] = Field(default_factory=dict)
    port: Optional[int] = None
    cpu_limit: str = "500m"
    memory_limit: str = "256Mi"


class Deployment(BaseModel):
    id: str
    name: str
    image: str
    replicas: int
    namespace: str
    status: Literal["pending", "running", "failed", "scaling", "updating"]
    ready_replicas: int = 0
    created_at: str
    updated_at: str


class DeploymentUpdate(BaseModel):
    image: Optional[str] = None
    replicas: Optional[int] = Field(default=None, ge=1, le=100)
    env: Optional[dict[str, str]] = None


class ServiceCreate(BaseModel):
    name: str
    deployment_id: str
    port: int
    target_port: int
    type: Literal["ClusterIP", "NodePort", "LoadBalancer"] = "ClusterIP"


class Service(BaseModel):
    id: str
    name: str
    deployment_id: str
    port: int
    target_port: int
    type: str
    external_ip: Optional[str] = None
    created_at: str


class PodStatus(BaseModel):
    name: str
    status: str
    ready: bool
    restarts: int
    age: str


# === In-Memory Storage (would use K8s API in production) ===

deployments: dict[str, dict] = {}
services: dict[str, dict] = {}


# === Kubernetes Manifest Generators ===

def generate_deployment_manifest(dep: DeploymentCreate) -> dict:
    """Generate Kubernetes Deployment manifest."""
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": dep.name,
            "namespace": dep.namespace,
            "labels": {"app": dep.name},
        },
        "spec": {
            "replicas": dep.replicas,
            "selector": {"matchLabels": {"app": dep.name}},
            "template": {
                "metadata": {"labels": {"app": dep.name}},
                "spec": {
                    "containers": [
                        {
                            "name": dep.name,
                            "image": dep.image,
                            "ports": [{"containerPort": dep.port}] if dep.port else [],
                            "env": [
                                {"name": k, "value": v}
                                for k, v in dep.env.items()
                            ],
                            "resources": {
                                "limits": {
                                    "cpu": dep.cpu_limit,
                                    "memory": dep.memory_limit,
                                },
                            },
                        }
                    ]
                },
            },
        },
    }


def generate_service_manifest(svc: ServiceCreate, deployment_name: str) -> dict:
    """Generate Kubernetes Service manifest."""
    return {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {"name": svc.name},
        "spec": {
            "type": svc.type,
            "selector": {"app": deployment_name},
            "ports": [
                {
                    "port": svc.port,
                    "targetPort": svc.target_port,
                }
            ],
        },
    }


# === Simulated K8s Operations ===

async def simulate_deployment_rollout(deployment_id: str):
    """Simulate deployment rollout progress."""
    if deployment_id not in deployments:
        return
    
    dep = deployments[deployment_id]
    total_replicas = dep["replicas"]
    
    for i in range(total_replicas + 1):
        await asyncio.sleep(0.5)  # Simulate pod startup
        if deployment_id in deployments:
            deployments[deployment_id]["ready_replicas"] = i
            if i == total_replicas:
                deployments[deployment_id]["status"] = "running"


# === API Endpoints ===

@app.get("/", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "service": "cloudnative-deploy",
        "version": "0.1.0",
        "timestamp": datetime.utcnow().isoformat(),
    }


# Deployments

@app.post("/api/deployments", response_model=Deployment, status_code=201, tags=["Deployments"])
async def create_deployment(
    dep: DeploymentCreate,
    background_tasks: BackgroundTasks
):
    """Create a new Kubernetes deployment."""
    dep_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    deployment = {
        "id": dep_id,
        "name": dep.name,
        "image": dep.image,
        "replicas": dep.replicas,
        "namespace": dep.namespace,
        "status": "pending",
        "ready_replicas": 0,
        "created_at": now,
        "updated_at": now,
        "manifest": generate_deployment_manifest(dep),
    }
    
    deployments[dep_id] = deployment
    background_tasks.add_task(simulate_deployment_rollout, dep_id)
    
    return deployment


@app.get("/api/deployments", response_model=list[Deployment], tags=["Deployments"])
async def list_deployments(namespace: Optional[str] = None):
    """List all deployments."""
    result = list(deployments.values())
    if namespace:
        result = [d for d in result if d["namespace"] == namespace]
    return result


@app.get("/api/deployments/{deployment_id}", response_model=Deployment, tags=["Deployments"])
async def get_deployment(deployment_id: str):
    """Get deployment details."""
    if deployment_id not in deployments:
        raise HTTPException(status_code=404, detail="Deployment not found")
    return deployments[deployment_id]


@app.patch("/api/deployments/{deployment_id}", response_model=Deployment, tags=["Deployments"])
async def update_deployment(
    deployment_id: str,
    update: DeploymentUpdate,
    background_tasks: BackgroundTasks
):
    """Update a deployment (rolling update)."""
    if deployment_id not in deployments:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    dep = deployments[deployment_id]
    dep["updated_at"] = datetime.utcnow().isoformat()
    
    if update.image:
        dep["image"] = update.image
        dep["status"] = "updating"
        background_tasks.add_task(simulate_deployment_rollout, deployment_id)
    
    if update.replicas:
        dep["replicas"] = update.replicas
        dep["status"] = "scaling"
        background_tasks.add_task(simulate_deployment_rollout, deployment_id)
    
    if update.env:
        dep["manifest"]["spec"]["template"]["spec"]["containers"][0]["env"] = [
            {"name": k, "value": v} for k, v in update.env.items()
        ]
    
    return dep


@app.delete("/api/deployments/{deployment_id}", tags=["Deployments"])
async def delete_deployment(deployment_id: str):
    """Delete a deployment."""
    if deployment_id not in deployments:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    del deployments[deployment_id]
    
    # Also delete associated services
    to_delete = [sid for sid, s in services.items() if s["deployment_id"] == deployment_id]
    for sid in to_delete:
        del services[sid]
    
    return {"message": "Deployment deleted"}


@app.get("/api/deployments/{deployment_id}/pods", response_model=list[PodStatus], tags=["Deployments"])
async def get_deployment_pods(deployment_id: str):
    """Get pods for a deployment."""
    if deployment_id not in deployments:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    dep = deployments[deployment_id]
    pods = []
    
    for i in range(dep["ready_replicas"]):
        pods.append(PodStatus(
            name=f"{dep['name']}-{uuid.uuid4().hex[:8]}",
            status="Running" if i < dep["ready_replicas"] else "Pending",
            ready=i < dep["ready_replicas"],
            restarts=0,
            age="2m",
        ))
    
    return pods


@app.get("/api/deployments/{deployment_id}/manifest", tags=["Deployments"])
async def get_deployment_manifest(deployment_id: str):
    """Get the Kubernetes manifest for a deployment."""
    if deployment_id not in deployments:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    return deployments[deployment_id]["manifest"]


# Services

@app.post("/api/services", response_model=Service, status_code=201, tags=["Services"])
async def create_service(svc: ServiceCreate):
    """Create a Kubernetes service."""
    if svc.deployment_id not in deployments:
        raise HTTPException(status_code=400, detail="Deployment not found")
    
    svc_id = str(uuid.uuid4())
    dep = deployments[svc.deployment_id]
    
    service = {
        "id": svc_id,
        "name": svc.name,
        "deployment_id": svc.deployment_id,
        "port": svc.port,
        "target_port": svc.target_port,
        "type": svc.type,
        "external_ip": "192.168.1.100" if svc.type == "LoadBalancer" else None,
        "created_at": datetime.utcnow().isoformat(),
        "manifest": generate_service_manifest(svc, dep["name"]),
    }
    
    services[svc_id] = service
    return service


@app.get("/api/services", response_model=list[Service], tags=["Services"])
async def list_services():
    """List all services."""
    return list(services.values())


@app.delete("/api/services/{service_id}", tags=["Services"])
async def delete_service(service_id: str):
    """Delete a service."""
    if service_id not in services:
        raise HTTPException(status_code=404, detail="Service not found")
    
    del services[service_id]
    return {"message": "Service deleted"}


# Namespaces (mock)

@app.get("/api/namespaces", tags=["Namespaces"])
async def list_namespaces():
    """List Kubernetes namespaces."""
    return [
        {"name": "default", "status": "Active"},
        {"name": "kube-system", "status": "Active"},
        {"name": "staging", "status": "Active"},
        {"name": "production", "status": "Active"},
    ]


# Cluster info

@app.get("/api/cluster/info", tags=["Cluster"])
async def get_cluster_info():
    """Get cluster information."""
    return {
        "version": "v1.28.0",
        "platform": "GKE",
        "nodes": 3,
        "namespaces": 4,
        "pods_running": sum(d["ready_replicas"] for d in deployments.values()),
        "services": len(services),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
