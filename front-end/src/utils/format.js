import { formatTimeToStr } from '@/utils/date'


export const formatBoolean = (bool) => {
  if (bool !== null) {
    return bool ? '是' : '否'
  } else {
    return ''
  }
}
export const formatDate = (time) => {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
  } else {
    return ''
  }
}

//将日期转换为时间戳，毫秒数
export const formatDateStrToNum = (dt) => {
  if (dt !== null && dt !== '') {
    return new Date(dt).getTime()
  } else {
    return ''
  }
}

//将时间戳转换为日期，年月日的
export const formatNumToDateStr = (num) => {
  if (num !== null && num !== '') {
    var date = new Date(num)
    return formatTimeToStr(date, 'yyyy-MM-dd')
  } else {
    return ''
  }
}


export const filterDict = (value, options) => {
  const rowLabel = options && options.filter(item => item.value === value)
  return rowLabel && rowLabel[0] && rowLabel[0].label
}

// export const getDictFunc = async(type) => {
//   const dicts = await getDict(type)
//   return dicts
// }
