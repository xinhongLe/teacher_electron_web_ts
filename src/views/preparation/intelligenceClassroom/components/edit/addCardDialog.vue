<template>
    <el-dialog
        v-model="visible"
        title="请添加卡名称"
        width="60%"
        center
        @close="close"
    >
        <div class="page-type-box">
            <el-form
                ref="ruleForm"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handleComfirm"
                    >确定</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, watch, reactive, toRefs, ref } from "vue";
export default defineComponent({
    name: "addCardDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        }
    },
    emits: ["update:dialogVisible", "handleAddCard"],
    setup(props, { emit }) {
        const state = reactive({
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "change"
                    }
                ]
            }
        });
        const ruleForm = ref();
        const form = ref({
            name: ""
        });
        const visible = computed(() => props.dialogVisible);

        watch(
            () => visible,
            (val) => {
                console.log(ruleForm);
                if (val) {
                }
            }
        );

        const handleComfirm = () => {
            emit("handleAddCard", form.value.name);
        };
        const close = () => {
            form.value.name = "";
            emit("update:dialogVisible", false);
        };
        return {
            ...toRefs(state),
            form,
            ruleForm,
            visible,
            handleComfirm,
            close
        };
    }
});
</script>
<style lang="scss" scoped>
</style>
