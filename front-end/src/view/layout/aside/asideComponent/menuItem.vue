<template>
  <div>
    <el-menu-item v-if="isCollapse" :index="routerInfo.name"
      :class="{ 'theme-3': theme.rightColor, 'el-menu-item-theme-3': theme.rightColor }"
      :style="{ 'line-height': '14px', 'margin-bottom': '25px' }">
      <el-tooltip class="box-item" effect="light" :content="routerInfo.meta.title" placement="right">
        <div class="collapse-menu-item" :style="{ 'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center'}">
          <el-icon v-if="routerInfo.meta.icon" :style="{'margin-right': '0px'}">
            <component :is="routerInfo.meta.icon" />
          </el-icon>
          <div :style="{ 'width': '30px', 'white-space': 'pre-wrap', 'font-size': '8px', 'margin-top': '5px', 'text-align': 'center' }">
            {{ routerInfo.meta.title }}
          </div>
        </div>
      </el-tooltip>
    </el-menu-item>
    <el-menu-item v-else :index="routerInfo.name"
      :class="{ 'theme-3': theme.rightColor, 'el-menu-item-theme-3': theme.rightColor }">
      <div class="gva-menu-item">
        <el-icon v-if="routerInfo.meta.icon">
          <component :is="routerInfo.meta.icon" />
        </el-icon>
        <span class="gva-menu-item-title">{{ routerInfo.meta.title }}</span>
      </div>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
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
  },
})

const background = ref(props.theme.background)
const activeBackground = ref(props.theme.activeBackground)
const activeText = ref(props.theme.activeText)
const normalText = ref(props.theme.normalText)
const hoverBackground = ref(props.theme.hoverBackground)
const hoverText = ref(props.theme.hoverText)
const rightColor = ref(props.theme.rightColor)

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
.gva-menu-item {
  flex: 1;
  height: 44px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .gva-menu-item-title {
    flex: 1;
    font-weight: 600;
  }
}

.rightColor {
  background-color: v-bind(rightColor);
  height: 100%;
  width: 50px
}

.el-menu--collapse {
  .el-menu-item.is-active {
    color: v-bind(activeBackground);
  }
}

.el-menu-item {
  color: v-bind(normalText);
  line-height: none;
}

.theme-3 {
  padding: 0px;
  font-weight: 600 !important;
}

.el-menu-item.is-active {
  background: v-bind(activeBackground);
  color: v-bind(activeText);
  .collapse-menu-item {
    background: v-bind(activeBackground) !important;
    color: v-bind(activeText);
  }

  .gva-menu-item {
    i {
      color: v-bind(activeText);
    }

    span {
      color: v-bind(activeText);
    }
  }
}

.el-menu-item-theme-3.is-active::after {
  // content: '';
  // width: 23px;
  // height: 80%;
  // background-color: #f1f9f8;
  // border-radius: 100% 0 0 100% / 50%;
}

.el-menu-item:hover {
  background: v-bind(activeBackground);
  color: v-bind(activeText);
  .collapse-menu-item {
    background: v-bind(activeBackground) !important;
    color: v-bind(activeText);
  }
}
</style>
