package types

import (
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

type SignupRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Username string `json:"username" validate:"required"`
	Image    string `json:"image" `
}

func ValidateSignupInput(data SignupRequest) error {
	return validate.Struct(data)
}

type SigninRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

func ValidateSigninInput(data SigninRequest) error {
	return validate.Struct(data)
}
