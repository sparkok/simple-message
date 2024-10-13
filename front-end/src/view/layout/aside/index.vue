<template>
  <div>
    <el-scrollbar style="height: calc(100vh - 60px);">
      <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
        <el-menu :style="{'overflow': 'auto'}" :collapse="isCollapse" :collapse-transition="false" :default-active="active"
          :active-text-color="theme.active" class="el-menu-vertical" unique-opened
          @select="selectMenuItem">
          <template v-for="item in routerStore.asyncRouters[0].children">
            <aside-component v-if="!item.hidden" :key="item.name" :is-collapse="isCollapse" :router-info="item"
              :theme="theme" />
          </template>
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'Aside',
}
</script>

<script setup>
import AsideComponent from '@/view/layout/aside/asideComponent/index.vue'
import { emitter } from '@/utils/bus.js'
import { ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRouterStore, useUserStore } from '@/pinia'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const routerStore = useRouterStore()

const theme = ref({})

const getTheme = () => {
  // switch (userStore.sideMode) {
  //   case '#fff':
  //     theme.value = {
  //       background: '#fff',
  //       activeBackground: '#4D70FF',
  //       activeText: '#fff',
  //       normalText: '#333',
  //       hoverBackground: 'rgba(64, 158, 255, 0.08)',
  //       hoverText: '#333',
  //     }
  //     break
  //   case '#191a23':
  //     theme.value = {
  //       background: '#191a23',
  //       activeBackground: '#4D70FF',
  //       activeText: '#fff',
  //       normalText: '#fff',
  //       hoverBackground: 'rgba(64, 158, 255, 0.08)',
  //       hoverText: '#fff',
  //     }
  //     break
  //   case '#16ad7a':
  //     theme.value = {
  //       background: '#fff',
  //       activeText: '#16ad7a',
  //       normalText: '#333',
  //       hoverBackground: 'rgba(64, 158, 255, 0.08)',
  //       hoverText: '#333',
  //       rightColor: '#f1f9f8'
  //     }
  //     break
  //   case '#2dce89':
  //     theme.value = {
  //       background: '#fff',
  //       activeText: '#2dce89',
  //       normalText: '#333',
  //       hoverBackground: 'rgba(64, 158, 255, 0.08)',
  //       hoverText: '#333',
  //       rightColor: '#2dce89'
  //     }
  // }
  // theme.value = {
  //       background: '#fff',
  //       // activeText: '#2dce89',
  //       activeText: '#057edb',
  //       normalText: '#333',
  //       // hoverBackground: 'rgba(64, 158, 255, 0.08)',
  //       hoverBackground: 'rgba(100, 188, 255, 0.08)',
  //       hoverText: '#333',
  //       rightColor: '#2dce89'
  //     }
  theme.value = {
    background: '#0067a8',
    // activeBackground: 'rgba(255,255,255,0.7)',
    activeBackground: '#1890ff',
    // activeText: '#0166b6',
    activeText: '#fff',
    normalText: '#fff',
    hoverBackground: 'rgba(255,255,255,0.9)',
    hoverText: '#0166b6',
  }
}

getTheme()

const active = ref('')
watch(() => route, () => {
  active.value = route.name
}, { deep: true })

watch(() => userStore.sideMode, () => {
  getTheme()
})

const isCollapse = ref(false)
const initPage = () => {
  active.value = route.name
  const screenWidth = document.body.clientWidth
  if (screenWidth < 1000) {
    isCollapse.value = !isCollapse.value
  }

  emitter.on('collapse', (item) => {
    isCollapse.value = item
  })
}

initPage()

onUnmounted(() => {
  emitter.off('collapse')
})

const selectMenuItem = (index, _, item, aaa) => {
  const query = {}
  const params = {}
  routerStore.routeMap[index]?.parameters &&
    routerStore.routeMap[index]?.parameters.forEach((item) => {
      if (item.type === 'query') {
        query[item.key] = item.value
      } else {
        params[item.key] = item.value
      }
    })
  if (index === route.name) return
  if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
    window.open(index)
  } else {
    router.push({ name: index, query, params })
  }

}
</script>

<style lang="scss">
.el-sub-menu__title:hover,
.el-menu-item:hover {
  background: transparent;
}

.el-sub-menu .el-menu--inline {
  background: #255d94;
}

.el-scrollbar {
  .el-scrollbar__view {
    height: 100%;
  }
}

.menu-info {
  .menu-contorl {
    line-height: 52px;
    font-size: 20px;
    display: table-cell;
    vertical-align: middle;
  }
}

// 隐藏菜单栏的滚动条
::-webkit-scrollbar{display:none}

</style>
