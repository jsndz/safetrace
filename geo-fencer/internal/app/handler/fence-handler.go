package handler

import (
	"bytes"
	"io"
	"log"
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
	log.Println("[FenceHandler] Hit CreateOrUpdateFence endpoint")

	idParam := c.Param("id")
	log.Printf("[FenceHandler] Received fence ID param: %s\n", idParam)

	if idParam == "" {
		log.Println("[FenceHandler] Missing fence ID in path")
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
		log.Printf("[FenceHandler] Failed to read request body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"err": "unable to read request body"})
		return
	}
	log.Printf("[FenceHandler] Raw Request Body: %s\n", string(bodyBytes))
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes)) // restore for binding
	
	var req utils.FenceRequest
	if err = c.ShouldBindJSON(&req); err != nil {
		log.Printf("[FenceHandler] Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"err": "invalid JSON"})
		return
	}
	log.Printf("[FenceHandler] Parsed request: %+v\n", req)
	
	userID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		log.Printf("[FenceHandler] Invalid fence ID: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid fence ID",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	if err := utils.ValidateFenceRequest(req); err != nil {
		log.Printf("[FenceHandler] Validation failed: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid request data",
			"success": false,
			"err":     err.Error(),
		})
		return
	}
	log.Println("[FenceHandler] Request validation passed")

	fence := model.Fence{
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Radius:    req.Radius,
	}
	log.Printf("[FenceHandler] Constructed Fence model: %+v\n", fence)

	res, err := h.fenceService.CreateOrUpdateFence(uint(userID), fence)
	if err != nil {
		log.Printf("[FenceHandler] Error in fenceService: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"message": "Couldn't create or update fence",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	log.Printf("[FenceHandler] Fence created/updated successfully: %+v\n", res)

	c.JSON(http.StatusOK, gin.H{
		"data":    res,
		"message": "Fence worked successfully",
		"success": true,
	})
}
