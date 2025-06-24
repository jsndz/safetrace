package types


type LocationData struct {
	Id        string
	Latitude  float64
	Longitude float64
	Accuracy  *float64
	Timestamp int64
	Address   *string
}
  