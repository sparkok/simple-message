<template>
  <div>
    <el-card style="padding: 20px">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
              <el-form-item label="标题">
                <el-input v-model="searchInfo.Title" placeholder="标题"/>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchInfo.Status" clearable placeholder="请选择">
                  <el-option v-for="item in StatusList" :label="item.desc" :value="item.id" :key="item.id" />
                </el-select>  
              </el-form-item>
              <el-form-item label="通道">
                <el-input v-model="searchInfo.Channel" placeholder="通道"/>
              </el-form-item>
              <el-form-item label="时间">
                <el-input v-model="searchInfo.Utc" placeholder="时间"/>
              </el-form-item>
              <el-form-item label="发送">
                <el-input v-model="searchInfo.Sender" placeholder="发送"/>
              </el-form-item>
              <el-form-item label="接收">
                <el-input v-model="searchInfo.Recver" placeholder="接收"/>
              </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px; padding: 20px" >
      <div class="gva-btn-list">
        <el-button type="primary" @click="openDialog('add')">新增</el-button>
        <el-popover v-model:visible="deleteVisible" placement="top" width="160">
          <p>确定要删除吗？</p>
          <div style="text-align: right; margin-top: 8px;">
            <el-button size="small" class="primary-button" @click="onDelete">确定</el-button>
            <el-button size="small" class="common-button" @click="deleteVisible = false">取消</el-button>
          </div>
          <template #reference>
            <el-button type="primary" :disabled="!objs.length" style="margin-left: 10px;" @click="deleteVisible = true">删除</el-button>
          </template>
        </el-popover>
        <el-button @click="onSubmit">刷新</el-button><el-button size="small"  class="common-button" icon="icon" @click="actionUnread()"></el-button>
        </div>
      <el-table border :scrollbar-always-on="true" :style="{ 'border-bottom': '1px solid #ebeef5' }"
        :header-cell-style="{ 'border-bottom': '1px solid #ebeef5', 'background-color': '#f5f8fc' }" height="400px"
        :data="tableData" @sort-change="onSortChange" @selection-change="onSelectionChange">
	      <el-table-column type="selection" width="55" />
		  <el-table-column v-for="item in listFields" :label="item.title" align="center" :prop="item.key" :key="item.key" :sortable="item.sorter ? 'custom' : false">
			<template #default="scope">
			  <data-table-item :itemRender="item.render" :itemData="scope.row[item.dataIndex]" />
			</template>
		  </el-table-column>
        <el-table-column align="left" fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              icon="edit"
              size="small"
              class="common-button"
              @click="editObject(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"
              size="small"
              class="del-button"
              @click="deleteObject(scope.row)"
            >删除</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
          layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </el-card>
     <el-drawer v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle" center width="40%">
      <el-form ref="objForm" :model="objInfo" :rules="rules" label-position="left" label-width="25%" style="width: 70%; margin: auto">
        <el-form-item label="标题" prop="Title" placeholder="请输入标题" >
          	<el-input v-model="objInfo.Title" ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="Status">
          <el-select v-model="objInfo.Status">
            <el-option v-for="item in StatusList" :label="item.desc" :value="item.id" :key="item.id">
            </el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="通道" prop="Channel" placeholder="请输入通道" >
          	<el-input v-model="objInfo.Channel" ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="Body" placeholder="请输入内容" >
          	<textarea v-model="objInfo.Body" ></textarea>
        </el-form-item>
        <el-form-item label="时间" prop="Utc" placeholder="请输入时间" >
          	<el-input v-model="objInfo.Utc" ></el-input>
        </el-form-item>
        <el-form-item label="发送" prop="Sender" placeholder="请输入发送" >
          	<el-input v-model="objInfo.Sender" ></el-input>
        </el-form-item>
        <el-form-item label="接收" prop="Recver" placeholder="请输入接收" >
          	<el-input v-model="objInfo.Recver" ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="enterDialog">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </template>
    </el-drawer>
  </div>
</template>    
<script>

import Obj from './model'
export default {
  name: 'simple_message_MessageView'
}
</script>
<script setup>

