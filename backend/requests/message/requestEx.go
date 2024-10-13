package message

type IdAndChannel struct {
	Id      *string //`json:"id" form:"id"` // 主键ID
	Channel *int    //`json:"channel" form:"channel"`
}
