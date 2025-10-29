package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jsndz/readit/api-gateway/middleware"
	"github.com/jsndz/readit/api-gateway/proxy"
)

func main() {
	app := fiber.New()

	var origin string
	var authURL, locationURL, fencerURL, alertURL string
	
	origin = os.Getenv("ORIGIN")
	authURL = os.Getenv("AUTH_URL")
	locationURL = os.Getenv("SERVER_URL")
	fencerURL = os.Getenv("FENCER_URL")
	alertURL = os.Getenv("ALERT_URL")
	
	app.Use(cors.New(cors.Config{
		AllowOrigins:     origin,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, Cache-Control",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Type, Cache-Control, Transfer-Encoding",
	}))

	app.Use(func(c *fiber.Ctx) error {
		limiter := middleware.NewRateLimiter(5, 10)
		if limiter.Allow() {
			return c.Next()
		}
		return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
			"data":    nil,
			"message": "Too many requests",
			"success": false,
		})
	})
	app.Use(logger.New())

	app.All("/api/v1/auth/*", func(c *fiber.Ctx) error {
		return proxy.ForwardOnly(c, authURL)
	})
	app.All("/api/v1/location/*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, locationURL)
	})
	app.All("/api/v1/fencer/*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, fencerURL)
	})
	app.All("/api/v1/alert/*", func(c *fiber.Ctx) error {
		log.Println("HIT ALERT ENNDPOINT")
		return proxy.ForwardSSE(c, alertURL)
	})
	app.Listen(":8080")
}
