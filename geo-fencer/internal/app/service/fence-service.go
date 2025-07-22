package service

import (
	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/repository"
	"gorm.io/gorm"
)

type FenceService struct {
	fenceRepo   *repository.FenceRepository
}

func NewFenceService (db *gorm.DB) * FenceService {
	return &FenceService{
		fenceRepo: repository.NewFenceRepository(db),
	
	}
}

func (s *FenceService) CreateFence(data model.Fence) error {
	return s.fenceRepo.Create(&data)
}

func (s *FenceService) GetFenceByID(id uint) (*model.Fence, error) {
	return s.fenceRepo.Read(id)
}

func (s *FenceService) UpdateFence(id uint, data model.Fence) (*model.Fence, error) {
	return s.fenceRepo.Update(id, data)
}



