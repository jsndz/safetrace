package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/pkg/kafka"
)

func main() {
	


	router := gin.New()

	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, gin.H{"message": "ok"})
	})

	topic := "location"
	consumer := kafka.NewConsumerFromEnv(topic,"geo_fencer")
	defer consumer.Close()


	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start HTTP server")
	}
}