package route

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/handler"

	"gorm.io/gorm"
)

func FenceRoute(router *gin.RouterGroup,db *gorm.DB){
	FenceHandler := handler.NewFenceHandler(db)
	log.Println("HII")
	router.POST("/:id",FenceHandler.CreateOrUpdateFence)
}