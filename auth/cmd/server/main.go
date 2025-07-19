package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/jsndz/readit/auth/pkg/db"
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
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("No .env file found (probably running inside Docker)")
	}
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:8080",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))
	dbConn,err := db.InitDB()

	db.MigrateDB(dbConn)
	if err!=nil {
		fmt.Println(err)
	}
	app.Get("/api/auth", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	authGroup := app.Group("/api/auth")
	route.SetUpRoute(authGroup, dbConn)
	port := getEnv("PORT","3001")
	fmt.Println("Connected:", dbConn)
	fmt.Println("Server running on port:", port)
	if err := app.Listen(":" + port); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
