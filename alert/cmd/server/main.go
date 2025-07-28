package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jsndz/safetrace/alert/internal/app/handler"
)

func main() {
  r := gin.Default()
  r.GET("/ping", handler.Ping)
  r.GET("/alerts",func(ctx *gin.Context) {
    ctx.Writer.Header().Set("Content-type","text/event-stream")
    ctx.Writer.Header().Set("Transfer-Encoding", "chunked")
    flusher,ok:= ctx.Writer.(http.Flusher)
    if !ok {
      ctx.String(http.StatusInternalServerError, "Streaming unsupported!")
      return
    }
    fmt.Fprintf(ctx.Writer,"data: is pushed\n\n")
    flusher.Flush()
  })
  r.Run(":3003") 
}
