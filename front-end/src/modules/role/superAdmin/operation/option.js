import { formatDate } from '@/utils/format';
export const columns = [
    {
        label: '操作人', 
        prop: 'userName',
        formatter: function (row) {
            return `${row.user.userName }(${row.user.nickName})`
        }
    },
    {
        label: '日期', 
        prop: 'CreatedAt',
        formatter: function (row) {
            return formatDate(row.CreatedAt);
        }
    },
    {
        label: '状态码', 
        prop: 'status',
    },
    {
        label: '请求IP', 
        prop: 'ip'
    },
    {
        label: '请求方法', 
        prop: 'method'
    },
    {
        label: '请求路径', 
        prop: 'path',
        width: '240px'
    },
]
