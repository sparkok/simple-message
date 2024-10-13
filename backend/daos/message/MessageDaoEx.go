package message

import (
	"gorm.io/gorm"
	messageModel "simple_message/models/message"
	. "simple_message/utils"
)

// 根据ID获取消息
func ListObjByRecverAndChannel(recver string, channel int, tx ...*gorm.DB) ([]messageModel.Message, error) {
	result := []messageModel.Message{}
	message := messageModel.Message{Channel: RefInt(channel), Recver: RefString(recver)}
	db := GetDb(tx...).Where(&message).Find(&result)
	return result, db.Error
}
