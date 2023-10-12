<template>
    <div>
        <el-upload
            class="avatar-uploader"
            action=""
            accept=".jpg,.jpeg,.gif,.png"
            :auto-upload="false"
            :on-change="(file) => onChange(file)"
            :show-file-list="false"
        >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>
            <template #tip>
                <div class="el-upload__tip">
                    <span>支持jpg.jpeg.gif.png</span>
                    <div v-if="isLimitImg" style="color: red">*图片像素不超过{{ maxImgWidth }} * {{ maxImgHeight }}</div>
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { cooOss, getOssUrl } from "@/utils/oss";
import { ElMessage } from "element-plus";
import { get, STORAGE_TYPES } from "@/utils/storage";

export default defineComponent({
    name: "upload",
    props: {
        isLimitImg: {
            type: Boolean,
            default: true
        },
        sizeImg: {
            type: Number,
            default: 0
        },
        maxImgWidth: {
            type: Number,
            default: 0
        },
        maxImgHeight: {
            type: Number,
            default: 0
        },
        imgUrl: {
            type: String,
            default: ""
        },
        index: {
            type: [Number, String],
            default: 0
        },
        type: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const upload = async (file: any) => {
            const filePath = await cooOss(file, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
            const fileInfo = await getOssUrl(filePath?.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
            emit("uploadSuccess", { filePath: filePath?.objectKey as string, fileInfo, index: props.index, type: props.type });
        };

        const onChange = (file: any) => {
            if (file) {
                if (props.isLimitImg) {
                    var reader = new FileReader();
                    reader.onload = function(event: any) {
                        var base64 = event.target.result;
                        var img = document.createElement("img");
                        img.src = base64;
                        img.onload = function() { // 注意只有onload以后才可以拿到图片信息
                            const imgWidth = img.width;
                            const imgHeight = img.height;

                            if (imgWidth > props.maxImgWidth || imgHeight > props.maxImgHeight) {
                                return ElMessage.warning(`图片像素不超过${props.maxImgWidth} * ${props.maxImgHeight}`);
                            }

                            if (props.sizeImg && (file.raw.size / 1024) > props.sizeImg * 1024) {
                                return ElMessage.warning(`文件大小不超过${props.sizeImg}`);
                            }
                            upload(file.raw);
                        };
                    };
                    reader.readAsDataURL(file.raw);
                } else {
                    upload(file.raw);
                }
            }
        };

        return {
            onChange
        };
    }
});
</script>

<style scoped lang="scss">
.avatar-uploader {
    line-height: 20px !important;

    .avatar {
        display: block;
        border-radius: 6px;
        width: 96px;
        height: 96px;
    }

    .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .el-icon.avatar-uploader-icon {
        border: 1px solid var(--el-border-color);
        font-size: 28px;
        color: #8c939d;
        width: 96px;
        height: 96px;
        line-height: 96px;
        text-align: center;
    }
}
</style>
