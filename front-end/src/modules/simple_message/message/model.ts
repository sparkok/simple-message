import { h } from 'vue'
import { service } from '../../../utils/request'

const url = '/simple_message/message'
export default class Message {
  constructor() {
    
  }
  pageObj(data:any){
    return service({
      url: `${url}/pageObj`,
      method: 'post',
      data
    })
  }
  count4Page(data:any){
    return service({
      url: `${url}/count4Page`,
      method: 'post',
      data
    })
  }
  createObj(data:any):any{
    return service({
      url: `${url}/createObj`,
      method: 'post',
      data: this.format(data)
    })
  }
  getObjById(data:any):any{
    return service({
      url: `${url}/getObjById`,
      method: 'post',
      data
    })
  }

  updateObj(data:any):any{
    return service({
      url: `${url}/updateObj`,
      method: 'post',
      data: this.format(data)
    })
  }

  listObj(data:any):any{
    return service({
      url: `${url}/listObj`,
      method: 'post',
      data
    })
  }

  deleteObj(data:any):any{
  	const ID = this.getKey(data)
    return service({
      url: `${url}/deleteObj`,
      method: 'post',
      data: { ID }
    })
  }

  deleteObjs(data:any):any{
    return service({
      url: `${url}/deleteObjs`,
      method: 'post',
      data
    })
  }
  actionUnread(data:any):any{
    return service({
      url: `${url}/actionUnread`,
      method: 'post',
      data
    })
  }  

  getDesc(obj:any) :any{
    return obj.Name
  }
  getKey(obj:any) :any{
  	return ""+obj.Token
  }
  getDescField() :any{
    return 'Name'
  }
  getKeyField(obj:any) :any{
    return ["Token"]
  }
  format(obj:any) :any{
	 if(null !== obj.Channel && undefined !== obj.Channel) {
		obj.Channel = parseFloat(""+obj.Channel)
	 }
     if(null !== obj.Status && undefined !== obj.Status) {
		obj.Status = parseFloat(""+obj.Status)
	 }
     if(null !== obj.Utc && undefined !== obj.Utc) {
		obj.Utc = parseFloat(""+obj.Utc)
	 }
     return obj
  }
  format4Select(obj:any):any {	
    return obj
  }
  // 字段的名称
  fields = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'message.title',
      query: true,
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'message.status',
      render: (t, itemData, item) => {
        switch (itemData) {
          case 0 : return h('span',{},'已读')
          case 1 : return h('span',{},'未读')
        }
      },
      query: true,
      sorter: true
    },
    {
      title: '通道',
      dataIndex: 'Channel',
      key: 'message.channel',
      query: true,
      sorter: true
    },
    {
      title: '内容',
      dataIndex: 'Body',
      key: 'message.body',
      query: false,
      sorter: true,
      hide: true
    },
    {
      title: '时间',
      dataIndex: 'Utc',
      key: 'message.utc',
      query: true,
      sorter: true
    },
    {
      title: '发送',
      dataIndex: 'Sender',
      key: 'message.sender',
      query: true,
      sorter: true
    },
    {
      title: '接收',
      dataIndex: 'Recver',
      key: 'message.recver',
      query: true,
      sorter: true
    }
  ]
}
