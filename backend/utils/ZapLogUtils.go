package utils

import (
	"go.uber.org/zap"
)
var Logger *zap.Logger
func createLogger() (logger *zap.Logger) {
	logger,_ = zap.NewProduction()
	return logger
}
func init()  {
	Logger = createLogger()
}
