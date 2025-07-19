package main

import (
	"context"
	"log"
	"os"

	"github.com/segmentio/kafka-go"
)

func main() {
	log.Println(" Kafka consumer started")

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:9092"},
		Topic:     "location",
		GroupID:   "logger-consumer",
		MinBytes:  1,
		MaxBytes:  10e6,
	})
	file, err := os.OpenFile("locations.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("no file: %v", err)
	}
	defer file.Close()

	logger := log.New(file, "", log.LstdFlags)
	defer reader.Close()

	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Printf(" Error : %v", err)
			continue
		}
		log.Printf(" Received message: key=%s, value=%s", string(msg.Key), string(msg.Value))
		logger.Printf(" Received message: key=%s, value=%s", string(msg.Key), string(msg.Value))

	}
}
