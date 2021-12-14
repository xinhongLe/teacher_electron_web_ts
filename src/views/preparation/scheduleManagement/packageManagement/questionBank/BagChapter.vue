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
                draggable="true"
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
                        >{{ cont.QuestionCount }}题</span
                    >
                    <span class="question_type">{{
                        getCourseBagType(cont.ClassifyType)
                    }}</span>
                    <span class="question_name">{{ cont.Name }}</span>
                </div>

                <div class="btn_list">
                    <el-button
                        icon="el-icon-video-play"
                        type="primary"
                        size="mini"
                        v-if="cont.HasVideo"
                        plain
                        @click="lookVideo(cont.FileID)"
                        >查看视频</el-button
                    >
                    <el-button
                        icon="el-icon-search"
                        type="primary"
                        size="mini"
                        plain
                        @click="
                            lookQuestions({
                                id: cont.PaperID,
                                type: 1,
                                courseBagId: courseBagId,
                            })
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
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { lookVideo, lookQuestions, getCourseBagType } from "@/utils";
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

        const getBagChapter = async (id: string) => {
            const res = await fetchBagChapter({
                bookID: id
            });
            if (res.resultCode === 200) {
                teacherBookChapterList.value = res.result;
                bagLessonsList.value =
                    res.result.find(({ ID }) => props.teacherBookChapter === ID)
                        ?.BagLessons || [];
            }
        };

        const _onDragStart = (e: DragEvent, info: BagPapers, id: string) => {
            const data = {
                teacherBookChapter: id,
                info
            };
            onDragStart(e, data);
        };

        watch(
            () => props.subjectPublisherBookValue,
            (value) => {
                getBagChapter(value[1]);
            },
            {
                deep: true
            }
        );

        watch(() => props.teacherBookChapter, (id) => {
            bagLessonsList.value =
                    teacherBookChapterList.value.find(({ ID }) => id === ID)
                        ?.BagLessons || [];
        });

        return {
            bagLessonsList,
            lookVideo,
            onDrag,
            onDragEnd,
            onDragStart: _onDragStart,
            courseBagId: computed(
                () => store.state.preparation.selectCourseBag.ID
            ),
            getCourseBagType,
            lookQuestions
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
