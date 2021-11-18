<template>
    <el-dialog
        :title="isEdit ? '编辑自定义课时' : '添加自定义课时'"
        :model-value="dialogVisible"
        width="60%"
        center
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="100px"
            style="width: 60%; margin: 0 auto"
        >
            <el-form-item label="课时序号：">
                <span>课时{{ lessonIndex + 1 }}</span>
            </el-form-item>
            <el-form-item label="课时名称：" prop="name">
                <el-input v-model="formData.name" placeholder="课时名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="addLesson">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { store } from "@/store";
import { ElFormType } from "@/types/elementType";
import { AddCustomBookLessonData } from "@/types/preparation";
import { defineComponent, inject, reactive, ref } from "vue";
import { addCustomBookLesson } from "../api";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        lessonIndex: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const rules = {
            name: [{ required: true, message: "课包名称", trigger: "blur" }]
        };
        const formData = reactive({
            name: ""
        });
        const formRef = ref<ElFormType>();
        const getTeacherLessonAndBag = inject("getTeacherLessonAndBag") as () => void;

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const addLesson = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    if (!props.isEdit) {
                        const data: AddCustomBookLessonData = {
                            chapterID: store.state.preparation.selectChapterID,
                            name: formData.name,
                            detail: ""
                        };
                        const res = await addCustomBookLesson(data);
                        if (res.resultCode === 200) {
                            handleClose();
                            getTeacherLessonAndBag();
                        }
                    }
                }
            });
        };

        return {
            rules,
            formData,
            formRef,
            addLesson,
            handleClose
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
