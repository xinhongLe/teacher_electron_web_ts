<template>
    <div class="add-question">
        <!--导学案涉及选择框-->
        <el-dialog
            v-if="questionVisible"
            class="custom-dialog"
            v-model="questionVisible"
            title="添加题目"
            width="80vw"
            align-center
            center
            :destroy-on-close="true"
            @close="close"
        >
            <div class="question-con">
                <QuestionIframe v-if="questionVisible" @selectedQuestion="selectedQuestion"></QuestionIframe>
            </div>
        </el-dialog>

    </div>

</template>

<script lang="ts">
import {
    defineComponent,
    ref,
} from "vue";
import QuestionIframe from "@/views/preparation/learnPlanDesign/QuestionIframe.vue";

export default defineComponent({
    name: "AddQuestionDialog",
    props: {
        questionVisible: {
            type: Boolean,
            default: false
        }
    },
    components: {QuestionIframe},
    emits: ["update:questionVisible", "selectedQuestion"],
    setup(props, {emit}) {
        // 关闭
        const close = () => {
            emit("update:questionVisible", false);
        };
        // 选择完试题了
        const selectedQuestion = (questions: any) => {
            emit("selectedQuestion", questions);
            emit("update:questionVisible", false);
        };
        return {
            close,
            selectedQuestion
        }
    }
})
</script>

<style lang="scss" scoped>
.add-question {
    :deep(.el-dialog) {
        border-radius: 8px;

        .el-dialog__header {
            padding: 20px;

            .el-dialog__title {
                font-size: 20px;
            }

            .el-dialog__headerbtn {
                width: 30px;
                height: 30px;
                border-radius: 50%;
            }
        }

        .el-dialog__body {
            background: #F5F6FA !important;
            min-height: 70vh;
            max-height: 80vh;
            overflow: auto;
            display: flex;
            padding: 0;

            .question-con {
                flex: 1;
            }
        }
    }
}
</style>
