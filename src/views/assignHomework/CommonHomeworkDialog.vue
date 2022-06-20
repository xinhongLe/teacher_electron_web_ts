<template>
    <div class="add-common-homework">
        <el-dialog
            title="自定义作业"
            :model-value="dialogVisible"
            width="80%"
            center
            :before-close="handleClose"
        >
            <div class="header">
                <span class="title-text">选择书册：</span>
                <el-cascader
                    v-model="form.subjectPublisherBookValue"
                    :props="cascaderProps"
                    :options="subjectPublisherBookList"
                ></el-cascader>
                <img
                    v-if="form.subjectPublisherBookValue.length > 0"
                    :src="bookImg"
                    alt=""
                />
                <div v-else class="no-check">
                    <img
                        src="@/assets/images/homeworkNew/pic_nopic@2x.png"
                        alt=""
                    />
                    <span>未选择书册</span>
                </div>
            </div>
            <div class="content">
                <div>
                    <span class="title-text">作业内容：</span>
                    <el-button
                        size="medium"
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        @click="addRow"
                        >添加作业</el-button
                    >
                </div>
                <div>
                    <div
                        v-for="(item, index) in commonList"
                        :key="index"
                        class="content-row"
                    >
                        <div class="flex-between-center">
                            <input
                                class="homeWork"
                                maxlength="50"
                                v-model="item.name"
                                type="text"
                                placeholder="请输入任务名称(50字以内)"
                            />
                            <div class="flex-between-center selsec_list">
                                <!-- <el-select
                                    v-model="item.type"
                                    placeholder="请选择作业属性"
                                >
                                    <el-option
                                        style="width: 230px"
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        class="select_list"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select> -->
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    action=""
                                    :limit="5"
                                    :accept="acceptList"
                                    :show-file-list="false"
                                    :on-exceed="(e) => onExceed(e,index)"
                                    :before-upload="beforeUpload"
                                    :http-request="(e) => uploadSuccess(e, index)
                                    "
                                >
                                    <el-button
                                        size="medium"
                                        type="primary"
                                        plain
                                        icon="el-icon-paperclip"
                                        >添加附件</el-button
                                    >
                                </el-upload>
                                <el-button
                                    @click="delRow(index)"
                                    size="medium"
                                    type="danger"
                                    icon="el-icon-delete"
                                ></el-button>
                            </div>
                        </div>
                        <div v-if="item.files.length > 0" class="file">
                            <div v-for="(file, j) in item.files" :key="j">
                                <p>
                                    <FileType :fileExtension="file.extension"/>
                                    <span class="ellipsis" :title="file.name">{{ file.name }}</span>
                                </p>
                                <img
                                    src="@/assets/homeworkImg/icon_delete_red@2x.png"
                                    @click="delFile(index, j)"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import useUploadFile from "@/hooks/useUploadFile";
