package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jsndz/readit/auth/pkg/db"
	"github.com/jsndz/readit/auth/pkg/utils"
	"github.com/jsndz/readit/auth/route"
)

func getEnv(key, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}


func main() {
	var origin string
	if utils.GetEnv("STATE","")=="docker" {
		origin = utils.GetEnv("AUTH_DOCKER_ORIGIN","")
	} else{
		origin = utils.GetEnv("AUTH_DEV_ORIGIN","")
	}
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: origin,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))
	dbConn,err := db.InitDB()

	db.MigrateDB(dbConn)
	if err!=nil {
		fmt.Println(err)
	}
	app.Get("/api/v1/auth", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	authGroup := app.Group("/api/v1/auth")
	route.SetUpRoute(authGroup, dbConn)
	port := getEnv("AUTH_PORT","3001")
	fmt.Println("Connected:", dbConn)
	fmt.Println("Server running on port:", port)
	if err := app.Listen(":" + port); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
