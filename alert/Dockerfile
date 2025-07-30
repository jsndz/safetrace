FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /alert_server ./cmd/server

FROM alpine:latest

COPY --from=builder /alert_server /alert_server

EXPOSE 3003
CMD ["/alert_server"]