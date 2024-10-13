import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
const token = ref(window.localStorage.getItem('token') || '')
token.value = 'debug'

import role_routers from './staticRouters'
export const routes = []
routes.push(...role_routers)
console.log('router',routes)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
  
