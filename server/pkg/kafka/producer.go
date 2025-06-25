package kafka

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

type KafkaWriter struct{
	Writer *kafka.Writer 
}


func CreateKafkaWriter(topic string) *KafkaWriter {
	writer := &kafka.Writer{
		Addr:    kafka.TCP("localhost:9092"),
		Topic:   topic,
		Balancer: &kafka.LeastBytes{},
	}
	return &KafkaWriter{Writer: writer}
}


func (w KafkaWriter ) WriteToKafka(key string ,value string) {
	err := w.Writer.WriteMessages(context.Background(),
		kafka.Message{
			Key:   []byte(key),
			Value: []byte(value),
		},
	)
	if err != nil {
		log.Fatal("failed to write messages:", err)
	}
}

func (w *KafkaWriter) Close() {
	if err := w.Writer.Close(); err != nil {
		log.Println("failed to close writer:", err)
	}
}