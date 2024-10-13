<template>
    <el-radio-group v-model="topicColor" class="topicStyle" @change="changeTopic">
      <el-radio label="1" size="large">蓝色</el-radio>
      <el-radio label="2" size="large">绿色</el-radio>
    </el-radio-group>
</template>

<script setup>
import { ref, onBeforeMount } from "vue"; 
const topicColor = ref('1');
const topics = ref({
    '1': {
        asideBackgroung: '#0067a8',
        asideChildBackground: '#255d94',
        asideHoverBackground: '#1890ff',
        asideHoverColor: '#ffffff',
        asideColor: '#ffffff',
        asideActive: '#ffffff',
        btnBackground: '#0166b6',
        btnColor: '#ffffff',
        topTabsBackground: '#f5f8fc',
        topTabsColor: '#333333',
        topTabsHoverBackground: '#e9f0fd',
        topTabsHoverColor: '#0166b6',
        contentColor: '#333333',
        tableTitleBackground: '#f5f8fc',
    },
    '2': {
        asideBackgroung: 'red',
        asideChildBackground: 'red',
        asideHoverBackground: 'red',
        asideHoverColor: 'red',
        asideColor: 'red',
        asideActive: 'red',
        btnBackground: 'red',
        btnColor: 'red',
        topTabsBackground: 'red',
        topTabsColor: 'red',
        topTabsHoverBackground: 'red',
        topTabsHoverColor: 'red',
        contentColor: 'red',
        tableTitleBackground: 'red',
    }
});
onBeforeMount(() => {
    topicColor.value = localStorage.getItem('themeType') ? localStorage.getItem('themeType') : '1';
})
const changeTopic = () => {
    let _theme = topics.value[topicColor.value];
    localStorage.setItem('theme', JSON.stringify(_theme));
    localStorage.setItem('themeType', JSON.stringify(topicColor.value));
    location.reload()
}
</script>

<style scoped>
.topicStyle {
    margin: 0 10px;
}
</style>