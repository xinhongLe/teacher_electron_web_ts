<template>
    <div class="set-content">
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="70px"
            label-position="right"
        >
            <div class="header">
                <el-form-item label="类型：">
                    <el-select
                        @change="changeType"
                        v-model="form.Type"
                        class="m-2"
                        placeholder="Select"
                        size="large"
                    >
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="背景：">
                    <el-select
                        v-model="form.ThemeId"
                        class="m-2"
                        placeholder="Select"
                        size="large"
                    >
                        <el-option
                            v-for="item in optionList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="默认分类数：" label-width="110px">
                    <el-input-number
                        v-model="form.DefaultCount"
                        :min="2"
                        :max="5"
                        controls-position="right"
                        size="large"
                    />
                </el-form-item>
                <el-form-item label="自动判断：" label-width="110px">
                    <el-radio-group v-model="form.AutoJudge">
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="0">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div class="add-box">
                <img
                    @click="addQuestion"
                    src="@/assets/projection/icon_add_btn.png"
                    alt=""
                />
                <span>添加分类</span>
                <span
                    >( <span class="num">{{ form.classData.length }}</span
                    >/5 )</span
                >
            </div>
            <div class="content-box">
                <div
                    v-for="(item, index) in form.classData"
                    :key="index"
                    class="row"
                >
                    <div>
                        <div class="text">
                            <img
                                v-if="index > 0"
                                @click="delQuestion(index)"
                                src="@/assets/projection/icon_delete.png"
                                alt=""
                            />
                            分类{{ index + 1 }}：
                        </div>
                        <div
                            v-if="form.Type === 1 || form.Type === 4"
                            class="option-col"
                        >
                            <el-form-item
                                label-width="0px"
                                :prop="`classData[${index}].Data`"
                                :rules="rules.Data"
                            >
                                <el-input
                                    v-model="item.Data"
                                    :autosize="{ minRows: 4, maxRows: 4 }"
                                    placeholder="请输入分类名称"
                                    type="textarea"
                                />
                            </el-form-item>
                        </div>
                        <div v-else class="option-col">
                            <el-form-item
                                label-width="0px"
                                :prop="`classData[${index}].File.url`"
                                :rules="rules.File"
                            >
                                <el-upload
                                    ref="uploadRef"
                                    class="avatar-uploader"
                                    action=""
                                    accept=".jpg,.jpeg,.gif,.png"
                                    :auto-upload="false"
                                    :on-change="(file) => onChange(file, index)"
                                    :show-file-list="false"
                                >
                                    <img
                                        v-if="item.File.url"
                                        :src="item.File.url"
                                        class="avatar"
                                    />
                                    <el-icon v-else class="avatar-uploader-icon"
                                        ><Plus />上传图片</el-icon
                                    >
                                </el-upload>
                            </el-form-item>
                        </div>
                    </div>
                    <div>
                        <div class="text">选项：</div>
                        <div class="row" style="flex-wrap: wrap">
                            <div
                                v-for="(option, i) in item.Item"
                                :key="i"
                                class="option-col"
                            >
                                <div v-if="form.Type === 3 || form.Type === 4">
                                    <img
                                        v-if="i > 0"
                                        class="del_img"
                                        @click="delOption(index, i)"
                                        src="@/assets/projection/icon_delete.png"
                                        alt=""
                                    />
                                    <el-form-item
                                        label-width="0px"
                                        :prop="`classData[${index}].Item[${i}].File.url`"
                                        :rules="rules.File"
                                    >
                                        <el-upload
                                            class="avatar-uploader"
                                            action=""
                                            accept=".jpg,.jpeg,.gif,.png"
                                            :auto-upload="false"
                                            :on-change="
                                                (file) =>
                                                    onChange(file, index, i)
                                            "
                                            :show-file-list="false"
                                        >
                                            <img
                                                v-if="option.File.url"
                                                :src="option.File.url"
                                                class="avatar"
                                            />
                                            <el-icon
                                                v-else
                                                class="avatar-uploader-icon"
                                                ><Plus />上传图片</el-icon
                                            >
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <div v-else>
                                    <img
                                        v-if="i > 0"
                                        class="del_img"
                                        @click="delOption(index, i)"
                                        src="@/assets/projection/icon_delete.png"
                                        alt=""
                                    />
                                    <el-form-item
                                        label-width="0px"
                                        :prop="`classData[${index}].Item[${i}].Data`"
                                        :rules="rules.Data"
                                    >
                                        <el-input
                                            v-model="option.Data"
                                            :autosize="{
                                                minRows: 4,
                                                maxRows: 4,
                                            }"
                                            placeholder="请输入分类选项"
                                            type="textarea"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="add-btn" @click="addOption(index)">
                                <el-icon :size="22"><Plus /></el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { cooOss, getOssUrl } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
