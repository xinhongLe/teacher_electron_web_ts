<template>
    <div class="content-detail">
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="right"
        >
            <div class="middle">
                <div class="middle-left">
                    <div class="top">
                        <p @click="addLeft">添加 {{ form.LeftItems.Items.length }}/9</p>
                    </div>
                    <div class="btn">
                        <el-button round>左边</el-button>
                    </div>
                    <div class="content">
                        <div class="types">
                        <span>
                            类型：
                        </span>
                            <el-radio-group v-model="form.LeftItems.Type">
                                <el-radio :label="1">文字</el-radio>
                                <el-radio :label="0">图片</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="content-text" v-if="form.LeftItems.Type == 1">
                            <div class="content-item" v-for="(item,index) in form.LeftItems.Items">
                                <span>{{ index + 1 }}</span>
                                <el-form-item
                                    label-width="0px"
                                    :prop="`LeftItems.Items[${index}].Data`"
                                    :rules="rules.Data"
                                    style="margin: 0"
                                >
                                    <el-input
                                        v-model="item.Data"
                                        placeholder="请输入文字"
                                        :maxlength="8"
                                        show-word-limit
                                    />
                                </el-form-item>
                                <div class="del-icon" @click="deleteLeftCon(index)">
                                    <el-icon v-if="index > 0">
                                        <Delete/>
                                    </el-icon>
                                </div>

                            </div>
                        </div>
                        <div class="content-img" v-if="form.LeftItems.Type == 0">
                            <div class="content-item" v-for="(item,index) in form.LeftItems.Items">
                                <el-form-item
                                    label-width="0px"
                                    :prop="`LeftItems.Items[${index}].File.url`"
                                    :rules="rules.File"
                                >
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
                                </el-form-item>
                                <div class="del-icon" @click="deleteLeftCon(index)">
                                    <el-icon v-if="index > 0">
                                        <Delete/>
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="middle-right">
                    <div class="top">
                        <p @click="addRight">添加 {{ form.RightItems.Items.length }}/9</p>
                    </div>
                    <div class="btn">
                        <el-button round>右边</el-button>
                    </div>
                    <div class="content">
                        <div class="types">
                        <span>
                            类型：
                        </span>
                            <el-radio-group v-model="form.RightItems.Type">
                                <el-radio :label="1">文字</el-radio>
                                <el-radio :label="0">图片</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="content-text" v-if="form.RightItems.Type == 1">
                            <div class="content-item" v-for="(item,index) in form.RightItems.Items">
                                <span>{{ index + 1 }}</span>
                                <el-form-item
                                    label-width="0px"
                                    :prop="`RightItems.Items[${index}].Data`"
                                    :rules="rules.Data"
                                    style="margin: 0"
                                >
                                    <el-input
                                        v-model="item.Data"
                                        placeholder="请输入文字"
                                        :maxlength="8"
                                        show-word-limit
                                    />
                                </el-form-item>
                                <div class="del-icon" @click="deleteRightCon(index)">
                                    <el-icon v-if="index > 0">
                                        <Delete/>
                                    </el-icon>
                                </div>

                            </div>
                        </div>
                        <div class="content-img" v-if="form.RightItems.Type == 0">
                            <div class="content-item" v-for="(item,index) in form.RightItems.Items">
                                <el-form-item
                                    label-width="0px"
                                    :prop="`RightItems.Items[${index}].File.url`"
                                    :rules="rules.File"
                                >
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
                                </el-form-item>
                                <div class="del-icon" @click="deleteRightCon(index)">
                                    <el-icon v-if="index > 0">
                                        <Delete/>
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <!--            <el-button>取消</el-button>-->
                <el-button type="primary" @click="handleComfirm">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from "vue";
import {Delete} from '@element-plus/icons-vue';
import {ElMessage} from "element-plus";
import {cooOss, getOssUrl} from "@/utils/oss";
import {get, STORAGE_TYPES} from "@/utils/storage";
import {createRandomCode} from "@/utils/common";

