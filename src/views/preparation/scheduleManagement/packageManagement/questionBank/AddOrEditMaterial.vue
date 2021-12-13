<template>
    <el-dialog
        :model-value="dialogVisible"
        :title="isEdit ? '编辑自定义素材' : '添加自定义素材'"
        center
        width="20%"
        :before-close="handleClose"
    >
        <div class="dialog-content">
            <el-form label-width="80px">
                <el-form-item label="课时：">
                    <el-select v-model="lessonId">
                        <el-option label="全部课时" :value="null" />
                        <el-option
                            v-for="item in lessons"
                            :key="item.ID"
                            :label="item.Name"
                            :value="item.ID"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="素材：">
                    <el-upload
                        action=""
                        :show-file-list="false"
                        :http-request="uploadFile"
                        v-if="!fileInfo.name"
                        v-loading="loadingShow"
                    >
                        <el-button>上传</el-button>
                    </el-upload>
                    <div v-else class="file">
                        <FileType :fileExtension="fileInfo.fileExtension" />
                        <div class="name" :title="fileInfo.name">
                            {{ fileInfo.fileName }}.{{ fileInfo.fileExtension }}
                        </div>
                        <span class="delete" @click="deleteFile" />
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="clickEnsureBtn"
                    >确定</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { fileTypeMap } from "@/config";
import useUploadFile from "@/hooks/useUploadFile";
import { Lesson, Material } from "@/types/preparation";
import { addMaterial, editMaterial } from "@/views/preparation/api";
import { ElMessage } from "element-plus";
import { computed, defineComponent, PropType, ref, watchEffect } from "vue";
import FileType from "@/components/fileType/index.vue";
export default defineComponent({
    props: {
        lessons: {
            type: Array as PropType<Lesson[]>,
            required: true
        },
        editInfo: {
            type: Object as PropType<Material>,
            default: () => ({})
        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
        isEdit: {
            type: Boolean,
            required: true
        },
        chapterID: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }) {
        const lessonId = ref<string | null>(null);
        const loading = ref(false);

        const { loadingShow, fileInfo, uploadFile, resetFileInfo } =
            useUploadFile("ElementFile");

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const clickEnsureBtn = async () => {
            if (!fileInfo.name) {
                return ElMessage.error("请上传素材");
            }
            let res;
            const ElementFile = {
                name: fileInfo.fileName,
                ossExtention: fileInfo.fileExtension,
                ossName: fileInfo.name,
                md5: fileInfo.md5
            };
            if (props.isEdit) {
                const data = {
                    ID: props.editInfo.ID,
                    FileType: fileType.value,
                    ElementFile,
                    LessonID: lessonId.value
                };
                res = await editMaterial(data);
            } else {
                const data = {
                    ChapterID: props.chapterID,
                    LessonID: lessonId.value,
                    Type: 3,
                    FileType: fileType.value,
                    ElementType: 0,
                    ElementFile
                };
                res = await addMaterial(data);
            }
            if (res?.resultCode === 200) {
                handleClose();
                emit("addSuccess");
            }
        };

        const fileType = computed(() => {
            const extension = fileInfo.fileExtension.toLowerCase();
            return fileTypeMap[extension];
        });

        watchEffect(() => {
            if (props.dialogVisible && props.isEdit) {
                lessonId.value = props.editInfo.LessonID;
                const { Name, Extention, FileName, FileMD5 } = props.editInfo.ElementFile;
                fileInfo.fileName = Name;
                fileInfo.fileExtension = Extention;
                fileInfo.name = FileName;
                fileInfo.md5 = FileMD5;
            }
        });

        return {
            lessonId,
            loading,
            handleClose,
            uploadFile,
            deleteFile: resetFileInfo,
            clickEnsureBtn,
            loadingShow,
            fileType,
            fileInfo
        };
    },
    components: { FileType }
});
</script>

<style lang="scss" scoped>
.dialog-content {
    display: flex;
    align-content: center;
    flex-direction: column;
}
.file {
    height: 36px;
    background: #f3f7ff;
    border-radius: 4px;
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
        position: absolute;
        background: url("../../../../../assets/images/attend-class/icon_delete_red.png");
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
    }
}
</style>
