FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /location_logger ./

FROM alpine:latest

COPY --from=builder /location_logger /location_logger


CMD ["/location_logger"]