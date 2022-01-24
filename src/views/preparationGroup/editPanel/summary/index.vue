<template>
    <div class="summary">
        <div class="header" :class="loadingShow ? 'pointer-events' : ''">
            <span style="font-size:18px;font-weight:600;color:#000;">备课总结与反思</span>
            <el-upload
                action=""
                :show-file-list="false"
                :http-request="uploadFile"
                :on-success="onSuccess"
                accept=".doc, .docx"
            >
                <div class="btn-upload" v-loading="loadingShow">
                    <img src="../../../../assets/preparationGroup/editPanel/sunmary.png" alt="">
                    <span>{{ `上传${loadingShow ? "中..." : "文档"}` }}</span>
                </div>
            </el-upload>
        </div>
        <div v-if="tableData && tableData.length > 0">
            <el-table :data="tableData" style="width: 100%" :height="autoHeight">
                <el-table-column align="left">
                    <template #default="scope">
                        <div class="table-left" @click="turnToPreview(scope.row)">
                            <img style="" src="@/assets/preparationGroup/editPanel/icon_word.png" alt="">
                            {{ `${scope.row.ReflectFiles.FileName}.${scope.row.ReflectFiles.Extention}` }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  align="right">
                    <template #default="scope" class="table-right">
                        {{ `${scope.row.TeachName}上传于${moment(scope.row.UploadTime).format("YYYY-MM-DD HH:mm:ss")}` }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    :current-page="page.pageNumber"
                    :page-sizes="page.pageChoose"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <div class="empty-wrapper" v-else>
            <p>暂无文档</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive, onMounted, nextTick, watch, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import useUploadFile from "@/hooks/useUploadFile";
import { getOssUrl } from "@/utils/oss";
import isElectron from "is-electron";
import { ElMessage } from "element-plus";
import moment from "moment";
import { uploadSummary, fetchReflectFiles } from "../../api";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { proxy } = getCurrentInstance() as any;
        const route = useRoute();
        const isHasRule = ref(false);
        const state = reactive({
            tableData: [],
            autoHeight: 500
        });
        const page = reactive({
            pageNumber: 1, // 当前页
            pageSize: 10, // 每页显示数据
            pageChoose: [10, 20, 30], // 分页配置
            total: 0 // 总数据
        });
        const handleSizeChange = (v: number) => {
            page.pageNumber = 1;
            page.pageSize = v;
            getTableList();
        };

        const handleCurrentChange = (v: number) => {
            page.pageNumber = v;
            getTableList();
        };
        const getTableList = async () => {
            const res = await fetchReflectFiles({
                pager: {
                    ...page
                },
                preparateID: route.params.preId as string
            });
            if (res.resultCode === 200) {
                proxy.tableData = res.result.list;
                page.total = res.result.pager.Total;
                nextTick(() => {
                    proxy.autoHeight = proxy.tableData.length * 60 + 32;
                });
            }
        };
        const uploadItem = async (file: any) => {
            const res = await uploadSummary({
                groupLessonPreparateID: route.params.preId as string,
                documentFileType: 2,
                attachments: [
                    {
                        ...file,
                        fileMD5: file.md5
                    }
                ]
            });
            if (res.resultCode === 200) {
                ElMessage.success("上传成功");
                getTableList();
            }
        };
        const turnToPreview = async (ite: any) => {
            const item = ite.ReflectFiles;
            let url = "";
            if (item.FilePath && item.FileMD5 && item.Extention && item.Bucket) {
                url = await getOssUrl(`${item.FilePath}/${item.FileMD5}.${item.Extention}`, item.Bucket);
            } else if (item.path && item.md5 && item.bucket) {
                if (item.extention) {
                    url = await getOssUrl(`${item.path}/${item.md5}.${item.extention}`, item.bucket);
                } else if (item.fileExtension) {
                    url = await getOssUrl(`${item.path}/${item.md5}.${item.fileExtension}`, item.bucket);
                }
            }
            const previewUrl = "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(url);
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke("downloadFile", previewUrl, `${item.fileName}.${item.Extention}`).then((filePath) => {
                    window.electron.shell.openPath(filePath);
                });
            }
            window.open(previewUrl);
        };
        const { loadingShow, fileInfo, uploadFile, resetFileInfo, getFileType } = useUploadFile("GroupLessonFile");
        watch(fileInfo, (fileObj) => {
            const file = {
                ...fileObj,
                extention: fileObj.fileExtension
            };
            if (file && file.name.length > 0) {
                if (file.fileName.length < 128) {
                    if (getFileType(`${file.fileName}.${file.fileExtension}`) === "word") {
                        uploadItem(file);
                    } else {
                        ElMessage.info("目前只支持上传word类型的文档");
                    }
                } else {
                    ElMessage.info("文件名字长度不能超过128位");
                    resetFileInfo();
                }
            }
            resetFileInfo();
        }, {
            immediate: true,
            deep: true
        });
        const onSuccess = () => {
            loadingShow.value = false;
        };
        onMounted(() => {
            proxy.mittBus.on("PreDetail", (preDetail: any) => {
                if (get(STORAGE_TYPES.USER_INFO)) {
                    isHasRule.value = preDetail.CreaterID === get(STORAGE_TYPES.USER_INFO).ID;
                } else {
                    isHasRule.value = false;
                }
            });
            getTableList();
        });
        return {
            ...toRefs(state),
            page,
            moment,
            handleCurrentChange,
            handleSizeChange,
            getTableList,
            loadingShow,
            fileInfo,
            isHasRule,
            uploadFile,
            onSuccess,
            resetFileInfo,
            getFileType,
            turnToPreview
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.summary {
    width: 100%;
    height: auto;
    padding: 24px;
    border-radius: 8px;
    user-select: none;
    background-color: #fff;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .btn-upload {
        width: 142px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color:#48DBBF;
        color:#fff;
        cursor: pointer;
        img {
            display: inline-block;
            width: 16px;
            height: auto;
        }
        span {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color:#fff;
            display: inline-block;
            margin: 0;
            min-width: 70px;
        }
        :deep(.el-loading-spinner) {
            top: -3px;
        }
    }
    .pointer-events {
        pointer-events: none;
        cursor: default;
    }
    :deep(.el-button) {
        width: 142px;
        height: 36px;
        border: none;
        overflow: hidden;
    }
    .page {
        height: 25px;
        margin: 15px 0 0 0;
        :deep(.el-pagination) {
            float: right;
        }
    }
    .empty-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px dashed #E0E2E7;
        margin-top: 20px;
        p {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
            text-align: center;
            line-height: 90px;
        }
    }
}
.table-left {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #19203D;
    cursor: pointer;
    &:hover {
        color: #4B71EE;
    }
    img{
        width: 24px;
        height: auto;
        margin-right: 8px;
    }
}
.table-right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5F626F;
}
</style>
