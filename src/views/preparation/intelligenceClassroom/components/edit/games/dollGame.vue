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
                    <el-form-item label="结束语" :prop="`Question[${index}].Answer`" :rules="rules.Answer" >
                        <el-input v-model="item.Answer" />
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
                Answer: [{ required: true, message: "请输入结束语", trigger: "blur" }],
                RightKey: [{ validator: checkRightKey, trigger: "blur" }],
                RightKeyEmpty: [{ validator: checkRightKeyEmpty, trigger: "blur" }]
            },
            showTextarea: false,
            form: {
                Question: [
                    { Subject: "", Answer: "", Options: [{ Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }] }
                ]
            },
            textValue: ""
        });

        const addQuestion = () => {
            state.form.Question.push(
                {
                    Subject: "",
                    Answer: "",
                    Options: [
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 }
                    ]
                });
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
        const addOption = (list: IDollItem[], index: number) => {
            list.splice(index + 1, 0, { Text: "", RightKey: 0 });
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
            getTeacherPageGameConfig({ PageID: props.slide!.id }).then(res => {
                if (res.resultCode === 200 && res.result.Config && res.result.Config.Question.length > 0) {
                    state.form.Question = res.result.Config.Question;
                }
            });
        });

        return {
            formRef,
            ...toRefs(state),
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
}

.el-form{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    height: 600px;
    overflow-y: auto;
}
.content{
    box-sizing: border-box;
    width: 400px;
    height: 370px;
    border: 1px solid #dcdfe6;
    padding: 24px;
    margin-bottom: 20px;
    margin-right: 20px;
    .first-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .text{
            color: #409eff;
            cursor: pointer;
        }
    }
    .opera{
        padding-top: 8px;
        img{
            width: 16px;
            height: 16px;
            margin-left: 6px;
            cursor: pointer;
        }
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
