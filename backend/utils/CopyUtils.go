package utils
import (
	"github.com/jinzhu/copier"
)
func Cp(to interface{},from interface{})  {
	copier.Copy(to,from)
}
