<template>
    <div>
        <div>
            <slot name="tableTopScope"></slot>
        </div>

        <el-table 
            border 
            :scrollbar-always-on="true" 
            :data="data" 
            :height="height"
            :style="{ 'border-bottom': '1px solid #ebeef5' }"
            :header-cell-style="{ 'border-bottom': '1px solid #ebeef5', 'background-color': '#f5f8fc' }"
            v-loading="loading" 
            @selection-change="handleSelectionChange"
            @cell-dblclick="cellDbClick"
        >
            <!-- 展开行 -->
            <el-table-column type="expand" width="50" v-if="isShowExpand">
                <template #default="scope">
                        <slot name="expand" v-bind="scope"></slot>
                </template>
            </el-table-column>
            <!-- 选择框 -->
            <el-table-column v-if="isSelectionShow" type="selection" width="50" align="center"></el-table-column>
            <!-- 序号框 -->
            <el-table-column label="#" type="index" width="50" align="center"></el-table-column>
            <!-- 常规字段 -->
            <el-table-column v-for="(value, index) in tableColumns" :key="index" :prop="value.prop" :label="value.label"
                :width="value.width || ''" :formatter="value.formatter" show-overflow-tooltip>
                <template v-if="value.slot" #default="scope">
                    <slot :name="value.prop + 'Scope'" v-bind="scope"></slot>
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column v-if="isOperationShow" label="操作" fixed="right" :width="operationWidth" align="center">
                <template #default="scope">
                    <slot name="opeartionScope" v-bind="scope"></slot>
                </template>
            </el-table-column>
        </el-table>

        <div v-if="isPaginationShow" class="gva-pagination">
            <el-pagination :current-page="page" :page-size="limit" :page-sizes="[10, 30, 50, 100]" :total="total"
                layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
                @size-change="handleSizeChange"></el-pagination>
        </div>

        <!-- 
            点击编辑 弹出的编辑表单
            默认是input输入框  有插槽可以自定义
            columns里面的属性：
                label: '名称';   ->   输入框前面的文字
                prop: 'name';    ->   输入框绑定的变量
                span：12； ->   输入框的宽度，默认是22
                labelWidth: '120px';    ->   输入框前面文字的宽度，默认110
                disabled: true;    ->   是否禁用输入框，默认false
                hidden: true;   ->  该变量是否在编辑框中是否隐藏，默认false（当和表格共用一个columns时，表格里面展示该数据，但编辑框中不需要编辑该数据）
                hide: true;   ->  该变量是否在表头中隐藏，默认false（理由同上）
                rules: []   ->   和el-form  里面rules规则一样
         -->
        <my-dialog :title="dialogTitle" :visible="dialogVisible" @submit="editSubmit" @cancel="editCancel">
            <el-form :model="editForm">
                <el-form-item v-for="(value, index) in editColumns" :key="index" :label="value.label"
                    :label-width="value.labelWidth || '110px'" :rules="value.rules" :prop="value.prop">
                    <slot v-if="value.tableSlot" :name="value.prop + 'TableScope'"></slot>
                    <el-col v-else :span="value.span || 22">
                        <el-input :disabled="value.disabled || false" v-model="editForm[value.prop]"
                            :placeholder="value.placeholder || '请输入' + value.label"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
        </my-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { _props } from './props';
import _emitsFun, { _emits } from './emits.js';
import _ from 'lodash';

// 开启当前行编辑的数据id
const currentId = ref('');
const currentColumn = ref({});
const currentRow = ref({});
const dialogVisible = ref(false);
const editForm = ref({});
const dialogTitle = ref('编辑');

const props = defineProps(_props);
const emit = defineEmits(_emits);
const { handleCurrentChange, handleSizeChange, editSubmit, handleSelectionChange } = _emitsFun(emit, editForm);

const editColumns = computed(() => {
    return props.columns.filter(item => !item.hidden);
})
const tableColumns = computed(() => {
    return props.columns.filter(item => !item.hide);
})

const editCancel = () => {
    editForm.value = {};
    dialogVisible.value = false;
}
const edit = (row) => {
    editForm.value = _.clone(row);
    dialogTitle.value = '编辑';
    dialogVisible.value = true;
}
const add = () => {
    editForm.value = {};
    dialogTitle.value = '添加';
    dialogVisible.value = true;
}

// 双击开启行编辑
const cellDbClick = (row, column, cell, event) => {
    if (!column.cellScope) return ;
    currentId.value = row.id || '';
    currentColumn.value = column;
    currentRow.value = row;
    let inputDom = createInputDom(column);
    cell.removeChild(cell.firstChild);
    cell.append(inputDom);
    inputDom.addEventListener('input', function (e) {
        currentRow.value[column.property] = e.target.value;
    })
}
const createInputDom = (column) => {
    let inputDom = document.createElement('input');
    inputDom.placeholder = `请输入${column.label}`;
    inputDom.style = 'border: 1px solid rgba(0, 0, 0, 0.15); height: 28px;width: 70%; margin-left: 10px; color: #333';
    return inputDom;
}
const closeRowEdit = (row, column, cell, event) => {
    console.log(row, column, cell, event,'关闭行编辑')
}
defineExpose({
    edit,
    add
})
</script>