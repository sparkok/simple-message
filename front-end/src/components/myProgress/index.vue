<template>
    <div class="progressBox">
        <div style="display: flex; justify-content: space-between;margin-bottom: 5px">
            <div>
                {{ Progress.percentage + '%'}}
            </div>
            <div>
                {{ Progress.current + " / " + total }}
            </div>
        </div>
        <el-progress :percentage="Progress.percentage" :show-text="false" :text-inside="false" :stroke-width="20">
        </el-progress>
        <!-- 失败原因 -->
        <div style="width: 100%; margin-top: 10px; display: flex; color: red" v-if="failReason">
            <div>失败原因：</div>
            <div v-html="failReason" style="width: 80%; max-height: 300px; overflow: auto"></div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from "vue";
const Progress = ref({
    status: false,
    success: 0,
    fail: 0,
    current: 0,
    percentage: 0,
    spanTime: "",
    key: "",
})
const failReason = ref('');
const startTime = ref(null);
const endTime = ref(null);

const total = computed(() => {
    return props.selectData ? props.selectData.length : 0;
})

const props = defineProps({
    selectData: {
        type: Array,
        default() {
            return [];
        }
    },
    submitFun: {
        type: Function,
        default() {
            return () => {
                return new Promise((res, rej) => {
                    res(true);
                })
            }
        }
    },
    progressType: {
        type: String,
        default: 'line',
    },
    // 特殊情况  批量创建网关之前需要验证外部ID  当外部ID不重复时返回null  外部ID重复时返回数据
    // special == '1'  批量创建网关做处理
    special: {
        type: String,
        default: '0'
    },
    id: {
        type: String,
        default: 'id'
    }
})
const emit = defineEmits(['ok']);

const init = () => {
    Progress.value.current = 0;
    Progress.value.percentage = 0;
    Progress.value.key = "";
    Progress.value.success = 0;
    Progress.value.fail = 0;
    failReason.value = "";
    startTime.value = null;
    endTime.value = null;
};
const initProgress = (callback) => {
    init();
    const time = window.setInterval(function () {
        if (props.selectData.length > 0) {
            window.clearInterval(time);
            submitList(0, ok, err, callback);
        }
    }, 200)
};
// 批量创建网关之前需要验证外部ID是否重复  如果重复返回重复的数据  不重复 res == null 和其他的页面返回数据不同 做特殊处理
const createGateWays = (res, i, t, callback) => {
    if (res !== null) {
        err({ message: `外部ID【${t.metadata.external_id}】重复` }, i, t);
        return submitList(i, ok, err, callback);
    } else {
        let _res = res == null ? { data: { data: true } } : res;
        if (typeof callback == 'function') {
            callback(t);
        }
        if (typeof ok == 'function') {
            ok(_res, i, t);
        }
        return submitList(i, ok, err, callback);
    }
}
// 删除网关之前需要验证该网关是否可以删除  res.data == []可以删除  反之不能删除
const deleteChannel = (res, i, t, callback) => {
    if (res.data.length) {
        err({ message: `外部ID为【${t.metadata.external_id}】的网关有通道正在使用，不能删除`}, i, t);
        return submitList(i, ok, err, callback);
    } else {
        let _res = { data: { data: true } };
        if (typeof callback == 'function') {
            callback(t);
        }
        if (typeof ok == 'function') {
            ok(_res, i, t);
        }
        return submitList(i, ok, err, callback);
    }
}

const submitList = (i, ok, err, callback) => {
    if (i == 0) {
        startTime.value = new Date();
    }
    const data = props.selectData;
    return new Promise((resolve, reject) => {
        const I = data.length;
        if (i >= I) {
            Progress.value.spanTime = getDateDiff(startTime.value, new Date());
            return resolve(true);
        }
        return resolve(false);
    }).then((res) => {
        if (!res) {
            let t = data[i];
            props.submitFun(t.metadata[props.id])
                .then(async (res) => {
                    i++;
                    if (props.special == '1') {
                        createGateWays(res, i, t, callback);
                    } else if (props.special == '2'){
                        deleteChannel(res, i, t, callback);
                    } else {
                        if (typeof callback == 'function') {
                            await callback(t);
                        }
                        if (typeof ok == 'function') {
                            ok(res, i, t);
                        }
                        return submitList(i, ok, err, callback);
                    }

                })
                .catch((e) => {
                    i++;
                    if (typeof err == 'function') {
                        err(e, i, t);
                    }
                    return submitList(i, ok, err, callback);
                })
        } else {
            emit('ok');
            return Promise.resolve(true);
        }
    })
};
const ok = (res, i, item) => {
    Progress.value.current = i;
    Progress.value.percentage = parseFloat(
        ((Progress.value.current * 100) / total.value).toFixed(2)
    );
    Progress.value.key = item.labCode || "";
    if (res.data.data) {
        Progress.value.success++
    } else {
        Progress.value.fail++;
    }
};
const err = (err, i, item) => {
    Progress.value.current = i;
    Progress.value.percentage = parseFloat(
        ((Progress.value.current * 100) / total.value).toFixed(2)
    );
    failReason.value += err.message + '</br>';
    Progress.value.key = item.labCode || '';
    Progress.value.fail++;
};

const getDateDiff = (startTime, endTime) => {
    let time_dis = endTime - startTime;
    let days = Math.floor(time_dis / (24 * 3600 * 3600));
    let leave1 = time_dis % (24 * 3600 * 1000);
    let hours = Math.floor(leave1 / (3600 * 1000));
    let leave2 = leave1 % (3600 * 1000);
    let minutes = Math.floor(leave2 / (60 * 1000));
    let leave3 = leave2 % (60 * 1000);
    let second = leave3 / 1000;
    let str = "";
    if (days > 0) {
        str += days + "天";
    }
    if (hours > 0) {
        str += hours + "小时";
    }
    if (minutes > 0) {
        str += minutes + "分";
    }
    if (second > 0) {
        str += second + "秒";
    }
    return str;
}
defineExpose({
    initProgress
})
</script>