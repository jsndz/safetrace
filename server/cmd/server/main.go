package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("SafeTrace Backend is Running")
	})

	app.Post("/api/track", func(c *fiber.Ctx) error {
		type Location struct {
			UserID    string  `json:"userId"`
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
			Timestamp int64   `json:"timestamp"`
		}

		var loc Location
		if err := c.BodyParser(&loc); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request",
			})
		}

		println("Received location from user:", loc.UserID)


		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Location received",
		})
	})

	app.Listen(":8080")
}
