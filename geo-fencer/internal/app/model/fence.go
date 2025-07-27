package model

import "time"

type Fence struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;index"`
	Latitude  float64   
	Longitude float64
	Radius    float64
	AlertType string 
	CreatedAt time.Time
	UpdatedAt time.Time
}
