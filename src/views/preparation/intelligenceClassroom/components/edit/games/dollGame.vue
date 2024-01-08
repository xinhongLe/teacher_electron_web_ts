<template>
    <div>
        <div v-if="!showTextarea" class="body-content">
            <div class="add-box">
                <img @click = addQuestion src="@/assets/projection/icon_add_btn.png" alt="">
                <span>新增题目</span>
            </div>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="70px" label-position="left">
                <div v-for="(item, index) in form.Question" :key="index" class="content">
                    <div class="first-row">
                        <div>{{index + 1}}</div>
                        <div v-if="index !==0" class="text" @click="delQuestion(index, item)">移除</div>
                    </div>
                    <el-form-item label="类型：">
                        <el-radio-group v-model="item.Type">
                            <el-radio :label="1">文本</el-radio>
                            <el-radio :label="2">图片</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="item.Type === 1">
                        <el-form-item label="题目" :prop="`Question[${index}].Subject`" :rules="rules.Subject">
                            <el-input v-model="item.Subject" />
                        </el-form-item>
                        <el-row :gutter="10" v-for="(option, i) in item.Options" :key="i">
                            <el-col :span="14">
                                <el-form-item :label="`选项${i + 1}`" :prop="`Question[${index}].Options[${i}].Text`" :rules="rules.Options">
                                    <el-input v-model="option.Text" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="0" :prop="`Question[${index}].Options[${i}].RightKey`" :rules=" item.Options.some(i => i.RightKey === 1) ? rules.RightKey : rules.RightKeyEmpty">
                                    <el-checkbox :true-label="1" :false-label="0" @change="handleChange(item.Options, i)" v-model="option.RightKey" label="正确答案" name="type" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <div class="opera">
                                    <img v-if="item.Options.length < 4" @click="addOption(item.Options, i)" src="@/assets/projection/icon_add_btn.png" alt="">
                                    <img @click="item.Options.splice(i, 1)" v-if="item.Options.length > 2" src="@/assets/projection/icon_delete.png" alt="">
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-else>
                        <el-form-item  label="题目：" :prop="`Question[${index}].SubjectFile.url`"
                                       :rules="rules.File">
                            <img :style="{ visibility: item.SubjectFile.url ?  'visible' : 'hidden'}" class="doll-img" :src="item.SubjectFile.url" alt="">
                            <el-upload
                                action=""
                                accept=".jpg,.jpeg,.gif,.png"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="(file) => changeFileSubject(file, `${index}`, 'subjectImg')"
                            >
                                <template #trigger>
                                    <el-tooltip class="box-item" effect="light" content="*推荐像素 1330*190" placement="right">
                                        <span class="doll-text">{{item.SubjectFile.url ? "重新上传" : "上传图片"}}</span>
                                    </el-tooltip>
                                </template>
                            </el-upload>
                        </el-form-item>
                        <el-row :gutter="10" v-for="(option, i) in item.Options" :key="i">
                            <el-col :span="14">
                                <el-form-item :label="`选项${i + 1}`" :prop="`Question[${index}].Options[${i}].TextFile.url`" :rules="rules.File">
                                    <img :style="{ visibility: option.TextFile.url ?  'visible' : 'hidden'}" class="doll-img" :src="option.TextFile.url" alt="">
                                    <el-upload
                                        action=""
                                        accept=".jpg,.jpeg,.gif,.png"
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        :on-change="(file) => changeFileSubject(file, `${index}-${i}`, 'optionImg')"
                                    >
                                        <template #trigger>
                                            <el-tooltip class="box-item" effect="light" content="*推荐像素 286*170" placement="right">
                                                <span class="doll-text">{{option.TextFile.url ? "重新上传" : "上传图片"}}</span>
                                            </el-tooltip>
                                        </template>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="0" :prop="`Question[${index}].Options[${i}].RightKey`" :rules=" item.Options.some(i => i.RightKey === 1) ? rules.RightKey : rules.RightKeyEmpty">
                                    <el-checkbox :true-label="1" :false-label="0" @change="handleChange(item.Options, i)" v-model="option.RightKey" label="正确答案" name="type" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <div class="opera">
                                    <img v-if="item.Options.length < 4" @click="addOption(item.Options, i)" src="@/assets/projection/icon_add_btn.png" alt="">
                                    <img @click="item.Options.splice(i, 1)" v-if="item.Options.length > 2" src="@/assets/projection/icon_delete.png" alt="">
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-form-item label="结束语" >
                        <el-input v-model="item.Answer" placeholder="(选填)" />
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div v-else class="body-content">
            <el-input placeholder="题目 xx 答案 xx 选项 xx 选项 xx 正确答案" style="height: 100%" clearable v-model="textValue" type="textarea" />
        </div>
        <div class="footer">
            <!--            <el-button class=" btn" @click="showTextarea = !showTextarea">智能填写</el-button>-->
            <!--            <el-button v-if="showTextarea" type="primary" @click="handleQuack">识别</el-button>-->
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, ref, onMounted } from "vue";
import { dollSet, quackDollSet, getTeacherPageGameConfig } from "@/api/game";
import { IDollSetRes, IDollSubject, IDollItem } from "@/types/game";
import { ElMessage, ElMessageBox } from "element-plus";
import { Slide } from "wincard";
import { cooOss, getOssUrl } from "@/utils/oss";
import { get, STORAGE_TYPES } from "@/utils/storage";
type dollImgLimit = "subjectImg" | "optionImg"
export default defineComponent({
    name: "dollGame",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    setup(props, { emit }) {
        const checkRightKey = (rule: any, value: any, callback: any) => {
            callback();
        };

        const checkRightKeyEmpty = (rule: any, value: any, callback: any) => {
            callback(new Error("至少选择一个"));
        };
        const state = reactive({
            rules: {
                Subject: [{ required: true, message: "请输入题目", trigger: "blur" }],
                Options: [{ required: true, message: "请输入选项", trigger: "blur" }],
                // Answer: [{ required: true, message: "请输入结束语", trigger: "blur" }],
                File: [{ required: true, message: "请上传图片", trigger: ["change", "blur"] }],
                RightKey: [{ validator: checkRightKey, trigger: "blur" }],
                RightKeyEmpty: [{ validator: checkRightKeyEmpty, trigger: "blur" }]
            },
            fileLimit: {
                subjectImg: { maxImgWidth: 1330, maxImgHeight: 190 },
                optionImg: { maxImgWidth: 286, maxImgHeight: 170 }
            },
            showTextarea: false,
            form: {
                Question: [
                    {
                        Type: 1,
                        Subject: "",
                        Answer: "",
                        Bucket: "",
                        Options: [
                            { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                            { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                            { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                            { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 }
                        ],
                        SubjectFile: {
                            url: "",
                            Bucket: "",
                            Name: "",
                            FileName: "",
                            FilePath: "",
                            Extention: "",
                            Type: 2
                        }
                    }
                ]
            },
            textValue: ""
        });

        const addQuestion = () => {
            state.form.Question.push(
                {
                    Type: 1,
                    Subject: "",
                    Answer: "",
                    Bucket: "",
                    Options: [
                        { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                        { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                        { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 },
                        { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 }
                    ],
                    SubjectFile: {
                        url: "",
                        Bucket: "",
                        Name: "",
                        FileName: "",
                        FilePath: "",
                        Extention: "",
                        Type: 2
                    }
                }
            );
        };

        const delQuestion = (index:number, item:IDollSubject) => {
            if (item.Subject || item.Answer || item.Options.some((i:IDollItem) => (i.Text || i.RightKey))) {
                ElMessageBox.confirm("确认删除此题目吗？", "提示",
                    { confirmButtonText: "是", cancelButtonText: "否", type: "warning" }
                ).then(() => {
                    state.form.Question.splice(index, 1);
                }).catch((err) => {
                    return err;
                });
            } else {
                state.form.Question.splice(index, 1);
            }
        };

        const handleChange = (list: IDollItem[], i: number) => {
            if (list[i].RightKey) {
                list.forEach((item: IDollItem, index: number) => {
                    if (index !== i) {
                        item.RightKey = 0;
                    }
                });
            }
        };
        const addOption = (list: any[], index: number) => {
            list.splice(index + 1, 0, { Text: "", TextFile: { url: "", Bucket: "", Name: "", FileName: "", FilePath: "", Extention: "", Type: 2 }, RightKey: 0 });
        };

        const handleQuack = () => {
            if (!state.textValue) return ElMessage({ type: "warning", message: "请输入内容" });
            const data = {
                pageID: props.slide?.id as string,
                gameID: props.slide?.game?.id as string,
                text: state.textValue
            };
            quackDollSet(data).then(res => {
                if (res.resultCode === 200) {
                    ElMessage({ type: "success", message: "快速配置成功" });
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

        const beforeUploadFile = (file:any, type:dollImgLimit) => {
            return new Promise(resolve => {
                var reader = new FileReader();
                reader.onload = function(event: any) {
                    var base64 = event.target.result;
                    var img = document.createElement("img");
                    img.src = base64;
                    img.onload = function() { // 注意只有onload以后才可以拿到图片信息
                        const imgWidth = img.width;
                        const imgHeight = img.height;

                        if (imgWidth > state.fileLimit[type].maxImgWidth || imgHeight > state.fileLimit[type].maxImgHeight) {
                            return ElMessage.warning(`图片像素不超过${state.fileLimit[type].maxImgWidth} * ${state.fileLimit[type].maxImgHeight}`);
                        }
                        resolve("ok");
                    };
                };
                reader.readAsDataURL(file.raw);
            });
        };

        const changeFileSubject = (file:any, index:string, type:dollImgLimit) => {
            beforeUploadFile(file, type).then(async res => {
                if (res === "ok") {
                    const filePath:any = await cooOss(file.raw, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"]);
                    const fileInfo:any = await getOssUrl(filePath?.objectKey as string, get(STORAGE_TYPES.OSS_PATHS)?.["ElementFile"].Bucket);
                    const arr = index.split("-");
                    if (type === "subjectImg") {
                        state.form.Question[Number(arr[0])].SubjectFile = {
                            url: fileInfo,
                            Bucket: "axsfile",
                            FilePath: filePath?.objectKey.split("/")[0] || "ElementFile",
                            FileName: filePath?.name || "",
                            Name: filePath?.name || "",
                            Extention: filePath?.fileExtension || "",
                            Type: 2
                        };
                    } else {
                        state.form.Question[Number(arr[0])].Options[Number(arr[1])].TextFile = {
                            url: fileInfo,
                            Bucket: "axsfile",
                            FilePath: filePath?.objectKey.split("/")[0] || "ElementFile",
                            FileName: filePath?.name || "",
                            Name: filePath?.name || "",
                            Extention: filePath?.fileExtension || "",
                            Type: 2
                        };
                    }
                }
            });
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid:boolean) => {
                if (valid) {
                    const list: IDollSubject[] = state.form.Question.map((item: IDollSubject, index: number) => {
                        item.Sort = index + 1;
                        item.Options.forEach((option: IDollItem, j: number) => {
                            option.Sort = j + 1;
                        });
                        return item;
                    });
                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: {
                            question: list
                        }
                    };
                    _dollSet(data);
                }
            });
        };

        const _dollSet = (data: IDollSetRes) => {
            dollSet(data).then(res => {
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

        onMounted(async () => {
            getTeacherPageGameConfig({ PageID: props.slide!.id }).then(async res => {
                if (res.resultCode === 200 && res.result.Config) {
                    // state.form.Question = res.result.Config.Question;

                    const files = res.result.Config?.Question || [];
                    for (let i = 0; i < files.length; i++) {
                        files[i].Type = files[i].Type || 1;
                        if (files[i].Type === 2) {
                            const fileInfo:any = await getOssUrl(`${files[i].SubjectFile.FilePath}/${files[i].SubjectFile.FileName}.${files[i].SubjectFile.Extention}`, `${files[i].SubjectFile.Bucket}`);
                            files[i].SubjectFile.url = fileInfo;
                            for (let j = 0; j < files[i].Options.length; j++) {
                                const fileInfoTwo:any = await getOssUrl(`${files[i].Options[j].TextFile.FilePath}/${files[i].Options[j].TextFile.FileName}.${files[i].Options[j].TextFile.Extention}`, `${files[i].Options[j].TextFile.Bucket}`);
                                files[i].Options[j].TextFile.url = fileInfoTwo;
                            }
                        }
                    }

                    console.log(files, "=================");
                    state.form.Question = files;
                }
            });
        });

        return {
            formRef,
            ...toRefs(state),
            changeFileSubject,
            addQuestion,
            delQuestion,
            addOption,
            handleChange,
            handleComfirm,
            handleQuack
        };
    }
});

</script>

<style scoped lang="scss">
.body-content{
    width: 100%;
    height: 600px;
    overflow-y: auto;
}

.el-form{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.content{
    box-sizing: border-box;
    width: 400px;
    height: 410px;
    overflow-y: auto;
    border: 1px solid var(--el-border-color);
    padding: 20px 20px 10px;
    margin-bottom: 20px;
    margin-right: 20px;
    .first-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .text{
            color: var(--el-color-primary);
            cursor: pointer;
        }
    }
    .opera{
        margin-top: 8px;
        img{
            width: 16px;
            height: 16px;
            margin-left: 6px;
            cursor: pointer;
        }
    }
    .doll-img{
        width: 20px;
        height: 20px;
        object-fit: cover;
        margin-right: 20px;
    }
    .doll-text{
        color: var(--el-color-primary);
        cursor: pointer;
    }
}
.add-box{
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    img{
        cursor: pointer;
        width: 25px;
        height: 25px;
        padding-bottom: 4px;
    }
    span{
        margin-left: 4px;
    }
}
:deep(.el-textarea__inner){
    height: 96%;
}
.footer{
    text-align: center;
    position: relative;
    margin-top: 20px;
    .btn{
        position: absolute;
        top: 0px;
        left: 0px;
    }
}
</style>
