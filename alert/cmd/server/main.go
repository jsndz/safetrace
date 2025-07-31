package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/alert/internal/app/handler"
	"github.com/jsndz/safetrace/alert/pkg/kafka"
)

var (
	userChannels = make(map[uint]chan string)
	mu           = sync.RWMutex{}
)

func main() {
	r := gin.Default()
	consumer := kafka.NewConsumerFromEnv("alert", "geo_fencer")
	ORIGIN1:= os.Getenv("ALERT_ORIGIN_ONE")
	ORIGIN2:= os.Getenv("ALERT_ORIGIN_TWO")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{ORIGIN1,ORIGIN2},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	go startKafkaConsumer(consumer)

	r.GET("/health", handler.Ping)

	r.GET("/api/v1/alert/:id", handleAlertStream)

	if err := r.Run(":3003"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func startKafkaConsumer(consumer *kafka.Consumer) {
	for {
		msg, err := consumer.ReadFromKafka(context.Background())
		if err != nil {
			log.Printf("[Kafka] Error reading message: %v", err)
			continue
		}

		key, err := strconv.ParseUint(string(msg.Key), 10, 32)
		if err != nil {
			log.Printf("[Kafka] Invalid user ID in key: %v", err)
			continue
		}

		mu.RLock()
		ch, ok := userChannels[uint(key)]
		mu.RUnlock()
		if ok {
			select {
				case ch <- string(msg.Value):
				//non blocking 
				//if the condition is not possible the default is executed
				//hence non blocking behaviour
				default:
					log.Printf("[SSE] Dropping message for user %d (no listener)", key)
				}
		}
	}
}

func handleAlertStream(ctx *gin.Context) {
	log.Println("HELLO")
	ctx.Writer.Header().Set("Content-Type", "text/event-stream")
	ctx.Writer.Header().Set("Transfer-Encoding", "chunked")

	idParam := ctx.Param("id")
	userID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		ctx.String(http.StatusBadRequest, "Invalid user ID")
		return
	}

	ch := make(chan string, 10)
	mu.Lock()
	userChannels[uint(userID)] = ch
	mu.Unlock()

	flusher, ok := ctx.Writer.(http.Flusher)
	if !ok {
		ctx.String(http.StatusInternalServerError, "Streaming unsupported")
		return
	}

	notify := ctx.Done()


	defer func() {
		mu.Lock()
		delete(userChannels, uint(userID))
		mu.Unlock()
		close(ch)
	}()

	for {
		select {
		case msg := <-ch:
			fmt.Fprintf(ctx.Writer, "data: %s\n\n", msg)
			flusher.Flush()
		case <-notify:
			return
		}
	}

}
