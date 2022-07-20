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
            <el-table-column width="140px" prop="time" label="编辑时间" />
            <el-table-column width="120px" prop="name" label="编辑人员" />
            <el-table-column prop="fileName" label="资源">
                <template #default="scope">
                    <el-button type="text">
                        <div class="file-text">{{scope.row.fileName}}</div>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts">
import { getResourceHistory } from "@/api/resource";
import moment from "moment";
import { defineComponent, ref, watch } from "vue";
interface IHistroy {
    time: string;
    name: string;
    fileName: string;
    file: {
        Id: string;
        Name: string;
        FileName: string;
        Size: number;
        FileBucket: string;
        FilePath: string;
        FileExtention: string;
        FileMD5: string;
        OldFileID: string;
    }
} 

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
    emits: ["update:visible"],
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };

        const tableData = ref<IHistroy[]>([]);

        watch(() => props.visible, () => {
            if (props.visible) {
                getResourceHistory({ id: props.target }).then(res => {
                    tableData.value = res.result.map(item => {
                        return {
                            time: moment(item.DateTime).format("YYYY-MM-DD HH:mm"),
                            name: item.UserName,
                            fileName: item.File.FileName,
                            file: item.File
                        }
                    });
                });
            }
        });

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

.file-text {
    width: 278px;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
