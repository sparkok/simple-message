<template>
    <div class="screenFull">
        <div class="gvaIcon gvaIcon-fullscreen-expand" @click="onToggle" v-if="!isFullScreen"></div>
        <div class="gvaIcon gvaIcon-fullscreen-shrink" @click="onToggle" v-else></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import screenfull from 'screenfull';

const emit = defineEmits(['onToggle']);

const isFullScreen = ref(false);

const change = () => {
    isFullScreen.value = screenfull.isFullscreen;
}

const onToggle = () => {
    emit('onToggle', screenfull);
}

onMounted(() => {
    screenfull.on('change', change);
})

onUnmounted(() => {
    screenfull.off('change', change);
})
</script>

<style scoped>
.screenFull {
    width: 30px;
}
</style>