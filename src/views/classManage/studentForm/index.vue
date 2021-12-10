<template>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="130px">
        <el-form-item label="学生姓名：" prop="name">
            <el-input
                v-model="formData.name"
                @change="getSystemAccountPwd"
                :maxlength="20"
            ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
            <el-input
                :disabled="isEdit"
                 v-model="formData.phone"
                @change="getSystemAccountPwd"
            ></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
            <el-input  v-model="formData.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
            <el-input
                :disabled="isEdit"
                 v-model="formData.password"
                :type="isEdit ? 'password' : ''"
                :maxlength="20"
                @input="onPasInput"
            >
                <template v-slot:append v-if="isEdit"
                    ><div
                        style="cursor: pointer"
                        @click="$emit('showRestPass')"
                    >
                        重置
                    </div></template
                >
            </el-input>
        </el-form-item>
        <el-form-item label="性别：">
            <el-radio  v-model="formData.sex" :label="1">男孩</el-radio>
            <el-radio  v-model="formData.sex" :label="2">女孩</el-radio>
        </el-form-item>
        <el-form-item label="生日：">
            <el-date-picker
                 v-model="formData.birthday"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
            >
            </el-date-picker>
        </el-form-item>
        <slot></slot>
        <el-form-item label="每日任务配置：">
            <div class="config">
                <p>集中攻克完成量<span>（每日至少完成的数量）</span></p>
                <el-input-number
                     v-model="formData.num"
                    :min="0"
                    :max="50"
                    label="描述文字"
                    size="medium"
                    :precision="0"
                ></el-input-number>
            </div>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { ElFormType } from "@/types/elementType";
import { defineComponent, PropType, reactive, ref } from "vue";
import { getAccountPassword } from "../api";
const checkPassword = (rule: unknown, value: string, callback: (error?: Error) => void) => {
    const reg = new RegExp(
        "[`~!@\\-_#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
    );
    if (value.length < 8) {
        callback(new Error("密码至少8个字符"));
    } else if (value.length > 20) {
        callback(new Error("密码最多20个字符"));
    } else if (
        !(/^(?![0-9]+$)/.test(value) || !/^(?![a-zA-Z]+$)/.test(value)) ||
        !reg.test(value)
    ) {
        callback(new Error("密码必须包含数字、字母和特殊符号"));
    } else {
        callback();
    }
};

interface From {
    name: string,
    phone: string,
    account: string,
    password: string,
    sex: number,
    birthday: string,
    num: number,
}

export default defineComponent({
    name: "studentForm",
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        form: {
            type: Object as PropType<From>,
            required: true
        }
    },
    setup(props) {
        const formData = reactive(props.form);
        const formRef = ref<ElFormType>();
        const rules = {
            name: [
                {
                    required: true,
                    message: "请输入学生姓名",
                    trigger: "blur"
                }
            ],
            phone: [
                { required: true, message: "请输入手机号", trigger: "blur" }
            ],
            account: [
                { required: true, message: "请输入账号", trigger: "blur" },
                {
                    pattern: /^(\d+[a-zA-Z]+|[a-zA-Z]+\d+)([0-9a-zA-Z]*)$/,
                    message: "只可以输入数字+字母",
                    trigger: ["blur", "change"]
                }
            ],
            password: [
                { required: true, message: "请输入密码", trigger: "blur" },
                { validator: checkPassword, trigger: "blur" }
            ]
        };

        const getSystemAccountPwd = async () => {
            if (formData.name && formData.phone && !props.isEdit) {
                const res = await getAccountPassword({
                    parentMobile: formData.phone,
                    studentName: formData.name
                });
                if (res.resultCode === 200) {
                    if (res.result.account) {
                        formData.account = res.result.account;
                        formData.password = res.result.password;
                    }
                }
            }
        };

        const onPasInput = (value:string) => {
            if (value) {
                formData.password = value.replace(/[\u4E00-\u9FA5]|\s+/g, "");
            }
        };

        return {
            formData,
            formRef,
            getSystemAccountPwd,
            onPasInput,
            rules
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
