<template>
    <el-dialog
        custom-class="custom-dialog"
        center
        title="资源版本记录"
        width="600px"
        :model-value="visible"
        @close="close()"
    >
        <el-table class="custom-table" :data="tableData" stripe>
            <el-table-column prop="time" label="编辑时间" />
            <el-table-column prop="name" label="编辑人员" />
            <el-table-column prop="fileName" label="资源">
                <template #default="scope">
                    <el-button type="text">
                        {{scope.row.fileName}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    props: {
        target: {
            type: String,
            default: ""
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };

        const tableData = ref([
            {
                time: "1975-05-03 08:35",
                name: "李老师",
                fileName: "数一数教案.doc"
            },
            {
                time: "1975-05-03 08:35",
                name: "李老师",
                fileName: "数一数教案.doc"
            },
            {
                time: "1975-05-03 08:35",
                name: "李老师",
                fileName: "数一数教案.doc"
            }
        ]);
        return {
            close,
            tableData
        };
    }
});
</script>

<style lang="scss" scoped>
.custom-table {
    width: 100%;
    &:before {
        display: none;
    }
    :deep(.el-table__header-wrapper .el-table__cell) {
        padding: 12px 0;
        font-weight: 600;
        background-color: #fafafa;
    }
    :deep(.el-table__cell) {
        padding: 4px 0;
        border-bottom: 0 !important;
    }
}
</style>
