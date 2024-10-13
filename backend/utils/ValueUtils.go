package utils

import (
	"encoding/json"
	"time"
)

func RefInt(value int)*int {
	return &value
}
func RefInt64(value uint64)*uint64 {
	return &value
}
func RefFloat(value float64)*float64 {
	return &value
}
func RefString(value string)*string {
	return &value
}
func RefBool(value bool)*bool {
	return &value
}
func RefFloat64(value float64)*float64 {
	return &value
}
func StringPtrAsTxt(value *string)string {
	if(value == nil) {
		return "nil"
	}
	return  *value
}
func AssertNotNull(ptr interface{},message string)interface{} {
	if(ptr == nil){
		Logger.Error(message)
		return ptr
	}
	return ptr
}
func RefBool2Int(bootPtr *bool)*int {
	if(bootPtr == nil) {
		return nil
	}
	if(*bootPtr == true) {
		return RefInt(1)
	} else{
		return RefInt(0)
	}

}
func Utc() int{
	var utc = time.Now().Unix()
	return int(utc)
}
func Obj2JsonTxt(obj interface{}) string {
	bin,err := json.Marshal(obj)
	if( err != nil ) {
		return ""
	}
	var res = string(bin)
	return res
}
