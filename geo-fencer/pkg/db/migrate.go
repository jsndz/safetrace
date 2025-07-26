package db

import (
	"log"

	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"gorm.io/gorm"
)

func MigrateDB(db *gorm.DB) {
	db.AutoMigrate(&model.Fence{}) 

	log.Println(" Sucessful migration")
}
