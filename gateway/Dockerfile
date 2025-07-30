FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /gateway ./cmd/server

FROM alpine:latest

COPY --from=builder /gateway /gateway

EXPOSE 8080
CMD ["/gateway"]