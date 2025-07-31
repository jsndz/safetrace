package main

import (
	"context"
	"encoding/json"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jsndz/safetrace/server/pkg/kafka"
	"github.com/jsndz/safetrace/server/pkg/types"
)

func main() {
	app := fiber.New()
	ORIGIN1:= os.Getenv("SERVER_ORIGIN")

	app.Use(cors.New(cors.Config{
		AllowOrigins: ORIGIN1,
		AllowCredentials: true,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))

	producer := kafka.NewProducerFromEnv()
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("SafeTrace Backend is Running")
	})

	app.Post("/api/v1/location", func(c *fiber.Ctx) error {
		var data types.LocationData
		if err :=c.BodyParser(&data) ; err!= nil{
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"data":    nil,
				"message": "Invalid request body",
				"success": false,
				"err":     err.Error(),
			})
		}

		value ,err := json.Marshal(data)
		if err!=nil{
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"data":    nil,
				"message": "Can't Serialize data",
				"success": false,
				"err":     err.Error(),
			})
		}
		key :=[]byte(strconv.FormatUint(uint64(data.UserId), 10))
		producer.Publish(context.Background(), "location", key, []byte(value))

		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Location received",
		})
	})

	app.Listen(":5000")
}