import warningBar from '@/components/warningBar/warningBar.vue'
import DataTableItem from '@/components/DataTableItem.vue'
import { ref } from 'vue'
import { convertString } from '@/utils/valueTools.js'
import { ElMessage, ElMessageBox } from 'element-plus'
const obj = new Obj()
const objs = ref([])
const type = ref('')
const StatusList = [{ id: 0, desc: '已读' }, { id: 1, desc: '未读' }]
const rules = ref({
	Status: [{
	  required: false,
	  message: '请填写状态 ',
	  trigger: 'blur'
	}],
	Title: [{
	  required: false,
	  message: '请填写标题 ',
	  trigger: 'blur'
	}],
	Body: [{
	  required: false,
	  message: '请填写内容 ',
	  trigger: 'blur'
	}],
	Utc: [{
	  required: false,
	  message: '请填写时间 ',
	  trigger: 'blur'
	}],
	Channel: [{
	  required: false,
	  message: '请填写通道 ',
	  trigger: 'blur'
	}],
	Recver: [{
	  required: false,
	  message: '请填写接收 ',
	  trigger: 'blur'
	}],
	Sender: [{
	  required: false,
	  message: '请填写发送 ',
	  trigger: 'blur'
	}]})
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
const orderInfo = ref({})
const objForm = ref(null)
const objInfo = ref({
	Status : null,
	Title : null,
	Body : null,
	Utc : null,
	Channel : null,
	Recver : null,
	Sender : null
})
const onReset = () => {
  searchInfo.value = {}
  orderInfo.value = {}
}

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData(true)
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData(true)
}

//改变当前页
const handleCurrentChange = (val) => {
  page.value = val
  getTableData(false)
}

// 排序
const onSortChange = ({ prop, order }) => {
  if (prop) {
    orderInfo.value.OrderKey = prop
    orderInfo.value.Desc = order === 'descending'
  }
  getTableData(false)
}

// 查询
// getTotalSize - 是否重新获取总尺寸
const getTableData = getTotalSize => {
  if(getTotalSize) {
  	//如果要重新获取总页数,则拉取总页数
  	obj.count4Page({ ...convertString(searchInfo.value) }).then(count => {
		if(count.code === 0) {
			total.value = count.count
			//计算最大的页码,页码从1开始
			const maxPage = total.value / pageSize.value + 1 
			if(page.value > maxPage ) {
				page.value = maxPage
			}
		}
	 })
  }
  obj.pageObj({ PageInfo: { Page: page.value, PageSize: pageSize.value } ,OrderInfo:{...orderInfo.value }, SearchInfo: { ...convertString(searchInfo.value) }}).then(table => {
	  if (table.code === 0) {
		tableData.value = table.list
	  }
  })
}

getTableData(true)
const listFields = obj.fields.filter(item => !item.hide); 


// 批量操作
const onSelectionChange = (val) => {
  objs.value = val
}

const deleteVisible = ref(false)
const onDelete = () => {
  const ids = objs.value.map(item => obj.getKey(item))
  obj.deleteObjs({ ids }).then(res => {
	  if (res.code === 0) {
		ElMessage({
		  type: 'success',
		  message: res.msg
		})
		if (tableData.value.length === ids.length && page.value > 1) {
		  page.value--
		}
		deleteVisible.value = false
		getTableData(true)
	}
  })
}
        
const actionUnread = () => {
  const ids = objs.value.map(item => obj.getKey(item))
  obj.actionUnread({ ids }).then(res => {
	  if (res.code === 0) {
		ElMessage({
		  type: 'success',
		  message: res.msg
		})
	}
  })
}



const initForm = () => {
  objForm.value.resetFields()
  objInfo.value = {
	Status : null,
	Title : null,
	Body : null,
	Utc : null,
	Channel : null,
	Recver : null,
	Sender : null
	}
}

const dialogTitle = ref('新增消息')
const dialogFormVisible = ref(false)
const updateOrCreate = ref(true)
const openDialog = (key) => {
  switch (key) {
    case 'add':
      dialogTitle.value = '新增消息'
	  updateOrCreate.value = true
      break
    case 'edit':
      dialogTitle.value = '编辑消息'
      updateOrCreate.value = false
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

const editObject = (row) => {
  obj.getObjById({ ID: obj.getKey(row) }).then(res => {
	  if(res.code === 0) {
		obj.format4Select(res.value)  
		objInfo.value = res.value
		openDialog('edit')
	  }
  })
}

const enterDialog = () => {
  objForm.value.validate(valid => {
    if (valid) {
      switch (type.value) {
        case 'add':
          {
            obj.createObj(objInfo.value).then(res => {
				if (res.code === 0) {
				  ElMessage({
					type: 'success',
					message: '添加成功',
					showClose: true
				  })
				}
				getTableData(true)
				closeDialog()
			})
		  }
          break
        case 'edit':
          {
            obj.updateObj(objInfo.value).then(res => {
				if (res.code === 0) {
				  ElMessage({
					type: 'success',
					message: '编辑成功',
					showClose: true
				  })
				}
				getTableData(false)
				closeDialog()
			})
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

const deleteObject = (row) => {
  ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      obj.deleteObj(row).then(res => {
		  if (res.code === 0) {
			ElMessage({
			  type: 'success',
			  message: '删除成功!'
			})
			if (tableData.value.length === 1 && page.value > 1) {
			  page.value--
			}
			getTableData(true)
		  }
	   })
    })
}

</script>