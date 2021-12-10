<template>
    <div class="container">
        <el-dialog
            :model-value="visible"
            title="正在查看同类题"
            center
            :show-close="false"
        >
            <Question :close="close" :isPureQuestion="true" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Question from "./Question.vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const close = () => {
            emit("update:visible", false);
        };
        return {
            close
        };
    },
    components: { Question }
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog) {
        width: fit-content;
    }
}
</style>
