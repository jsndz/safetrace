package utils

import (
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

type FenceRequest struct {
	Latitude  float64   `json:"latitude" validate:"required"`
	Longitude float64   `json:"longitude" validate:"required"`
	Radius    float64   `json:"radius" validate:"required"` 
}

func ValidateFenceRequest(data FenceRequest) error {
	return validate.Struct(data)
}
