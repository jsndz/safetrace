package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/service"
	"github.com/jsndz/safetrace/geo-fencer/pkg/db"
	"github.com/jsndz/safetrace/geo-fencer/pkg/kafka"
	route "github.com/jsndz/safetrace/geo-fencer/routes"
)

func main() {
	log.Println("[DB] Connecting to database...")
	ORIGIN1:= os.Getenv("FENCER_ORIGIN_ONE")
	ORIGIN2:= os.Getenv("FENCER_ORIGIN_TWO")
	database, err := db.InitDB()
	db.MigrateDB(database)
	if err != nil {
		log.Fatalf("[Error] Couldn't connect to database: %v", err)
	}

	router := gin.New()
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{ORIGIN1,ORIGIN2},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, gin.H{"message": "ok"})
	})

	producer := kafka.NewProducerFromEnv()
	consumer := kafka.NewConsumerFromEnv( "location", "geo_fencer")
	defer func() {
		log.Println("[Kafka] Closing consumer...")
		consumer.Close()
	}()

	go func() {
		for {
			msg, err := consumer.ReadFromKafka(context.Background())
			if err != nil {
				log.Printf("[Kafka] Error reading message: %v", err)
				continue
			}
			key, err := strconv.ParseUint(string(msg.Key), 10, 1)
			if err != nil {
				log.Printf("[Kafka] Error parsing key: %v", err)
				continue
			}
			service.Fencing(uint(key), string(msg.Value), database,producer)
		}
	}()

	api := router.Group("/api/v1/fencer")
	route.FenceRoute(api, database)

	if err := router.Run(":3002"); err != nil {
		log.Fatalf("[Fatal] Failed to start HTTP server: %v", err)
	}
}
