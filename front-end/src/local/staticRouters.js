//将缺省子路由的路径设置为/
const routers = [
  {
    path: '/debugPanel', 
    meta: { closeTab:false,defaultMenu:false,icon:"connection",keepAlive:false,title:"调试面板"},
    btns: null,
    component: () => import('@/view/layout/index.vue'),
      //配置子路由
    children:[
		{
          meta: { closeTab:false,defaultMenu:false,icon:"connection",keepAlive:false,title:"[ MESSAGE ]管理"},
          btns: null,
          path: '/',  
          name: 'MessageList',
          component: () => import('@/modules/simple_message/message/view.vue')
         },
      ]
    }
]
export default routers
