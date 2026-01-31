# CloudNative Deploy

Kubernetes deployment orchestration API for managing containers at scale.

## Features

- 🚀 **Deployment Management** - Create, update, scale, delete
- 🔄 **Rolling Updates** - Zero-downtime deployments
- 🌐 **Service Networking** - ClusterIP, NodePort, LoadBalancer
- 📋 **Manifest Generation** - K8s YAML from API
- 📊 **Cluster Overview** - Nodes, pods, namespaces

## Tech Stack

- **Framework**: FastAPI
- **Orchestration**: Kubernetes Python client
- **Container**: Docker
- **Language**: Python 3.11+

## Getting Started

```bash
# Install dependencies
uv sync

# Run server
uvicorn app.main:app --reload --port 8002

# Run tests
pytest

# Docker
docker build -t cloudnative-deploy .
docker run -p 8002:8002 cloudnative-deploy
```

## API Endpoints

### Deployments
```
POST   /api/deployments                    # Create deployment
GET    /api/deployments                    # List deployments
GET    /api/deployments/{id}               # Get deployment
PATCH  /api/deployments/{id}               # Update deployment
DELETE /api/deployments/{id}               # Delete deployment
GET    /api/deployments/{id}/pods          # List pods
GET    /api/deployments/{id}/manifest      # Get K8s manifest
```

### Services
```
POST   /api/services          # Create service
GET    /api/services          # List services
DELETE /api/services/{id}     # Delete service
```

### Cluster
```
GET    /api/namespaces        # List namespaces
GET    /api/cluster/info      # Cluster overview
```

## Example Usage

### Create Deployment
```bash
curl -X POST http://localhost:8002/api/deployments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-app",
    "image": "nginx:latest",
    "replicas": 3,
    "port": 80
  }'
```

### Scale Deployment
```bash
curl -X PATCH http://localhost:8002/api/deployments/{id} \
  -H "Content-Type: application/json" \
  -d '{"replicas": 5}'
```

### Create LoadBalancer Service
```bash
curl -X POST http://localhost:8002/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-app-lb",
    "deployment_id": "...",
    "port": 80,
    "target_port": 8080,
    "type": "LoadBalancer"
  }'
```

## Project Structure

```
apps/cloudnative-deploy/
├── app/
│   ├── __init__.py
│   └── main.py          # FastAPI application
├── tests/
│   └── test_api.py      # API tests
├── Dockerfile           # Container image
├── pyproject.toml       # Dependencies
└── README.md
```

## Generated Manifests

The API generates standard Kubernetes manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    spec:
      containers:
        - name: my-app
          image: nginx:latest
          resources:
            limits:
              cpu: "500m"
              memory: "256Mi"
```

## License

MIT
