package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/beego/beego/v2/server/web"
	messageDao "simple_message/daos/message"
	. "simple_message/requests/common"
	. "simple_message/utils"
)

func (this *MessageController) ActionUnread() {
	var err error
	var request IdsReq
	var count int64
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		var id string
		if request.Ids == nil || len((*request.Ids[0])) == 0 {
			Logger.Warn(fmt.Sprintf("ActionUnread %s", "Ids is empty"))
			this.Data["json"] = map[string]interface{}{"error": "Ids[0] is empty", "code": -1}
			this.ServeJSON()
			return
		}
		id = *request.Ids[0]
		count, _ = messageDao.Count4Page("where status=1 and Recver=\"" + id + "\"")
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
