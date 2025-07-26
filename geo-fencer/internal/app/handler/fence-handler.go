package handler

import (
	"bytes"
	"io"
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
	bodyBytes, err := c.GetRawData()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": "unable to read request body"})
		return
	}
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) 
	
	var req utils.FenceRequest
	if err = c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": "invalid JSON"})
		return
	}
	
	userID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid fence ID",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	if err := utils.ValidateFenceRequest(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid request data",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	fence := model.Fence{
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Radius:    req.Radius,
	}

	res, err := h.fenceService.CreateOrUpdateFence(uint(userID), fence)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"message": "Couldn't create or update fence",
			"success": false,
			"err":     err.Error(),
		})
		return
	}


	c.JSON(http.StatusOK, gin.H{
		"data":    res,
		"message": "Fence worked successfully",
		"success": true,
	})
}
