FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /auth_server ./cmd/server

FROM alpine:latest

COPY --from=builder /auth_server /auth_server

EXPOSE 3001
CMD ["/auth_server"]