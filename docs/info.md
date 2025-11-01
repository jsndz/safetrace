# SafeTrace 

SafeTrace is a modular, event‑driven real‑time location tracking system. A TypeScript React client publishes user location updates to a Go backend, which validates and produces events to Kafka. Independent Go services consume these events to provide geo‑fencing, alerting via Server‑Sent Events (SSE), logging, and more. The system runs locally via Docker Compose and can be deployed to Kubernetes (manifests provided), with an API gateway handling routing, JWT validation, and rate limiting.

## Skills and Expertise Demonstrated

- Backend (Go)
  - Building microservices with Fiber and Gin
  - Designing clean service boundaries (auth, server/producer, gateway, geo‑fencer, alert/notification, logger)
  - Implementing Kafka producers/consumers using `segmentio/kafka-go`
  - Input validation, environment config, base64 helpers, utility extraction
  - SSE for near real‑time push notifications
  - JWT‑based authentication and authorization
  - API gateway patterns: reverse proxying, routing, auth middleware, rate limiting

- Frontend (React + TypeScript)
  - Vite tooling, TailwindCSS setup, modular components and hooks
  - Authentication flows (login, signup), protected routes
  - Live location capture and periodic publishing
  - SSE client integration for real‑time alerts

- Messaging and Streaming (Kafka)
  - Topic design for location and alert workflows
  - Consumer group usage and horizontal scaling concepts (partitions, rewind)
  - Extension model: plug‑and‑play consumers (geo‑fencer, logger, notifications)

- Data and Persistence
  - PostgreSQL for auth (users, migrations)
  - Geofence configuration persistence; optional location history persistence

- DevOps and Platform
  - Dockerfiles for each service and a cohesive `docker-compose.yml`
  - Kubernetes manifests for all services (Deployments, Services, Ingress, ConfigMaps, Secrets)
  - Minikube setup, Ingress controller enablement, tunneling, and verification
  - Helper scripts for container tagging/pushing and k8s deploy/delete

- Architecture and Design
  - Event‑driven architecture with clear producer/consumer roles
  - Separation of concerns via gateway, auth, producer, and independent consumers
  - Real‑time geospatial processing (radius checks, fence violation detection)

## High‑Level Architecture

1. Client (React/TS) collects location and sends updates to the gateway.
2. Gateway (Go) validates JWT, rate limits, and routes to the server.
3. Server (Go + Fiber/Gin) validates payload and produces location events to Kafka.
4. Kafka brokers events consumed by independent services:
   - Geo‑Fencer checks for geofence violations and publishes alerts
   - Notification/Alert service consumes alerts and pushes via SSE
   - Location Logger writes events to file (and optionally to DB)
5. Client connects to SSE endpoint to receive alerts in real time.


## Completed Work

- Project foundation
  - Folder structure for client, gateway, server, kafka/services
  - Docker Compose for Kafka + Zookeeper and Postgres (auth)
  - Go REST API with `/health`
  - Kafka producer (dummy location data) and consumer (console logging)

- Client + Location Tracking
  - Live location display and periodic publish to backend `/location`
  - Backend `/location` validates input and publishes to Kafka (location events)

- Auth Microservice
  - Signup (`POST /register`), Login (`POST /login`) → JWT, Validate (`GET /me`)
  - JWT middleware on server and gateway
  - Frontend login/register pages with token storage

- Gateway
  - JWT validation, routing for `/location`, `/login`, `/register`, and `/alerts` (SSE)
  - Services protected behind the gateway

- Geo‑Fencer
  - Consumer of location events, compares with stored fence radius
  - Violations published to alerts topic
  - `geo_fences` persistence and `POST /set-fence` API

- Notification (SSE)
  - Consumer of `alerts` topic
  - Maintains map of `userId → SSE connection`
  - Pushes alert events to appropriate clients

- Logger Extension
  - Consumer of location events
  - Writes logs to file (`userId_timestamp.txt`) and/or DB table

