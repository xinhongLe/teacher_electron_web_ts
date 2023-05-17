<template>
    <div class="content-detail">
        <div class="top">
            <p @click="addPairing">添加配对 {{ form.leftData.length }}/9</p>
        </div>
        <div class="middle">
            <div class="middle-left">
                <div class="btn">
                    <el-button round>左边</el-button>
                </div>
                <div class="content">
                    <div class="types">
                        <span>
                            类型：
                        </span>
                        <el-radio-group v-model="form.leftType">
                            <el-radio :label="1">文字</el-radio>
                            <el-radio :label="2">图片</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="content-text" v-if="form.leftType == 1">
                        <div class="content-item" v-for="(item,index) in form.leftData">
                            <span>{{ index + 1 }}</span>
                            <el-input v-model="item.Data"></el-input>
                            <div class="del-icon" @click="deleteLeftCon(index)">
                                <el-icon v-if="index > 1">
                                    <Delete/>
                                </el-icon>
                            </div>

                        </div>
                    </div>
                    <div class="content-img" v-if="form.leftType == 2">
                        <div class="content-item" v-for="(item,index) in form.leftData">
                            <el-upload
                                ref="uploadRef"
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.jpeg,.gif,.png"
                                :auto-upload="false"
                                :on-change="(file) => onChange(file, index,1)"
                                :show-file-list="false"
                            >
                                <img
                                    v-if="item.File.url"
                                    :src="item.File.url"
                                    class="avatar"
                                />
                                <el-icon v-else class="avatar-uploader-icon"
                                >
                                    <Plus/>
                                    上传图片
                                </el-icon
                                >
                            </el-upload>
                            <div class="del-icon" @click="deleteLeftCon(index)">
                                <el-icon v-if="index > 1">
                                    <Delete/>
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="middle-right">
                <div class="btn">
                    <el-button round>右边</el-button>
                </div>
                <div class="content">
                    <div class="types">
                        <span>
                            类型：
                        </span>
                        <el-radio-group v-model="form.rightType">
                            <el-radio :label="1">文字</el-radio>
                            <el-radio :label="2">图片</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="content-text" v-if="form.rightType == 1">
                        <div class="content-item" v-for="(item,index) in form.rightData">
                            <span>{{ index + 1 }}</span>
                            <el-input v-model="item.Data"></el-input>
                            <div class="del-icon" @click="deleteLeftCon(index)">
                                <el-icon v-if="index > 1">
                                    <Delete/>
                                </el-icon>
                            </div>

                        </div>
                    </div>
                    <div class="content-img" v-if="form.rightType == 2">
                        <div class="content-item" v-for="(item,index) in form.rightData">
                            <el-upload
                                ref="uploadRef"
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.jpeg,.gif,.png"
                                :auto-upload="false"
                                :on-change="(file) => onChange(file, index,2)"
                                :show-file-list="false"
                            >
                                <img
                                    v-if="item.File.url"
                                    :src="item.File.url"
                                    class="avatar"
                                />
                                <el-icon v-else class="avatar-uploader-icon"
                                >
                                    <Plus/>
                                    上传图片
                                </el-icon
                                >
                            </el-upload>
                            <div class="del-icon" @click="deleteLeftCon(index)">
                                <el-icon v-if="index > 1">
                                    <Delete/>
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button>取消</el-button>
            <el-button type="primary">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from "vue";
import {Delete} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {cooOss, getOssUrl} from "@/utils/oss";
import {get, STORAGE_TYPES} from "@/utils/storage";

