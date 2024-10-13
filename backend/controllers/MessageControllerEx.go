package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/beego/beego/v2/server/web"
	messageDao "simple_message/daos/message"
	"simple_message/requests/message"
	. "simple_message/utils"
)

func (this *MessageController) ActionUnread() {
	var err error
	var request message.RecverAndChannel
	var count int64
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if request.Recver == nil {
			Logger.Warn(fmt.Sprintf("ActionUnread Recver is empty"))
			this.Data["json"] = map[string]interface{}{"error": "Recver  is empty", "code": -1}
			this.ServeJSON()
			return
		}
		if request.Channel == nil {
			request.Channel = RefInt(0)
		}
		count, _ = messageDao.Count4Page(fmt.Sprintf("where status=1 and Recver=\"%s\" and channel = %d", *request.Recver, *request.Channel))
		this.Data["json"] = map[string]interface{}{"code": 0, "count": count}
	} else {
		Logger.Warn(fmt.Sprintf("ActionUnread %s", err.Error()))
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

// @Title listObj
// @Description 列出 消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /listObj [post]
func (this *MessageController) ListObjByRecverAndChannel() {
	var err error
	var request message.RecverAndChannel
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if list, err := messageDao.ListObjByRecverAndChannel(*request.Recver, *request.Channel); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0, "list": list}
		} else {
			Logger.Warn(fmt.Sprintf("ListObj %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		Logger.Warn(fmt.Sprintf("ListObjByRecverAndChannel %s", err.Error()))
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
}

func init() {
	web.Router("/simple_message/message/actionUnread", &MessageController{}, "post:ActionUnread")
	web.Router("/simple_message/message/listObjByRecverAndChannel", &MessageController{}, "post:ListObjByRecverAndChannel")
}
