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
	var request message.IdAndChannel
	var count int64
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if request.Id == nil {
			Logger.Warn(fmt.Sprintf("ActionUnread Id is empty"))
			this.Data["json"] = map[string]interface{}{"error": "Id  is empty", "code": -1}
			this.ServeJSON()
			return
		}
		if request.Channel == nil {
			request.Channel = RefInt(0)
		}
		count, _ = messageDao.Count4Page(fmt.Sprintf("where status=1 and Recver=\"%s\" and channel = %d", *request.Id, *request.Channel))
		this.Data["json"] = map[string]interface{}{"code": 0, "count": count}
	} else {
		Logger.Warn(fmt.Sprintf("ActionUnread %s", err.Error()))
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

func init() {
	web.Router("/simple_message/message/actionUnread", &MessageController{}, "post:ActionUnread")
}
