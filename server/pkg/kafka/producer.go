package kafka

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

type Producer struct{
	writer *kafka.Writer
}



func NewProducer(brokers []string) *Producer{
	return &Producer{
		&kafka.Writer{
			Addr:     kafka.TCP(brokers...),
			Balancer: &kafka.LeastBytes{},
		},
	}
	
}

func(p *Producer) Publish(ctx context.Context,topic string, key ,value []byte) error{
	err := p.writer.WriteMessages(ctx,
		kafka.Message{
			Topic: topic,
			Key:   key,
			Value: value,
		},
	)
	if err != nil {
		log.Printf("failed to write messages: %v", err)
		return err
	}
	return nil
	
}
func (p *Producer) Close() error {
	return p.writer.Close()
}



