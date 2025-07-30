package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


func InitDB() (*gorm.DB,error){
	host := os.Getenv("AUTH_DB_HOST")
	port := os.Getenv("AUTH_DB_PORT")
	user := os.Getenv("AUTH_DB_USER")
	password := os.Getenv("AUTH_DB_PASSWORD")
	dbname := os.Getenv("AUTH_DB_NAME")
	timezone := os.Getenv("AUTH_DB_TIMEZONE")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=%s",
		host, user, password, dbname, port, timezone,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Coudn't run postgres")
	}
	return db,nil

}