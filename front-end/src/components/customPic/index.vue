<template>
  <div class="avatar_div">
    <img :src="src" class="img">
    <div class="div" @click="changeAvatar">修改</div>

    <my-dialog title="修改头像" width="500px" :visible="dialog" @submit="confirmSelectImg" @cancel="cancel">
      <div class="img-list">
        <img :src="src" v-for="src, index in imgSrcList" :key="index" :class="index == imgIndex ? 'changedImg' : ''"
          @click="selectImg(index)" />
      </div>
    </my-dialog>
  </div>
</template>

<script>
export default {
  name: 'CustomPic',
}
</script>

<script setup>
import { computed, ref, watch } from 'vue';
import avatar11 from '@/assets/avatar/avatar-11.png'
import avatar16 from '@/assets/avatar/avatar-16.png'
import avatar12 from '@/assets/avatar/avatar-12.png'
import avatar13 from '@/assets/avatar/avatar-13.png'
import avatar14 from '@/assets/avatar/avatar-14.png'
import avatar15 from '@/assets/avatar/avatar-15.png'
import avatar17 from '@/assets/avatar/avatar-17.png'
import avatar18 from '@/assets/avatar/avatar-18.png'
import avatar19 from '@/assets/avatar/avatar-19.png'
import { ElMessage } from 'element-plus';
const src = ref('')
const dialog = ref(false)
const imgSrcList = ref([
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
])
const imgIndex = ref(-1)

const selectImg = (index) => {
  imgIndex.value = index
}

watch(() => src.value, () => {
  if (window.sessionStorage.getItem('avatar_img')) {
    src.value = window.sessionStorage.getItem('avatar_img')
  } else {
    src.value = imgSrcList.value[0]
  }
}, { immediate: true })



const changeAvatar = () => {
  dialog.value = true
}

const cancel = () => {
  dialog.value = false
  imgIndex.value = -1
}

const confirmSelectImg = () => {
  ElMessage({
    type: 'success',
    message: '修改成功'
  })
  src.value = imgSrcList.value[imgIndex.value]
  window.sessionStorage.setItem('avatar_img', src.value)
  dialog.value = false
}
</script>

<style scoped lang="scss">
.avatar_div {
  width: 60px;
  height: 60px;
  position: relative;
  overflow: auto;
  display: flex;
  align-items: center;

  .div {
    width: 46px;
    height: 46px;
    background: rgb(90, 90, 90);
    border-radius: 50%;
    margin-top: 7px;
    position: absolute;
    transition: z-index .15s ease;
    top: 0;
    font-size: 4px !important;
    line-height: 46px;
    text-align: center;
    opacity: 0.8;
    color: #fff;
    cursor: pointer;
    z-index: -1;
  }

  &::-webkit-scrollbar {
    display: none
  }

  &:hover {
    .div {
      z-index: 2;
    }
  }
}

.img {
  width: 46px;
  height: 46px;
  border: none !important;
}

.img-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  img {
    width: 100px;
    height: 100px;
    border: none;
    cursor: pointer;

    &:hover {
      border-radius: 50%;
      box-shadow:0 0 10px 1px #1f72a6;
    }
  }
}

.changedImg {
  border: #333 1px solid !important;
}
</style>
