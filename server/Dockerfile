FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /server ./cmd/server

FROM alpine:latest

COPY --from=builder /server /server

EXPOSE 5000
CMD ["/server"]