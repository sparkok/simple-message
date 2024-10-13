export const columns = [
    {
        label: 'id', 
        prop: 'ID',
        width: '100px'
    },
    {
        label: '用户名', 
        prop: 'userName'
    },
    {
        label: '昵称', 
        prop: 'nickName',
    },
    {
        label: '手机号', 
        prop: 'phone'
    },
    {
        label: '邮箱', 
        prop: 'email'
    },
    {
        label: '用户角色', 
        prop: 'authorityIds',
        formatter: function (row) {
            return row.authorities[0].authorityName;
        }
    },
]