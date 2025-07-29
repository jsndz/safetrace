package repository

import (
	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type FenceRepository struct {
	db *gorm.DB
}

func NewFenceRepository(db *gorm.DB) *FenceRepository {
	return &FenceRepository{db: db}
}

func (r *FenceRepository) Create(fence *model.Fence) (*model.Fence,error) {
	if err := r.db.Create(fence).Error; err != nil {
		log.Error().Err(err).Msg("Failed to create fence")
		return fence, err
	}
	return fence, nil
}

func (r *FenceRepository) Read(userID uint) (*model.Fence, error) {
	var fence model.Fence
	err := r.db.Where("user_id = ?", userID).First(&fence).Error
	return &fence, err
}



func (r *FenceRepository) Update(userID uint, data model.Fence) (*model.Fence, error) {
	if err := r.db.Model(&model.Fence{}).
		Where("user_id = ?", userID).
		Updates(data).Error; err != nil {
		return nil, err
	}

	var updated model.Fence
	if err := r.db.Where("user_id = ?", userID).First(&updated).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}
