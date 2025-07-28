# SAFETRACE Real-Time Location Tracking System (Go + Kafka + React)

Real-Time Location Tracker is a modular event-driven system that continuously tracks user locations from a frontend app, streams the data to a Go backend, and publishes it to Kafka for real-time processing. Custom Kafka consumers handle features like geo-fencing alerts, proximity detection, and location logging, making it ideal for learning Kafka, Go, and real-time architectures.
The project is built to learn kafka.
This is a initial version.
I have built a simple extension for location logging.
In the future, based on circumstances i may continue to build it.

---

## Features

- Real-time location tracking from frontend
- Backend API with Go Fiber to receive & validate dataQ
- Kafka integration using `segmentio/kafka-go`
- Plug-and-play Kafka consumers:
- Geo-fencing alerts
- Meetup proximity detection
- Location logging to file
- Real-time updates to frontend via WebSocket

---

## PORTS:

- auth :3001
- client:5173
- gateway:8080
- server:5000
- geo-fencer:3002
- alert:3003

---

## Architecture Overview

```text
                    Frontend (React/Vite)
                            ↓
                Go Fiber Backend (REST API)
                            ↓
                Kafka (location-events topic)
  ↓                         ↓                    ↓
[GeoFence Checker]     [Meetup Matcher]     [Location Logger]
  ↓                         ↓                   ↓
Go Fiber Events API → Notification → Frontend
```

````

---

## Running the Project

### 1. Clone and Setup

```bash
git clone https://github.com/jsndz/safetrace
cd safetrace
```

### 2. Start Kafka with Docker

```bash
docker-compose up -d
```

### 3. Start Go Backend (Producer API)

```bash
cd cmd/server
go run main.go
```

### 4. Start Kafka Consumer Extensions

Each consumer can be run independently. For example:

```bash
cd extensions/location_logger
go run main.go
```

### 5. Run Frontend

```bash
cd client
npm install
npm run dev
```

---

## API Endpoint

### `POST /location`

Sends the user's location.

#### Request Body:

```json
{
  "id": "loc_123",
  "userId": "user_1",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timestamp": 1723456789
}
```

---

## Extensions (Kafka Consumers)

| Extension         | Description                               |
| ----------------- | ----------------------------------------- |
| Geo-Fence Checker | Sends alert if user exits allowed area    |
| Meetup Matcher    | Triggers notification if users are nearby |
| Location Logger   | Stores location history in file           |

---

## Kafka Topics

- `location-events` – main topic for location updates
- `alerts` – triggered by consumers like GeoFence
- `meetups` – for proximity notifications

---

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Go + Fiber + Kafka producer
- **Messaging**: Apache Kafka (via `kafka-go`)
- **DB** (optional): Postgres / Mongo
- **Notification**: WebSocket / SSE / Firebase

---


## Learning Outcomes

- Kafka producer-consumer pattern
- Event-driven architecture
- Real-time geospatial data processing
- Modular backend service design in Go

---

## What i learned

- kafka lets you have multiple consumers
- make the consumers scale horizontally by increasing partitions and consumers
- Each consumer can be grouped if all consumers in a single group queue different group pub-sub
- high throughput
- rewinding option is available

---

## Contributing

Pull requests welcome. Fork the repo, create a new branch, and submit a PR.

---

## Contact
Built by [jsndz](https://github.com/jsndz)

----
````
