package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


func InitDB() (*gorm.DB,error){
	host := os.Getenv("FENCER_DB_HOST")
	port := os.Getenv("FENCER_DB_PORT")
	user := os.Getenv("FENCER_DB_USER")
	password := os.Getenv("FENCER_DB_PASSWORD")
	dbname := os.Getenv("FENCER_DB_NAME")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port, 
	)	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Coudn't run postgres",err)
	}
	return db,nil
}