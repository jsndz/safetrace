package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math"

	"github.com/jsndz/safetrace/geo-fencer/internal/app/model"
	"github.com/jsndz/safetrace/geo-fencer/internal/app/repository"
	"github.com/jsndz/safetrace/geo-fencer/pkg/kafka"
	"gorm.io/gorm"
)


type FenceService struct {
	fenceRepo   *repository.FenceRepository
}
type LocationData struct {
	Id        string   `json:"id"`
	Latitude  float64  `json:"latitude"`
	Longitude float64  `json:"longitude"`
	Accuracy  *float64 `json:"accuracy,omitempty"`
	Extensions []string `json:"extensions"`
	Timestamp int64    `json:"timestamp"`
	Address   *string  `json:"address,omitempty"`
	UserId    uint     `json:"userId"`
}
func Haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371000

	toRad := func(deg float64) float64 {
		return deg * math.Pi / 180
	}

	lat1Rad := toRad(lat1)
	lon1Rad := toRad(lon1)
	lat2Rad := toRad(lat2)
	lon2Rad := toRad(lon2)

	dLat := lat2Rad - lat1Rad
	dLon := lon2Rad - lon1Rad

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
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
			log.Fatal("Error in service 1")
		}
		return fence,err
	} 
	log.Printf("%v",data)
	fence ,err= s.fenceRepo.Update(userid, data)
	if err!=nil{
		log.Fatal("Error in service2")
	}
	return fence,nil
}
func ParseLocationData(data string) (LocationData, error) {
    var location LocationData
    err := json.Unmarshal([]byte(data), &location)
    if err != nil {
        return LocationData{}, errors.New("invalid location data format")
    }
    return location, nil
}
func Fencing(userId uint,stream string,db *gorm.DB,p *kafka.Producer) bool{
	var fence model.Fence
	data, err := ParseLocationData(stream)
	if err != nil {
		log.Fatal("error ",err)
	}
	err = db.Where("user_id = ?", userId).Find(&fence).Error
	log.Printf("%v",fence)
	if err != nil {
		log.Fatal("error ",err)
	}
	distance := Haversine(data.Latitude, data.Longitude, fence.Latitude, fence.Longitude)
	isInside := distance <= fence.Radius
	log.Printf("Distance from fence: %.2f meters\n", distance)

	switch fence.AlertType {
	case "enter":
		if isInside {
			log.Println("Alert: Entered geofence")
			p.Publish(context.Background(),"alert",fmt.Appendf(nil, "%d", userId),[]byte("Alert: Entered geofence"))
			return true
		}
	case "exit":
		if !isInside {
			log.Println(" Alert: Exited geofence")
			p.Publish(context.Background(),"alert",fmt.Appendf(nil, "%d", userId),[]byte("Alert: Exited geofence"))
			return true
		}
	case "both":
		message := fmt.Sprintf("Alert: User is currently %s the geofence", map[bool]string{true: "inside", false: "outside"}[isInside])
		log.Println(message)
		p.Publish(context.Background(), "alert", fmt.Appendf(nil,"%d", userId), []byte(message))
		return true
	default:
		log.Printf("Unknown AlertType: %s", fence.AlertType)
	}

	log.Println("No alert triggered.")
	return false

}
