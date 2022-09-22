<template>
    <div class="container">
        <el-dialog
            :model-value="visible"
            title="讲解题目"
            center
            v-if="isShowDialog"
            :before-close="close"
            :show-close="false"
        >
            <!-- <Question :close="close" :isPureQuestion="false" /> -->
            <LookQuestion
                v-if="visible"
                :dialog="true"
                :close="close"
                :resource="resource"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, PropType } from "vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import Question from "@/components/lookQuestion/Question.vue";
import { IViewResourceData } from "@/types/store";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true,
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
    components: { Question, LookQuestion },
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
