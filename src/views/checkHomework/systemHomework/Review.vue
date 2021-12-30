<template>
    <div>
        <div class="student-once">
            <div class="answer-all" v-if="isShow">
                <img
                    src="@/assets/images/homeworkNew/icon_zuida.png"
                    alt=""
                    @click="enlargeRef.visible = true"
                />
            </div>
            <div class="answer" :class="{success: result === QuestionResultTypeEnum.RIGHT, error: result === QuestionResultTypeEnum.ERROR}">
                <template v-if="detail.Detail">
                    <TeacherAnswer
                        v-if="detail.Detail.HomeworkPaperType === 2"
                        :data="detail"
                    />
                    <template v-else-if="detail.Detail.HomeworkPaperType === 0">
                        <SpeechAudio
                            v-if="detail.Question?.Type === 7"
                            :speechResult="detail.Detail?.SpeechAssessResults"
                        />
                        <AnswerChoiceValue
                            v-else-if="detail.Question?.Type < 5"
                            :choiceValue="detail.Study?.ChoiceValue"
                            :isError="detail.Detail?.Result === 2"
                        />
                        <Answer
                            v-else
                            :data="detailData"
                            :questionType="detail.Question?.Type"
                            :question="question"
                            :answer="answer"
                            :isOrigin="true"
                            :isQuestion="true"
                            :writeList="detail?.Question?.QuestionBlanks"
                            :choiceValue="detail.Question?.ChoiceValue"
                            :style="{ transform: 'scale(' + 288 / 900 + ')' }"
                        ></Answer>
                    </template>
                </template>
            </div>
            <div class="answer-userinfo">
                <div class="answer-avator" v-if="detail.Student">
                    <Avatar
                        :file="detail.Student?.HeadPortrait"
                        :size="28"
                    ></Avatar>
                    <span class="studentNameBOX">{{
                        detail.Student?.Name
                    }}</span>
                    <el-tooltip placement="bottom">
                        <template #content>
                            <div>{{ className }}</div>
                        </template>
                        <span class="classNameBox">{{ className }}</span>
                    </el-tooltip>
                </div>
                <div class="answer-answer">
                    <div
                        class="answer-btn"
                        @click="successHandle(detail.Detail?.ID)"
                        :class="{success: result == QuestionResultTypeEnum.RIGHT}"
                    >
                        <img src="@/assets/images/homeworkNew/icon_duigou_white.png" v-if="result == QuestionResultTypeEnum.RIGHT"/>

                        <img
                            v-else
                            src="@/assets/images/homeworkNew/icon_duigou.png"
                            alt=""
                        />
                    </div>
                    <div
                        class="answer-btn"
                        @click="errorHandle(detail.Detail?.ID)"
                        :class="{error: result == QuestionResultTypeEnum.ERROR}"
                    >
                        <img src="@/assets/images/homeworkNew/icon_cuo_white.png" v-if="result == QuestionResultTypeEnum.ERROR"/>
                        <img
                            v-else
                            src="@/assets/images/homeworkNew/icon_cuo.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
        <Enlarge
            :childrenName="detail.Student ? detail.Student.Name : ''"
            :className="className"
            :Detail="detail.Detail"
            ref="enlargeRef"
            :errorHandle="errorHandle"
            :successHandle="successHandle"
            :headPortrait="detail.Student?.HeadPortrait"
        >
            <template v-if="detail.Detail">
                <TeacherAnswerImg
                    v-if="detail.Detail.HomeworkPaperType === 2"
                    :data="detail"
                />
                <template v-else-if="detail.Detail.HomeworkPaperType === 0">
                    <QuestionChoiceList
                        v-if="detail.Question?.Type < 5"
                        :choiceValue="detail.Study?.ChoiceValue"
                        :questionType="detail?.Question?.Type"
                        :choiceCount="detail?.Question?.ChoiceCount"
                    />
                    <Answer
                        :data="detailData"
                        :questionType="detail?.Question?.Type"
                        :question="question"
                        :answer="answer"
                        :isOrigin="true"
                        :isQuestion="true"
                        :writeList="detail?.Question?.QuestionBlanks"
                        :choiceValue="detail.Question?.ChoiceValue"
                        :result="result"
                    ></Answer>
                </template>
            </template>
        </Enlarge>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { changeResult, fetchDetailByMissionStudyID } from "../api";
