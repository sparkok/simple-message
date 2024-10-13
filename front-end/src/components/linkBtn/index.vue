<template>
    <el-button 
        size="small"
        @click="btnClick" 
        :class="type == 'danger' ? 'linkBtn delete' : 'linkBtn'" :icon="icon">
        <slot></slot>
    </el-button>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['click']);
const btnClick = () => {
    emit('click');
}
</script>

<style scoped lang="scss">
.linkBtn {
    border: none;
    color: #0166b6;
}
.delete {
    color: #e2728b;
}
</style>