export default defineComponent({
    name: "classGame",
    props: {
        newForm: {
            type: Object,
            require: true,
            default: () => ({
                Type: 1,
                ThemeId: 0,
                AutoJudge: 1,
                DefaultCount: 2,
                classData: [
                    {
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
                        Position: { x: 200, y: 800 },
                        Size: { Width: 240, Height: 168 },
                        Item: [
                            {
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
                                Position: { x: 200, y: 168 },
                                Size: { Width: 240, Height: 168 },
                            },
                        ],
                    },
                ],
            }),
        },
    },
    emits: ["save"],
    setup(props, { emit }) {
        const state = reactive({
            typeList: [
                { name: "文本+文本", value: 1 },
                { name: "图片+文本", value: 2 },
                { name: "图片+图片", value: 3 },
                { name: "文本+图片", value: 4 },
            ],
            optionList: [
                { name: "树林", value: 0 },
                { name: "沙滩", value: 1 },
                { name: "雪地", value: 2 },
            ],
            rules: {
                Data: [
                    { required: true, message: "请输入", trigger: "blur" },
                    { max: 8, message: "最多8字符", trigger: "blur" },
                ],
                File: [
                    {
                        required: true,
                        message: "请上传图片",
                        trigger: ["change", "blur"],
                    },
                ],
            },
        });

        const form: any = computed(() => props.newForm);

        const changeType = (value: number) => {
            form.value.classData = [
                {
                    Data: "",
                    Type:
                        form.value.Type === 1 || form.value.Type === 4 ? 1 : 0,
                    File: {
                        url: "",
                        Bucket: "",
                        Name: "",
                        FileName: "",
                        FilePath: "",
                        Extention: "",
                        Type: 2,
                    },
                    Position: { x: 200, y: 600 },
                    Size: { Width: 297, Height: 377 },
                    Item: [
                        {
                            Data: "",
                            Type:
                                form.value.Type === 3 || form.value.Type === 4
                                    ? 0
                                    : 1,
                            File: {
                                url: "",
                                Bucket: "",
                                Name: "",
                                FileName: "",
                                FilePath: "",
                                Extention: "",
                            },
                            Position: { x: 200, y: 168 },
                            Size: { Width: 240, Height: 168 },
                        },
                    ],
                },
            ];
        };

        const upload = async (
            file: any,
            imgWidth: number,
            imgHeight: number,
            index: number,
            i: undefined | number
        ) => {
            const filePath = await cooOss(
                file,
                get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]
            );
            const fileInfo = await getOssUrl(
                filePath?.objectKey as string,
                get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket
            );
            if (typeof i === "number") {
                form.value.classData[index].Item[i].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.classData[index].Item[i].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };
            } else {
                form.value.classData[index].File = {
                    url: fileInfo,
                    Bucket: "axsfile",
                    FilePath:
                        filePath?.objectKey.split("/")[0] || "ElementFile",
                    FileName: filePath?.name || "",
                    Name: filePath?.name || "",
                    Extention: filePath?.fileExtension || "",
                    Type: 2,
                };
                form.value.classData[index].Size = {
                    Width: imgWidth,
                    Height: imgHeight,
                };
                console.log(form.value.classData, "form.value.classData");
            }
        };

        const onChange = (file: any, index: number, i: undefined | number) => {
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
                            imgWidth > 540 ||
                            imgHeight > 960 ||
                            file.raw.size / 1024 > 1024
                        ) {
                            return ElMessage.warning(
                                "图片像素不超过540 * 960，且文件大小不超过1M"
                            );
                        }
                        upload(file.raw, imgWidth, imgHeight, index, i);
                    };
                };
                reader.readAsDataURL(file.raw);
            }
        };

        const addQuestion = () => {
            if (form.value.classData.length === 5) {
                return ElMessage.warning("最多只能添加5个分类");
            }
            form.value.classData.push({
                Data: "",
                Type: form.value.Type === 1 || form.value.Type === 4 ? 1 : 0,
                File: {
                    url: "",
                    Bucket: "",
                    Name: "",
                    FileName: "",
                    FilePath: "",
                    Extention: "",
                    Type: 2,
                },
                Position: {
                    x: 260 * (form.value.classData.length + 1),
                    y: 600,
                },
                Size: { Width: 297, Height: 377 },
                Item: [
                    {
                        Data: "",
                        Type:
                            form.value.Type === 3 || form.value.Type === 4
                                ? 0
                                : 1,
                        File: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2,
                        },
                        Position: {
                            x: 200,
                            y: 168 * (form.value.classData.length + 1),
                        },
                        Size: { Width: 240, Height: 168 },
                    },
                ],
            });
        };

        const delQuestion = (index: number) => {
            form.value.classData.splice(index, 1);
        };

        const addOption = (index: number) => {
            if (form.value.classData[index].Item.length === 7) {
                return ElMessage.warning("最多只能添加七个分类选项");
            }
            form.value.classData[index].Item.push({
                Data: "",
                Type: form.value.Type === 3 || form.value.Type === 4 ? 0 : 1,
                File: {
                    url: "",
                    Bucket: "",
                    Name: "",
                    FileName: "",
                    FilePath: "",
                    Extention: "",
                    Type: 2,
                },
                Position: {
                    x: 200 * (form.value.classData[index].Item.length + 1),
                    y: 168 * (index + 1),
                },
                Size: { Width: 240, Height: 168 },
            });
        };

        const delOption = (index: number, i: number) => {
            form.value.classData[index].Item.splice(i, 1);
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    console.log(form.value, "handleComfirm");
                    emit("save");
                }
            });
        };

        return {
            ...toRefs(state),
            formRef,
            form,
            changeType,
            onChange,
            addQuestion,
            delQuestion,
            addOption,
            delOption,
            handleComfirm,
        };
    },
});
</script>

