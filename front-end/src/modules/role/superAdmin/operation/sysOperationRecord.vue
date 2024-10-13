<template>
  <my-container @search="onSubmit" @empty="onReset">
    <template #searchScope>
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="请求方法">
          <el-input v-model="searchInfo.method" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="请求路径">
          <el-input v-model="searchInfo.path" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="结果状态码">
          <el-input v-model="searchInfo.status" placeholder="搜索条件" />
        </el-form-item>
      </el-form>
    </template>

    <template #btnScope>
      <el-popover v-model:visible="deleteVisible" placement="top" width="160">
        <p>确定要删除吗？</p>
        <div style="text-align: right; margin-top: 8px;">
          <my-button size="small" @click="deleteVisible = false">取消</my-button>
          <my-button size="small" @click="onDelete" class="confirm-button new-button">确定</my-button>
        </div>
        <template #reference>
          <my-button type="primary" :disabled="!multipleSelection.length" @click="deleteVisible = true">删除</my-button>
        </template>
      </el-popover>
      <my-button @click="onSubmit" :disabled="tableLoading">刷新</my-button>
    </template>

    <my-table 
      operationWidth="200px"
      ref="myTableRef" 
      :columns="columns" 
      :data="tableData" 
      :isSelectionShow="true" 
      :isOperationShow="true"
      :isPaginationShow="true" 
      :page="page" 
      :limit="pageSize" 
      :total="total" 
      :loading="tableLoading"
      @current-change="handleCurrentChange" 
      @size-change="handleSizeChange"
      @selection-change="handleSelectionChange">
      <template #opeartionScope="scope">
        <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
          <p>确定要删除吗？</p>
          <div style="text-align: right; margin-top: 8px;">
            <el-button size="small" @click="deleteSysOperationRecordFunc(scope.row)" class="confirm-button new-button">
              确定</el-button>
            <el-button size="small" @click="scope.row.visible = false">取消</el-button>
          </div>
          <template #reference>
            <link-btn @click="scope.row.visible = true" type="danger">删除</link-btn>
          </template>
        </el-popover>
      </template>
    </my-table>
  </my-container>
</template>

<script setup>
import { columns } from "./option";
import {
  deleteSysOperationRecord,
  getSysOperationRecordList,
  deleteSysOperationRecordByIds
} from '@/modules/role/actions/sysOperationRecord' // 此处请自行替换地址
import { formatDate } from '@/utils/format'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouterStore, useUserStore } from '@/pinia'
const userStore = useUserStore()

const tableLoading = ref(false);
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

// 条件搜索前端看此方法
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  if (searchInfo.value.status === '') {
    searchInfo.value.status = null
  }
  getTableData()
}

const onReset = () => {
  searchInfo.value.method = '';
  searchInfo.value.path = '';
  searchInfo.value.status = '';
  onSubmit();
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async () => {
  tableLoading.value = true;
  const table = await getSysOperationRecordList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  tableLoading.value = false;
}

getTableData()

const deleteVisible = ref(false)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const onDelete = async () => {
  const ids = []
  multipleSelection.value &&
    multipleSelection.value.forEach(item => {
      ids.push(item.ID)
    })
  const res = await deleteSysOperationRecordByIds({ ids })
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    if (tableData.value.length === ids.length && page.value > 1) {
      page.value--
    }
    deleteVisible.value = false
    getTableData()
  }
}
const deleteSysOperationRecordFunc = async (row) => {
  row.visible = false
  const res = await deleteSysOperationRecord({ ID: row.ID })
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    if (tableData.value.length === 1 && page.value > 1) {
      page.value--
    }
    getTableData()
  }
}
const fmtBody = (value) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

</script>

<script>

export default {
  name: 'SysOperationRecord'
}
</script>

<style lang="scss">
.table-expand {
  padding-left: 60px;
  font-size: 0;

  label {
    width: 90px;
    color: #99a9bf;

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
}

.popover-box {
  background: #112435;
  color: #f08047;
  height: 600px;
  width: 420px;
  overflow: auto;
}

.popover-box::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