export default defineComponent({
    name: "setContent",
    components: {Delete},
    props: {
        newForm: {
            type: Object,
            require: true,
            default: () => ({
                LeftItems: {
                    Type: 1,
                    Items: [
                        {
                            Id: "",
                            Data: "",
                            File: {
                                ID: "",
                                Name: "",
                                SN: 0,
                                FileName: "",
                                Bucket: "",
                                FilePath: "",
                                Extention: "",
                                FileMD5: "",
                                Type: 0,
                                StaffID: ""
                            },
                            Position: {x: 200, y: 200},
                            Size: {Width: 284, Height: 92},
                        }
                    ]
                },
                RightItems: {
                    Type: 0,
                    Items: [
                        {
                            Id: "",
                            Data: "",
                            File: {
                                ID: "",
                                Name: "",
                                SN: 0,
                                FileName: "",
                                Bucket: "",
                                FilePath: "",
                                Extention: "",
                                FileMD5: "",
                                Type: 0,
                                StaffID: ""
                            },
                            Position: {x: 600, y: 200},
                            Size: {Width: 284, Height: 92},
                        }
                    ]
                }
            }),
        },
    },
    setup(props, {emit}) {
        const rules = {
            Data: [
                {required: true, message: "请输入", trigger: "blur"},
                {max: 8, message: "最多8字符", trigger: "blur"}
            ],
            File: [
                {
                    required: true,
                    message: "请上传图片",
                    trigger: ["change", "blur"]
                }
            ]
        };
        const form: any = computed(() => props.newForm);
        //
        // const leftType = ref(1);
        // const rightType = ref(1);

        //添加左边
        const addLeft = () => {
            if (form.value.LeftItems.Items.length >= 9) return;
            const id: string = createRandomCode();
            form.value.LeftItems.Items.push(
                {
                    Id: id,
                    Data: "",
                    File: {
                        ID: "",
                        Name: "",
                        SN: 0,
                        FileName: "",
                        Bucket: "",
                        FilePath: "",
                        Extention: "",
                        FileMD5: "",
                        Type: 0,
                        StaffID: ""
                    },
                    Position: {
                        x: 200,
                        y: form.value.LeftItems.Items[form.value.LeftItems.Items.length - 1].Position.y + 150
                    },
                    Size: {Width: 284, Height: 92}
                }
            );
        };
        //添加右边
        const addRight = () => {
            if (form.value.RightItems.Items.length >= 9) return;
            const id: string = createRandomCode();
            form.value.RightItems.Items.push(
                {
                    Id: id,
                    Data: "",
                    File: {
                        ID: "",
                        Name: "",
                        SN: 0,
                        FileName: "",
                        Bucket: "",
                        FilePath: "",
                        Extention: "",
                        FileMD5: "",
                        Type: 0,
                        StaffID: ""
                    },
                    Position: {
                        x: 600,
                        y: form.value.RightItems.Items[form.value.RightItems.Items.length - 1].Position.y + 150
                    },
                    Size: {Width: 284, Height: 92}
                }
            );
        };
        //删除左边
        const deleteLeftCon = (index: number) => {
            form.value.LeftItems.Items.splice(index, 1);
        };
        //删除右边
        const deleteRightCon = (index: number) => {
            form.value.RightItems.Items.splice(index, 1);
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
                            imgWidth > 1920 ||
                            imgHeight > 1080 ||
                            file.raw.size / 2048 > 2048
                        ) {
                            return ElMessage.warning(
                                "图片像素不超过1920 * 1080，且文件大小不超过2M"
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
                form.value.LeftItems.Items[index].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.LeftItems.Items[index].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };

            } else {
                form.value.RightItems.Items[index].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.RightItems.Items[index].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };
            }
        };
        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    emit("save");
                }
            });
        };
        return {
            form,
            rules,
            formRef,
            addRight,
            addLeft,
            deleteLeftCon,
            deleteRightCon,
            onChange,
            handleComfirm
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
