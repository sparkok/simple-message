package message
import (
	"bytes"
	"simple_message/requests/common"
	messageModel "simple_message/models/message"
)


/**
* Message请求类 
*/
type PageObj struct {
	common.PageObjBase
	SearchInfo SearchInfo
}
type SearchInfo struct {
 
	//`json:"body"`
	Body *string  
	//`json:"channel"`
	Channel *string  
	//`json:"recver"`
	Recver *string  
	//`json:"sender"`
	Sender *string 
	 
	//`json:"status"`
	Status *string  
	//`json:"title"`
	Title *string  
	//`json:"token"`
	Token *string  
	//`json:"utc"`
	Utc *string 
}

func (this *SearchInfo) GetConditions() string{
    var condition bytes.Buffer
    if this.Body != nil {
      condition.WriteString("and (message.body like '%" + *this.Body + "%')")
    }
    if this.Channel != nil {
     condition.WriteString("and (message.channel = " + *this.Channel + ")")
    }
    if this.Recver != nil {
      condition.WriteString("and (message.recver like '%" + *this.Recver + "%')")
    }
    if this.Sender != nil {
      condition.WriteString("and (message.sender like '%" + *this.Sender + "%')")
    }
    if this.Status != nil {
     condition.WriteString("and (message.status = " + *this.Status + ")")
    }
    if this.Title != nil {
      condition.WriteString("and (message.title like '%" + *this.Title + "%')")
    }
    if this.Token != nil {
      condition.WriteString("and (message.token like '%" + *this.Token + "%')")
    }
    if this.Utc != nil {
     condition.WriteString("and (message.utc = " + *this.Utc + ")")
    }

	if(condition.Len() > 4) {
		return " where " + condition.String()[4:]
	}
	return ""
}

type CreateObj struct {

	//`json:"body"`
	Body *string 
	//`json:"channel"`
	Channel *int 
	//`json:"recver"`
	Recver *string 
	//`json:"sender"`
	Sender *string 
	
	//`json:"status"`
	Status *int 
	//`json:"title"`
	Title *string 
	//`json:"token"`
	Token *string 
	//`json:"utc"`
	Utc *int 
}
func (this *CreateObj) Convert2Message() messageModel.Message  {
	var message = messageModel.Message{}

	message.Body = this.Body
	message.Channel = this.Channel
	message.Recver = this.Recver
	message.Sender = this.Sender
	
	message.Status = this.Status
	message.Title = this.Title
	message.Token = this.Token
	message.Utc = this.Utc
	return message
}

type UpdateObj struct {

	//`json:"body"`
	Body *string 
	//`json:"channel"`
	Channel *int 
	//`json:"recver"`
	Recver *string 
	//`json:"sender"`
	Sender *string 
	
	//`json:"status"`
	Status *int 
	//`json:"title"`
	Title *string 
	//`json:"token"`
	Token *string 
	//`json:"utc"`
	Utc *int 
}
func (this *UpdateObj) Convert2Message() messageModel.Message  {
	var message = messageModel.Message{}

	message.Body = this.Body
	message.Channel = this.Channel
	message.Recver = this.Recver
	message.Sender = this.Sender
	
	message.Status = this.Status
	message.Title = this.Title
	message.Token = this.Token
	message.Utc = this.Utc
	return message
}
