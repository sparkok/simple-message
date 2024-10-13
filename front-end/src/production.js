import { createApp} from 'vue' 
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入gin-vue-admin前端初始化相关内容
import './core/gin-vue-admin'
// 引入封装的router
import router from '@/router/index'
// 如果要免登陆直接看模块,注释下面这行
import '@/modules/role/actions/permission'

import run from '@/core/gin-vue-admin.js'
import auth from '@/directive/auth'
// import { store } from '@/pinia'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueClipboard from 'vue-clipboard2'

// 引入全局组件
import components from "@/components/batchImport";

var process = process || { flag:"ok"}

console.log('process',process)
const app = createApp(App)
app.config.productionTip = false
app.config.warnHandler = () => null
app.config.globalProperties.$MqttClient = {};
app
  .use(run)
  .use(createPinia())
  // .use(store)
  .use(auth)
  .use(router)
  .use(VueClipboard)
  .use(ElementPlus, { locale: zhCn })
  .use(components)
  .mount('#app')
export default app