export default defineComponent({
    name: "setContent",
    components: {Delete},
    props: {
        newForm: {
            type: Object,
            require: true,
            default: () => ({
                leftType: 1,
                rightType: 1,
                leftData: [
                    {
                        Type: 1,
                        Data: "",
                        File: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2,
                        },
                        Position: {x: 200, y: 200},
                        Size: {Width: 240, Height: 100},
                    },
                ],
                rightData: [
                    {
                        Type: 1,
                        Data: "",
                        File: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2,
                        },
                        Position: {x: 600, y: 200},
                        Size: {Width: 240, Height: 100},
                    },
                ]
            }),
        },
    },
    setup(props, {emit}) {
        const form: any = computed(() => props.newForm);
        //
        // const leftType = ref(1);
        // const rightType = ref(1);

        //添加配对
        const addPairing = () => {
            if (form.value.leftData.length >= 9) return;
            form.value.leftData.push({
                Type: 1,
                Data: "",
                File: {
                    url: "",
                    Bucket: "",
                    Name: "",
                    FileName: "",
                    FilePath: "",
                    Extention: "",
                    Type: 2,
                },
                Position: {x: 200, y: form.value.leftData[form.value.leftData.length - 1].Position.y + 150},
                Size: {Width: 240, Height: 100},
            })
            form.value.rightData.push({
                Type: 1,
                Data: "",
                File: {
                    url: "",
                    Bucket: "",
                    Name: "",
                    FileName: "",
                    FilePath: "",
                    Extention: "",
                    Type: 2,
                },
                Position: {x: 600, y: form.value.rightData[form.value.rightData.length - 1].Position.y + 150},
                Size: {Width: 240, Height: 100},
            })
        };
        watch(() => form.value.leftType, val => {
            if (val === 1) {
                form.value.leftData.forEach((item: any) => {
                    item.Type = 1
                })
            } else {
                form.value.leftData.forEach((item: any) => {
                    item.Type = 0
                })
            }
        });
        watch(() => form.value.rightType, val => {
            if (val === 1) {
                form.value.rightData.forEach((item: any) => {
                    item.Type = 1
                })
            } else {
                form.value.rightData.forEach((item: any) => {
                    item.Type = 0
                })
            }
        });
        //删除左边
        const deleteLeftCon = (index: number) => {
            form.value.leftData.splice(index, 1)
            form.value.rightData.splice(index, 1)
        };
        //上传图片
        const onChange = (file: any, index: number, type: number) => {
            if (file) {
                var reader = new FileReader();
                reader.onload = function (event: any) {
                    var base64 = event.target.result;
                    var img = document.createElement("img");
                    img.src = base64;
                    img.onload = function () {
                        // 注意只有onload以后才可以拿到图片信息
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        if (
                            imgWidth > 240 ||
                            imgHeight > 100 ||
                            file.raw.size / 1024 > 1024
                        ) {
                            return ElMessage.warning(
                                "图片像素不超过240 * 100，且文件大小不超过1M"
                            );
                        }
                        upload(file.raw, index, imgWidth, imgHeight, type);
                    };
                };
                reader.readAsDataURL(file.raw);
            }
        };
        const upload = async (
            file: any,
            index: number,
            imgWidth: number,
            imgHeight: number,
            type: number
        ) => {
            const filePath = await cooOss(
                file,
                get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]
            );
            const fileInfo = await getOssUrl(
                filePath?.objectKey as string,
                get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket
            );
            if (type === 1) {
                form.value.leftData[index].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.leftData[index].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };

            } else {
                form.value.rightData[index].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.rightData[index].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };
            }

            // if (typeof i === "number") {
            //     form.value.classData[index].Item[i].File = {
            //         url: fileInfo,
            //         Bucket: "axsfile",
            //         FilePath:
            //             filePath?.objectKey.split("/")[0] || "ElementFile",
            //         FileName: filePath?.name || "",
            //         Name: filePath?.name || "",
            //         Extention: filePath?.fileExtension || "",
            //         Type: 2,
            //     };
            //     form.value.classData[index].Item[i].Size = {
            //         Width: imgWidth,
            //         Height: imgHeight,
            //     };
            // } else {
            //     form.value.classData[index].File = {
            //         url: fileInfo,
            //         Bucket: "axsfile",
            //         FilePath:
            //             filePath?.objectKey.split("/")[0] || "ElementFile",
            //         FileName: filePath?.name || "",
            //         Name: filePath?.name || "",
            //         Extention: filePath?.fileExtension || "",
            //         Type: 2,
            //     };
            //     form.value.classData[index].Size = {
            //         Width: imgWidth,
            //         Height: imgHeight,
            //     };
            //     console.log(form.value.classData, "form.value.classData");
            // }
        };
        return {
            form,
            // leftType,
            // rightType,
            addPairing,
            deleteLeftCon,
            onChange
        }
    }
})
</script>

<style scoped lang="scss">
.content-detail {
    .top {
        p {
            color: #00d2a7;
            cursor: pointer;
        }
    }

    .middle {
        display: flex;
        border-bottom: 2px solid #90949e;

        .middle-left, .middle-right {
            width: 50%;

            .btn {
                border-bottom: 1px solid #90949e;
                width: 100%;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-content: center;
            }

            .content {
                padding: 10px;

                .types {
                    text-align: center;
                }

                .content-text {
                    margin-top: 12px;

                    :deep(.content-item) {
                        margin-bottom: 14px;
                        display: flex;
                        align-items: center;

                        span {
                            font-size: 16px;
                        }

                        .el-input {
                            margin: 0 10px;
                        }

                        .del-icon {
                            width: 18px;

                            .el-icon {
                                font-size: 18px;
                                color: #ff5151;
                                cursor: pointer;
                            }
                        }
                    }
                }

                .content-img {
                    margin-top: 12px;
                    display: flex;
                    flex-wrap: wrap;

                    .content-item {
                        margin-right: 10px;
                        margin-bottom: 10px;

                        .del-icon {
                            padding-top: 6px;
                            width: 16px;
                            margin: 0 auto;

                            .el-icon {
                                font-size: 18px;
                                color: #ff5151;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }

        .middle-left {
            .content {
                border-right: 2px dashed #90949e;
            }
        }
    }

    .footer {
        margin-top: 20px;
        text-align: center;
    }
}

.avatar-uploader {
    line-height: 20px !important;

    .avatar {
        display: block;
        border-radius: 6px;
        width: 94px;
        height: 94px;
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
        font-size: 14px;
        color: #8c939d;
        width: 94px;
        height: 94px;
        line-height: 96px;
        text-align: center;
    }
}
</style>
