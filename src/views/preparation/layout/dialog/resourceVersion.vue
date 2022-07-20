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
                    <el-button type="text" @click="download(scope.row.file)">
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
import loading from "@/components/loading";
import { getOssUrl } from "@/utils/oss";
interface IFile {
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

        const download = async (file: IFile) => {
            if (file) {
				loading.show();
                const url = await getOssUrl(`${file.FilePath}/${file.FileMD5}.${file.FileExtention}`, file.FileBucket);
                getBlob(url, function(blob: any) {
                    saveAs(blob, file.FileName);
                });
            }
        };

        const getBlob = (url: string, cb: any) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cb(xhr.response);
                }
            };
            xhr.send();
        };

        const saveAs = (blob: any, name: string) => {
            const link = document.createElement("a");
            const body = document.querySelectorAll("body");
            link.href = window.URL.createObjectURL(blob);
            link.download = name;
            link.style.display = "none";
            body[0].appendChild(link);
            link.click();
            body[0].removeChild(link);
            window.URL.revokeObjectURL(link.href);
            setTimeout(() => {
                loading.destroy();
            }, 500);
        };

        return {
            close,
            tableData,
            download
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
