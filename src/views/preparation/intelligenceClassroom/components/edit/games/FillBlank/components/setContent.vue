<template>
    <div class="content-detail">
        <div class="top">
            <p @click="addPairing">添加题目 2/3</p>
        </div>
        <div class="middle">
            <div class="question-item">
                <div class="item-left">
                    填空1
                </div>
                <div class="item-right">
                    <el-input
                        v-model="textarea"
                        maxlength="30"
                        placeholder="请输入"
                        show-word-limit
                        type="textarea"
                    />
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

        const leftType = ref(1);
        const rightType = ref(1);

        //添加配对
        const addPairing = () => {
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
        watch(() => leftType.value, val => {
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
        watch(() => rightType.value, val => {
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
            leftType,
            rightType,
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

        //border-bottom: 2px solid #90949e;
        .question-item {
            display: flex;
            padding: 20px;
            border-top: 2px dashed #e1e1e1;
            border-bottom: 2px dashed #e1e1e1;
            margin: 20px 0;
            align-items: center;

            .item-left {

            }
        }
    }

    .footer {
        margin-top: 20px;
        text-align: center;
    }
}

</style>
