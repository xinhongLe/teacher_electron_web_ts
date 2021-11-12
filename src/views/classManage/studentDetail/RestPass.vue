<template>
    <el-dialog
        title="重置密码"
        :model-value="visible"
        width="500px"
        append-to-body
        :before-close="handleClose"
    >
        <div class="rest-pass">
            <div class="info">
                <span><i class="el-icon-user"></i>姓名：{{ info.name }}</span>
                <span
                    ><i class="el-icon-mobile-phone"></i>账号：{{ info.account }}</span
                >
            </div>
            <el-form
                :rules="rules"
                ref="formRef"
                :model="form"
                label-width="100px"
                label-position="left"
            >
                <el-form-item label="新密码：" prop="pass1">
                    <el-input
                        placeholder="请输入新密码"
                        v-model="form.pass1"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="pass2">
                    <el-input
                        placeholder="请再次输入新密码"
                        v-model="form.pass2"
                        show-password
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <span @click="handleClose">取消</span>
                <span @click="save">确认</span>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { ElFormType } from "@/types/elementType";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, ref } from "vue";
import { resetStudentPassword } from "../api";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const formRef = ref<ElFormType>();
        const form = reactive({
            pass1: "",
            pass2: ""
        });

        const rules = {
            pass1: [
                {
                    required: true,
                    message: "请输入新密码",
                    trigger: "blur"
                }
            ],
            pass2: [
                {
                    required: true,
                    message: "请再次输入新密码",
                    trigger: "blur"
                }
            ]
        };

        const handleClose = () => {
            emit("update:visible", false);
        };

        const save = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    if (form.pass1 !== form.pass2) {
                        return ElMessage.info("两次输入密码不一致");
                    }
                    const data = {
                        studentId: props.info.id,
                        password: form.pass1,
                        teacherId: get(STORAGE_TYPES.USER_INFO).ID
                    };
                    const res = await resetStudentPassword(data);
                    if (res.resultCode === 200) {
                        ElMessage.success("密码修改成功");
                        handleClose();
                    }
                }
            });
        };

        return {
            form,
            handleClose,
            rules,
            formRef,
            save
        };
    }
});
</script>

<style lang="scss" scoped>
.rest-pass {
    padding: 0 40px;
    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        span {
            font-size: 16px;
            font-weight: 400;
            color: #5f626f;
            line-height: 22px;
            flex: 1;
            i {
                margin-right: 3px;
            }
        }
    }
    .btns {
        border-top: 1px solid #f5f6fa;
        display: flex;
        justify-content: center;
        margin-bottom: -32px;
        margin-top: 40px;
        span {
            width: 120px;
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
            background: #4b71ee;
            color: #fff;
            margin-left: 24px;
        }
    }
}
</style>
