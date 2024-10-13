import { createApp} from 'vue' 
import 'element-plus/dist/index.css'
import './style/element_visiable.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入gin-vue-admin前端初始化相关内容
import './core/gin-vue-admin'

import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
const token = ref(window.localStorage.getItem('token') || '')
token.value = 'debug'
  
import role_routers from '@/local/staticRouters'
// 引入全局组件
import components from "@/components/batchImport";

export const routes = []
routes.push(...role_routers)
console.log('router',routes)
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

console.log('dev_routers',router)
console.log('routes',routes)

import run from '@/core/gin-vue-admin.js'
import auth from '@/directive/auth'
import { store,useRouterStore } from '@/pinia'
import App from './App.vue'
import VueClipboard from 'vue-clipboard3'
const app = createApp(App)
app.config.productionTip = false


app
  .use(run)
  .use(store)
  .use(auth)
  .use(router)
  .use(components)  
  .use(VueClipboard)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')
const routerStore = useRouterStore()
routerStore.SetDebugRouter(routes)
export default app
