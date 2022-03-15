<template>
    <el-dialog
        :title="isEdit ? '编辑课包名称' : '新增课包名称'"
        :model-value="dialogVisible"
        width="60%"
        center
        :before-close="handleClose"
        :destroy-on-close="true"
    >
        <el-form
            ref="formRef"
            :rules="rules"
            label-width="80px"
            :model="formData"
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
                    type="primary"
                    @click="handleConfirm"
                    > {{isEdit ? "保存" : "确 定"}}</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { bagKey } from "@/hooks/useBag";
import { ElFormType } from "@/types/elementType";
import { find } from "lodash";
import { defineComponent, inject, reactive, ref } from "vue";
import { updateCourseBagTeacher } from "../api";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const formRef = ref<ElFormType>();
        const { bagList, selectBag } = inject(bagKey)!;
        const rules = {
            name: [{ required: true, message: "课包名称", trigger: "blur" }]
        };
        const formData = reactive({
            name: selectBag.value?.Name || ""
        });

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const handleConfirm = () => {
            formRef.value!.validate(async valid => {
                if (valid) {
                    const data = {
                        name: formData.name,
                        id: selectBag.value?.ID || ""
                    };
                    const res = await updateCourseBagTeacher(data);
                    if (res.resultCode === 200) {
                        handleClose();
                        selectBag.value!.Name = formData.name;
                        const findBag = find(bagList.value, { ID: selectBag.value?.ID });
                        findBag && (findBag.Name = formData.name);
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
