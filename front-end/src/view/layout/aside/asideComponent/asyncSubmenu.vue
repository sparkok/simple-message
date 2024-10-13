<template>
  <el-sub-menu v-if="isCollapse" ref="subMenu" :style="{'margin': '25px 0'}" :index="routerInfo.name">
    <template #title>
      <div :style="{'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center'}">
        <el-icon v-if="routerInfo.meta.icon">
          <component :is="routerInfo.meta.icon" />
        </el-icon>
        <div :style="{'width': '30px','white-space': 'pre-wrap', 'font-size': '8px', 'line-height': '14px', 'margin-top': '5px', 'text-align': 'center'}">
          {{ routerInfo.meta.title }}
        </div>
      </div>
    </template>
    <slot />
  </el-sub-menu>
  <el-sub-menu v-else ref="subMenu" :index="routerInfo.name">
    <template #title>
      <el-icon v-if="routerInfo.meta.icon">
        <component :is="routerInfo.meta.icon" />
      </el-icon>
      <span style="font-weight: 600">{{ routerInfo.meta.title }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>

<script>
export default {
  name: 'AsyncSubmenu',
}
</script>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  routerInfo: {
    default: function () {
      return null
    },
    type: Object
  },
  isCollapse: {
    default: function () {
      return false
    },
    type: Boolean
  },
  theme: {
    default: function () {
      return {}
    },
    type: Object
  }
})

const background = ref(props.theme.background)
const activeBackground = ref(props.theme.activeBackground)
const activeText = ref(props.theme.activeText)
const normalText = ref(props.theme.normalText)
const hoverBackground = ref(props.theme.hoverBackground)
const hoverText = ref(props.theme.hoverText)

watch(() => props.theme, () => {
  background.value = props.theme.background
  activeBackground.value = props.theme.activeBackground
  activeText.value = props.theme.activeText
  normalText.value = props.theme.normalText
  hoverBackground.value = props.theme.hoverBackground
  hoverText.value = props.theme.hoverText
})

</script>

<style lang="scss" scoped>
.el-sub-menu {
  ::v-deep(.el-sub-menu__title) {
    color: v-bind(normalText);
  }
}
</style>
