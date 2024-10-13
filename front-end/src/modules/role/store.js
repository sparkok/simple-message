import { login, getUserInfo, setSelfInfo } from '@/modules/role/actions/user'
import { jsonInBlacklist } from '@/modules/role/actions/jwt'
import router from '@/router/index'
import { ElLoading, ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { asyncRouterHandle } from './utils/asyncRouter'
import { asyncMenu } from './actions/menu'

const routerListArr = []
const keepAliveRoutersArr = []
const  printInitScript = (initSubModulesScripts) => {
  const keys = Object.keys(initSubModulesScripts)
  console.log('lazeImportInitScript3', keys)
}

//载入路由和子路由到routerListArr和routeMap中,并把数据补全
//routerMap的键值为名字
const formatRouter = (routes, routeMap) => {
  routes && routes.forEach(item => {
    if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404' && !item.hidden) {
      routerListArr.push({ label: item.meta.title, value: item.name })
    }
    if(item.meta === undefined) {
      item.meta = { hidden:item.hidden,btns:item.btns}
    } else {
      item.meta.hidden = item.hidden
      item.meta.btns = item.btns 
    }
    routeMap[item.name] = item
    if (item.children && item.children.length > 0) {
      formatRouter(item.children, routeMap)
    }
  })
}

//将路由中需要keepAlive的路由添加到keepAliveRoutersArr中
const KeepAliveFilter = (routes) => {
  routes && routes.forEach(item => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta.keepAlive) || item.meta.keepAlive)) {
      item.component && item.component().then(val => { 
        keepAliveRoutersArr.push(val.default.name) 
      })
    }
    if (item.children && item.children.length > 0) {
      KeepAliveFilter(item.children)
    }
  })
}

export const useRouterStore = defineStore('router', () => {
  const asyncRouters = ref([])
  const routerList = ref(routerListArr)
  const keepAliveRouters = ref(keepAliveRoutersArr)
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    
    //从服务拉取菜单
    const asyncRouterRes = await asyncMenu()
    //获取路由信息
    const asyncRouter = asyncRouterRes.data.menus
    //增加错误页面和重新载入数据的页面
    asyncRouter && asyncRouter.push({
      path: '404',
      name: '404',
      hidden: true,
      meta: {
        title: '迷路了*。*',
        closeTab: true,
      },
      component: 'view/error/index.vue'
    }, {
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: '',
        closeTab: true,
      },
      component: 'view/error/reload.vue'
    })
    //载入各个子模块内部使用的隐藏路由,这种方法载入子页面后组件没显示
    //const subModuleHiddenRouters = import.meta.glob('@/modules/**/hiddenRouter.js')
    //console.log('dynamicImportHiddenRouter',subModuleHiddenRouters)
    //await dynamicImportHiddenRouter(asyncRouter,subModuleHiddenRouters)

    //载入各个模块中的初始化脚本,进行初始化
    const initSubModule = import.meta.globEager('@/modules/*/init.js',{ eager: true })
    //把载入的页面打印出来用于调试
    printInitScript(initSubModule)
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/layout/404'
    })
    
    //通过动态加载,填充路由中的component字段将它指向vue组件
    asyncRouterHandle(baseRouter)
    //将路由添加到keepAliveRoutersArr数组中
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    keepAliveRouters.value = keepAliveRoutersArr
    return true
  }
  
  //填充本地路由到路由表中,用于建立loc模式
  const SetDebugRouter = (asyncRouter) => {
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    asyncRouter && asyncRouter.push({
      path: '404',
      name: '404',
      hidden: true,
      meta: {
        title: '迷路了*。*',
        closeTab: true,
      },
      component: 'view/error/index.vue'
    }, {
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: '',
        closeTab: true,
      },
      component: 'view/error/reload.vue',
    })
   
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/layout/404'
    })
    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    keepAliveRouters.value = keepAliveRoutersArr
    return true
  }

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    SetAsyncRouter,
    SetDebugRouter,
    routeMap
  }
})


