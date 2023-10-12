<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="right">
            <div class="header">
                <el-row :gutter="20">
                    <el-col :span="8">
                         <el-form-item label="游戏模式：">
                        <el-select v-model="form.Model" class="m-2" size="large" @change="handleChange">
                            <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="游戏计时：">
                            <el-select v-model="form.TimeModel" class="m-2" size="large">
                                <el-option
                                    v-for="item in optionList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" v-if="form.TimeModel !== 0">
                        <el-form-item label-width="0px" prop="Time" >
                            <el-input v-model="form.Time" size="large" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="1"  v-if="form.TimeModel !== 0" style="padding-left: 0">
                        <div style="padding-top: 10px">秒</div>
                    </el-col>
                </el-row>

                <el-form-item label="题干文本：" prop="Title">
                    <el-input type="textarea" maxlength="20" show-word-limit v-model="form.Title" size="large" />
                </el-form-item>
            </div>
            <div class="add-box" v-if="form.Data.length < 12">
                <img @click="addQuestion" src="@/assets/projection/icon_add_btn.png" alt=""/>
                <span>添加选项</span>
                <span>(<span class="num">{{form.Data.length}}</span>/12 )</span>
            </div>

            <div class="content-box">
                <div v-for="(item, index) in form.Data" :key="index" class="option-col">
                    <el-form-item label-width="0px"
                                  :prop="item.ItemA.Type === 0 ?`Data[${index}].ItemA.File.url` : `Data[${index}].ItemA.Text`"
                                  :rules="item.ItemA.Type === 0 ? rules.File : rules.Text">
                        <upload
                            v-if="item.ItemA.Type === 0"
                            :isLimitImg="false"
                            :imgUrl="item.ItemA.File.url"
                            :index="index + '-A'"
                            @uploadSuccess="uploadSuccess"
                        ></upload>
                        <el-input
                            v-else
                            v-model="item.ItemA.Text"
                            maxlength="15"
                            show-word-limit
                            :autosize="{ minRows: 4, maxRows: 4}"
                            placeholder="请输入文字"
                            style="margin-right: 10px"
                            type="textarea"/>
                    </el-form-item>

                    <div class="center">
                        <span class="block"></span>
                        <img v-if="index > 2" @click="delQuestion(index)" class="del_img" src="@/assets/projection/icon_delete.png" alt=""/>
                    </div>

                    <el-form-item label-width="0px"
                                  :prop="item.ItemB.Type === 0 ?`Data[${index}].ItemB.File.url` : `Data[${index}].ItemB.Text`"
                                  :rules="item.ItemB.Type === 0 ? rules.File : rules.Text">
                        <upload
                            v-if="item.ItemB.Type === 0"
                            :isLimitImg="false"
                            :imgUrl="item.ItemB.File.url"
                            :index="index + '-B'"
                            @uploadSuccess="uploadSuccess"
                        ></upload>
                        <el-input
                            v-else
                            v-model="item.ItemB.Text"
                            maxlength="15"
                            show-word-limit
                            :autosize="{ minRows: 4, maxRows: 4}"
                            placeholder="请输入文字"
                            type="textarea"/>
                    </el-form-item>

                </div>
            </div>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ref, PropType, onMounted } from "vue";
import { getOssUrl } from "@/utils/oss";
import Upload from "./components/upload.vue";
import { getTeacherPageGameConfig, linkSet } from "@/api/game";
import { Slide } from "wincard";
import { IlinkSetRes } from "@/types/game";