import Avatar from "@/components/avatar/index.vue";
import { QuestionDetail } from "@/types/checkHomework";
import Answer from "./Answer.vue";
import Enlarge from "./Enlarge.vue";
import TeacherAnswer from "./TeacherAnswer.vue";
import TeacherAnswerImg from "./TeacherAnswerImg.vue";
import SpeechAudio from "./SpeechAudio.vue";
import AnswerChoiceValue from "./AnswerChoiceValue.vue";
import QuestionChoiceList from "./QuestionChoiceList.vue";
import { QuestionResultTypeEnum } from "../enum";
export default defineComponent({
    props: {
        className: {
            type: String,
            default: ""
        },
        index: {
            type: Number,
            default: 0
        },
        misssionStudyID: {
            type: String,
            default: ""
        },
        result: {
            type: Number,
            default: null
        }
    },
    setup(props) {
        const enlargeRef = ref();
        const detail = ref<QuestionDetail>({});
        const isShow = computed(
            () =>
                (detail.value?.Detail?.HomeworkPaperType === 0 &&
                    detail.value?.Question?.Type !== 7) ||
                (detail.value?.Detail?.HomeworkPaperType === 2 &&
                    detail.value.Study?.MissionFiles?.find(
                        ({ PageNum }) =>
                            PageNum ===
                            detail.value.WorkbookPageQuestion?.PageNum
                    )?.File)
        );
        const detailData = computed(() =>
            detail.value.Study?.StudyFiles
        );
        const question = computed(
            () =>
                detail.value?.Question?.Answers[0].AnswerFiles.find(
                    (v) => v.Type === 3
                )?.File
        );
        const answer = computed(
            () =>
                detail.value?.Question?.Answers[0].AnswerFiles.find(
                    (v) => v.Type === 3
                )?.File
        );

        const getData = async () => {
            const res = await fetchDetailByMissionStudyID({
                MissionStudyID: props.misssionStudyID
            });
            if (res.resultCode === 200) {
                detail.value = res.result;
            }
        };

        const successHandle = async (id = "") => {
            if (props.result === QuestionResultTypeEnum.RIGHT) return;
            const res = await changeResult({
                missionDetailID: id,
                result: QuestionResultTypeEnum.RIGHT
            });
            if (res.resultCode === 200) {
                document.dispatchEvent(new Event("updateSystemHomework"));
            }
        };

        const errorHandle = async (id = "") => {
            if (props.result === QuestionResultTypeEnum.ERROR) return;
            const res = await changeResult({
                missionDetailID: id,
                result: QuestionResultTypeEnum.ERROR
            });
            if (res.resultCode === 200) {
                document.dispatchEvent(new Event("updateSystemHomework"));
            }
        };

        watchEffect(getData);
        return {
            enlargeRef,
            detail,
            successHandle,
            isShow,
            question,
            detailData,
            answer,
            QuestionResultTypeEnum,
            errorHandle
        };
    },
    components: {
        Avatar,
        Answer,
        Enlarge,
        TeacherAnswer,
        TeacherAnswerImg,
        SpeechAudio,
        AnswerChoiceValue,
        QuestionChoiceList
    }
});
</script>

<style lang="scss" scoped>
.student-once {
    position: relative;
    width: 294px;
    height: 180px;
    margin-bottom: 16px;
    .answer-all {
        position: absolute;
        z-index: 2;
        top: 4px;
        right: 4px;
        img {
            width: 24px;
            z-index: 2;
        }
    }
    .studentNameBOX {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .classNameBox {
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .answer {
        width: 100%;
        height: 136px;
        border: 3px solid #98aef6;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
        overflow: hidden;
        z-index: 1;
        &.success {
            border-color: #74EBB6;
        }
        &.error {
            border-color: #FEA0A2;
        }
        img,
        canvas {
            transform-origin: center;
        }
        .canvas-box {
            position: absolute;
            z-index: 1;
        }
        canvas {
            box-sizing: border-box;
        }
    }
    .answer-userinfo {
        width: 100%;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 12px 8px;
        justify-content: space-between;
        .answer-avator {
            display: flex;
            align-items: center;
            img {
                width: 28px;
                height: 28px;
                border-radius: 28px;
            }
            .studentNameBOX {
                font-size: 14px;
                font-family: PingFang-SC-Medium, PingFang-SC;
                font-weight: 500;
                color: #19203d;
                line-height: 20px;
                padding-left: 7px;
            }
            .classNameBox {
                font-size: 12px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-weight: 500;
                color: #5f626f;
                line-height: 17px;
                padding-left: 8px;
                flex: 1;
            }
        }
        .answer-answer {
            display: flex;
            align-items: center;
            justify-content: space-around;
            .answer-btn {
                width: 40px;
                height: 28px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #e0e2e7;
                display: flex;
                align-items: center;
                justify-content: space-around;
                cursor: pointer;
                &:first-child {
                    margin-right: 12px;
                }
                &.success {
                    background: #34E1B6;
                    border: none;
                }
                &.error {
                    background: #FF6B6B;
                    border: none;
                }
            }
        }
    }
}
</style>
