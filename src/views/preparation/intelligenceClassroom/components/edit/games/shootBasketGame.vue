<template>
    <div>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
            <div>
                <el-form-item label="PK模式：">
                    <el-radio-group v-model="form.Model" class="ml-4">
                        <el-radio :label="0" size="large">小组</el-radio>
                        <el-radio :label="1" size="large">双人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="add-box" v-if="form.Data.length < 3">
                    <img @click = addQuestion src="@/assets/projection/icon_add_btn.png" alt="">
                    <span>新建分组</span>
                </div>
            </div>
            <div class="content-box">
                <div v-for="(question, index) in form.Data" :key="index" class="content">
                    <div class="first-row">
                        <div class="group-title">分组{{index + 1}}</div>
                        <div v-if="index > 1" class="text" @click="delQuestion(index)">移除</div>
                    </div>
                    <el-form-item label="名称" :prop="`Data[${index}].Title`" :rules="rules.Title" label-width="60px">
                        <el-input v-model="question.Title" maxlength="8" show-word-limit type="textarea" />
                    </el-form-item>
                    <div class="option-content">
                        <el-tag
                            v-for="(item, i) in question.Answer"
                            :key="i"
                            class="mx-1"
                            closable
                            size="large"
                            :disable-transitions="false"
                            @close="handleClose(index, i)"
                        >
                            {{ item }}
                        </el-tag>
                        <el-input
                            v-if="question.inputVisible"
                            ref="inputRef"
                            v-model="question.inputValue"
                            class="ml-1 w-20"
                            size="default"
                            @keyup.enter="handleInputConfirm(index)"
                            @blur="handleInputConfirm(index)"
                        />
                        <el-button v-if="question.Answer.length < 10 && !question.inputVisible" type="primary" plain  class="ml-1" size="default" @click="showInput(index)">
                            + 新增
                        </el-button>

                        <div class="title">选项<span class="text">{{question.Answer.length}}</span>/10</div>
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
import { defineComponent, nextTick, onMounted, PropType, reactive, ref, toRefs } from "vue";
import { getTeacherPageGameConfig, basketSet } from "@/api/game";
import { Slide } from "wincard";
import { ElInput, ElMessage } from "element-plus";
export default defineComponent({
    name: "shootBasket",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    setup(props, { emit }) {
        const inputRef = ref<InstanceType<typeof ElInput>[]>();
        const state = reactive({
            rules: {
                Title: [{ required: true, message: "请输入", trigger: "blur" }]
            },
            form: {
                Model: 0,
                Data: [
                    { Title: "", inputVisible: false, inputValue: "", Answer: [] as string[] },
                    { Title: "", inputVisible: false, inputValue: "", Answer: []as string[] }
                ]
            }
        });

        const addQuestion = () => {
            state.form.Data.push({ Title: "", inputVisible: false, inputValue: "", Answer: [] });
        };
        const delQuestion = (index:number) => {
            state.form.Data.splice(index, 1);
        };

        const handleClose = (index: number, i: number) => {
            state.form.Data[index].Answer.splice(i, 1);
        };

        const showInput = (index:number) => {
            state.form.Data[index].inputVisible = true;
            nextTick(() => {
                inputRef.value && inputRef.value[0]!.input!.focus();
            });
        };

        const handleInputConfirm = (index:number) => {
            if (state.form.Data[index].inputValue) {
                state.form.Data[index].Answer.push(state.form.Data[index].inputValue);
            }
            state.form.Data[index].inputVisible = false;
            state.form.Data[index].inputValue = "";
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid:boolean) => {
                if (valid) {
                    const flag = state.form.Data.some((item, index) => {
                        if (item.Answer.length === 0) {
                            ElMessage.warning(`请在分组${index + 1}中至少添加一个选项`);
                            return true;
                        }
                    });
                    if (flag) return;
                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: {
                            ...state.form
                        }
                    };
                    _basketSet(data);
                }
            });
        };

        const _basketSet = (data:any) => {
            basketSet(data).then(res => {
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
                    state.form = {
                        Model: res.result.Config.Model,
                        Data: res.result.Config.Data || []
                    };
                }
            });
        });

        return {
            formRef,
            inputRef,
            ...toRefs(state),
            addQuestion,
            delQuestion,
            handleClose,
            showInput,
            handleInputConfirm,
            handleComfirm
        };
    }
});

</script>

<style scoped lang="scss">
.content-box{
    height: 520px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
}
.content{
    box-sizing: border-box;
    width: 50%;
    //height: 100%;
    padding: 22px;
    .first-row{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .group-title{
            font-size: 16px;
            font-weight: 600;
        }
        .text{
            color: var(--el-color-primary);
            cursor: pointer;
        }
    }

    .option-content{
        position: relative;
        border: 1px solid var(--el-border-color);
        padding: 20px;
        margin-bottom: 20px;
        height: 200px;
        overflow-y: auto;
        .el-button{
            margin-bottom: 20px;
        }
        .el-tag{
            margin-right: 20px;
            margin-bottom: 20px;
        }
        .el-input{
            width: 100px;
            margin-bottom: 20px;
        }
        .title{
            position: absolute;
            right: 10px;
            bottom: -6px;
            font-size: 14px;
            font-weight: bold;
            color: var(--el-text-color-regular);
            margin: 20px 0 10px;
            .text{
                margin-left: 5px;
                color: red;
            }
        }
    }
}
.add-box{
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
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
</style>