//封装了一个可以存储用户信息的对象
export const useUserStore = defineStore('user', () => {
  const loadingInstance = ref(null)
  //存储用户信息
  const userInfo = ref({
    uuid: '',
    nickName: '',
    headerImg: '', 
    authority: {},
    sideMode: 'light',
    activeColor: '#4D70FF',
    baseColor: '#fff',
    buttonClass: '',
    cardClass: '',
    historyTabsClass: '',
    background: '',
    marginTop: '',
    inputClass: ''
  })
  const token = ref(window.localStorage.getItem('token') || '')
  const setUserInfo = (val) => {
    userInfo.value = val
  }

  const setToken = (val) => {
    token.value = val
  }

  const NeedInit = () => {
    token.value = ''
    window.localStorage.removeItem('token')
    localStorage.clear()
    router.push({ name: 'Init', replace: true })
  }

  const ResetUserInfo = (value = {}) => {
    userInfo.value = {
      ...userInfo.value,
      ...value
    }
  }
  /* 获取用户信息*/
  const GetUserInfo = async() => {
    let res = await getUserInfo()
    if(typeof(res) === "undefined" || typeof(res.data) === "undefined") {
      console.log("GetUserInfo error")
      return null
    }
    res = res.data
    if (res.code === 0) {
      setUserInfo(res.data.userInfo)
      return res
    } 
    if(res.code === 7) {
      console.log("token is timeout or else error!redirect to login");
      //退出并清空本地存储
      token.value = ''
      sessionStorage.clear()
      localStorage.clear()
      router.push({ name: 'Login', replace: true })
      window.location.reload()
      return res
    }
    return res
  }
  /* 登录*/
  const LoginIn = async(loginInfo) => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '登陆中，请稍候...',
    })
    try {
      //进行用户登陆
      const res = await login(loginInfo)
      if (res.code === 0) {
        setUserInfo(res.data.user)
        setToken(res.data.token)
        
        //拉取路由信息
        const routerStore = useRouterStore()
        await routerStore.SetAsyncRouter()
        const asyncRouters = routerStore.asyncRouters
        asyncRouters.forEach(asyncRouter => {
          router.addRoute(asyncRouter)
        })
        router.push({ name: userInfo.value.authority.defaultRouter })        
        return true
      }
    } catch (e) {
      loadingInstance.value.close()
    }
    loadingInstance.value.close()
  }
  /* 登出*/
  const LoginOut = async() => {
    const res = await jsonInBlacklist()
    if (res.code === 0) {
      token.value = ''
      sessionStorage.clear()
      localStorage.clear()
      router.push({ name: 'Login', replace: true })
      window.location.reload()
    }
  }
  /* 设置侧边栏模式*/
  const changeSideMode = async(data) => {
    const res = await setSelfInfo({ sideMode: data })
    if (res.code === 0) {
      userInfo.value.sideMode = data
      ElMessage({
        type: 'success',
        message: '设置成功'
      })
    }
  }
 
  const mode = computed(() => userInfo.value.sideMode)
  const sideMode = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#191a23'
    } else if (userInfo.value.sideMode === 'light') {
      return '#fff'
    } else if(userInfo.value.sideMode === 'lightGreen'){
      return '#16ad7a'
    } else if(userInfo.value.sideMode === 'green'){
      return '#5bce88'
    } else {
      return userInfo.value.sideMode
    }
  })
  const baseColor = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#fff'
    } else if (userInfo.value.sideMode === 'light' || userInfo.value.sideMode === 'lightGreen') {
      return '#191a23'
    } else {
      return userInfo.value.baseColor
    }
  })
  const activeColor = computed(() => {
    if (userInfo.value.sideMode === 'dark' || userInfo.value.sideMode === 'light') {
      return '#4D70FF'
    }
    return userInfo.value.activeColor
  })

  watch(() => token.value, () => {
    window.localStorage.setItem('token', token.value)
  })

  return {
    userInfo,
    token,
    NeedInit,
    ResetUserInfo,
    GetUserInfo,
    LoginIn,
    LoginOut,
    changeSideMode,
    mode,
    sideMode,
    setToken,
    baseColor,
    activeColor,
    loadingInstance
  }
})

