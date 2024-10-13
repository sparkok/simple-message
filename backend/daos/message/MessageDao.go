package message
import (
	"simple_message/models/common"
	"gorm.io/gorm"
	messageModel "simple_message/models/message"
	. "simple_message/utils"
)

// 列出 消息
func ListObj(tx ... *gorm.DB)([]messageModel.Message,error){
	list := []messageModel.Message{}
	db := GetDb(tx ...).Table("message").Find(&list)
	return list,db.Error
}

/**
* message数据库操作类 
*/
func CreateObj(message *messageModel.Message,tx ... *gorm.DB) (int64,error){
	db := GetDb(tx ...).Create(message)
	return db.RowsAffected,db.Error
}

//  更新消息
func UpdateObj(message *messageModel.Message,tx ... *gorm.DB)(int64,error){
	db := GetDb(tx ...).Updates(message)
	return db.RowsAffected,db.Error
}

//  更新非null字段
func UpdateObjItem(message *messageModel.Message,tx ... *gorm.DB)(int64,error){
	db := GetDb(tx ...).UpdateColumns(message)
	return db.RowsAffected,db.Error
}

//  更新消息
func SaveObj(message *messageModel.Message,tx ... *gorm.DB)(int64,error){
	db := GetDb(tx ...).Save(message)
	return db.RowsAffected,db.Error
}


// 根据ID获取消息
func GetObjById(token *string,tx ... *gorm.DB)(messageModel.Message,error){
	message := messageModel.Message{Token:token}
	result := messageModel.Message{}
	db := GetDb(tx ...).Where(&message).Take(&result)
	return result,db.Error
}
//  用分页方式列出 消息
func PageObj(conditions string,order string,curPage int,pageSize int,tx ... *gorm.DB)([]messageModel.Message,error){
	sql := `select message.body as body,message.recver as recver,message.sender as sender,message.status as status,message.title as title,message.token as token,message.utc as utc from message `
	list := []messageModel.Message{}
	limitAndOffset := MakeLimitOffset(curPage,pageSize)
	db := GetDb(tx ...).Raw(sql + conditions + " " + order + " " + limitAndOffset).Find(&list)
	return list,db.Error
}

func Count4Page(conditions string,tx ... *gorm.DB)(int64,error){
	sql := `select count(*) as Count from message `
	count := common.Count{}
	db := GetDb(tx ...).Raw(sql + conditions).Take(&count)
	return count.Count,db.Error
}

// 根据id删除 消息
func DeleteObj(token *string,tx ... *gorm.DB) (int64,error){
	db := GetDb(tx ...).Delete(&messageModel.Message{Token:token})
	return db.RowsAffected,db.Error
}
