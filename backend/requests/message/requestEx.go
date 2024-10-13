package message

type RecverAndChannel struct {
	Recver  *string //`json:"id" form:"id"` // 主键ID
	Channel *int    //`json:"channel" form:"channel"`
}
