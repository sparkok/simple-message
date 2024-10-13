
import service from '@/utils/request'

export const getAuthorityBtnApi = (data) => {
  return service({
    url: '/role/authorityBtn/getAuthorityBtn',
    method: 'post',
    data
  })
}

export const setAuthorityBtnApi = (data) => {
  return service({
    url: '/role/authorityBtn/setAuthorityBtn',
    method: 'post',
    data
  })
}

export const canRemoveAuthorityBtnApi = (params) => {
  return service({
    url: '/role/authorityBtn/canRemoveAuthorityBtn',
    method: 'post',
    params
  })
}

