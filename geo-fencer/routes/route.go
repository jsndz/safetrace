package route

import (
	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/handler"

	"gorm.io/gorm"
)

func FenceRoute(router *gin.RouterGroup,db *gorm.DB){
	FenceHandler := handler.NewFenceHandler(db)
	router.POST("/:id",FenceHandler.CreateOrUpdateFence)
}