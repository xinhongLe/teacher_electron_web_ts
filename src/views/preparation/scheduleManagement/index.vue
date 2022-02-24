<template>
    <!-- <CourseList ref="courseListRef"/> -->
    <div class="right">
        <PackageManagement/>
    </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import CourseList from "./courseList/index.vue";
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
            courseListRef
        };
    },
    components: {
        // CourseList,
        PackageManagement
    }
});
</script>

<style lang="scss" scoped>
.right {
    flex: 1;
    height: 100%;
    padding: 12px 0 0 12px;
    overflow-y: auto;

}
</style>
