package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
)

func Authenticate(c *fiber.Ctx) error {

	secretKey := os.Getenv("jwtSecret")
	if secretKey == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Server configuration error",
		})
	}

	tokenString := c.Cookies("token")

	log.Infof("%v",tokenString)
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Token not provided",
		})
	}


	token ,err := jwt.Parse(tokenString,func (t *jwt.Token)(interface{},error){
		return []byte(secretKey),nil
	})
	if err != nil || !token.Valid {
		log.Infof("Error in token: %v", err)

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Invalid token",
		})
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		c.Locals("id", claims["sub"])
	}
	return c.Next()
}