import { CommHomework } from "@/types/assignHomework";
import { getOssUrl } from "@/utils/oss";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, watch } from "vue";
import { getBookImg } from "./api";
import useBookList from "./hooks/useBookList";
import { showImg } from "./logic";
import FileType from "../../components/fileType/index.vue";
const defaultBookImg = require("@/assets/indexImages/card_beike.png");
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const acceptList = ".ppt,.pptx,.doc,.docx,.pdf,.mp3,.mp4,.mkv,.flv,.jpg,.png,.jpeg";
        const form = reactive({
            subjectPublisherBookValue: [] as string[]
        });
        const commonList = ref<CommHomework[]>([]);
        const bookImg = ref(defaultBookImg);
        const { subjectPublisherBookList, cascaderProps } = useBookList();
        const { uploadFile, fileInfo } = useUploadFile("CustomHomework");
        const handleClose = () => {
            emit("update:dialogVisible", false);
        };
        const submit = () => {
            if (form.subjectPublisherBookValue.length === 0) {
                return ElMessage.error("请选择书册");
            }
            if (commonList.value.length === 0) {
                return ElMessage.error("请添加作业");
            }
            handleClose();
            commonList.value = commonList.value.map(item => {
                item.BookID = form.subjectPublisherBookValue[2];
                return item;
            });
            emit("updateCommonHomeworkList", commonList.value);
        };
        const addRow = () => {
            commonList.value.push({
                name: "",
                type: 0,
                BookID: "",
                files: [],
                students: []
            });
        };
        const delRow = (index: number) => {
            commonList.value.splice(index, 1);
        };
        const delFile = (index: number, j: number) => {
            commonList.value[index].files.splice(j, 1);
        };
        const onExceed = (e:any, index: number) => {
            if (commonList.value[index].files.length === 5) {
                ElMessage.info("最多添加5个附件");
            } else {
                uploadSuccess({ file: e[0] }, index);
            }
        };
        const beforeUpload = ({ name }: {
            name: string;
        }) => {
            const fileType = name.substring(name.lastIndexOf(".") + 1);
            const whiteList = [
                "ppt",
                "pptx",
                "doc",
                "docx",
                "pdf",
                "mp3",
                "mp4",
                "mkv",
                "flv",
                "jpg",
                "png",
                "jpeg"
            ];
            if (whiteList.indexOf(fileType) === -1) {
                ElMessage.error("上传文件只能是 ppt,pptx,doc,docx,pdf,mp3,mp4,mkv,flv,jpg,png,jpeg格式");
                return false;
            }
        };
        const uploadSuccess = async ({ file }: {
            file: File & Blob;
        }, index: number) => {
            await uploadFile({ file });
            commonList.value[index].files.push({
                extension: fileInfo.fileExtension,
                name: fileInfo.fileName,
                fileName: fileInfo.name
            });
        };
        watch(() => form.subjectPublisherBookValue, (v) => {
            getBookImg({
                BookID: v[2]
            }).then((res) => {
                if (res.resultCode === 200 && res.result.BookCoverFile) {
                    const key = res.result.BookCoverFile.FilePath +
                        "/" +
                        res.result.BookCoverFile.FileName +
                        "." +
                        res.result.BookCoverFile.Extention;
                    getOssUrl(key, res.result.BookCoverFile.Bucket).then((res) => {
                        bookImg.value = res;
                    });
                } else {
                    bookImg.value = defaultBookImg;
                }
            });
        });
        return {
            handleClose,
            subjectPublisherBookList,
            cascaderProps,
            commonList,
            beforeUpload,
            addRow,
            submit,
            showImg,
            delFile,
            delRow,
            acceptList,
            bookImg,
            uploadSuccess,
            onExceed,
            form
        };
    },
    components: { FileType }
});
</script>

<style lang="scss" scoped>
.add-common-homework {
    :deep(.el-dialog__body) {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        padding: 0;
        .title-text {
            font-size: 18px;
            font-weight: 600;
            color: #19203d;
        }
        .header {
            padding: 20px;
            img {
                height: 120px;
                width: 100px;
                margin-top: 20px;
                display: block;
            }
            .no-check {
                color: #fff;
                position: relative;
                span {
                    position: absolute;
                    left: 17px;
                    top: 54px;
                    font-size: 12px;
                }
            }
        }
        .content {
            padding: 20px;
            background-color: #f5f6fa;
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            .content-row {
                background-color: #fff;
                margin-top: 15px;
                padding: 10px 20px;
                border-radius: 4px;
                .selsec_list {
                    .el-select {
                        width: 230px;
                        margin-right: 40px;
                        :deep(input) {
                            min-width: none !important;
                            border: none;
                            outline: none;
                        }
                        :deep(.el-input__inner) {
                            min-width: none !important;
                            border: none;
                            outline: none;
                        }
                    }
                }
                .homeWork {
                    min-width: 400px;
                    border: none;
                    outline: none;
                }
                .el-button--primary {
                    margin: 0 10px 0 40px;
                }
                .file {
                    display: flex;
                    justify-content: flex-start;
                    padding-top: 10px;
                    margin-top: 10px;
                    border-top: 1px solid #e9ecf0;
                    div {
                        position: relative;
                        margin-right: 20px;
                        padding: 10px 40px;
                        background-color: #f3f7ff;
                        border-radius: 4px;
                        max-width: calc(20% - 20px);
                        p {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            >span:first-child{
                                margin-right: 10px;
                            }
                            img {
                                width: 20px;
                                height: 20px;
                                vertical-align: middle;
                                margin-right: 10px;
                            }
                        }
                        > img {
                            position: absolute;
                            right: -6px;
                            top: -6px;
                            width: 20px;
                            height: 20px;
                            cursor: pointer;
                        }
                    }
                    .ellipsis {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                        width: auto;
                        max-width: calc(95% - 25px);
                    }
                }
            }
        }
    }

    :deep(.el-dialog) {
        height: 90vh;
        display: flex;
        flex-direction: column;
        --el-dialog-margin-top: 5vh;
    }
}
</style>
