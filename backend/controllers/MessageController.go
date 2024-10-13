package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/beego/beego/v2/server/web"
	messageDao "simple_message/daos/message"
	. "simple_message/requests/common"
	. "simple_message/requests/message"
	. "simple_message/utils"
)

// Operations about Message
type MessageController struct {
	web.Controller
}

// @Title 创建 Message
// @Description 创建 消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /simple_message/message/createObj [post]
func (this *MessageController) CreateObj() {
	var err error
	var request CreateObj
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {

		if request.Token == nil {
			request.Token = Uuid()
		}
		if request.Utc == nil {
			request.Utc = RefInt(Utc())
		}
		if request.Channel == nil {
			request.Channel = RefInt(0)
		}
		if request.Status == nil {
			request.Status = RefInt(1)
		}
		if request.Title == nil {
			request.Title = RefString("通知")
		}
		if request.Body == nil {
			request.Body = RefString("无")
		}
		if request.Sender == nil || request.Recver == nil {
			Logger.Warn(fmt.Sprintf("CreateObj %s", "无接收者"))
			this.Data["json"] = map[string]interface{}{"error": "无接收者", "code": -1}
			this.ServeJSON()
			return
		}
		message := request.Convert2Message()
		if _, err := messageDao.CreateObj(&message); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0}
		} else {
			Logger.Warn(fmt.Sprintf("CreateObj %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
}

// @Title getObjById
// @Description 根据Id获取消息
// @Param	body		body 	string	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /getObjById [post]
func (this *MessageController) GetObjById() {
	var err error
	var request GetById
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if obj, err := messageDao.GetObjById(request.Id); err == nil {
			this.Data["json"] = map[string]interface{}{"value": obj, "code": 0}
		} else {
			Logger.Warn(fmt.Sprintf("GetObjById %s %s", StringPtrAsTxt(request.Id), err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
}

// @Title updateObj
// @Description 更新消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /updateObj [post]
func (this *MessageController) UpdateObj() {
	var err error
	var request UpdateObj
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		message := request.Convert2Message()
		if _, err := messageDao.UpdateObj(&message); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0}
		} else {
			Logger.Warn(fmt.Sprintf("UpdateObj %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
}

// @Title listObj
// @Description 列出 消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /listObj [post]
func (this *MessageController) ListObj() {
	if list, err := messageDao.ListObj(); err == nil {
		this.Data["json"] = map[string]interface{}{"code": 0, "list": list}
	} else {
		Logger.Warn(fmt.Sprintf("ListObj %s", err.Error()))
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
}

// @Title Count4Page
// @Description 分页方式列出消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403
// @router /pageObj [post]
func (this *MessageController) Count4Page() {
	var err error
	var request SearchInfo
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if count, err := messageDao.Count4Page(request.GetConditions()); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0, "count": count}
		} else {
			Logger.Warn(fmt.Sprintf("Count4Page %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

// @Title PageObj
// @Description 分页方式列出消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403
// @router /pageObj [post]
func (this *MessageController) PageObj() {
	var err error
	var request PageObj
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if list, err := messageDao.PageObj(request.SearchInfo.GetConditions(), request.GetOrder(), request.PageInfo.Page, request.PageInfo.PageSize); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0, "list": list}
		} else {
			Logger.Warn(fmt.Sprintf("PageObj %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

// @Title DeleteObj
// @Description 删除消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int}
// @Failure 403
// @router /deleteObj [post]
func (this *MessageController) DeleteObj() {
	var err error
	var request GetById
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		if count, err := messageDao.DeleteObj(request.Id); err == nil {
			this.Data["json"] = map[string]interface{}{"code": 0, "count": count}
		} else {
			Logger.Warn(fmt.Sprintf("DeleteObj %s", err.Error()))
			this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
		}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

// @Title deleteObjs
// @Description create 消息
// @Param	body		body 	models.Message	true		"body for message content"
// @Success 200 {int} models.Message.Recver
// @Failure 403 body is empty
// @router /deleteObjs [delete]
func (this *MessageController) DeleteObjs() {
	var err error
	var request IdsReq
	count := 0
	if err = json.Unmarshal(this.Ctx.Input.RequestBody, &request); err == nil {
		for _, id := range request.Ids {
			if _, err = messageDao.DeleteObj(id); err != nil {
				Logger.Warn(fmt.Sprintf("DeleteObjs %s", err.Error()))
				this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
				this.ServeJSON()
				return
			}
			count++
		}
		this.Data["json"] = map[string]interface{}{"code": 0, "count": count}
	} else {
		this.Data["json"] = map[string]interface{}{"error": err.Error(), "code": -1}
	}
	this.ServeJSON()
	return
}

func init() {
	web.Router("/simple_message/message/listObj", &MessageController{}, "get,post:ListObj")
	web.Router("/simple_message/message/deleteObjs", &MessageController{}, "post:DeleteObjs")
	web.Router("/simple_message/message/deleteObj", &MessageController{}, "post:DeleteObj")
	web.Router("/simple_message/message/pageObj", &MessageController{}, "post:PageObj")
	web.Router("/simple_message/message/count4Page", &MessageController{}, "post:Count4Page")
	web.Router("/simple_message/message/updateObj", &MessageController{}, "post:UpdateObj")
	web.Router("/simple_message/message/getObjById", &MessageController{}, "post:GetObjById")
	web.Router("/simple_message/message/createObj", &MessageController{}, "post:CreateObj")
}
