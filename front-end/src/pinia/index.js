import { createPinia } from 'pinia'
import { useUserStore,useRouterStore } from '@/modules/role/store'


const store = createPinia()

export {
  store,useUserStore ,useRouterStore
}
