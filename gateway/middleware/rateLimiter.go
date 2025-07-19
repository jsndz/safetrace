package middleware

import (
	"sync"
	"time"
)

type  RateLimiter struct{
	tokens int
	lastRefill time.Time
	refillRate int
	capacity int
	mutex sync.Mutex

}


func NewRateLimiter(rate int,capacity int) *RateLimiter{
	return &RateLimiter{
		tokens: capacity,
		lastRefill: time.Now(),
		refillRate: rate,
		capacity: capacity,

	}
}


func (r *RateLimiter) Allow() bool{
	r.mutex.Lock()
	defer r.mutex.Unlock()

	now := time.Now()
	elapsed:= now.Sub(r.lastRefill).Seconds()
	refill :=int((elapsed) * float64(r.refillRate))

	if refill>0{
		r.tokens = min(r.capacity,r.tokens+refill)
		r.lastRefill=now
	}

	if r.tokens>0{
		r.tokens--
		return true
	}
	return false

} 