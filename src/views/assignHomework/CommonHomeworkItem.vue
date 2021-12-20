<template>
    <div>
        <div class="homework-row flex-between-center">
            <div class="first-col">
                <span class="indexNumber">{{ index + 1 }}</span>
                <img
                    :src="require(`@/assets/images/homeworkNew/homework0.png`)"
                    alt=""
                />
                <p>{{ item.name }}</p>
            </div>
            <div class="placeholder"></div>
            <SelectLabel
                :studentList="item.students"
            ></SelectLabel>
            <div class="btns">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :limit="5"
                    :show-file-list="false"
                    :http-request="uploadSuccess"
                >
                    <el-button
                        size="small"
                        type="primary"
                        plain
                        icon="el-icon-paperclip"
                        >添加附件</el-button
                    >
                </el-upload>
                <el-button
                    size="small"
                    type="danger"
                    style="margin-left: 10px"
                    icon="el-icon-delete"
                    @click="$emit('deleteCommonHomework', index)"
                ></el-button>
            </div>
        </div>
        <div v-if="item.files.length > 0" class="file">
            <div v-for="(file, j) in item.files" :key="j">
                <p>
                    <img
                        :src="
                            require(`@/assets/homeworkImg/${showImg(
                                file.extension
                            )}.png`)
                        "
                        alt=""
                    />
                    <span>{{ file.name }}</span>
                    <img
                        src="@/assets/homeworkImg/icon_delete_red@2x.png"
                        @click="delFile(j)"
                        alt=""
                    />
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useUploadFile from "@/hooks/useUploadFile";
import { CommHomework, Student } from "@/types/assignHomework";
import { UploadFile } from "element-plus/lib/components/upload/src/upload.type";
import { defineComponent, PropType, reactive, watch } from "vue";
import { showImg } from "./logic";
import SelectLabel from "./SelectLabel.vue";
export default defineComponent({
    props: {
        item: {
            type: Object as PropType<CommHomework>,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    setup(props, { emit }) {
        const info = reactive(props.item);
        const { fileInfo, uploadFile } = useUploadFile("CustomHomework");
        const delFile = (j: number) => {
            info.files.splice(j, 1);
        };
        const uploadSuccess = async ({ file }: { file: UploadFile & Blob }) => {
            await uploadFile({ file });
            const { name, fileExtension, fileName } = fileInfo;
            info.files.push({
                name: fileName,
                extension: fileExtension,
                fileName: name
            });
        };
        const updateStudents = (students: Student[]) => {
            info.students = students;
        };
        watch(
            info,
            (v) => {
                emit("updateCommonHomework", props.index, v);
            },
            { deep: true }
        );
        return {
            showImg,
            delFile,
            updateStudents,
            uploadSuccess
        };
    },
    components: { SelectLabel }
});
</script>

<style lang="scss" scoped>
.file {
    display: flex;
    justify-content: flex-start;
    border-top: 1px solid #e9ecf0;
    background-color: #f9fafc;
    div {
        margin-right: 20px;
        padding: 10px 40px;
        border-radius: 4px;
        p {
            background-color: #fff;
            position: relative;
            padding: 7px 8px;
            img {
                width: 20px;
                height: 20px;
                vertical-align: middle;
                margin-right: 10px;
            }
            img:nth-of-type(2) {
                position: absolute;
                right: -14px;
                top: -7px;
                width: 14px;
                height: 14px;
                cursor: pointer;
            }
        }
    }
}
.homework-row {
    display: flex;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background: #f9fafc;
    border-radius: 4px;
    padding: 0 20px;
    margin-top: 10px;
    .placeholder {
        width: 20%;
        margin-right: 30px;
    }
    .first-col {
        width: 40%;
        align-items: center;
        display: flex;
        .indexNumber {
            font-size: 22px;
            color: #4b71ee;
        }
        .attributebox {
            width: 60%;
            margin-left: auto;
            .attributetype {
                display: inline-block;
                width: 80px;
                text-align: center;
            }
        }
        p {
            font-weight: 600;
        }
        span {
            margin-left: 12px;
        }
        .type {
            color: #4b71ee;
        }
        img {
            width: 20px;
            height: 20px;
            margin: 0 12px;
        }
    }
    .el-icon-edit {
        color: #4b71ee;
        margin-left: 12px;
    }
}
.btns {
    margin-left: auto;
    display: flex;
    align-items: center;
}
</style>
