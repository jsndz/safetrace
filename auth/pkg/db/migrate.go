package db

import (
	"log"

	"github.com/jsndz/readit/auth/internal/app/model"
	"gorm.io/gorm"
)

func MigrateDB(db *gorm.DB){

	err:= db.AutoMigrate(
	
		&model.User{},

	)

	if err!=nil {
		log.Fatal("migration failed: ", err)
	}

	log.Println("Database migrated successfully")
}