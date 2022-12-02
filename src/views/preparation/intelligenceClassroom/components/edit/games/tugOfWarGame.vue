<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="70px" label-position="left">
            <div class="header">
                <el-form-item label="每题时间(秒)：" prop="Time" label-width="120px">
                    <el-input v-model.number="form.Time" />
                </el-form-item>
                <el-form-item label="出题顺序："  label-width="84px">
                    <el-radio-group v-model="form.Order">
                        <el-radio class="m_r_14" :label="0">固定</el-radio>
                        <el-radio :label="1">随机</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="比赛模式：" label-width="84px">
                    <el-radio-group v-model="form.Mode">
                        <el-radio class="m_r_14" :label="0">抢答</el-radio>
                        <el-radio :label="1">普通</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div class="add-box">
                <img @click = addQuestion src="@/assets/projection/icon_add_btn.png" alt="">
                <span>新增题目</span>
                <span>
                        ( <span class="active_text">{{form.Question.length}}</span>/10 )
                    </span>
            </div>
            <div class="content-box">
                <div v-for="(item, index) in form.Question" :key="index" class="content">
                    <div class="first-row">
                        <div>
                            <span>{{index + 1}}</span>
                            <span class="active_text">{{item.Options.filter(i => i.RightKey === 1).length >= 2 ? '（多选题）' : ''}}</span>
                        </div>
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
                                <el-checkbox :true-label="1" :false-label="0"  v-model="option.RightKey" label="正确答案" name="type" />
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
            </div>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, ref, onMounted } from "vue";
import { tugOfWarSet, getTeacherPageGameConfig } from "@/api/game";
import { ITugOfWarSetRes, IDollSubject, IDollItem } from "@/types/game";
import { ElMessage, ElMessageBox } from "element-plus";
import { Slide } from "wincard";
export default defineComponent({
    name: "tugOfWarGame",
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
                Time: [{ required: true, message: "请输入时间", trigger: "blur" }],
                Subject: [
                    { required: true, message: "请输入题目", trigger: "blur" },
                    { max: 60, message: "最多60字符", trigger: "blur" }
                ],
                Options: [
                    { required: true, message: "请输入选项", trigger: "blur" },
                    { max: 8, message: "最多8字符", trigger: "blur" }
                ],
                RightKey: [{ validator: checkRightKey, trigger: "blur" }],
                RightKeyEmpty: [{ validator: checkRightKeyEmpty, trigger: "blur" }]
            },
            showTextarea: false,
            form: {
                Time: "",
                Mode: 0,
                Order: 0,
                Question: [
                    { Subject: "", Options: [{ Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }, { Text: "", RightKey: 0 }] }
                ]
            }
        });

        const addQuestion = () => {
            if (state.form.Question.length === 10) {
                return ElMessage.warning("最多只能新增10道题目");
            }
            state.form.Question.push(
                {
                    Subject: "",
                    Options: [
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 },
                        { Text: "", RightKey: 0 }
                    ]
                });
        };

        const delQuestion = (index:number, item:any) => {
            if (item.Subject || item.Options.some((i:any) => (i.Text || i.RightKey))) {
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

        const addOption = (list: IDollItem[], index: number) => {
            list.splice(index + 1, 0, { Text: "", RightKey: 0 });
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid:boolean) => {
                if (valid) {
                    const list: IDollSubject[] = state.form.Question.map((item: any, index: number) => {
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
                            info: {
                                Time: state.form.Time,
                                Mode: state.form.Mode,
                                Order: state.form.Order
                            },
                            question: list
                        }
                    };
                    _tugOfWarSet(data);
                }
            });
        };

        const _tugOfWarSet = (data: ITugOfWarSetRes) => {
            tugOfWarSet(data).then(res => {
                if (res.resultCode === 200) {
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
                    state.form.Time = res.result.Config.Info.Time;
                    state.form.Mode = res.result.Config.Info.Mode;
                    state.form.Order = res.result.Config.Info.Order;
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
            handleComfirm
        };
    }
});

</script>

<style scoped lang="scss">
.m_r_14{
    margin-right: 14px;
}
.active_text{
    color: var(--el-color-primary);
}

.header{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    >div{
        margin-right: 30px;
    }
}

.content-box{
    height: 600px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
}
.content{
    box-sizing: border-box;
    width: 390px;
    height: 320px;
    border: 1px solid var(--el-border-color);
    padding: 24px;
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
