<template>
  <my-container @search="onSubmit" @empty="onReset">
    <template #searchScope>
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="路径">
          <el-input v-model="searchInfo.path" placeholder="路径" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="API组">
          <el-input v-model="searchInfo.apiGroup" placeholder="api组" />
        </el-form-item>
        <el-form-item label="请求">
          <el-select v-model="searchInfo.method" clearable placeholder="请选择">
            <el-option v-for="item in methodOptions" :key="item.value" :label="`${item.label}(${item.value})`"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #btnScope>
      <my-button type="primary" @click="openDialog('addApi')" :disabled="tableLoading">新增</my-button>
      <el-popover v-model:visible="deleteVisible" placement="top" width="160">
        <p>确定要删除吗？</p>
        <div style="text-align: right; margin-top: 8px;">
          <el-button size="small" @click="onDelete" class="confirm-button new-button">确定</el-button>
          <el-button size="small" @click="deleteVisible = false">取消</el-button>
        </div>
        <template #reference>
          <my-button type="primary" :disabled="!apis.length" @click="deleteVisible = true">删除</my-button>
        </template>
      </el-popover>
      <my-button @click="onSubmit" :disabled="tableLoading">刷新</my-button>
    </template>

    <my-table ref="myTableRef" :columns="columns" :data="tableData" :isSelectionShow="true" :isOperationShow="true"
      :isPaginationShow="true" :page="page" :limit="pageSize" :total="total" :loading="tableLoading"
      operationWidth="240px" @current-change="handleCurrentChange" @size-change="handleSizeChange"
      @selection-change="handleSelectionChange">
      <template #opeartionScope="scope">
        <link-btn @click="editApiFunc(scope.row)">编辑</link-btn>
        <link-btn @click="deleteApiFunc(scope.row)" type="danger">删除</link-btn>
      </template>
    </my-table>

    <my-dialog :title="dialogTitle" v-model:visible="dialogFormVisible" @before-close="closeDialog"
      @submit="enterDialog" @cancel="closeDialog">
      <el-form ref="apiForm" :model="form" :rules="rules" label-position="top">
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" autocomplete="off" />
        </el-form-item>
        <el-form-item label="请求" prop="method">
          <el-select v-model="form.method" placeholder="请选择" style="width:100%" :popper-append-to-body="false">
            <el-option v-for="item in methodOptions" :key="item.value" :label="`${item.label}(${item.value})`"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="api分组" prop="apiGroup">
          <el-input v-model="form.apiGroup" autocomplete="off" />
        </el-form-item>
        <el-form-item label="api简介" prop="description">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
    </my-dialog>
  </my-container>
</template>

<script>
export default {
  name: 'Api',
}
</script>

<script setup>
import {
  getApiById,
  getApiList,
  createApi,
  updateApi,
  deleteApi,
  deleteApisByIds
} from '@/modules/role/actions/api'
import { toSQLLine } from '@/utils/stringFun'
import warningBar from '@/components/warningBar/warningBar.vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouterStore, useUserStore } from '@/pinia'
import { columns } from './option';
const userStore = useUserStore()

const methodFiletr = (value) => {
  const target = methodOptions.value.filter(item => item.value === value)[0]
  return target && `${target.label}`
}

const tableLoading = ref(false);
const apis = ref([])
const form = ref({
  path: '',
  apiGroup: '',
  method: '',
  description: ''
})
const methodOptions = ref([
  {
    value: 'POST',
    label: '创建',
    type: 'success'
  },
  {
    value: 'GET',
    label: '查看',
    type: ''
  },
  {
    value: 'PUT',
    label: '更新',
    type: 'warning'
  },
  {
    value: 'DELETE',
    label: '删除',
    type: 'danger'
  }
])

const type = ref('')
const rules = ref({
  path: [{ required: true, message: '请输入api路径', trigger: 'blur' }],
  apiGroup: [
    { required: true, message: '请输入组名称', trigger: 'blur' }
  ],
  method: [
    {
      required: true,
      message: '请选择请求',
    }
  ],
  description: [
    { required: true, message: '请输入api介绍', trigger: 'blur' }
  ]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

const onReset = () => {
  searchInfo.value.path = '';
  searchInfo.value.description = '';
  searchInfo.value.apiGroup = '';
  searchInfo.value.method = '';
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

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    searchInfo.value.orderKey = toSQLLine(prop)
    searchInfo.value.desc = order === 'descending'
  }
  getTableData()
}

// 查询
const getTableData = async () => {
  tableLoading.value = true;
  const table = await getApiList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  tableLoading.value = false;
}

getTableData()

// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val
}

const deleteVisible = ref(false)
const onDelete = async () => {
  const ids = apis.value.map(item => item.ID)
  const res = await deleteApisByIds({ ids })
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: res.msg
    })
    if (tableData.value.length === ids.length && page.value > 1) {
      page.value--
    }
    deleteVisible.value = false
    getTableData()
  }
}

// 弹窗相关
const apiForm = ref(null)
const initForm = () => {
  apiForm.value.resetFields()
  form.value = {
    path: '',
    apiGroup: '',
    method: '',
    description: ''
  }
}

const dialogTitle = ref('新增Api')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'addApi':
      dialogTitle.value = '新增Api'
      break
    case 'edit':
      dialogTitle.value = '编辑Api'
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editApiFunc = async (row) => {
  const res = await getApiById({ id: row.ID })
  form.value = res.data.api
  openDialog('edit')
}

const enterDialog = async () => {
  apiForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'addApi':
          {
            const res = await createApi(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功',
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }

          break
        case 'edit':
          {
            const res = await updateApi(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '编辑成功',
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }
          break
        default:
          // eslint-disable-next-line no-lone-blocks
          {
            ElMessage({
              type: 'error',
              message: '未知操作',
              showClose: true
            })
          }
          break
      }
    }
  })
}

const deleteApiFunc = async (row) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该api, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deleteApi(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
    })
}

</script>

<style scoped lang="scss">
.button-box {
  padding: 10px 20px;

  .el-button {
    float: right;
  }
}

.warning {
  color: #dc143c;
}
</style>
