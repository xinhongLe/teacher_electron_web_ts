<template>
    <el-dialog
        :title="isEdit ? '编辑课包名称' : '新增课包名称'"
        :model-value="dialogVisible"
        width="60%"
        center
        :before-close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80px"
            style="width: 60%; margin: 0 auto"
        >
            <el-form-item label="课包名称" prop="name">
                <el-input v-model="formData.name" placeholder="课包名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button
                    v-if="!isEdit"
                    type="primary"
                    @click="handleConfirm"
                    >确 定</el-button
                >
                <div v-else class="footerBtn">
                    <el-button type="primary" @click="handleConfirm"
                        >编辑</el-button
                    >
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { ElFormType } from "@/types/elementType";
import { Course } from "@/types/preparation";
import { defineComponent, inject, PropType, reactive, ref } from "vue";
import { addCourseBagTeacher, updateCourseBagTeacher } from "../api";
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
        lessonOrBagValue: {
            type: Object as PropType<Course>,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const formRef = ref<ElFormType>();
        const rules = {
            name: [{ required: true, message: "课包名称", trigger: "blur" }]
        };
        const formData = reactive({
            name: ""
        });

        const getTeacherLessonAndBag = inject("getTeacherLessonAndBag") as () => void;

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const handleConfirm = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    let res;
                    const data = {
                        name: formData.name,
                        lessonID: props.lessonOrBagValue.ID
                    };
                    if (props.isEdit) {
                        res = await updateCourseBagTeacher(data);
                    } else {
                        res = await addCourseBagTeacher(data);
                    }
                    if (res?.resultCode === 200) {
                        handleClose();
                        getTeacherLessonAndBag();
                    }
                }
            });
        };

        return {
            rules,
            formData,
            handleClose,
            formRef,
            handleConfirm
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
