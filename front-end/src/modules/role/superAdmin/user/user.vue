<template>
  <my-container :isSearchShow="false">
    <template #btnScope>
      <my-button @click="addUser" type="primary" :disabled="tableLoading">新增用户</my-button>
      <my-button @click="getTableData" :disabled="tableLoading">刷新</my-button>
    </template>

    <my-table height="600px" operationWidth="300px" ref="myTableRef" :columns="columns" :data="tableData"
      :isOperationShow="true" :isPaginationShow="true" :page="page" :limit="pageSize" :total="total"
      :loading="tableLoading" @current-change="handleCurrentChange" @size-change="handleSizeChange">
      <template #opeartionScope="scope">
        <link-btn @click="openEdit(scope.row)">编辑</link-btn>
        <link-btn @click="resetPasswordFunc(scope.row)">重置密码</link-btn>
        <link-btn @click="deleteUserFunc(scope.row)" type="danger">删除</link-btn>
      </template>
    </my-table>

    <my-dialog :title="用户" v-model:visible="addUserDialog" @submit="enterAddUserDialog" @cancel="closeAddUserDialog">
      <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px">
        <el-form-item label="用户名" v-if="dialogFlag === 'add'" prop="userName">
          <el-input v-model="userInfo.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" v-if="dialogFlag === 'add'" prop="password">
          <el-input v-model="userInfo.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="userInfo.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="authorityId" label="用户角色">
          <el-cascader v-model="userInfo.authorityIds" style="width:100%" :options="authOptions"
            :show-all-levels="false"
            :props="{ multiple: true, checkStrictly: true, label: 'authorityName', value: 'authorityId', disabled: 'disabled', emitPath: false }"
            :clearable="false" :popper-append-to-body="false" />
        </el-form-item>
        <el-form-item prop="metaData" label="属性">
          <el-input v-model="userInfo.metaData" placeholder="请输入属性"></el-input>
        </el-form-item>
        <!-- <el-form-item label="头像"> -->
        <!-- <div style="display:inline-block" @click="openHeaderChange"> -->
        <!-- <div style="display:inline-block">
              <img  class="header-img-box" src="@/assets/noBody.png"> -->
        <!-- <div v-else class="header-img-box">从媒体库选择</div> -->
        <!-- </div>
          </el-form-item> -->
      </el-form>
    </my-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`headerImg`" />
  </my-container>
</template>

<script>
export default {
  name: 'User',
}
</script>

<script setup>
import { columns } from "./option";

import {
  getUserList,
  setUserAuthorities,
  register,
  deleteUser
} from '@/modules/role/actions/user'

import { getAuthorityList } from '@/modules/role/actions/authority'
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { setUserInfo, resetPassword } from '@/modules/role/actions/user.js'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouterStore, useUserStore } from '@/pinia'
import { valiRequired } from "@/utils/formRules";
const userStore = useUserStore()
const path = ref(import.meta.env.VITE_BASE_API + '/')
// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
    AuthorityData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName,
          children: []
        }
        setAuthorityOptions(item.children, option.children)
        optionsData.push(option)
      } else {
        const option = {
          authorityId: item.authorityId,
          authorityName: item.authorityName
        }
        optionsData.push(option)
      }
    })
}

const tableLoading = ref(false);
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const initUserInfo = () => {
  userInfo.value = {
    username: '',
    password: '',
    nickName: '',
    headerImg: '',
    authorityId: '',
    authorityIds: [],
    metaData: '',
  }
}

// 查询
const getTableData = async () => {
  tableLoading.value = true;
  const table = await getUserList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    let _list = table.data.list || [];
    tableData.value = _list.map((item) => {
      let _metaData = item.metaData || {};
      return {
        ...item,
        metaData: JSON.stringify(_metaData),
      }
    });
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  tableLoading.value = false;
}

watch(() => tableData.value, () => {
  setAuthorityIds()
})

const initPage = async () => {
  getTableData()
  const res = await getAuthorityList({ page: 1, pageSize: 999 })
  setOptions(res.data.list)
}

initPage()

const resetPasswordFunc = (row) => {
  ElMessageBox.confirm(
    '是否将此用户密码重置为123456?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await resetPassword({
      ID: row.ID,
    })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  })
}
const setAuthorityIds = () => {
  tableData.value && tableData.value.forEach((user) => {
    const authorityIds = user.authorities && user.authorities.map(i => {
      return i.authorityId
    })
    user.authorityIds = authorityIds
  })
}

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}

const authOptions = ref([])
const setOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

const deleteUserFunc = async (row) => {
  const res = await deleteUser({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  } else if (res.code === 7) {
    ElMessage.error('删除失败，不能删除自己')
  }
}

// 弹窗相关
const userInfo = ref({
  username: '',
  password: '',
  nickName: '',
  headerImg: '',
  authorityId: '',
  authorityIds: [],
  metaData: {},
  metaName: '',
  metaValue: ''
})

const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  authorityId: [
    {
      required: true,
      message: '请选择用户角色',
      validator: (rule, value, callback) => {
        return valiRequired(rule, value, callback, userInfo.value.authorityIds)
      }
    }
  ]
})


const userForm = ref(null)
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
const enterAddUserDialog = async () => {
  userInfo.value.authorityId = userInfo.value.authorityIds[0]
  userForm.value.validate(async valid => {
    if (valid) {

      if (userInfo.value.metaData) {
        let isJson = isJSON(userInfo.value.metaData.replace(/'/g, '"'));
        if (isJson) {
          userInfo.value.metaData = JSON.parse(userInfo.value.metaData.replace(/'/g, '"'));
        } else {
          ElMessage.error('属性字段，请输入正确的JSON格式');
          return false;
        }
      }
      const req = {
        ...userInfo.value
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setUserInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
    }
  })
}

const addUserDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  userInfo.value.headerImg = ''
  userInfo.value.authorityIds = []
  addUserDialog.value = false
}

const dialogFlag = ref('add')

const addUser = () => {
  initUserInfo();
  dialogFlag.value = 'add'
  addUserDialog.value = true
}
const changeAuthority = async (row, flag) => {
  if (flag) {
    return
  }

  await nextTick()
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds
  })
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '角色设置成功' })
  }
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  userInfo.value = JSON.parse(JSON.stringify(row))
  addUserDialog.value = true
}

</script>

<style lang="scss">
.user-dialog {
  .header-img-box {
    width: 150px;
    height: 150px;
    // border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 150px;
    margin: auto;
    // cursor: pointer;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.nickName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pointer {
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}
</style>
