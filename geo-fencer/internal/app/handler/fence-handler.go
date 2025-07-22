package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/service"
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

func (h *FenceHandler) CreateFence(c *gin.Context) {
	var req model.Fence

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"data":    nil,
			"message": "Invalid request body",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	err := h.fenceService.CreateFence(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"data":    nil,
			"message": "Couldn't create fence",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"data":    nil,
		"message": "Successfully created a new fence",
		"success": true,
	})
}

func (h *FenceHandler) GetFenceByID(c *gin.Context) {
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

	fence, err := h.fenceService.GetFenceByID(uint(fenceID))
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
		"data":    fence,
		"message": "Fence fetched successfully",
		"success": true,
	})
}


func (h *FenceHandler) UpdateFence(c *gin.Context) {
	idParam := c.Param("id")
	fenceID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid fence ID",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	var updateData model.Fence
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	updatedFence, err := h.fenceService.UpdateFence(uint(fenceID), updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update fence",
			"success": false,
			"err":     err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":    updatedFence,
		"message": "Fence updated successfully",
		"success": true,
	})
}