- Final Integrations
  - `.env` environment setup across services
  - Full `docker-compose` including: Kafka, Auth, Server, Geo‑Fencer, Logger, Notification, Gateway
  - Client UI: login and real‑time status done (alerts UI pending)

## Tech Stack Overview

- Languages: Go, TypeScript
- Frontend: React, Vite, TailwindCSS
- Backend Frameworks: Fiber and Gin (used in different services)
- Messaging: Apache Kafka via `segmentio/kafka-go`
- Auth: JWT
- Realtime: Server‑Sent Events (SSE)
- Databases: PostgreSQL (auth, fences); optional for logs
- Reverse Proxy/Gateway: Go gateway with JWT + rate limiting; Nginx config in client container
- Containerization: Docker, Docker Compose

## Service‑by‑Service Details

### Client (`client/`)
- React + TypeScript + Vite, TailwindCSS
- Features: authentication pages, protected routes, live location capture, SSE alerts, map/history/settings pages
- Notable code: `src/hooks/*` for `useAuth`, `useLocationTracking`, `useAlert`, `useExtensions`
- Runs on port `5173` (dev)

### Gateway (`gateway/`)
- Go gateway with middleware for JWT validation and rate limiting
- Routes:
  - `/location` → server
  - `/login`, `/register` → auth
  - `/alerts` → notification SSE
- Runs on port `8080`

### Server / Producer (`server/`)
- Go backend (Fiber/Gin) exposing `/location`
- Validates request, publishes to Kafka (`location`/`location-events` topic)
- Runs on port `5000`

### Auth Service (`auth/`)
- Go + Postgres
- Endpoints: `POST /register`, `POST /login`, `GET /me`
- Utilities: JWT generation/validation, DB client and migrations
- Runs on port `3001`

### Geo‑Fencer (`geo-fencer/`)
- Go consumer subscribes to location events
- Compares positions with stored geofences (center + radius)
- On violation, produces to `alerts` topic
- API: `POST /set-fence`
- Runs on port `3002`

### Alert / Notification (`alert/`)
- Go (Gin) service consuming `alerts` topic
- Pushes events through SSE to connected clients
- Runs on port `3003`

### Location Logger (`location-logger/`)
- Go consumer of location events
- Writes logs to files and/or DB table

## Kafka Topics and Event Flow

- Location topic: used for publishing location updates
- Alerts topic: produced by geo‑fencer on fence violations; consumed by notification service
- Consumers are designed to be plug‑and‑play. Scaling via partitions and consumer groups is supported.

## Ports

- `auth`: 3001
- `client`: 5173
- `gateway`: 8080
- `server`: 5000
- `geo-fencer`: 3002
- `alert`: 3003

## Deployment and Operations

### Docker (preferred for local)
- One‑command bring‑up with `docker compose up -d`
- Services have individual Dockerfiles

