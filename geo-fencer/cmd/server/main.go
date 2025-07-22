package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/pkg/db"
	"github.com/jsndz/safetrace/geo-fencer/pkg/kafka"
	route "github.com/jsndz/safetrace/geo-fencer/routes"
)

func main() {
	db,err:= db.InitDB()
	if err!=nil {
		log.Println("Couldn't connect to database")
	}
	router := gin.New()

	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, gin.H{"message": "ok"})
	})

	topic := "location"
	consumer := kafka.NewConsumerFromEnv(topic,"geo_fencer")
	defer consumer.Close()
	api := router.Group("/api/v1/fencer")
	route.FenceRoute(api,db)
	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start HTTP server")
	}
}