export default defineComponent({
    name: "linkGame",
    emits: ["save"],
    components: { Upload },
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            typeList: [
                { name: "图片+图片", value: 0 },
                { name: "图片+文字", value: 1 },
                { name: "文字+文字", value: 2 }
            ],
            optionList: [
                { name: "正计时", value: 0 },
                { name: "倒计时", value: 1 }
            ],
            rules: {
                Time: [{ required: true, message: "请输入", trigger: "blur" }],
                Title: [{ required: true, message: "请输入", trigger: "blur" }],
                Text: [{ required: true, message: "请输入", trigger: "blur" }],
                File: [{ required: true, message: "请上传图片", trigger: ["change", "blur"] }]
            },
            form: {
                Model: 1,
                TimeModel: 0,
                Time: "",
                Title: "",
                Data: [
                    {
                        ItemA: {
                            Type: 0,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        },
                        ItemB: {
                            Type: 1,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        }
                    },
                    {
                        ItemA: {
                            Type: 0,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        },
                        ItemB: {
                            Type: 1,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        }
                    },
                    {
                        ItemA: {
                            Type: 0,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        },
                        ItemB: {
                            Type: 1,
                            Text: "",
                            File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                        }
                    }
                ]
            }
        });

        const handleChange = () => {
            formRef.value.clearValidate();
            state.form.Data = [
                {
                    ItemA: {
                        Type: state.form.Model === 2 ? 1 : 0,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    },
                    ItemB: {
                        Type: state.form.Model === 0 ? 0 : 1,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    }
                },
                {
                    ItemA: {
                        Type: state.form.Model === 2 ? 1 : 0,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    },
                    ItemB: {
                        Type: state.form.Model === 0 ? 0 : 1,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    }
                },
                {
                    ItemA: {
                        Type: state.form.Model === 2 ? 1 : 0,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    },
                    ItemB: {
                        Type: state.form.Model === 0 ? 0 : 1,
                        Text: "",
                        File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                    }
                }
            ];
        };

        const addQuestion = () => {
            // if (state.form.classData.length === 5) {
            //     return ElMessage.warning("最多只能添加5个分类");
            // }
            state.form.Data.push({
                ItemA: {
                    Type: state.form.Model === 2 ? 1 : 0,
                    Text: "",
                    File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                },
                ItemB: {
                    Type: state.form.Model === 0 ? 0 : 1,
                    Text: "",
                    File: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }
                }
            });
        };

        const delQuestion = (index: number) => {
            state.form.Data.splice(index, 1);
        };

        const uploadSuccess = async (data: {filePath:string, fileInfo: string, index:string}) => {
            const { filePath, fileInfo, index } = data;
            debugger;
            const arr = index.split("-");
            const str = arr[1] === "A" ? "ItemA" : "ItemB";
            state.form.Data[Number(arr[0])][str].File = {
                url: fileInfo,
                Bucket: "axsfile",
                FilePath: filePath.split("/")[0],
                FileName: filePath.split("/")[1].split(".")[0],
                Name: filePath.split("/")[1].split(".")[0],
                Extention: filePath.split(".")[1],
                Type: 2
            };
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: state.form
                    };
                    _linkSet(data);
                }
            });
        };

        const _linkSet = (data:IlinkSetRes) => {
            linkSet(data).then(res => {
                if (res.resultCode === 200) {
                    // ElMessage({ type: "success", message: "配置成功" });
                    const data = {
                        ID: props.slide?.game?.id,
                        Name: props.slide?.game?.name,
                        Url: props.slide?.game?.src.includes("?pageId")
                            ? `${props.slide?.game?.src.split("?pageId")[0]}?pageId=${props.slide?.id}&time=${new Date().getTime()}` : `${props.slide?.game?.src}?pageId=${props.slide?.id}&time=${new Date().getTime()}`
                    };
                    emit("save", data);
                }
            });
        };
        onMounted(() => {
            getTeacherPageGameConfig({ PageID: props.slide!.id }).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    const files = res.result.Config.Data || [];
                    for (let i = 0; i < files.length; i++) {
                        if (files[i].ItemA.Type === 0) {
                            const fileInfo = await getOssUrl(`${files[i].ItemA.File.FilePath}/${files[i].ItemA.File.FileName}.${files[i].ItemA.File.Extention}`, `${files[i].ItemA.File.Bucket}`);
                            files[i].ItemA.File.url = fileInfo;
                        }
                        if (files[i].ItemB.Type === 0) {
                            const fileInfo = await getOssUrl(`${files[i].ItemB.File.FilePath}/${files[i].ItemB.File.FileName}.${files[i].ItemB.File.Extention}`, `${files[i].ItemB.File.Bucket}`);
                            files[i].ItemB.File.url = fileInfo;
                        }
                    }

                    state.form = {
                        Model: res.result.Config.Model,
                        TimeModel: res.result.Config.TimeModel,
                        Time: res.result.Config.Time,
                        Title: res.result.Config.Title,
                        Data: files
                    };
                }
            });
        });

        return {
            ...toRefs(state),
            formRef,
            handleChange,
            uploadSuccess,
            addQuestion,
            delQuestion,
            handleComfirm
        };
    }
});
</script>

<style scoped lang="scss">
.set-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
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
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
    max-height: 400px;
    overflow-y: auto;
    .option-col{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--el-border-color);
        padding: 10px;
        margin-right: 14px;
        margin-bottom: 20px;
        &:nth-of-type(3n){
            margin-right: 0px;
        }
        .center{
            text-align: center;
            margin-right: 10px;
        }
        .block{
            display: block;
            width: 30px;
            height: 6px;
            background-color: var(--el-border-color);
            border-radius: 5px;
        }
        .del_img {
            width: 18px;
            height: 18px;
            cursor: pointer;
            margin-top: 10px;
        }
        .el-textarea{
            width: 96px;
            height: 96px;
            margin-bottom: 20px;
        }
    }
}

.el-form {
    .el-form-item {
        align-items: center;
    }
}
</style>
