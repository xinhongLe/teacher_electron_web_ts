<template>
    <el-dialog
        title="添加老师"
        :model-value="visible"
        width="820px"
        append-to-body
        :before-close="handleClose"
    >
        <div class="tab">
            <span :class="{ active: tabIndex == 0 }" @click="tabIndex = 0"
                >注册单个学生</span
            >
            <span :class="{ active: tabIndex == 1 }" @click="tabIndex = 1"
                >表格批量导入</span
            >
            <span :class="{ active: tabIndex == 2 }" @click="tabIndex = 2"
                >添加已有学生</span
            >
        </div>
        <div class="form" v-if="tabIndex === 0">
            <StudentForm ref="formRef" :form="formData">
                <el-form-item label="班级和年级：">
                    <el-input v-model="formData.className" disabled></el-input>
                </el-form-item>
            </StudentForm>
        </div>
        <Import v-show="tabIndex === 1" v-model:isDisabledBtn="isDisabledBtn" @successCallback="successCallback" ref="uploadRef"/>
        <StudentInfo v-if="tabIndex === 2" @successCallback="successCallback" ref="studentRef"/>
        <div class="btns">
            <span @click="handleClose">取消</span>
            <span  @click="save" :class="tabIndex === 1 && isDisabledBtn ? 'disable' : ''">保存</span>
            <!-- <span v-if="tabIndex == 1 && !fileList.name" style="background: #D4D6D9;color: #fff">保存</span> -->
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { ActionTypes, store } from "@/store";
import { defineComponent, ref } from "vue";
import StudentForm from "../studentForm/index.vue";
import useStudentForm from "./useStudentForm";
import Import from "./Import.vue";
import StudentInfo from "./StudentInfo.vue";
export default defineComponent({
    name: "addStudent",
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const tabIndex = ref(0);
        const formRef = ref<InstanceType<typeof StudentForm>>();
        const uploadRef = ref<InstanceType<typeof Import>>();
        const studentRef = ref<InstanceType<typeof StudentInfo>>();
        const isDisabledBtn = ref(true);
        const { formData, saveForm } = useStudentForm();

        const handleClose = () => {
            emit("update:visible", false);
        };

        const successCallback = () => {
            handleClose();
            setTimeout(async () => {
                await store.dispatch(ActionTypes.FETCH_CLASS_LIST);
                store.dispatch(ActionTypes.FETCH_STUDENT_LIST);
            }, 300);
        };

        const save = () => {
            if (tabIndex.value === 0) {
                formRef.value!.formRef!.validate(valid => {
                    if (valid) {
                        saveForm(successCallback);
                    }
                });
            } else if (tabIndex.value === 1) {
                uploadRef.value!.uploadRef!.submit();
            } else {
                studentRef.value!.save();
            }
        };
        return {
            handleClose,
            tabIndex,
            formRef,
            successCallback,
            save,
            isDisabledBtn,
            uploadRef,
            studentRef,
            formData
        };
    },
    components: { StudentForm, Import, StudentInfo }
});
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
    padding: 0;
}
.tab {
    display: flex;
    justify-content: center;
    span {
        width: 160px;
        height: 40px;
        cursor: pointer;
        background: #eff0f4;
        border-radius: 4px;
        margin-right: 8px;
        font-size: 16px;
        color: #5f626f;
        line-height: 40px;
        text-align: center;
        display: block;
    }
    .active {
        color: #fff;
        background: #4b71ee;
    }
}
.form {
    padding: 50px 100px 0 80px;
}
.btns {
    border-top: 1px solid #f5f6fa;
    display: flex;
    justify-content: center;
    margin-bottom: -32px;
    span {
        width: 200px;
        cursor: pointer;
        height: 40px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e0e2e7;
        font-size: 16px;
        color: #19203d;
        line-height: 40px;
        text-align: center;
        margin: 16px 0;
    }
    span:nth-of-type(2) {
        &.disable {
            background: #D4D6D9;
        }
        background: #4b71ee;
        color: #fff;
        margin-left: 24px;
    }
}
</style>
