package main

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jsndz/readit/api-gateway/middleware"
	"github.com/jsndz/readit/api-gateway/proxy"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
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
	app.All("/api/auth/*", func(c *fiber.Ctx) error {
		return proxy.ForwardOnly(c, "http://localhost:3001")
	})
	app.Get("/api/post/get/:id",middleware.Authenticate,func( c *fiber.Ctx)error{
		response, err := proxy.ForwardReturn(c, "http://localhost:3002")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to fetch post data",
			})
		}
		dataMap, ok := response["data"].(map[string]interface{})
		log.Infof("map %v",dataMap)
		if !ok {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "invalid data format",
			})
		}

		userId, ok := dataMap["UserID"].(float64)
    if !ok {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "invalid UserID format",
        })
    }
		username ,err:= proxy.ForwardSpecific(c, `http://localhost:3001/api/auth/username/`+strconv.FormatFloat(userId, 'f', -1, 64))
		 if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "failed to fetch username",
			})
		}
		 return  c.Status(fiber.StatusAccepted).JSON(fiber.Map{
			"data":    dataMap,
			"username":username,
			"message": "User Successfully signed in.",
			"success": true,
			"err":     nil,
		}) 
	})
	app.All("/api/post/*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, "http://localhost:3002")
	})
	app.All("/api/comment/*", middleware.Authenticate, func(c *fiber.Ctx) error {
		return proxy.Forward(c, "http://localhost:3002")
	})
	
	app.Listen(":8080")
}

