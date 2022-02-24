<template>
    <div class="preparation">
        <Head
            v-model:tabIndex="tabIndex"
            :reload="reload"
        />
        <div class="content-wrapper">
            <CourseList/>
            <keep-alive v-if="isRouterAlive">
                <ScheduleManagement v-if="tabIndex === 0"/>
                <IntelligenceClassroom v-else-if="tabIndex ===1"/>
            </keep-alive>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import Head from "./head/index.vue";
import ScheduleManagement from "./scheduleManagement/index.vue";
import IntelligenceClassroom from "./intelligenceClassroom/index.vue";
import CourseList from "./courseList/index.vue";
export default defineComponent({
    name: "Preparation",
    setup() {
        const tabIndex = ref(0);
        const isRouterAlive = ref(true);

        const reload = () => {
            isRouterAlive.value = false;
            nextTick(() => {
                isRouterAlive.value = true;
            });
        };

        return {
            tabIndex,
            isRouterAlive,
            reload
        };
    },
    components: { Head, ScheduleManagement, IntelligenceClassroom, CourseList }
});
</script>

<style lang="scss" scoped>
.preparation {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background-color: #f5f6fa;
    .content-wrapper {
        display: flex;
        flex:1;
        min-height: 0;
        min-width: 0;
        background-color: #F5F6FA;
    }
}
</style>
