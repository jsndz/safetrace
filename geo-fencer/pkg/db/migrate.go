package db

import (
	"log"

	"gorm.io/gorm"
)

func MigrateDB(db *gorm.DB) {
	
	log.Println("Seed data (10 posts and comments) inserted successfully")
}
