export const _props = {
    // 表头
    columns: {
        type: Array,
        default: () => [],
    },
    // 数据
    data: {
        type: Array,
        default: () => [],
    },
    // 是否展示分页，默认不展示
    isPaginationShow: {
        type: Boolean,
        default: true,
    },
    // 是否展示多选框，默认不展示
    isSelectionShow: {
        type: Boolean,
        default: false,
    },
    // 表格中是否有操作栏，默认不展示
    isOperationShow: {
        type: Boolean,
        default: false,
    },
    // 展示分页时 需要传page、limit、total
    page: {
        type: Number,
        default: 1
    },
    limit: {
        type: Number,
        default: 10,
    },
    total: {
        type: Number,
        default: 0
    },
    // 表格是否加载
    loading: {
        type: Boolean,
        default: false,
    },
    // 表格高度
    height: {
        type: String,
        default: '500px',
    },
    // 表格中操作栏宽度
    operationWidth: {
        type: String,
        default: '400px',
    },
    isShowExpand: {
        type: Boolean,
        default: false
    }
}