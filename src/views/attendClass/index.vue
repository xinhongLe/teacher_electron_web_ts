<template>
    <div class="attend-class-container">
        <Head
            v-model:activeIndex="activeIndex"
            @refresh="refresh"
        />
        <StayOnCourse v-if="activeIndex === 0" ref="stayOnCourseRef"/>
        <HistoryCourse v-else ref="historyCourseRef"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Head from "./Head.vue";
import StayOnCourse from "./stayOnCourse/index.vue";
import HistoryCourse from "./historyCourse/index.vue";
export default defineComponent({
    name: "AttendClass",
    setup() {
        const activeIndex = ref(0);
        const stayOnCourseRef = ref<InstanceType<typeof StayOnCourse>>();
        const historyCourseRef = ref<InstanceType<typeof HistoryCourse>>();

        const refresh = () => {
            if (activeIndex.value === 0) {
                stayOnCourseRef.value && stayOnCourseRef.value.getTeacherClasses();
            } else {
                historyCourseRef.value && historyCourseRef.value.getTeacherClasses();
            }
        };

        return {
            activeIndex,
            historyCourseRef,
            refresh,
            stayOnCourseRef
        };
    },
    components: { Head, StayOnCourse, HistoryCourse }
});
</script>

<style lang="scss" scoped>
.attend-class-container {
    display: flex;
    padding-top: 15px;
    height: 100%;
    padding-bottom: 0;
    box-sizing: border-box;
    flex-flow: column;
}
</style>
