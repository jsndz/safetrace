package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/jsndz/readit/auth/internal/app/model"
	"github.com/jsndz/readit/auth/internal/app/service"
	"gorm.io/gorm"
)

type UserHandler struct{
	userService *service.UserService
}

func NewUserHandler(db *gorm.DB) * UserHandler {
	return &UserHandler{
		userService: service.NewUserService(db),
	}
}

func (h *UserHandler) Signup (c *fiber.Ctx) error{
	var req model.User

	if err:= c.BodyParser(&req);err!=nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Invalid request body",
			"success": false,
			"err":     err.Error(),
		})
	}
	token,user, err := h.userService.Signup(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"data":    nil,
			"message": "Couldn't create new user",
			"success": false,
			"err":     err.Error(),
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"token":token,
		"data":    user,
		"message": "Successfully created a new user",
		"success": true,
		"err":     nil,
	}) 
}


func (h *UserHandler) Signin (c *fiber.Ctx) error{
	var req model.User

	if err:= c.BodyParser(&req);err!=nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Invalid request body",
			"success": false,
			"err":     err.Error(),
		})
	}
	token,user, err := h.userService.Signin(req.Email,req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"data":    nil,
			"message": "Couldn't signin user.",
			"success": false,
			"err":     err.Error(),
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"token":token,
		"data":    user,
		"message": "User Successfully signed in.",
		"success": true,
		"err":     nil,
	}) 
}

func (h *UserHandler) Getname (c *fiber.Ctx) error{
	idParamStr := c.Params("id")
	idParam, err := strconv.ParseUint(idParamStr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Invalid ID parameter",
			"success": false,
			"err":     err.Error(),
		})
	}


	username, err := h.userService.GetName(uint(idParam))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"data":    nil,
			"message": "Couldn't get username.",
			"success": false,
			"err":     err.Error(),
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		
		"data":    username,
		"message": "returned username successfully.",
		"success": true,
		"err":     nil,
	}) 
}