<template>
    <div class="container" v-for="ele in bagLessonsList" :key="ele.ID">
        <p class="classTitle">{{ ele.Name }}</p>
        <div
            class="problem"
            v-for="(cont, index) in ele.BagPapers"
            :key="index"
        >
            <div
                class="problem_item"
                :draggable="isOperator"
                @dragstart="onDragStart($event, cont, ele.ID)"
                @drag="onDrag"
                @dragend="onDragEnd"
            >
                <div>
                    <img
                        src="@/assets/images/attend-class/icon_yidong@2x.png"
                        alt=""
                    />
                    <span class="question_count"
                        >{{ cont.Questions?.length || 0 }}题</span
                    >
                    <span class="question_type">{{
                        getCourseBagType(cont.ClassifyType)
                    }}</span>
                    <span class="question_name">{{ cont.Name }}</span>
                </div>

                <div class="btn_list">
                    <el-button
                        :icon="VideoPlay"
                        type="primary"
                        size="mini"
                        v-if="cont.HasVideo"
                        plain
                        @click="lookVideo(cont.FileID)"
                        >查看视频</el-button
                    >
                    <el-button
                        :icon="Search"
                        type="primary"
                        size="mini"
                        plain
                        @click="
                            lookQuestions(ele.ID , cont.PaperID)
                        "
                        >查看题目</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useDrag from "@/hooks/useDrag";
import { store } from "@/store";
import { BagChapter, BagLessons, BagPapers } from "@/types/preparation";
import { fetchBagChapter } from "@/views/preparation/api";
import { defineComponent, inject, onMounted, onUnmounted, PropType, ref, watch, watchEffect } from "vue";
import { lookVideo, lookQuestions, getCourseBagType } from "@/utils";
import emitter from "@/utils/mitt";
import { find, pullAllBy } from "lodash";
import { VideoPlay, Search } from "@element-plus/icons-vue";
export default defineComponent({
    props: {
        subjectPublisherBookValue: {
            type: Array as PropType<string[]>,
            required: true
        },
        teacherBookChapter: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const teacherBookChapterList = ref<BagChapter[]>([]);
        const bagLessonsList = ref<BagLessons[]>([]);
        const { onDrag, onDragEnd, onDragStart } = useDrag();
        const isOperator = inject("isOperator", true);
        const deleteQuestionList = ref<Map<string, {
            courseBagId: string,
            questionIDs: string[],
            id: string,
            paperId: string
        }>>(new Map());

        const getBagLessonsList = (id: string) => {
            const bagLessons = teacherBookChapterList.value.find(({ ID }) => id === ID)
                ?.BagLessons || [];
            for (const [paperId, { courseBagId, questionIDs }] of deleteQuestionList.value) {
                const bagPapers = find(bagLessons, { ID: courseBagId })?.BagPapers || [];
                const questionInfo = find(bagPapers, { PaperID: paperId });
                const questions = questionInfo?.Questions || [];
                pullAllBy(questions, questionIDs.map(id => ({ QuestionID: id })), "QuestionID");
                questionInfo && (questionInfo.QuestionCount = questions.length);
            }
            bagLessonsList.value = bagLessons;
        };

        const getBagChapter = async (id: string) => {
            const res = await fetchBagChapter({
                bookID: id
            });
            if (res.resultCode === 200) {
                teacherBookChapterList.value = res.result;
                getBagLessonsList(props.teacherBookChapter);
            }
        };

        const _onDragStart = (e: DragEvent, info: BagPapers, id: string) => {
            const data = {
                teacherBookChapter: id,
                info
            };
            onDragStart(e, data);
        };

        const _lookQuestions = (courseBagId: string, paperID: string) => {
            // lookQuestions({
            //     id: paperID,
            //     type: 1,
            //     courseBagId: courseBagId || "",
            //     deleteQuestionIds: deleteQuestionList.value.get(paperID)?.questionIDs || []
            // });
            // emitter.off("deleteQuestion");
            // emitter.on("deleteQuestion", ({ courseBagId, paperId, questionID }) => {
            //     const bagPapers = find(bagLessonsList.value, { ID: courseBagId })?.BagPapers || [];
            //     const questionInfo = find(bagPapers, { PaperID: paperId });
            //     const questions = questionInfo?.Questions || [];
            //     pullAllBy(questions, [{ QuestionID: questionID }], "QuestionID");
            //     questionInfo && (questionInfo.QuestionCount = questions.length);
            //     const info = deleteQuestionList.value.get(paperId);
            //     const questionIDs = info?.questionIDs || [];
            //     questionIDs.push(questionID);
            //     deleteQuestionList.value.set(paperId, { courseBagId, paperId, questionIDs, id: props.teacherBookChapter });
            // });
        };

        // watch(() => store.state.common.isShowQuestion, (v) => {
        //     if (!v) {
        //         emitter.off("deleteQuestion");
        //     }
        // });

        watchEffect(() => {
            const id = props.subjectPublisherBookValue[1];
            id && getBagChapter(id);
        });

        watch(() => props.teacherBookChapter, (id) => {
            getBagLessonsList(id);
        });

        const preparationReLoad = () => {
            getBagChapter(props.subjectPublisherBookValue[1]);
        };

        onMounted(() => {
            emitter.on("preparationReLoad", preparationReLoad);
        });

        onUnmounted(() => {
            emitter.off("preparationReLoad", preparationReLoad);
        });

        return {
            VideoPlay,
            Search,
            bagLessonsList,
            lookVideo,
            onDrag,
            onDragEnd,
            onDragStart: _onDragStart,
            deleteQuestionList,
            getCourseBagType,
            isOperator,
            lookQuestions: _lookQuestions
        };
    }
});
</script>

<style lang="scss" scoped>
.classTitle {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #19203d;
    margin: 12px 0px 8px;
}
.classTitle::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 14px;
    margin-right: 10px;
    background: #4b71ee;
    border-radius: 1px;
}
.problem {
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 12px;
    .problem_item {
        width: 100%;
        pointer-events: auto;
        padding: 12px;
        display: flex;
        border: none;
        justify-content: space-between;
        align-items: center;
        position: relative;
        span {
            line-height: 25px;
        }
        .question_type {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4b71ee;
            margin: 0 16px;
        }
        .question_name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203d;
        }
        .question_count {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5f626f;
        }
        .btn_list {
            float: right;
        }
    }
    img {
        width: 16px;
        margin-right: 16px;
        vertical-align: middle;
    }
}
</style>
