package message

/**
* 实体类 Message
 */
type Message struct {
	Channel *int `gorm:"index:idx_channel"`
	Body    *string
	Recver  *string `gorm:"index:idx_recver"`
	Sender  *string
	Status  *int `gorm:"index:idx_status"`
	Title   *string
	Token   *string `gorm:"primaryKey;"`
	Utc     *int    `gorm:"index:idx_status"`
}
