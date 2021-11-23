<template>
    <CourseList ref="courseListRef"/>
    <div class="right">
        <PackageManagement v-if="isViewCourseDetailIng"/>
        <Schedule v-else/>
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent, provide, ref } from "vue";
import CourseList from "./courseList/index.vue";
import Schedule from "./schedule/index.vue";
import PackageManagement from "./packageManagement/index.vue";
export default defineComponent({
    name: "scheduleManagement",
    setup() {
        const courseListRef = ref<InstanceType<typeof CourseList>>();
        const getTeacherLessonAndBag = () => {
            courseListRef.value!.getTeacherLessonAndBag();
        };
        provide("getTeacherLessonAndBag", getTeacherLessonAndBag);
        return {
            isViewCourseDetailIng: computed(() => store.state.preparation.isViewCourseDetailIng),
            courseListRef
        };
    },
    components: { CourseList, Schedule, PackageManagement }
});
</script>

<style lang="scss" scoped>
.right {
    flex: 1;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;

}
</style>
