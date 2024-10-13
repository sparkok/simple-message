<template>
  <el-select
    style="width: 100%"
    :multiple="multiable"
    :clearable="clearable"
    class="filter-item"
    v-bind:style="styleObject"
    @input="onInput"
    @change="onChange"
    :value="selectField"
    placeholder="请选择"
    filterable
  >
    <el-option
      v-for="item in list"
      :key="model.getKey(item)"
      :label="model.getDesc(item)"
      :value="model.getKey(item)"
    />
  </el-select>
</template>  
<script>
export default {
  name: 'SelectOneContainer',
  data() {
    return {
      keywords: '',
      listLoading: false,
      list: []
    }
  },
  created() {
    this.onList()
  },
  props: {
    // 查询函数名称
    queryMethod: {
      type: String,
      default: 'listObj'
    },
    styleObject: {
      width: '130px'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiable: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default: function() {
        return { pageNum: 0, numPerPage: 3000 }
      }
    },
    value: {
      default: null
    },
    model: {
      type: Object,
      default: null
    }
  },
  computed: {
    selectField() {
      return this.value
    }
  },
  methods: {
    onInput(val) {
      if (val === null) {
        val = ''
      }
      this.$emit('input', val)
    },
    onChange(val) {
      if (val === null) {
        val = ''
      }
      this.$emit('change', val)
    },
    async onList() {
      // 异步方式获取数据列表
      this.listLoading = true
      const that = this
      const res = await this.model[this.queryMethod](this.queryParams)

      if (res.code === 0) {
          that.list = res.list
          that.listLoading = false
          that.total = res.list.length
      }
    }
  }
}
</script>    