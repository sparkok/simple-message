import service from '@/utils/request'

export const preview = (data) => {
  return service({
    url: '/role/autoCode/preview',
    method: 'post',
    data
  })
}

export const createTemp = (data) => {
  return service({
    url: '/role/autoCode/createTemp',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// @Tags SysApi
// @Summary 获取当前所有数据库
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /autoCode/getDatabase [get]
export const getDB = () => {
  return service({
    url: '/role/autoCode/getDB',
    method: 'get'
  })
}

// @Tags SysApi
// @Summary 获取当前数据库所有表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /autoCode/getTables [get]
export const getTable = (params) => {
  return service({
    url: '/role/autoCode/getTables',
    method: 'get',
    params
  })
}

// @Tags SysApi
// @Summary 获取当前数据库所有表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /autoCode/getColumn [get]
export const getColumn = (params) => {
  return service({
    url: '/role/autoCode/getColumn',
    method: 'get',
    params
  })
}

export const getSysHistory = (data) => {
  return service({
    url: '/role/autoCode/getSysHistory',
    method: 'post',
    data
  })
}

export const rollback = (data) => {
  return service({
    url: '/role/autoCode/rollback',
    method: 'post',
    data
  })
}

export const getMeta = (data) => {
  return service({
    url: '/role/autoCode/getMeta',
    method: 'post',
    data
  })
}

export const delSysHistory = (data) => {
  return service({
    url: '/role/autoCode/delSysHistory',
    method: 'post',
    data
  })
}

export const createPackageApi = (data) => {
  return service({
    url: '/role/autoCode/createPackage',
    method: 'post',
    data
  })
}

export const getPackageApi = () => {
  return service({
    url: '/role/autoCode/getPackage',
    method: 'post'
  })
}

export const deletePackageApi = (data) => {
  return service({
    url: '/role/autoCode/delPackage',
    method: 'post',
    data
  })
}

export const createPlugApi = (data) => {
  return service({
    url: '/role/autoCode/createPlug',
    method: 'post',
    data
  })
}

