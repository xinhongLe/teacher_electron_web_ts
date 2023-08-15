<template>
    <div class="content">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="题目主题：" prop="Title">
                <el-input type="textarea" maxlength="30" show-word-limit v-model="form.Title"/>
            </el-form-item>

            <div>
               <div class="title">正确项<span class="text">{{form.Correct.length}}</span>/50</div>
                <div class="option-content">
                    <el-tag
                        v-for="(item, i) in form.Correct"
                        :key="i"
                        class="mx-1"
                        closable
                        size="large"
                        :disable-transitions="false"
                        @close="handleClose(i, 'Correct')"
                    >
                        {{ item }}
                    </el-tag>
                    <el-input
                        v-if="inputVisibleCorrect"
                        ref="InputCorrectRef"
                        v-model="inputValueCorrect"
                        class="ml-1 w-20"
                        size="default"
                        @keyup.enter="handleInputConfirm('Correct')"
                        @blur="handleInputConfirm('Correct')"
                    />
                    <el-button v-if="form.Correct.length < 50 && !inputVisibleCorrect" type="primary" plain  class="ml-1" size="default" @click="showInput('Correct')">
                        + 新增
                    </el-button>
                </div>
            </div>

            <div>
                <div class="title">干扰项<span class="text">{{form.Interfere.length}}</span>/30</div>
                <div class="option-content">
                    <el-tag
                        v-for="(item, i) in form.Interfere"
                        :key="i"
                        class="mx-1"
                        closable
                        size="large"
                        :disable-transitions="false"
                        @close="handleClose(i)"
                    >
                        {{ item }}
                    </el-tag>
                    <el-input
                        v-if="inputVisible"
                        ref="InputRef"
                        v-model="inputValue"
                        class="ml-1 w-20"
                        size="default"
                        @keyup.enter="handleInputConfirm"
                        @blur="handleInputConfirm"
                    />
                    <el-button type="primary" plain v-if="form.Interfere.length < 30 && !inputVisible" class="ml-1" size="default" @click="showInput">
                        + 新增
                    </el-button>
                </div>
            </div>

            <el-row :gutter="20" class="footer-row">
                <el-col :span="9">
                    <el-form-item label="模式选择：" prop="Round">
                        <el-radio-group v-model="form.Model" class="ml-4">
                            <el-radio v-for="item in modelOptionsMouse" :label="item.value" :key="item.value" size="large">{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="比赛时间(秒)：" prop="Time" label-width="110px">
                        <el-input-number
                            v-model="form.Time"
                            class="mx-4"
                            :min="60"
                            :max="180"
                            controls-position="right"
                        />
                    </el-form-item>
                </el-col>

                <el-col :span="9">
                    <el-form-item label="下落速度：" prop="Speed" >
                        <el-radio-group v-model="form.Speed" class="ml-4">
                            <el-radio :label="0" size="large">快</el-radio>
                            <el-radio :label="1" size="large">中</el-radio>
                            <el-radio :label="2" size="large">慢</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="洞数设置：" prop="holeSet" >
                <el-select v-model="form.holeSet" class="m-2" size="large">
                    <el-option
                        v-for="item in ( form.Model === 0 ? HoleSetOptionList : HoleSetOptionListOne)"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="handleComfirm">保存</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, ref, onMounted, nextTick } from "vue";
import { hitMouseSet, getTeacherPageGameConfig } from "@/api/game";
import { ElMessage, ElMessageBox, ElInput } from "element-plus";
import { Slide } from "wincard";

import { modelOptionsMouse, HoleSetOptionList, HoleSetOptionListOne } from "./hook/options";
import { IhitMouseSetRes } from "@/types/game";

export default defineComponent({
    name: "hitMouseGame",
    props: {
        slide: {
            type: Object as PropType<Slide>,
            require: true
        }
    },
    emits: ["save"],
    setup(props, { emit }) {
        const InputCorrectRef = ref<InstanceType<typeof ElInput>>();
        const InputRef = ref<InstanceType<typeof ElInput>>();
        const state = reactive({
            rules: {
                Title: [{ required: true, message: "请输入题目", trigger: "blur" }],
                Speed: [{ required: true, message: "请选择", trigger: "change" }],
                holeSet: [{ required: true, message: "请选择", trigger: "change" }]
            },
            inputValueCorrect: "",
            inputVisibleCorrect: false,
            inputValue: "",
            inputVisible: false,
            form: {
                Title: "",
                Model: 0,
                Speed: 0,
                Time: 60,
                holeSet: 0,
                Correct: [] as string[],
                Interfere: [] as string[]
            }
        });

        const handleClose = (index: number, type:string) => {
            type === "Correct" ? state.form.Correct.splice(index, 1) : state.form.Interfere.splice(index, 1);
        };

        const showInput = (type: string) => {
            if (type === "Correct") {
                state.inputVisibleCorrect = true;
                nextTick(() => {
                    InputCorrectRef.value!.input!.focus();
                });
            } else {
                state.inputVisible = true;
                nextTick(() => {
                    InputRef.value!.input!.focus();
                });
            }
        };

        const handleInputConfirm = (type: string) => {
            if (type === "Correct" && state.inputValueCorrect) {
                state.form.Correct.push(state.inputValueCorrect);
                state.inputVisibleCorrect = false;
                state.inputValueCorrect = "";
            } else if (state.inputValue) {
                state.form.Interfere.push(state.inputValue);
                state.inputVisible = false;
                state.inputValue = "";
            }
        };

        const formRef = ref();
        const handleComfirm = () => {
            formRef.value.validate((valid: boolean) => {
                if (valid) {
                    if (state.form.Correct.length < 10) {
                        return ElMessage.warning("正确项最少填入十项");
                    }
                    const data = {
                        pageID: props.slide?.id as string,
                        gameID: props.slide?.game?.id as string,
                        config: {
                            ...state.form,
                            HoleRow: state.form.Model === 0 ? HoleSetOptionList[state.form.holeSet].row : HoleSetOptionListOne[state.form.holeSet].row,
                            HoleCol: state.form.Model === 0 ? HoleSetOptionList[state.form.holeSet].col : HoleSetOptionListOne[state.form.holeSet].col
                        }
                    };
                    console.log(data, "---------");
                    _hitMouseSet(data);
                }
            });
        };

        const _hitMouseSet = (data: IhitMouseSetRes) => {
            hitMouseSet(data).then(res => {
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
                if (res.resultCode === 200 && res.result.Config) {
                    const data = res.result.Config;
                    let value:number;
                    if (data.Model === 0) {
                        value = HoleSetOptionList.find(item => item.row === data.HoleRow)?.value || 0;
                    } else {
                        value = HoleSetOptionListOne.find(item => item.row === data.HoleRow)?.value || 0;
                    }
                    state.form = {
                        Title: data.Title,
                        Model: data.Model,
                        Speed: data.Speed,
                        Time: data.Time,
                        holeSet: value,
                        Correct: data.Correct,
                        Interfere: data.Interfere
                    };
                }
            });
        });

        return {
            formRef,
            InputCorrectRef,
            InputRef,
            modelOptionsMouse,
            HoleSetOptionList,
            HoleSetOptionListOne,
            ...toRefs(state),
            handleClose,
            showInput,
            handleInputConfirm,
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

.title{
    font-size: 14px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    margin: 20px 0 10px;
    .text{
        margin-left: 10px;
        color: red;
    }
}

.option-content{
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
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
}

.footer-row{
    display: flex;
    align-items: center;
    .el-form-item{
        display: flex;
        align-items: center;
    }

}

</style>
