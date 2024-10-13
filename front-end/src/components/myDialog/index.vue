<template>
    <el-dialog 
        v-model="dialogVisible" 
        :width="width" 
        :show-close="false"
        :before-close="closeDialog"
    >
        <template #title>
            <div class="dialogHeader">
                <span>{{title}}</span>
                <el-icon v-if="showClose" class="dialogIcon" @click="cancel"><Close /></el-icon>
            </div>
        </template>
        <slot></slot>
        <template #footer>
            <div class="dialogBtn" v-if="showBtn">
                <my-button type="primary" @click="submit" :loading="btnLoading">确定</my-button>
                <my-button @click="cancel" :loading="btnLoading">取消</my-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const dialogVisible = ref(false);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '编辑'
    },
    width: {
        type: String,
        default: '50%'
    },
    showBtn: {
        type: Boolean,
        default: true
    },
    showClose: {
        type: Boolean,
        default: true,
    },
    btnLoading: {
        type: Boolean,
        default: false,
    }
})
watch(() => props.visible, (newValue) => {
    dialogVisible.value = newValue;
},{immediate: true})

const emit = defineEmits(['submit', 'cancel', 'before-close']);
const submit = () => {
    emit('submit');
}
const cancel = () => {
    emit('update:visible', false)
    emit('cancel');
}
const closeDialog = () => {
    emit('before-close');
}

</script>

<style scoped lang="scss">
.dialogBtn {
    width: 100%;
    display: flex;
    justify-content: center;
}
.dialogHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #555;
    font-size: 18px;
    .dialogIcon {
        cursor: pointer;
    }
    .dialogIcon:hover {
        color: #0166b6;
    }
}
</style>