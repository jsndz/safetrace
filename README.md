# SAFETRACE Real-Time Location Tracking System (Go + Kafka + React)

Real-Time Location Tracker is a modular event-driven system that continuously tracks user locations from a frontend app, streams the data to a Go backend, and publishes it to Kafka for real-time processing. Custom Kafka consumers handle features like geo-fencing alerts, proximity detection, and location logging, making it ideal for learning Kafka, Go, and real-time architectures.

---

## 🚀 Features

- 🌍 Real-time location tracking from frontend
- 🛡️ Backend API with Go Fiber to receive & validate data
- 📦 Kafka integration using `segmentio/kafka-go`
- 🔌 Plug-and-play Kafka consumers:
  - Geo-fencing alerts
  - Meetup proximity detection
  - Location logging to DB
- 🔔 Real-time updates to frontend via WebSocket

---

## 🧱 Architecture Overview

```text
                    Frontend (React/Vite)
                            ↓
                Go Fiber Backend (REST API)
                            ↓
                Kafka (location-events topic)
  ↓                         ↓                    ↓
[GeoFence Checker]     [Meetup Matcher]     [Location Logger]
  ↓                         ↓                   ↓
Go Fiber Events API → Notification → Frontend (WebSocket/SSE)
```

````

---

## 📂 Project Structure


---

## 🧪 Running the Project

### 1. 🔃 Clone and Setup

```bash
git clone https://github.com/jsndz/safetrace
cd location-tracker
```

### 2. 🐳 Start Kafka with Docker

```bash
docker-compose up -d
```

### 3. 🚦 Start Go Backend (Producer API)

```bash
cd cmd/server
go run main.go
```

### 4. 📟 Start Kafka Consumer Extensions

Each consumer can be run independently. For example:

```bash
cd extensions/geo-fence-checker
go run main.go
```

### 5. 🖥️ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoint

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

## 🧩 Extensions (Kafka Consumers)

| Extension         | Description                               |
| ----------------- | ----------------------------------------- |
| Geo-Fence Checker | Sends alert if user exits allowed area    |
| Meetup Matcher    | Triggers notification if users are nearby |
| Location Logger   | Stores location history in DB             |

---

## 📦 Kafka Topics

- `location-events` – main topic for location updates
- `alerts` – triggered by consumers like GeoFence
- `meetups` – for proximity notifications

---

## 🧠 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Go + Fiber + Kafka producer
- **Messaging**: Apache Kafka (via `kafka-go`)
- **DB** (optional): Postgres / Mongo
- **Notification**: WebSocket / SSE / Firebase

---

## 📌 TODOs

- [ ] Add Redis caching for latest user location
- [ ] Add authentication to track multiple users
- [ ] WebSocket server for real-time frontend updates
- [ ] Frontend map UI (Leaflet.js or Google Maps)
- [ ] Deploy backend on Railway/Fly.io

---

## 🧠 Learning Outcomes

- Kafka producer-consumer pattern
- Event-driven architecture
- Real-time geospatial data processing
- Modular backend service design in Go

---

## 📜 License

MIT

---

## 🤝 Contributing

Pull requests welcome. Fork the repo, create a new branch, and submit a PR.

---

## 🗣️ Contact

Built with 💻 by [Your Name](https://github.com/your-username)

----
````
