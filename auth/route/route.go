package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jsndz/readit/auth/internal/app/handler"
	"gorm.io/gorm"
)

func SetUpRoute(router fiber.Router,db *gorm.DB){
	userHandler := handler.NewUserHandler(db)

	router.Post("/signup",userHandler.Signup)
	router.Post("/signin",userHandler.Signin)
	router.Get("/username/:id",userHandler.Getname)
}