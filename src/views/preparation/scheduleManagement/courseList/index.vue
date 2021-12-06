<template>
    <div class="course-list">
        <div class="list" v-show="showList">
            <div>
                <CourseItem
                    v-for="(item, index) in courseList"
                    :key="item.ID"
                    :item="item"
                    :index="index"
                    v-model:startActiveIndex="startActiveIndex"
                />
            </div>
            <p class="add-ks" @click="dialogVisible = true">
                <span class="el-icon-circle-plus-outline"></span>
                <span>添加自定义课时</span>
            </p>
            <LessonDialog
                v-model:dialogVisible="dialogVisible"
                :lessonIndex="courseList.length"
                v-if="dialogVisible"
            />
        </div>
        <div class="shrink" style="width: 18px">
            <div @click="showList = !showList"><i :style="{'transform': 'rotate(' + (showList ? 0 : 180) + 'deg)'}" class="el-icon-arrow-left"></i></div>
        </div>
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { Course } from "@/types/preparation";
import { defineComponent, provide, ref, watchEffect } from "vue";
import { fetchTeacherLessonAndBagByChapter } from "../../api";
import { teacherLessonAndBagFilter } from "../../logic";
import CourseItem from "./CourseItem.vue";
import LessonDialog from "./LessonDialog.vue";
export default defineComponent({
    name: "courseList",
    setup() {
        const courseList = ref<Course[]>([]);
        const dialogVisible = ref(false);
        const showList = ref(true);
        const startActiveIndex = ref(0);
        const getTeacherLessonAndBag = () => {
            const chapterID = store.state.preparation.selectChapterID;
            if (chapterID) {
                fetchTeacherLessonAndBagByChapter({
                    chapterID
                }).then(res => {
                    if (res.resultCode === 200) {
                        startActiveIndex.value = res.result.findIndex(({ CourseBags }) => CourseBags.length !== 0);
                        courseList.value = teacherLessonAndBagFilter(res.result);
                        const { selectCourseBag } = store.state.preparation;
                        if (startActiveIndex.value !== -1 && !selectCourseBag?.ID) { // 当正在查看课包内容且课包列表中有课包且当前选中的课包为空时
                            const info = courseList.value[startActiveIndex.value]?.CourseBags[0] || {};
                            store.commit(MutationTypes.SET_SELECT_COURSE_BAG, info);
                        }
                    }
                });
            }
        };

        watchEffect(getTeacherLessonAndBag);

        provide("getTeacherLessonAndBag", getTeacherLessonAndBag);

        return {
            courseList,
            getTeacherLessonAndBag,
            startActiveIndex,
            dialogVisible,
            showList
        };
    },
    components: { CourseItem, LessonDialog }
});
</script>

<style lang="scss" scoped>
.course-list {
    height: 100%;
    display: flex;
    margin-right: 10px;
    .list {
        height: 100%;
        width: 200px;
        padding: 20px 15px 0 20px;
        background-color: #fff;
        flex: 1;
        > div {
            height: calc(100% - 30px);
            overflow-y: auto;
        }
        .add-ks {
            width: 100%;
            text-align: center;
            color: #4b71ee;
            font-size: 12px;
            cursor: pointer;
            margin-top: 10px;
        }
    }
    .shrink {
        background: #DDE1F1;
        height: 100%;
        margin-left: 5px;
        position: relative;
        >div {
            background: #CCD1E3;
            width: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            height: 12vh;
            text-align: center;
            cursor: pointer;
            opacity: .66;
            i {
                line-height: 12vh;
                color: #fff;
                font-size: 14px;
                transition: all .2s;
            }
        }
        >div:hover {
            opacity: 1
        }
    }
}
</style>
