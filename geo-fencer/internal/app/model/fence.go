package model

import "time"

type Fence struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;index"`
	Latitude  float64   `gorm:"not null"`
	Longitude float64   `gorm:"not null"`
	Radius    float64   `gorm:"not null"` 
	CreatedAt time.Time
	UpdatedAt time.Time
}
