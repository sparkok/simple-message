import { createRouter, createWebHashHistory } from 'vue-router'
import role_routers from '@/modules/role/routers'
export const routes = []
routes.push(...role_routers)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
