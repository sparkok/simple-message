<template>
    <div class="container">
        <el-card v-if="isSearchShow" :style="{'margin-bottom': '20px'}">
            <template #header>
                <div class="cardHeader isHidden" @click="clickHeader">
                    <span>查询条件</span>
                    <el-tag 
                        v-if="showTag"
                        :style="{'margin-left': '10px'}" 
                        closable 
                        type="warning"
                        @close="closeTag"
                    >注：点击可{{isHidden ? '收起' : '展开'}}查询条件</el-tag>
                </div>
            </template>
            <div class="hiddenCard" v-if="isHidden">
                <div class="searchCondition">
                    <slot name="searchScope"></slot>
                </div>
                <div class="searchBtn">
                    <my-button type="primary" @click="search">查询</my-button>
                    <my-button @click="onempty">清空</my-button>
                </div>
            </div>
        </el-card>

        <my-card title="数据列表">
            <template #btnScope>
                <slot name="btnScope"></slot>
            </template>
            <div class="dataList">
                <slot></slot>
            </div>
        </my-card>
    </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
    isSearchShow: {
        type: Boolean,
        default: true
    }
})
const isHidden = ref(false);
const showTag = ref(true);
const clickHeader = () => {
    isHidden.value = !isHidden.value;
}

const emit = defineEmits(['search', 'empty']);
const search = () => {
    emit('search');
}
const onempty = () => {
    emit('empty');
}
const closeTag = () => {
    showTag.value = false;
}
</script>

<style scoped lang="scss">
.container {
    .cardHeader {
        cursor: pointer;
    }
    .searchCondition {
        height: auto;
        margin-top: 10px;
    }

    .searchBtn {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dataList {
        margin-top: 10px;
        height: auto;
    }
}
</style>