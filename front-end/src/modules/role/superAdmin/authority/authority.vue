<template>
  <my-container :isSearchShow="false">
    <template #btnScope>
      <my-button type="primary" @click="addAuthority('0')" :disabled="tableLoading">新增角色</my-button>
      <my-button @click="getTableData" :disabled="tableLoading">刷新</my-button>
    </template>

    <my-table height="650px" ref="myTableRef" :columns="columns" :data="tableData" :isPaginationShow="false"
      :isOperationShow="true" :loading="tableLoading">
      <template #opeartionScope="scope">
        <link-btn @click="opdendrawer(scope.row)">设置权限</link-btn>
        <link-btn @click="addAuthority(scope.row.authorityId)">增加子角色</link-btn>
        <link-btn @click="copyAuthorityFunc(scope.row)">拷贝</link-btn>
        <link-btn @click="editAuthority(scope.row)">编辑</link-btn>
        <link-btn @click="deleteAuth(scope.row)" type="danger">删除</link-btn>
      </template>

      <!-- 表单插槽 -->
      <template #parentIdTableScope>
        {{ AuthorityOption }}
        <el-cascader v-model="_form.parentId" :options="AuthorityOption"
          :props="{ checkStrictly: true, label: 'authorityName', value: 'authorityId', disabled: 'disabled', emitPath: false }"
          :show-all-levels="false" filterable :popper-append-to-body="false" />
      </template>
    </my-table>

    <my-dialog v-model:visible="dialogFormVisible" :title="dialogTitle" @submit="enterDialog" @cancel="closeDialog">
      <el-form ref="authorityForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="parentId" label="父级角色">
          <el-cascader v-model="form.parentId" style="width:100%" :options="AuthorityOption"
            :props="{ checkStrictly: true, label: 'authorityName', value: 'authorityId', disabled: 'disabled', emitPath: false }"
            :show-all-levels="false" filterable :popper-append-to-body="false" />
        </el-form-item>
        <el-form-item prop="authorityId" label="角色ID">
          <el-input v-model="form.authorityId" autocomplete="off" size="large" placeholder="请输入角色ID" />
        </el-form-item>
        <el-form-item prop="authorityName" label="角色姓名">
          <el-input v-model="form.authorityName" autocomplete="off" size="large" placeholder="请输入角色姓名" />
        </el-form-item>
        <el-form-item prop="organId" label="组织">
          <el-input v-model="form.organId" autocomplete="off" size="large" placeholder="请输入组织" />
        </el-form-item>
        <el-form-item prop="metaData" label="属性">
          <el-input v-model="form.metaData" autocomplete="off" size="large" placeholder="请输入属性"></el-input>
          <!-- <el-col :span="10">
              <el-input v-model="form.metaName" size="large" placeholder="可以输入多个属性名，用“,”隔开" />
            </el-col>
            <el-col :span="4" style="text-align: center">属性值：</el-col>
            <el-col :span="10">
              <el-input v-model="form.metaValue" size="large" placeholder="可以输入多个属性名，用“,”隔开" />
            </el-col> -->
        </el-form-item>
      </el-form>
    </my-dialog>

    <el-drawer v-if="drawer" v-model="drawer" :with-header="false" size="40%" title="角色配置">
      <el-tabs :before-leave="autoEnter" class="role-box" type="border-card">
        <el-tab-pane label="角色菜单">
          <Menus ref="menus" :row="activeRow" @changeRow="changeRow" />
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <Apis ref="apis" :row="activeRow" @changeRow="changeRow" />
        </el-tab-pane>
        <el-tab-pane label="资源权限">
          <Datas ref="datas" :authority="tableData" :row="activeRow" @changeRow="changeRow" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </my-container>
</template>

<script setup>
import {
  getAuthorityList,
  deleteAuthority,
  createAuthority,
  updateAuthority,
  copyAuthority
} from '@/modules/role/actions/authority'

import Menus from '@/modules/role/superAdmin/authority/components/menus.vue'
import Apis from '@/modules/role/superAdmin/authority/components/apis.vue'
import Datas from '@/modules/role/superAdmin/authority/components/datas.vue'
import warningBar from '@/components/warningBar/warningBar.vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouterStore, useUserStore } from '@/pinia'

import { columns } from './option';
const userStore = useUserStore()

const mustUint = (rule, value, callback) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入正整数'))
  }
  return callback()
}

const myTableRef = ref();
const tableLoading = ref(false);

const AuthorityOption = ref([
  {
    authorityId: '0',
    authorityName: '根角色'
  }
])
const drawer = ref(false)
const dialogType = ref('add')
const activeRow = ref({})

const dialogTitle = ref('新增角色')
const dialogFormVisible = ref(false)
const apiDialogFlag = ref(false)
const copyForm = ref({})

