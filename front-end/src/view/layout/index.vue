<template>
  <el-container class="layout-cont">
    <el-container :class="[isSider?'openside':'hideside',isMobile ? 'mobile': '']">
      <el-row :class="[isShadowBg?'shadowBg':'']" @click="changeShadow()" />
      <el-aside class="main-cont main-left">
        <div class="tilte" :style="{background: '#0067a8'}">
          <div v-if='isSider' class="bigLogoBox">
            <img alt class="logoimg" src="../../assets/newLogo.png">
            <span class="logoname">管理后台</span>
          </div>
          <img alt class="mini-logoimg" src="../../assets/newLogo.png" v-else>
          <div v-if="isSider" class="tit-text" :style="{color:textColor}">{{ $GIN_VUE_ADMIN.appName }}</div>
        </div>
        <Aside :class="asideStyle"/>
      </el-aside>
      <!-- 分块滑动功能 -->
      <el-main class="main-cont main-right">
        <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
          <div :style="{width: `calc(100% - ${isMobile ? '0px' : isCollapse ? '54px' : '220px'})`}" class="topfix">
            <el-row class="header-cont" :style="{backgroundColor: bgc}">
              <el-col :span="10">
                <div class="menu-left">
                  <div class="menu-total" @click="totalCollapse">
                    <el-icon v-if="isCollapse">
                      <Expand />
                    </el-icon>
                    <el-icon v-else>
                      <Fold />
                    </el-icon>
                    <!-- <img src="../../assets/open_navigation.png" style='width: 20px; height: 20px' v-if="isCollapse" />
                    <img src="../../assets/close_navigation.png" style='width: 20px; height: 20px' v-else /> -->
                  </div>
                  <el-breadcrumb class="breadcrumb">
                    <el-breadcrumb-item v-for="item in matched.slice(1,matched.length)" :key="item.path">
                      <div style="color: #555; font-size: 18px">{{ route.params.title || item.meta.title }}</div>
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="right-box">
                  <!-- <div class="date-style">
                    <div>{{ resDate }}</div>
                    <div>{{ '星期' + week[weekDay] }}</div>
                  </div> -->
                  <screen-full @onToggle="onToggle"></screen-full>
                  <div class="avatar">
                    <div>
                      <CustomPic :picSrc='avatarSrc' />
                    </div>
                    <div style="font-weight: 500; font-size: 18px;">
                      {{ userStore.userInfo.nickName }}
                    </div>
                  </div>
                  <el-dropdown>
                    <div class="dropdownDiv">
                      <!-- <el-icon class="dropdownIcon">
                        <CopyDocument />
                      </el-icon> -->
                      <el-icon class="dropdownIcon">
                        <CaretBottom />
                      </el-icon>
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu class="dropdown-group">
                        <el-dropdown-item>
                          <span style="font-weight: 600;">
                            当前角色：{{ userStore.userInfo.authority.authorityName }}
                          </span>
                        </el-dropdown-item>
                        <template v-if="userStore.userInfo.authorities">
                          <el-dropdown-item
                            v-for="item in userStore.userInfo.authorities.filter(i=>i.authorityId!==userStore.userInfo.authorityId)"
                            :key="item.authorityId" @click="changeUserAuth(item.authorityId)">
                            <span>
                              切换为：{{ item.authorityName }}
                            </span>
                          </el-dropdown-item>
                        </template>
                        <!-- <el-dropdown-item icon="avatar" @click="toPerson">个人信息</el-dropdown-item> -->
                        <!-- <el-dropdown-item icon="reading-lamp" @click="userStore.LoginOut">退出当前账号</el-dropdown-item> -->
                        <el-dropdown-item icon="reading-lamp" @click="LoginOut">退出当前账号</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </el-col>
            </el-row>
            <HistoryComponent ref="layoutHistoryComponent" />
          </div>
        </transition>
        <router-view v-if="reloadFlag" v-slot="{ Component }" v-loading="loadingFlag" element-loading-text="正在加载中"
          class="admin-box">
          <div class="marginTop">
            <transition mode="out-in" name="el-fade-in-linear">
              <keep-alive :include="routerStore.keepAliveRouters">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </div>
          <BottomInfo />
        </router-view>
        <!-- <setting /> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<script setup>
import Aside from '@/view/layout/aside/index.vue'
import HistoryComponent from '@/view/layout/aside/historyComponent/history.vue'
import Search from '@/view/layout/search/search.vue'
import BottomInfo from '@/view/layout/bottomInfo/bottomInfo.vue'
import CustomPic from '@/components/customPic/index.vue'
import Setting from './setting/index.vue'
import { setUserAuthority } from '@/modules/role/actions/user'
import { emitter } from '@/utils/bus.js'
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRouterStore, useUserStore } from '@/pinia'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const routerStore = useRouterStore()
// 三种窗口适配
const isCollapse = ref(false)
const isSider = ref(true)
const isMobile = ref(false)

const avatarSrc = ref('avatar_man')
const screenFullDom = ref(null);

// 退出登录
const LoginOut = () => {
  let _token = window.localStorage.getItem('token');
  if ( _token ) {
    window.localStorage.setItem('token','');
    window.location.reload();
  }
};

