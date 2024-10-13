<template>
    <el-button :type="type" :disabled="disabled" @click="btnClick" :loading="loading">
        <slot></slot>
    </el-button>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'default'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false,
    }
})
const emit = defineEmits(['click']);
const btnClick = () => {
    emit('click');
}
</script>
