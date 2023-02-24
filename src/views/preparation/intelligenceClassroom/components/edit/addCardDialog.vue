<template>
    <el-dialog v-if="visible" v-model="visible" title="请填写文件夹名称" width="30%" center @close="close">
        <div class="page-type-box">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" @submit.prevent="() => false">
                <el-form-item label="名称" prop="name">
                    <el-input
                        @keyup.enter="handleComfirm"
                        v-model="form.name"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref } from "vue";

export default defineComponent({
    name: "addCardDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
    },
    emits: ["update:dialogVisible", "handleAddCard"],
    setup(props, { emit }) {
        const state = reactive({
            rules: {
                name: [
                    { required: true, message: "请输入名称", trigger: "change" }
                ]
            }

        });
        const ruleForm = ref();
        const form = ref({
            name: ""
        });
        const visible = computed(() => props.dialogVisible);

        const handleComfirm = () => {
            ruleForm.value.validate((valid: Boolean) => {
                if(valid){
                    emit("handleAddCard", form.value.name);
                    close();
                }
            })
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

<style scoped>

</style>
