<template>
    <div class="look-question" @click="closeSmall">
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
import isElectronFun from "is-electron";
import { useRoute } from "vue-router";
import Question from "./Question.vue";
import PureQuestionDialog from "./PureQuestionDialog.vue";
import { checkPureQuestionByQuestionID } from "./api";
import { ElMessage } from "element-plus";
export default defineComponent({
    setup() {
        const route = useRoute();
        const type = computed(() => Number(route.params.type));
        const isElectron = isElectronFun();
        const dialogVisible = ref(false);
        const nowQuestionID = ref("");
        const closeSmall = () => {
            if (isElectron) {
                // type.value === 2 && ipcRenderer.send("closeSQuestion");
            }
        };

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
            window.close();
            // if (isElectron) {
            //     type.value === 2
            //         ? ipcRenderer.send("closeSQuestion")
            //         : ipcRenderer.send("closeQuestion");
            // }
        };

        provide("nowQuestionID", nowQuestionID);

        return {
            closeSmall,
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
        margin-top: 16px;
    }
}
</style>
