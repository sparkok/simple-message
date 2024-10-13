<template>
    <el-card>
        <template #header>
            <div class="cardHeader">
                <span>{{title}}</span>
                <div>
                    <slot name="btnScope"></slot>
                </div>
            </div>
        </template>
        <slot></slot>
    </el-card>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '数据列表',
    }
})
</script>

<style scoped lang="scss">
.cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>