FROM golang:1.24.3-alpine AS builder


WORKDIR /app
    
COPY go.mod go.sum ./
RUN go mod download
    
COPY . .
RUN go build -o auth-service ./cmd/server
    
FROM alpine:latest
    
WORKDIR /root/
    
COPY --from=builder /app/auth-service .
    
EXPOSE 3001
    
CMD ["./auth-service"]
    