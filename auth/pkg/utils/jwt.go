package utils

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2/log"
	"github.com/golang-jwt/jwt/v5"
)


func GenerateJWT(email string,userId uint) (string, error) {
	jwtSecret := os.Getenv("jwtSecret")
	if(jwtSecret==""){
		log.Fatal("Secert is Empty")
	}
	log.Infof("%s",jwtSecret)
	claims := jwt.MapClaims{
		"id"  : userId,
		"email":   email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}
