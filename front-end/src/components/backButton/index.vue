<template>
    <div>
        <el-button @click="goBack" icon="back" class="common-button" style="margin-bottom: 10px">返回</el-button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const goBack = () => {
    router.go(-1)
}
</script>