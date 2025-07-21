package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jsndz/readit/api-gateway/middleware"
	"github.com/jsndz/readit/api-gateway/proxy"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
	}))
	app.Use(func (c *fiber.Ctx) error {
		limiter:= middleware.NewRateLimiter(5,10)
		if limiter.Allow(){
		return	c.Next()
		} 
		return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
			"data":    nil,
			"message": "Too many requests",
			"success": false,
		})
	})
	app.Use(logger.New())
	app.All("/api/v1/auth/*", func(c *fiber.Ctx) error {
		return proxy.ForwardOnly(c, "http://localhost:3001")
	})
	app.All("/api/v1/location/*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, "http://localhost:5000")
	})
	app.All("/api/v1//*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, "http://localhost:3002")
	})
	
	app.Listen(":8080")
}

