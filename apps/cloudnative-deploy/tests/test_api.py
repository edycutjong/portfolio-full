"""
Tests for CloudNative Deploy API.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app, deployments, services


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture(autouse=True)
def clear_state():
    """Clear state before each test."""
    deployments.clear()
    services.clear()


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.mark.anyio
async def test_health_check(client: AsyncClient):
    """Test health endpoint."""
    response = await client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "cloudnative-deploy"


@pytest.mark.anyio
async def test_list_deployments_empty(client: AsyncClient):
    """Test empty deployment list."""
    response = await client.get("/api/deployments")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
async def test_create_deployment(client: AsyncClient):
    """Test creating a deployment."""
    response = await client.post(
        "/api/deployments",
        json={
            "name": "my-app",
            "image": "nginx:latest",
            "replicas": 3,
        }
    )
    assert response.status_code == 201
    
    data = response.json()
    assert data["name"] == "my-app"
    assert data["image"] == "nginx:latest"
    assert data["replicas"] == 3
    assert data["status"] == "pending"


@pytest.mark.anyio
async def test_get_deployment(client: AsyncClient):
    """Test getting a deployment."""
    # Create first
    create_resp = await client.post(
        "/api/deployments",
        json={"name": "test-app", "image": "alpine:latest"}
    )
    dep_id = create_resp.json()["id"]
    
    # Get
    response = await client.get(f"/api/deployments/{dep_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "test-app"


@pytest.mark.anyio
async def test_get_deployment_not_found(client: AsyncClient):
    """Test getting non-existent deployment."""
    response = await client.get("/api/deployments/nonexistent")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_update_deployment_image(client: AsyncClient):
    """Test updating deployment image."""
    # Create
    create_resp = await client.post(
        "/api/deployments",
        json={"name": "app", "image": "nginx:1.0"}
    )
    dep_id = create_resp.json()["id"]
    
    # Update
    response = await client.patch(
        f"/api/deployments/{dep_id}",
        json={"image": "nginx:2.0"}
    )
    assert response.status_code == 200
    assert response.json()["image"] == "nginx:2.0"
    assert response.json()["status"] == "updating"


@pytest.mark.anyio
async def test_delete_deployment(client: AsyncClient):
    """Test deleting a deployment."""
    # Create
    create_resp = await client.post(
        "/api/deployments",
        json={"name": "to-delete", "image": "alpine:latest"}
    )
    dep_id = create_resp.json()["id"]
    
    # Delete
    response = await client.delete(f"/api/deployments/{dep_id}")
    assert response.status_code == 200
    
    # Verify gone
    get_resp = await client.get(f"/api/deployments/{dep_id}")
    assert get_resp.status_code == 404


@pytest.mark.anyio
async def test_get_deployment_manifest(client: AsyncClient):
    """Test getting deployment manifest."""
    create_resp = await client.post(
        "/api/deployments",
        json={"name": "manifest-test", "image": "nginx:latest", "replicas": 2}
    )
    dep_id = create_resp.json()["id"]
    
    response = await client.get(f"/api/deployments/{dep_id}/manifest")
    assert response.status_code == 200
    
    manifest = response.json()
    assert manifest["kind"] == "Deployment"
    assert manifest["metadata"]["name"] == "manifest-test"
    assert manifest["spec"]["replicas"] == 2


@pytest.mark.anyio
async def test_create_service(client: AsyncClient):
    """Test creating a service."""
    # Create deployment first
    dep_resp = await client.post(
        "/api/deployments",
        json={"name": "service-app", "image": "nginx:latest"}
    )
    dep_id = dep_resp.json()["id"]
    
    # Create service
    response = await client.post(
        "/api/services",
        json={
            "name": "service-app-svc",
            "deployment_id": dep_id,
            "port": 80,
            "target_port": 8080,
            "type": "LoadBalancer",
        }
    )
    assert response.status_code == 201
    
    data = response.json()
    assert data["name"] == "service-app-svc"
    assert data["type"] == "LoadBalancer"
    assert data["external_ip"] is not None


@pytest.mark.anyio
async def test_list_namespaces(client: AsyncClient):
    """Test listing namespaces."""
    response = await client.get("/api/namespaces")
    assert response.status_code == 200
    
    namespaces = response.json()
    assert len(namespaces) > 0
    assert any(ns["name"] == "default" for ns in namespaces)


@pytest.mark.anyio
async def test_cluster_info(client: AsyncClient):
    """Test cluster info endpoint."""
    response = await client.get("/api/cluster/info")
    assert response.status_code == 200
    
    info = response.json()
    assert "version" in info
    assert "nodes" in info
