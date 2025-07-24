package service

import (
	"errors"
	"log"

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


func (s *FenceService) CreateOrUpdateFence(userid uint,data model.Fence) (*model.Fence, error) {
	fence ,err:= s.fenceRepo.Read(userid)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		fence ,err= s.fenceRepo.Create(&data)
		if err!=nil{
			log.Fatal("Error in service")
		}
		return fence,err
	} 
	fence ,err= s.fenceRepo.Update(fence.ID, data)
	if err!=nil{
		log.Fatal("Error in service")
	}
	return fence,nil
}



