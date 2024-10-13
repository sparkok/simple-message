export const columns = [
    {
        label: '父级角色',
        prop: 'parentId',
        tableSlot: true,
        hide: true,
        rules: [
            { required: true, message: '请输入角色ID', trigger: 'blur' },
        ]
    },
    {
        label: '角色ID', 
        prop: 'authorityId',
        rules: [
            { required: true, message: '请输入角色ID', trigger: 'blur' },
        ]
    },
    {
        label: '角色名称', 
        prop: 'authorityName',
        rules: [
            { required: true, message: '请输入角色ID', trigger: 'blur' },
        ]
    },
    {
        label: '组织', 
        prop: 'organId',
    },
]