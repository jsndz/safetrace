FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /geo_fencer ./cmd/server

FROM alpine:latest

COPY --from=builder /geo_fencer /geo_fencer

EXPOSE 3002
CMD ["/geo_fencer"]