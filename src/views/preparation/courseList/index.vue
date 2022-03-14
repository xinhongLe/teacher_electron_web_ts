<script lang="ts" setup>
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue";
import { computed, onMounted, ref, watch } from "vue";
import { pull, isEmpty, find } from "lodash";
import CollapseTransition from "@/components/collapseTransition/index.vue";
import useBook from "../hooks/useBook";
import { MutationTypes, store } from "@/store";
import { fetchSchoolLessonList, getLastSelectBook, setLastSelectBook } from "../api";
import { GetLastSelectBookRes, SchoolLesson } from "@/types/preparation";
import useDrag from "@/hooks/useDrag";

const activeIds = ref<string[]>([]);
const isShow = ref(true);
const lessonListMap = ref<Map<string, SchoolLesson[]>>(new Map());
const selectLessonId = computed(() => store.state.preparation.selectLessonId);
const { teacherBookChapterList, getTeacherBookChapters } = useBook();
const { onDragStart, onDrag, onDragEnd } = useDrag();
const subjectPublisherBookValue = computed(() => store.state.preparation.subjectPublisherBookValue);
let selectBook: GetLastSelectBookRes;
let isInit = false;

const getLessonList = async (id: string) => {
    const res = await fetchSchoolLessonList({
        chapterID: id
    });
    if (res.resultCode === 200) {
        lessonListMap.value.set(
            id,
            res.result.filter((item) => !item.IsHide)
        );
    }
};

onMounted(async () => {
    const selectBookRes = await getLastSelectBook({
        subjectID: ""
    });
    if (selectBookRes.resultCode === 200) {
        selectBook = selectBookRes.result;
    }
    if (!isEmpty(selectBook)) {
        const { BookID, PublisherID, SubjectID, ChapterID, LessonID } = selectBook;
        store.commit(
            MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
            [
                SubjectID,
                PublisherID,
                BookID
            ]
        );
        isInit = true;
        await getTeacherBookChapters(BookID);
        activeIds.value.push(ChapterID);
        getLessonList(ChapterID).then(() => {
            const lessonList = lessonListMap.value.get(ChapterID);
            if (!isEmpty(lessonList)) {
                store.commit(
                    MutationTypes.SET_SELECT_LESSON_ID,
                    LessonID || lessonList![0]?.ID
                );
            }
        });
        isInit = false;
    } else {
        // findFirstId(
        //     [subjectPublisherBookList.value[0]],
        //     subjectPublisherBookValue.value
        // );
    }
});

watch(
    subjectPublisherBookValue,
    async (value) => {
        if (!value[2] || isInit) return;
        await getTeacherBookChapters(value[2]);
        const id = teacherBookChapterList.value[0]?.ID;
        activeIds.value = [];
        activeIds.value.push(id);
        getLessonList(id).then(() => {
            const lessonList = lessonListMap.value.get(id);
            if (!isEmpty(lessonList)) {
                store.commit(
                    MutationTypes.SET_SELECT_LESSON_ID,
                    lessonList![0]?.ID
                );
                setLastSelectBook({
                    bookID: subjectPublisherBookValue.value[2],
                    chapterID: id,
                    lessonID: selectLessonId.value,
                    subjectID: subjectPublisherBookValue.value[0]
                });
            }
        });
    }, {
        deep: true
    }
);

const collapseClick = (id: string) => {
    if (activeIds.value.includes(id)) {
        pull(activeIds.value, id);
    } else {
        activeIds.value.push(id);
    }
    if (!lessonListMap.value.has(id)) {
        getLessonList(id);
    }
};

const clickLesson = (id: string, chapterId: string) => {
    store.commit(MutationTypes.SET_SELECT_LESSON_ID, id);
    setLastSelectBook({
        bookID: subjectPublisherBookValue.value[2],
        chapterID: chapterId,
        lessonID: selectLessonId.value,
        subjectID: subjectPublisherBookValue.value[0]
    });
};

</script>

<template>
    <div class="container">
        <transition name="slide">
            <div class="course-list-warp" v-show="isShow">
                <div class="course-list">
                    <div
                        class="chapter-warp"
                        v-for="chapter in teacherBookChapterList"
                        :key="chapter.ID"
                    >
                        <div
                            class="chapter-item"
                            @click="collapseClick(chapter.ID)"
                        >
                            <span class="chapter"
                                >{{ chapter.Name }} {{ chapter.Detial }}</span
                            >
                            <el-icon color="#979BA9"
                                ><ArrowUpBold
                                    v-if="
                                        activeIds.includes(chapter.ID)
                                    " /><ArrowDownBold v-else
                            /></el-icon>
                        </div>
                        <CollapseTransition>
                            <div
                                v-show="activeIds.includes(chapter.ID)"
                                class="chapter-course-list-warp"
                            >
                                <div
                                    class="course"
                                    v-for="lesson in lessonListMap.get(
                                        chapter.ID
                                    )"
                                    :key="lesson.ID"
                                    :class="{
                                        active: selectLessonId === lesson.ID,
                                    }"
                                    :draggable="true"
                                    @dragstart="onDragStart($event, lesson)"
                                    @dragend="onDragEnd($event)"
                                    @drag="onDrag($event)"
                                    @click="clickLesson(lesson.ID, chapter.ID)"
                                >
                                    {{ lesson.Name }}
                                </div>
                            </div>
                        </CollapseTransition>
                    </div>
                </div>
            </div>
        </transition>

        <div class="fold-btn" @click="isShow = !isShow">
            <i
                :class="isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
            ></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
        .chapter {
            white-space: nowrap;
        }
    }

    .slide-enter-from,
    .slide-leave-to {
        width: 0;
        opacity: 0;
    }
    .fold-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateX(100%) translateY(-50%);
        right: 0;
        height: 104px;
        width: 18px;
        border-radius: 0px 8px 8px 0px;
        box-shadow: 2px 4px 8px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        cursor: pointer;
        z-index: 1;
        i {
            color: #7e7f83;
            font-size: 18px;
            font-weight: 700;
        }
    }
}
.course-list-warp {
    width: 244px;
    height: 100%;
    background-color: #fff;
    &.hidden {
        width: 0;
    }
    .course-list {
        padding: 20px;
        height: 100%;
        overflow-y: overlay;
    }
    .chapter-warp {
        padding: 16px 0;
        border-top: 1px dashed #e9ecf0;
        &:first-child {
            padding: 0;
            padding-bottom: 16px;
            border-top: none;
        }
        .chapter-item {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            .chapter {
                font-size: 16px;
                font-weight: 600;
                color: var(--app-color-dark);
                line-height: 22px;
            }
        }
        .chapter-course-list-warp {
            .course {
                height: 60px;
                display: flex;
                padding: 0 16px;
                align-items: center;
                color: var(--app-color-dark);
                background-color: #f0f4ff;
                font-size: 14px;
                font-weight: 400;
                margin-top: 8px;
                border-radius: 4px;
                cursor: pointer;
                &:first-child {
                    margin-top: 12px;
                }
                &.active {
                    background-color: var(--app-color-primary);
                    color: #fff;
                    position: relative;
                    &::before {
                        content: "";
                        height: 0;
                        width: 0;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateX(100%) translateY(-50%);
                        border: 8px solid transparent;
                        border-left: 8px solid var(--app-color-primary);
                    }
                }
            }
        }
    }
}
</style>