<style scoped lang="scss">
.set-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-select {
        width: 120px;
    }
    .el-radio {
        margin-right: 20px;
    }
    .el-input-number {
        width: 110px;
    }
}

.add-box {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    img {
        cursor: pointer;
        width: 25px;
        height: 25px;
        padding-bottom: 4px;
    }
    span {
        margin-left: 4px;
    }
    .num {
        color: var(--el-color-primary);
    }
}
.content-box {
    .text {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
        img {
            cursor: pointer;
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
    }
    .row {
        display: flex;
        justify-content: flex-start;
    }
    .asterisk-left {
        width: 126px;
        height: 94px;
    }
    .option-col {
        position: relative;
        margin-left: 10px;
        .del_img {
            width: 18px;
            height: 18px;
            position: absolute;
            right: -6px;
            top: -10px;
            z-index: 2;
            cursor: pointer;
        }
    }

    .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        margin-bottom: 18px;
        width: 126px;
        height: 94px;
        border: 1px solid var(--el-border-color);
        cursor: pointer;
    }
}

.el-form {
    .el-form-item {
        align-items: center;
    }
}

.avatar-uploader {
    line-height: 20px !important;
    .avatar {
        display: block;
        border-radius: 6px;
        width: 126px;
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
        width: 126px;
        height: 94px;
        line-height: 96px;
        text-align: center;
    }
}
</style>
