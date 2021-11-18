<template>
    <el-dialog
        title="添加自定义单元"
        :model-value="dialogVisible"
        width="60%"
        center
        :before-close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="100px"
            style="width: 60%; margin: 0 auto"
        >
            <el-form-item label="单元名称：" prop="name">
                <el-input v-model="formData.name" placeholder="单元名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ElFormType } from "@/types/elementType";
import { AddChapterData } from "@/types/preparation";
import { defineComponent, reactive, ref } from "vue";
import { addChapter } from "../api";
export default defineComponent({
    props: {
        bookID: {
            type: String,
            default: () => ""
        },
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const rules = {
            name: [{ required: true, message: "单元名称", trigger: "blur" }]
        };
        const formData = reactive({
            name: ""
        });

        const formRef = ref<ElFormType>();

        const submit = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    const data:AddChapterData = {
                        bookID: props.bookID,
                        name: formData.name
                    };

                    const res = await addChapter(data);
                    if (res.resultCode === 200) {
                        handleClose();
                        emit("getTeacherBookChapters");
                    }
                }
            });
        };

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        return {
            formData,
            rules,
            submit,
            formRef,
            handleClose
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
