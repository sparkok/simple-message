package simple_message
@util.DataSource("Common")
class Message
{
  String token
  int status
  String title
  String body
  long utc
  String recver
  String sender
  static objDesp = "name"
  static belongsTo = [:]
  static service = "message"
  static classLabel = "消息"
  static actions = ["unread":["h_backend":1,"h_id":2]]
  static fields = [
    token:[label:"ID",listHide:true,ofKey:true],
    title:[label:"标题"],
    status:[label:"状态",inList:[0:'已读',1:'未读']],
    body:[label:"内容",listHide:true,h_query:false,h_ctrl:'textarea',h_style:"height:'200px';width:'100px'"],    
    utc:[label:"时间"],
    sender:[label:"发送"],
    recver:[label:"接收"]
  ]
}
