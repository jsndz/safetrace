package service

import (
	"fmt"

	"github.com/jsndz/readit/auth/internal/app/model"
	"github.com/jsndz/readit/auth/internal/app/repository"
	"github.com/jsndz/readit/auth/pkg/utils"
	"gorm.io/gorm"
)


type UserService struct {
	userRepo   *repository.UserRepository
}

func NewUserService (db *gorm.DB) * UserService {
	return &UserService{
		userRepo: repository.NewUserRepository(db),
	}
}


func (s *UserService) Signup(data model.User)(string,*model.User,error){
	user,err := s.userRepo.Create(&data);
	if  err != nil {
		return "",nil,err
	}
	jwt_token, err := utils.GenerateJWT(data.Email,user.ID)
	if  err != nil {
		return "",nil,err
	}
	return jwt_token,user,nil
}

func (s *UserService) Signin(Email string,Password string)(string,*model.User,error){
	var user *model.User
	user, err := s.userRepo.Get(Email)
	if  err != nil {
		return "", nil,fmt.Errorf("user doesn't exist")
	}

	if !model.CheckPassword(user.Password,Password) {
		return "", nil,fmt.Errorf("invalid credentials")
	}

	jwt_token, err := utils.GenerateJWT(Email,user.ID)

	if  err != nil {
		return "",nil,err
	}
	return jwt_token,user,nil
}


func (s *UserService) GetName(ID uint)(string,error){
	return s.userRepo.GetName(ID)
}