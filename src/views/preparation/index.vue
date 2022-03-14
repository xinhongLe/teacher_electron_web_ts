<template>
    <div class="preparation">
        <Head v-model:tabIndex="tabIndex" v-model:showClassArrangement="showClassArrangement"/>
        <div class="content-wrapper">
            <CourseList />
            <keep-alive>
                <ClassArrangement v-if="showClassArrangement"/>
                <keep-alive v-else>
                    <div v-if="tabIndex === ClassroomType.Classes" class="schedule-management-warp">
                        <div class="schedule-management">
                            <ScheduleManagement  :selectLessonId="selectLessonId"/>
                        </div>
                    </div>
                    <IntelligenceClassroom v-else-if="tabIndex === ClassroomType.WindowClasses" :selectLessonId="selectLessonId"/>
                </keep-alive>
            </keep-alive>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, provide, ref } from "vue";
import Head from "./head/index.vue";
import ScheduleManagement from "./scheduleManagement/index.vue";
import IntelligenceClassroom from "./intelligenceClassroom/index.vue";
import CourseList from "./courseList/index.vue";
import ClassArrangement from "./classArrangement/index.vue";
import { ClassroomType } from "@/types/preparation";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import useBag, { bagKey } from "@/hooks/useBag";
import emitter from "@/utils/mitt";
import { store } from "@/store";
export default defineComponent({
    name: "Preparation",
    setup() {
        const tabIndex = ref(ClassroomType.WindowClasses);
        const showClassArrangement = ref(false);
        const selectLessonId = computed(() => store.state.preparation.selectLessonId);
        const subjectPublisherBookValue = computed(() => store.state.preparation.subjectPublisherBookValue);

        provide(windowInfoKey, useWindowInfo());
        provide(bagKey, useBag(selectLessonId));
        provide("subjectId", computed(() => subjectPublisherBookValue.value[0]));
        provide("initSubjectPublisherBookValue", subjectPublisherBookValue);

        onUnmounted(() => {
            emitter.off("preparationReLoad");
        });

        return {
            tabIndex,
            ClassroomType,
            selectLessonId,
            showClassArrangement
        };
    },
    components: {
        Head,
        ScheduleManagement,
        IntelligenceClassroom,
        CourseList,
        ClassArrangement
    }
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
        flex: 1;
        min-height: 0;
        min-width: 0;
        background-color: #f5f6fa;
    }
    .schedule-management-warp {
        flex: 1;
        height: 100%;
        padding: 12px 0 0 12px;
        overflow-y: auto;
        .schedule-management {
            padding: 20px;
            background: #fff;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
