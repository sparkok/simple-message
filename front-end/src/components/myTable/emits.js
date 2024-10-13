export const _emits = ['current-change', 'size-change', 'edit-save', 'selection-change'];

export default function _emitsFun(emit, editForm) {
    const handleCurrentChange = (val) => {
        emit('current-change', val);
    }
    const handleSizeChange = (val) => {
        emit('size-change', val);
    }
    const editSubmit = () => {
        emit('edit-save', editForm.value);
    }
    const handleSelectionChange = (val) => {
        emit('selection-change', val);
    }

    return {
        handleCurrentChange,
        handleSizeChange,
        editSubmit,
        handleSelectionChange
    }
}




