<template>
    <div class="look-question">
        <Question :close="close" ref="questionRef" v-model:nowQuestionID="nowQuestionID">
            <template #title>
                <p class="title">查看题目</p>
            </template>
            <template v-slot:footerBtn="slotProps">
                <div class="btn-list">
                    <div
                        v-show="type !== 2 && slotProps.sum > 1"
                        class="btn"
                        @click.stop="viewPureQuestion"
                    >
                        <p>同类题</p>
                    </div>
                    <div
                        v-show="type !== 2"
                        @click.stop="slotProps.removeQuestion"
                        class="btn"
                    >
                        <p>移除题目</p>
                    </div>
                </div>
            </template>
        </Question>
        <PureQuestionDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref } from "vue";
import Question from "./Question.vue";
import PureQuestionDialog from "./PureQuestionDialog.vue";
import { checkPureQuestionByQuestionID } from "./api";
import { ElMessage } from "element-plus";
import { MutationTypes, store } from "@/store";
export default defineComponent({
    setup() {
        const type = computed(() => store.state.common.viewQuestionInfo.type);
        const dialogVisible = ref(false);
        const nowQuestionID = ref("");

        const viewPureQuestion = async () => {
            const check = await checkPureQuestionByQuestionID({
                questionID: nowQuestionID.value
            });
            if (check.resultCode === 200) {
                if (check.result) {
                    dialogVisible.value = true;
                } else {
                    ElMessage.warning("无同类题");
                }
            }
        };

        const close = () => {
            store.commit(MutationTypes.SET_IS_SHOW_QUESTION, { flag: false, info: {} });
        };

        provide("nowQuestionID", nowQuestionID);

        return {
            type,
            viewPureQuestion,
            close,
            nowQuestionID,
            dialogVisible
        };
    },

    components: { Question, PureQuestionDialog }
});
</script>

<style lang="scss" scoped>
.look-question {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    z-index: 999;
    background: #fff;
    padding-top: 16px;
    :deep(.el-dialog__body) {
        height: 700px;
    }
    .btn-list {
        display: flex;
    }
    .btn {
        width: 64px;
        height: 64px;
        cursor: pointer;
        margin-right: 20px;
        p {
            text-align: center;
            font-size: 12px;
            color: #4b71ee;
            line-height: 24px;
            margin-top: 40px;
            font-weight: 550;
        }
        &:nth-child(1) {
            background: url("./../../assets/look/btn_tongleiti@2x.png");
            background-size: 100% 100%;
        }
        &:nth-child(2) {
            background: url("./../../assets/look/btn_yichu@2x.png");
            background-size: 100% 100%;
        }
    }
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        line-height: 28px;
        text-align: center;
    }
}
</style>
