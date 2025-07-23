package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/service"
	"github.com/jsndz/safetrace/geo-fencer/utils"
	"gorm.io/gorm"
)

type FenceHandler struct {
	fenceService *service.FenceService
}

func NewFenceHandler(db *gorm.DB) *FenceHandler {
	return &FenceHandler{
		fenceService: service.NewFenceService(db),
	}
}


func (h *FenceHandler) CreateOrUpdateFence(c *gin.Context) {
	idParam := c.Param("id")
	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Fence ID is required",
			"success": false,
			"err":     "missing fence ID",
		})
		return
	}

	fenceID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid fence ID",
			"success": false,
			"err":     err.Error(),
		})
		return
	}
	var req utils.FenceRequest

	if err= c.ShouldBindJSON(&req); err!=nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Couldnt parse json",
			"success": false,
			"err":     err.Error(),
		})
	}
	if err := utils.ValidateFenceRequest(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Couldnt parse json",
			"success": false,
			"err":     err.Error(),
		})
	}

	fence := model.Fence{
		UserID:    req.UserID,
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Radius:    req.Radius,
	}


	res, err := h.fenceService.CreateOrUpdateFence(uint(fenceID),fence)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"message": "Couldn't fetch fence",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    res,
		"message": "Fence fetched successfully",
		"success": true,
	})
}


