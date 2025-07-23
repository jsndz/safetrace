package service

import (
	"errors"

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


func (s *FenceService) CreateOrUpdateFence(id uint,data model.Fence) (*model.Fence, error) {
	fence ,err:= s.fenceRepo.Read(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		s.fenceRepo.Create(&data)
	} 
	s.fenceRepo.Update(fence.ID, data)
	return fence,nil
}