### Development Environment (Devbox)
This project uses [Devbox](https://www.jetpack.io/devbox) to manage development dependencies and tools. Devbox ensures consistent environments across different machines by defining all required tools (Go, Node.js, kubectl, kind, etc.) in `devbox.json`.

**Setup:**
1. Install Devbox (if not already installed):
   ```bash
   curl -fsSL https://get.jetpack.io/devbox | bash
   ```

2. Enter the Devbox shell:
   ```bash
   devbox shell
   ```
   This will automatically install and configure all required tools including:
   - Go (latest)
   - Node.js 20
   - kubectl, kind, k9s (Kubernetes tools)
   - go-task (Taskfile runner)
   - And other utilities (gh, jq, helm, etc.)

3. Once in the devbox shell, you can use `task` commands for Kubernetes operations (see Taskfile section below).

### Taskfile (Task Runner)
The project uses [Task](https://taskfile.dev/) to automate common Kubernetes operations. Taskfile commands provide a convenient way to manage the Kubernetes cluster and deployments without remembering complex kubectl commands.

**Available Task Commands:**

**Kind Cluster Management:**
- `task kind:create-cluster` - Create a Kubernetes cluster using kind
- `task kind:enable-loadbalancer` - Enable LoadBalancer services with KinD
- `task kind:delete-cluster` - Delete the kind cluster

**Kubernetes Resource Management:**
- `task k8s:apply-all` - Apply all Kubernetes resources from k8s folder
- `task k8s:delete-all` - Delete all Kubernetes resources
- `task k8s:apply-namespace` - Create the safetrace namespace
- `task k8s:apply-secrets` - Apply secrets configuration
- `task k8s:apply-configmap` - Apply ConfigMap configuration
- `task k8s:apply-databases` - Apply PostgreSQL and Kafka resources
- `task k8s:apply-services` - Apply all service resources
- `task k8s:apply-deployments` - Apply all deployment resources

**Deployment Management:**
- `task k8s:rollout-restart DEPLOYMENT=gateway` - Restart a specific deployment
- `task k8s:rollout-status DEPLOYMENT=gateway` - Check rollout status

**Port Forwarding:**
- `task k8s:port-forward-gateway` - Port forward to gateway (localhost:8080)
- `task k8s:port-forward-auth` - Port forward to auth service
- `task k8s:port-forward-server` - Port forward to server service

**Status and Debugging:**
- `task k8s:get-pods` - List all pods in safetrace namespace
- `task k8s:get-services` - List all services
- `task k8s:get-deployments` - List all deployments
- `task k8s:get-all` - Get all resources in the namespace
- `task k8s:logs POD=gateway-xxx` - Stream logs from a pod
- `task k8s:describe RESOURCE_TYPE=deployment RESOURCE_NAME=gateway` - Describe a resource

### Kubernetes Deployment (Kind)

The project uses [Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker) for local Kubernetes development. The cluster configuration is defined in `kind-config.yaml`.

**Prerequisites:**
- Devbox shell (see Devbox section above) or manually install: kind, kubectl, docker

**Quick Start:**

1. **Enter Devbox shell** (recommended):
   ```bash
   devbox shell
   ```

2. **Create Kind cluster:**
   ```bash
   task kind:create-cluster
   ```

3. **Enable LoadBalancer support:**
   ```bash
   task kind:enable-loadbalancer
   ```
   Note: This runs `cloud-provider-kind` which enables LoadBalancer services in KinD. Keep this process running or run it in the background.

4. **Apply Kubernetes resources:**
   ```bash
   task k8s:apply-all
   ```
   This will create:
   - Namespace (`safetrace`)
   - Secrets and ConfigMaps
   - PostgreSQL databases (auth and geo-fencer)
   - Kafka (StatefulSet)
   - All microservices (gateway, auth, server, geo-fencer, alert, logger)
   - Services and networking

5. **Verify deployment:**
   ```bash
   task k8s:get-all
   task k8s:get-pods
   ```
   Wait for all pods to be in `Running` state. Check status with:
   ```bash
   kubectl get pods -n safetrace
   ```

6. **Access services:**
   - Port forward the gateway:
     ```bash
     task k8s:port-forward-gateway
     ```
   - Or use Ingress (if configured):
     ```bash
     kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
     ```

**Cleaning Up:**
```bash
task k8s:delete-all    # Delete all resources
task kind:delete-cluster  # Delete the cluster
```

**Troubleshooting:**
- If pods are not starting, check logs: `task k8s:logs POD=<pod-name>`
- Check resource status: `task k8s:describe RESOURCE_TYPE=pod RESOURCE_NAME=<pod-name>`
- Verify secrets and configmaps are applied: `kubectl get secrets,configmaps -n safetrace`
- Ensure LoadBalancer provider is running (see step 3 above)



## Learning Outcomes Captured

- Kafka producer/consumer patterns and event‑driven design
- SSE for real‑time client updates
- JWT auth across gateway and services
- Horizontal scaling via partitions and consumer groups; rewind semantics
- Modular service composition and clear separation of concerns

---


