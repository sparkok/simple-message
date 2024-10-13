// 下拉框必选项验证
export const valiRequired = (rule, value, callback, arr) => {
    if (arr.length < 1) {
        callback(new Error(rule.message));
    } else {
        callback()
    }
}