const onToggle = (screenfull) => {
  screenFullDom.value = document.getElementsByClassName('admin-box');
  screenfull.toggle(screenFullDom.value[0]);
}


const _theme = ref(JSON.parse(localStorage.getItem('theme')));
console.log(_theme,"本地存储")

const initPage = () => {
  const screenWidth = document.body.clientWidth
  if (screenWidth < 1000) {
    isMobile.value = true
    isSider.value = false
    isCollapse.value = true
  } else if (screenWidth >= 1000 && screenWidth < 1200) {
    isMobile.value = false
    isSider.value = false
    isCollapse.value = true
  } else {
    isMobile.value = false
    isSider.value = true
    isCollapse.value = false
  }
}

initPage()

const loadingFlag = ref(false)
onMounted(() => {
  // 挂载一些通用的事件
  emitter.emit('collapse', isCollapse.value)
  emitter.emit('mobile', isMobile.value)
  emitter.on('reload', reload)
  emitter.on('showLoading', () => {
    loadingFlag.value = true
  })
  emitter.on('closeLoading', () => {
    loadingFlag.value = false
  })
  window.onresize = () => {
    return (() => {
      initPage()
      emitter.emit('collapse', isCollapse.value)
      emitter.emit('mobile', isMobile.value)
    })()
  }
  if (userStore.loadingInstance) {
    userStore.loadingInstance.close()
  }
})


const textColor = computed(() => {
  return '#191a23'
})

const backgroundColor = computed(() => {
  // if (userStore.sideMode === '#16ad7a' || userStore.sideMode === '#2dce89') {
  //   return '#fff'
  // } else {
  //   return userStore.sideMode
  // }
  return '#fff'
})

const asideStyle = computed(() => {
  // if(userStore.userInfo.sideMode === 'fresh') {
  //   return 'aside-2'
  // } else {
  //   return 'aside-1'
  // }
  return 'aside-2'
})
const matched = computed(() => {
  // return route.meta.matched
  return route.meta.matched || []
})

const changeUserAuth = async (id) => {
  const res = await setUserAuthority({
    authorityId: id
  })
  if (res.code === 0) {
    emitter.emit('closeAllPage')
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }
}

const reloadFlag = ref(true)
let reloadTimer = null
const reload = async () => {
  if (reloadTimer) {
    window.clearTimeout(reloadTimer)
  }
  reloadTimer = window.setTimeout(async () => {
    if (route.meta.keepAlive) {
      reloadFlag.value = false
      await nextTick()
      reloadFlag.value = true
    } else {
      const title = route.meta.title
      router.push({ name: 'Reload', params: { title } })
    }
  }, 400)
}

const isShadowBg = ref(false)
const totalCollapse = () => {
  isCollapse.value = !isCollapse.value
  isSider.value = !isCollapse.value
  isShadowBg.value = !isCollapse.value
  emitter.emit('collapse', isCollapse.value)
}

const toPerson = () => {
  router.push({ name: 'person' })
}
const changeShadow = () => {
  isShadowBg.value = !isShadowBg.value
  isSider.value = !!isCollapse.value
  totalCollapse()
}

const bgc = computed(() => {
  // if(userStore.userInfo.sideMode == 'lightGreen') {
  //   return '#f1f9f8'
  // } else if(userStore.userInfo.sideMode == 'green') {
  //   return '#2dce89'
  // } else {
  //   return '#f0f2f5'
  // }
  // return '#2dce89'
  return '#fff'
})

const bodyBgc = computed(() => {
  // if(userStore.userInfo.sideMode == 'lightGreen') {
  //   return '#f1f9f8'
  // } else if(userStore.userInfo.sideMode == 'green') {
  //   return '#f1f4fa'
  // } else {
  //   return '#f0f2f5'
  // }
  return '#f1f4fa'
})


const d = ref('')
const weekDay = ref(1)
const week = ref(['日', '一', '二', '三', '四', '五', '六'])
const p = (s) => {
  return s < 10 ? '0' + s : s
}
const resDate = ref('')

const computeDate = () => {
  d.value = new Date()
  resDate.value = d.value.getFullYear() + '年' + p((d.value.getMonth() + 1)) + '月' + p(d.value.getDate()) + '日—';
  let y = d.value.getFullYear() % 100
  let c = Math.floor(d.value.getFullYear() / 100)
  let m = d.value.getMonth() + 1
  let dd = d.value.getDate()
  weekDay.value = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor((26 * (m + 1)) / 10) + dd - 1) % 7
}
computeDate()
//定时重新计算一下日期
setInterval(() => {
  computeDate()
}, 600000)



</script>

<style lang="scss">
@import '@/style/mobile.scss';

.dark {
  background-color: #191a23 !important;
  color: #fff !important;
}

.light {
  background-color: #fff !important;
  color: #000 !important;
}

.dropdownDiv {
  cursor: pointer;
  width: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.date-style {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 20px;

  div {
    font-size: 16px !important;
    // font-family: 'scribble';
  }
}

.avatar {
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-box {
  background-color: #f1f2f5;
}
</style>