const form = ref({
  authorityId: '',
  authorityName: '',
  parentId: '0',
  organId: '',
  metaData: '',
})
const _form = ref({
  parentId: '0',
})
const rules = ref({
  authorityId: [
    { required: true, message: '请输入角色ID', trigger: 'blur' },
    { validator: mustUint, trigger: 'blur' }
  ],
  authorityName: [
    { required: true, message: '请输入角色名', trigger: 'blur' }
  ],
  parentId: [
    { required: true, message: '请选择请求方式', trigger: 'blur' }
  ]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(999)
const tableData = ref([])
const searchInfo = ref({})

// 查询
const getTableData = async () => {
  tableLoading.value = true;
  const table = await getAuthorityList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    let _list = table.data.list || [];
    tableData.value = _list.map((item) => {
      let _metaData = item.metaData || {};
      return {
        ...item,
        metaData: JSON.stringify(_metaData),
      }
    })
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  tableLoading.value = false;
}

getTableData()

const changeRow = (key, value) => {
  activeRow.value[key] = value
}
const menus = ref(null)
const apis = ref(null)
const datas = ref(null)
const autoEnter = (activeName, oldActiveName) => {
  const paneArr = [menus, apis, datas]
  if (oldActiveName) {
    if (paneArr[oldActiveName].value.needConfirm) {
      paneArr[oldActiveName].value.enterAndNext()
      paneArr[oldActiveName].value.needConfirm = false
    }
  }
}
// 拷贝角色
const copyAuthorityFunc = (row) => {
  setOptions()
  dialogTitle.value = '拷贝角色'
  dialogType.value = 'copy'
  for (const k in form.value) {
    form.value[k] = row[k]
  }
  copyForm.value = row
  dialogFormVisible.value = true
}
const opdendrawer = (row) => {
  drawer.value = true
  activeRow.value = row
}
// 删除角色
const deleteAuth = (row) => {
  ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deleteAuthority({ authorityId: row.authorityId })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      } else if (res.code == 7) {
        ElMessage({
          type: 'error',
          message: res.msg
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
// 初始化表单
const authorityForm = ref(null)
const initForm = () => {
  if (authorityForm.value) {
    authorityForm.value.resetFields()
  }
  form.value = {
    authorityId: '',
    authorityName: '',
    organId: '',
    parentId: '0',

    metaData: '',
  }
}
// 关闭窗口
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
  apiDialogFlag.value = false
}
// 确定弹窗
const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}
const enterDialog = () => {
  if (form.value.authorityId === '0') {
    ElMessage({
      type: 'error',
      message: '角色id不能为0'
    })
    return false
  }

  if (form.value.metaData) {
    let isJson = isJSON(form.value.metaData.replace(/'/g, '"'));
    if (isJson) {
      form.value.metaData = JSON.parse(form.value.metaData.replace(/'/g, '"'));
    } else {
      ElMessage.error('属性字段，请输入正确的JSON格式');
      return false;
    }
  }
  authorityForm.value.validate(async valid => {
    if (valid) {
      switch (dialogType.value) {
        case 'add':
          {
            const res = await createAuthority(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!'
              })
              getTableData()
              closeDialog()
            } else if (res.code == 7) {
              ElMessage({
                type: 'error',
                message: res.msg
              })
            }
          }
          break
        case 'edit':
          {
            const res = await updateAuthority(form.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!'
              })
              getTableData()
              closeDialog()
            }
          }
          break
        case 'copy': {
          const data = {
            authority: {
              authorityId: 'string',
              authorityName: 'string',
              datauthorityId: [],
              parentId: 'string',
              organId: 'string',

              metaData: '',
            },
            oldAuthorityId: 0
          }
          data.authority.authorityId = form.value.authorityId
          data.authority.authorityName = form.value.authorityName
          data.authority.parentId = form.value.parentId
          data.authority.organId = form.value.organId
          data.authority.metaData = form.value.metaData
          data.authority.dataAuthorityId = copyForm.value.dataAuthorityId
          data.oldAuthorityId = copyForm.value.authorityId
          const res = await copyAuthority(data)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '复制成功！'
            })
            getTableData()
          } else {
            ElMessage({
              type: 'error',
              message: '复制失败！'
            })
          }
        }
      }

      initForm()
      dialogFormVisible.value = false
    }
  })
}
const setOptions = () => {
  AuthorityOption.value = [
    {
      authorityId: '0',
      authorityName: '根角色'
    }
  ]
  setAuthorityOptions(tableData.value, AuthorityOption.value, false)
}
const setAuthorityOptions = (AuthorityData, optionsData, disabled) => {
  form.value.authorityId = String(form.value.authorityId)
  AuthorityData &&
    AuthorityData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
          disabled: disabled || item.authorityId === form.value.authorityId,
          children: []
        }
        setAuthorityOptions(
          item.children,
          option.children,
          disabled || item.authorityId === form.value.authorityId
        )
        optionsData.push(option)
      } else {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
          disabled: disabled || item.authorityId === form.value.authorityId
        }
        optionsData.push(option)
      }
    })
}
// 增加角色
const addAuthority = (parentId) => {
  initForm()
  dialogTitle.value = '新增角色'
  dialogType.value = 'add'
  form.value.parentId = parentId
  setOptions()
  dialogFormVisible.value = true
}
// 编辑角色
const editAuthority = (row) => {
  setOptions()
  dialogTitle.value = '编辑角色'
  dialogType.value = 'edit'
  for (const key in form.value) {
    form.value[key] = row[key]
  }
  setOptions()
  dialogFormVisible.value = true
}

</script>

<script>

export default {
  name: 'Authority'
}
</script>

<style lang="scss" scoped>
.authority {
  .el-input-number {
    margin-left: 15px;

    span {
      display: none;
    }
  }
}

.role-box {
  .el-tabs__content {
    height: calc(100vh - 72px);
    overflow: auto;
  }
}
</style>
