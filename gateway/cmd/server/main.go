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

	state := os.Getenv("STATE")
	if state == "docker" {
		origin = os.Getenv("GATEWAY_DOCKER_ORIGIN")
		authURL = os.Getenv("AUTH_DOCKER_URL")
		locationURL = os.Getenv("SERVER_DOCKER_URL")
		fencerURL = os.Getenv("FENCER_DOCKER_URL")
		alertURL = os.Getenv("ALERT_DOCKER_URL")
	} else {
		origin = os.Getenv("GATEWAY_DEV_ORIGIN")
		authURL = os.Getenv("AUTH_DEV_URL")
		locationURL = os.Getenv("SERVER_DEV_URL")
		fencerURL = os.Getenv("FENCER_DEV_URL")
		alertURL = os.Getenv("ALERT_DEV_URL")
	}

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
