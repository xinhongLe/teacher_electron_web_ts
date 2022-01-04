<template>
    <el-dialog
        :append-to-body="true"
        :model-value="dialogVisible"
        :before-close="handleClose"
        :title="flagType + '研讨内容'"
        width="800px"
        center
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
            <el-form-item label="研讨主题:" :label-width="formLabelWidth" prop="title">
                <el-input v-model="form.title" placeholder="请输入研讨主题" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="资源类型:" :label-width="formLabelWidth" prop="resourceType">
                <el-radio-group v-model="form.resourceType">
                    <el-radio :label="1">教案设计</el-radio>
                    <el-radio :label="2">课件设计</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容摘要:" :label-width="formLabelWidth" prop="content">
                <el-input v-model="form.content" autocomplete="off" type="textarea" :row="4" resize="none"></el-input>
            </el-form-item>
            <el-form-item
                label="教案/课件:"
                :label-width="formLabelWidth"
                :show-message="false"
                prop="planFile"
            >
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
                        <div class="el-upload__tip TheSlogan">仅可上传一个word或ppt文件</div>
                    </template>
                </el-upload>
                <div v-else>
                    <File :fileInfo="fileContent" action="upload" @close="deleteFile"></File>
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
                        <div class="el-upload__tip TheSlogan">
                            可上传不超过9个素材，支持格式：doc、docx、ppt、pdf、jpg、png、mp3、mp4等
                        </div>
                    </template>
                </el-upload>
                <div v-if="fileList.length > 0" class="attachmentBox">
                    <div class="file-item" v-for="(file, index) in fileList" :key="index">
                        <File :fileInfo="file" action="upload" @close="delFile(index)"></File>
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
import { defineComponent, onMounted, reactive, ref, toRefs, watch, PropType } from "vue";
import { useRoute } from "vue-router";
import { ElFormType } from "@/types/elementType";
import { ElMessage } from "element-plus";
import { IOssFileInfo } from "@/types/oss";
import { cooOss } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import File from "../file/index.vue";
import useUploadFile from "@/hooks/useUploadFile";
import { AddDiscussionContent, EditDiscussionContent } from "../api";
import { DiscussioncontentList } from "@/types/preparationGroup";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        researchContent: {
            type: Object as PropType<DiscussioncontentList>,
            default: () => ({})
        },
        researchType: {
            type: String,
            default: () => {
                return "新增";
            }
        }
    },
    components: { File },
    setup(props, { emit }) {
        console.log(props);
        const route = useRoute();
        const formRef = ref<ElFormType>();
        const preId = ref();
        const flagType = ref(props.researchType);
        const acceptList = ".ppt,.doc,.docx,.pdf,.mp3,.mp4,.jpg,.png,";
        // const fileList = reactive<{ extention: string; fileName: string; name: string; bucket: string; fileMD5: string; filePath: string; size: number; fileSize: string; fileType: string; }[]>([]);
        const fileList = ref<IOssFileInfo[]>([]);
        const fileContent = reactive<IOssFileInfo>({
            bucket: "",
            path: "",
            objectKey: "",
            name: "",
            md5: "",
            fileName: "",
            fileExtension: "",
            size: 0,
            fileSize: "",
            fileType: ""
        });
        const state = reactive({
            form: {
                title: "",
                resourceType: 1,
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

        watch(() => props.dialogVisible, (visible) => {
            if (visible) {
                console.log(visible, "visible");
                if (props.researchContent) {
                    console.log(props.researchContent, "1234567890");
                    flagType.value = "编辑";
                    preId.value = props.researchContent.DiscussionContentID;
                    state.form.title = props.researchContent.Title;
                    state.form.resourceType = props.researchContent.ResourceType;
                    state.form.content = props.researchContent.Content;
                    state.form.planFile = "1";
                    fileContent.name = props.researchContent.ResourceSource.Name;
                    fileContent.bucket = props.researchContent.ResourceSource.Bucket;
                    fileContent.path = props.researchContent.ResourceSource.FilePath;
                    fileContent.fileExtension = props.researchContent.ResourceSource.Extention;
                    fileContent.md5 = props.researchContent.ResourceSource.FileMD5;
                    fileContent.fileName = props.researchContent.ResourceSource.FileName;
                    fileContent.size = props.researchContent.ResourceSource.Size;
                    fileContent.fileSize = getFileSize(props.researchContent.ResourceSource.Size || 0);
                    fileContent.fileType = getFileType(`${props.researchContent.ResourceSource.Name}.${props.researchContent.ResourceSource.Extention}`);
                    fileList.value = [];
                    props.researchContent.Attachments && props.researchContent.Attachments.map(item => {
                        console.log(item);
                        fileList.value.push({
                            objectKey: "",
                            bucket: item.Bucket,
                            name: item.Name,
                            md5: item.FileMD5,
                            fileName: item.FileName,
                            fileExtension: item.Extention,
                            path: item.FilePath,
                            size: item.Size,
                            fileSize: getFileSize(item.Size || 0),
                            fileType: getFileType(`${item.Name}.${item.Extention}`)
                        });
                    });
                    console.log(fileList.value, "fileListfileListfileList");
                }
            }
        });

        const { loadingShow, fileInfo, getFileSize, getFileType, uploadFile } = useUploadFile("GroupLessonFile");

        // 教案课件上传之前
        const beforeUpload = ({ name }: {name: string;}) => {
            const fileType = name.substring(name.lastIndexOf(".") + 1);
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
        };

        // 上传教案/课件
        const uploadFileSuccess = async ({ file }: {file: UploadFile & Blob;}) => {
            const ossPath = get(STORAGE_TYPES.OSS_PATHS)?.["GroupLessonFile"];
            const res = await cooOss(file, ossPath);
            if (res?.code === 200) {
                console.log(res, "resresres");
                const { objectKey, name, md5, fileExtension } = res;
                fileContent.bucket = ossPath.Bucket;
                fileContent.path = ossPath.Path;
                fileContent.fileExtension = fileExtension;
                fileContent.objectKey = objectKey;
                fileContent.name = name;
                fileContent.md5 = md5;
                fileContent.fileName = file.name.substring(0, file.name.lastIndexOf("."));
                fileContent.size = file.size;
                fileContent.fileSize = getFileSize(file.size);
                fileContent.fileType = getFileType(file.name);
            }
        };

        // 删除教案/课件
        const deleteFile = () => {
            fileContent.bucket = "";
            fileContent.path = "";
            fileContent.fileExtension = "";
            fileContent.objectKey = "";
            fileContent.name = "";
            fileContent.md5 = "";
            fileContent.fileName = "";
            fileContent.size = 0;
            fileContent.fileSize = "";
            fileContent.fileType = "";
            state.form.planFile = "";
        };

        // 上传附件
        const uploadSuccess = async ({ file }: {file: UploadFile & Blob;}) => {
            await uploadFile({ file });
            fileList.value.push({
                ...fileInfo
                // extention: fileInfo.fileExtension,
                // name: fileInfo.name,
                // fileName: fileInfo.fileName,
                // bucket: fileInfo.bucket,
                // fileMD5: fileInfo.md5,
                // filePath: fileInfo.path!,
                // size: fileInfo.size!,
                // fileSize: fileInfo.fileSize!,
                // fileType: fileInfo.fileType!
            });
        };

        // 删除附件
        const delFile = (index: number) => {
            fileList.value.splice(index, 1);
        };

        // 确认新增事件
        const submitForm = async () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    const data = {
                        discussionContent: {
                            title: state.form.title,
                            resourceType: state.form.resourceType,
                            content: state.form.content,
                            planFile: {
                                ...fileContent,
                                name: fileContent.name,
                                fileName: fileContent.fileName,
                                bucket: fileContent.bucket,
                                filePath: fileContent.path!,
                                extention: fileContent.fileExtension,
                                fileMD5: fileContent.md5
                            },
                            attachments: fileList.value
                        }
                    };
                    if (flagType.value === "新增") {
                        const params = Object.assign(data, { groupLessonPreparateID: preId.value });
                        const res = await AddDiscussionContent(params);
                        if (res.resultCode === 200) {
                            ElMessage.success("新增研讨内容成功");
                            emit("AddSuccess");
                        }
                    } else {
                        const params = Object.assign(data, { discussionID: preId.value });
                        const res = await EditDiscussionContent(params);
                        if (res.resultCode === 200) {
                            ElMessage.success("编辑研讨内容成功");
                            emit("EditSuccess");
                        }
                    }
                } else {
                    if (state.form.title === "") {
                        return false;
                    }
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
        onMounted(() => {
            preId.value = route.params.preId;
        });
        return {
            formRef,
            ...toRefs(state),
            rules,
            fileList,
            acceptList,
            loadingShow,
            fileContent,
            flagType,
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
    margin-top: 8px;
    .file-item {
        margin: 0 10px 10px 0;
    }
}
.TheSlogan {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #a7aab4;
    line-height: 17px;
}
</style>
