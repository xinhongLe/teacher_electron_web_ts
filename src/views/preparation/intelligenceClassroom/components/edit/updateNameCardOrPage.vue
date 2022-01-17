<template>
    <el-dialog v-model="visible" title="请修改名称" width="30%" center @close="close">
        <div class="page-type-box">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" @submit.prevent="() => false">
                <el-form-item label="名称" prop="name">
                    <el-input
                        @keyup.enter="handleComfirm"
                        v-model="form.name"
                        autofocus
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
import { computed, defineComponent, watch, reactive, toRefs, ref } from "vue";

export default defineComponent({
    name: "updateNameCardOrPage",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        currentValue: {
            type: Object,
            require: true
        }
    },
    emits: ["update:dialogVisible", "updateName"],
    setup(props, { emit }) {
        const state = reactive({
            rules: {
                name: [
                    { required: true, message: "请输入名称", trigger: "change" }
                ]
            }

        });
        const form = ref({
            name: ""
        });
        const visible = computed(() => props.dialogVisible);
        watch(() => props.currentValue, () => {
            form.value.name = props.currentValue!.Name;
        });
        const handleComfirm = () => {
            emit("updateName", form.value.name);
        };
        const close = () => {
            emit("update:dialogVisible", false);
        };
        return {
            ...toRefs(state),
            form,
            visible,
            handleComfirm,
            close
        };
    }
});
</script>

<style scoped>

</style>
