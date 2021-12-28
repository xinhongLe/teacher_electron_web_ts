<template>
    <el-dialog :append-to-body="true" :model-value="dialogVisible" :before-close="handleClose" title="新增研讨内容" width="800px" center>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
            <el-form-item label="研讨主题:" :label-width="formLabelWidth" prop="title">
                <el-input v-model="form.title" placeholder="请输入研讨主题" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="资源类型:" :label-width="formLabelWidth" prop="resourceType">
                <el-radio-group v-model="form.resourceType">
                    <el-radio label="1">教案设计</el-radio>
                    <el-radio label="2">课件设计</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容摘要:" :label-width="formLabelWidth" prop="content">
                <el-input v-model="form.content" autocomplete="off" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="教案/课件:" :label-width="formLabelWidth" :show-message="false" prop="planFile">
                <el-upload
                    action
                    :show-file-list="false"
                    accept=".doc, .docx, .ppt"
                    :before-upload="beforeUpload"
                    :http-request="uploadFileSuccess"
                    v-if="!fileContent.name"
                >
                    <el-button size="small" type="primary" plain icon="el-icon-upload">上传文件</el-button>
                    <template #tip>
                        <div>仅可上传一个word或ppt文件</div>
                    </template>
                </el-upload>
                <div v-else class="fileBox">
                    <FileType :fileExtension="fileContent.fileExtension" />
                    <div
                        class="name"
                        :title="fileContent.name"
                    >{{ fileContent.fileName }}.{{ fileContent.fileExtension }}</div>
                    <span class="delete" @click="deleteFile" />
                </div>
            </el-form-item>
            <el-form-item label="附件:" :label-width="formLabelWidth" prop="attachments">
                <el-upload
                    class="upload-demo"
                    v-loading="loadingShow"
                    action
                    multiple
                    :limit="9"
                    :show-file-list="false"
                    :accept="acceptList"
                    :http-request="uploadSuccess"
                >
                    <el-button size="small" type="primary" plain icon="el-icon-paperclip">上传附件</el-button>
                    <template #tip>
                        <div>可上传不超过9个素材，支持格式：doc、docx、ppt、pdf、jpg、png、mp3、mp4等</div>
                    </template>
                </el-upload>
                <div v-if="fileList.length > 0" class="attachmentBox">
                    <div v-for="(file, index) in fileList" :key="index">
                        <p>
                            <FileType :fileExtension="file.extension" />
                            <span
                                class="ellipsis"
                                :title="file.name"
                            >{{ file.name }}.{{ file.extension }}</span>
                        </p>
                        <img
                            src="@/assets/preparationGroup/icon_shanchu.png"
                            @click="delFile(index)"
                            alt=""
                        />
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { ElFormType } from "@/types/elementType";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref, toRefs } from "vue";
import useUploadFile from "@/hooks/useUploadFile";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import FileType from "@/components/fileType/index.vue";
import { IOssFileInfo } from "@/types/oss";
import { cooOss } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";

export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    components: { FileType },
    setup(props, { emit }) {
        const formRef = ref<ElFormType>();
        const acceptList = ".ppt,.doc,.docx,.pdf,.mp3,.mp4,.jpg,.png,";
        const fileList = reactive<{ extension: string; fileName: string; name: string }[]>([]);
        const fileContent = reactive<IOssFileInfo>({
            bucket: "",
            objectKey: "",
            name: "",
            md5: "",
            fileName: "",
            fileExtension: ""
        });
        const state = reactive({
            form: {
                title: "",
                resourceType: "1",
                content: "",
                planFile: "",
                attachments: []
            },
            formLabelWidth: "90px"
        });
        const rules = {
            title: [
                {
                    required: true,
                    message: "请输入研讨主题",
                    trigger: "blur"
                }
            ],
            resourceType: [
                {
                    required: true,
                    message: "请选择资源类型",
                    trigger: ["blur", "change"]
                }
            ],
            planFile: [
                {
                    required: true,
                    message: "请上传教案/课件",
                    trigger: ["blur", "change"]
                }
            ]
        };
        const { loadingShow, fileInfo, uploadFile } = useUploadFile("ElementFile");

        const beforeUpload = ({ name }: {
            name: string;
        }) => {
            const fileType = name.substring(name.lastIndexOf(".") + 1);
            console.log(name, fileType);
            const whiteList = [
                "ppt",
                "pptx",
                "doc",
                "docx"
            ];
            if (whiteList.indexOf(fileType) === -1) {
                ElMessage.error("上传文件只能是 ppt,pptx,doc,docx格式");
                return false;
            }
            state.form.planFile = "1";
            console.log(state.form.planFile, "99");
        };
        const uploadFileSuccess = async ({ file }: {
            file: UploadFile & Blob;
        }) => {
            const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"];
            const res = await cooOss(file, ossPath);
            if (res?.code === 200) {
                const { objectKey, name, md5, fileExtension } = res;
                fileContent.bucket = ossPath.Bucket;
                fileContent.fileExtension = fileExtension;
                fileContent.objectKey = objectKey;
                fileContent.name = name;
                fileContent.objectKey = objectKey;
                fileContent.md5 = md5;
                fileContent.fileName = file.name.substring(0, file.name.lastIndexOf("."));
            }
        };
        const deleteFile = () => {
            fileContent.bucket = "";
            fileContent.fileExtension = "";
            fileContent.objectKey = "";
            fileContent.name = "";
            fileContent.objectKey = "";
            fileContent.md5 = "";
            fileContent.fileName = "";
        };
        const uploadSuccess = async ({ file }: {
            file: UploadFile & Blob;
        }) => {
            await uploadFile({ file });
            fileList.push({
                extension: fileInfo.fileExtension,
                name: fileInfo.fileName,
                fileName: fileInfo.name
            });
        };
        const delFile = (index: number) => {
            fileList.splice(index, 1);
        };

        const submitForm = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    alert("'submit!'");
                } else {
                    if (state.form.planFile === "") {
                        ElMessage.error("请上传教案/课件");
                    }
                    console.log("'error submit!!'");
                    return false;
                }
            });
        };
        const handleClose = () => {
            emit("update:dialogVisible", false);
        };
        return {
            formRef,
            ...toRefs(state),
            rules,
            fileList,
            acceptList,
            loadingShow,
            fileContent,
            deleteFile,
            beforeUpload,
            uploadFileSuccess,
            uploadSuccess,
            delFile,
            submitForm,
            handleClose
        };
    }
});
</script>
<style lang="scss" scoped>
.fileBox {
    height: 36px;
    width: 260px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e0e2e7;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    position: relative;
    .name {
        color: #19203d;
        font-size: 14px;
        margin-left: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
    }
    .delete {
        width: 14px;
        height: 14px;
        cursor: pointer;
        position: absolute;
        background: url("../../../assets/preparationGroup/icon_shanchu.png");
        right: 0;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.attachmentBox {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    div {
        display: flex;
        align-items: center;
        margin: 0 20px 20px 0;
        padding: 0 12px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e0e2e7;
        p {
            display: flex;
            justify-content: center;
            align-items: center;
            > span:first-child {
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
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    }
    .ellipsis {
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
}
</style>
