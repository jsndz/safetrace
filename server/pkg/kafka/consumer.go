package kafka

import (
	"context"

	"github.com/gofiber/fiber/v2/log"
	"github.com/segmentio/kafka-go"
)

func Consume() {	
	log.Info(" Kafka consumer started!")
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"localhost:9092"},
		Topic:     "location",
		Partition: 0,
		MaxBytes:  10e6,
	})
	r.SetOffset(kafka.FirstOffset)
	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Info(" Kafka broke!")
			break
		}
		log.Infof("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))
		
	}
	
	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
	
}
