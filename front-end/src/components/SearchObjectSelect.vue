<template>
  <!-- <el-form-item :label="fieldLabel"> -->
    <!-- <el-select :multiple="multiable" :clearable="clearable" class="filter-item" v-bind:style="styleObject" v-model="innerValue" filterable> -->
    <el-select :multiple="multiable" :clearable="clearable" class="filter-item" filterable>
      <el-option v-for="item in list" :key="getKey(item)" :label="getDesc(item)" :value="getKey(item)" />
    </el-select>
  <!-- </el-form-item> -->
</template>

<script>
export default {
  name: 'searchObjectSelect',
  data() {
    return {
      listLoading: false,
      innerValue: '',
      list: []
    }
  },
  methods: {
    onList() {
        this.listLoading = true;
        const that = this
        return new Promise((resolve, reject) => {        
          that.fetchDataFunc(response => {
            that.listLoading = false;
            that.list = response.list;
            that.total = response.list.length;
            resolve(response)
          });
      }).catch(error => {
        reject(error)
      })
    }
  },
  props: {
    fieldLabel: {
      type: String,
      default: ''
    },
    getKey: {
      type: Function,
      default: it => it.id
    },
    getDesc: {
      type: Function,
      default: it => it.name
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    styleObject: {
      width: '130px'
    },
    value: {
      default: ''
    },
    fetchDataFunc: {
      type: Function,
      required: true
    }
  },
  watch: {
    value(val) {
      this.innerValue = val
    },
    innerValue(val) {
      console.log('fire input',val)
      this.$emit('input', val)
    }
  },
  mounted() {
    this.innerValue = this.value;
    this.listLoading = true;
    const that = this
    this.fetchDataFunc(response => {
      //console.log('fetchDataFunc',response)
      that.listLoading = false;
      that.list = response.list;
      that.total = response.list.length;
    });
  }
}
</script>