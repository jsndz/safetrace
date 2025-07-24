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
	err := r.db.Where("UserID = ?", userID).Find(&fence).Error
	if err != nil {
		return nil, err
	}
	return &fence, nil
}



func (r *FenceRepository) Update(UserID uint, data model.Fence) (*model.Fence, error) {
	var fence model.Fence
	if err := r.db.Model(&fence).Where("UserID = ?", UserID).Updates(data).Error; err != nil {
		return nil, err
	}
	err := r.db.Where("UserID = ?", UserID).Find(&fence).Error
	if err!=nil {
		return nil,err
	}
	return &fence, nil
}
