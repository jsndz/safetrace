package types


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