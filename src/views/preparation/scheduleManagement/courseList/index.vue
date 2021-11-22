<template>
    <div class="course-list">
        <div>
            <CourseItem
                v-for="(item, index) in courseList"
                :key="item.ID"
                :item="item"
                :index="index"
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
</template>

<script lang="ts">
import { store } from "@/store";
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

        const getTeacherLessonAndBag = () => {
            const chapterID = store.state.preparation.selectChapterID;
            if (chapterID) {
                fetchTeacherLessonAndBagByChapter({
                    chapterID
                }).then(res => {
                    if (res.resultCode === 200) {
                        courseList.value = teacherLessonAndBagFilter(res.result);
                    }
                });
            }
        };

        watchEffect(getTeacherLessonAndBag);

        provide("getTeacherLessonAndBag", getTeacherLessonAndBag);

        return {
            courseList,
            getTeacherLessonAndBag,
            dialogVisible
        };
    },
    components: { CourseItem, LessonDialog }
});
</script>

<style lang="scss" scoped>
.course-list {
    width: 200px;
    height: 100%;
    padding: 20px 20px 0;
    margin-right: 10px;
    background-color: #fff;
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
</style>
