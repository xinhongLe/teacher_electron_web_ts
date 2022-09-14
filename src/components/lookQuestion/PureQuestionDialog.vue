<template>
    <div class="container">
        <el-dialog
            :model-value="visible"
            title="正在查看同类题"
            center
            v-if="isShowDialog"
            :before-close="close"
            :show-close="false"
        >
            <Question :close="close" :isPureQuestion="true" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";
import Question from "./Question.vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const isShowDialog = ref(true);
        const close = () => {
            isShowDialog.value = false;
            nextTick(() => {
                emit("update:visible", false);
            });
        };
        return {
            close,
            isShowDialog,
        };
    },
    components: { Question },
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog) {
        --el-dialog-width: 90%;
        margin: 0 auto;
        top: 50%;
        transform: translateY(-50%);
    }
    :deep(.el-dialog__body) {
        height: 90vh;
    }
}
</style>
