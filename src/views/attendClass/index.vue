<script lang="ts">
export default {
    name: "AttendClass",
    inheritAttrs: false,
    customOptions: {}
};
</script>

<script lang="ts" setup>
/* eslint-disable import/first */
import { ClassroomType } from "@/types/preparation";
import { computed, onMounted, onUnmounted, provide, ref } from "vue";
import ScheduleManagement from "../preparation/scheduleManagement/index.vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import { useRoute } from "vue-router";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import useBag, { bagKey } from "@/hooks/useBag";
import WindowList from "@/components/windowList/index.vue";
import emitter from "@/utils/mitt";
import useOpenWindow from "@/hooks/useOpenWindow";

const titleList = [
    { title: "翻转课堂", type: ClassroomType.Classes },
    { title: "数智课堂", type: ClassroomType.WindowClasses }
];
const currentTab = ref(ClassroomType.WindowClasses);
const route = useRoute();

const selectLessonId = computed(() => route.params.lessonId as string);
const subjectId = computed(() => route.params.subjectId as string);

const windowInfo = useWindowInfo();

provide(windowInfoKey, windowInfo);
provide(bagKey, useBag());
provide(
    "subjectId",
    computed(() => subjectId.value)
);

useOpenWindow(currentTab, windowInfo.updateCurrentWindow);
</script>
<template>
    <div class="attend-class-warp">
        <div class="header">
            <div
                v-for="item in titleList"
                :key="item.title"
                class="tab"
                :class="{ active: item.type === currentTab }"
                @click="currentTab = item.type"
            >
                {{ item.title }}
            </div>
            <WindowList v-show="currentTab === ClassroomType.WindowClasses" />
        </div>
        <div class="content-warp">
            <keep-alive>
                <div
                    v-if="currentTab === ClassroomType.Classes"
                    class="schedule-management"
                >
                    <ScheduleManagement
                        :selectLessonId="selectLessonId"
                        :isOperator="false"
                    />
                </div>
                <template
                    v-else-if="currentTab === ClassroomType.WindowClasses"
                >
                    <div v-if="windowInfo.winList.value.length === 0" class="empty-warp">
                        <div class="empty-container">
                            <img src="@/assets/images/attend-class/pic_wuneirong_big.svg"/>
                            <span>暂无课件</span>
                        </div>
                    </div>
                    <IntelligenceClassroom :selectLessonId="selectLessonId" v-else/>
                </template>
            </keep-alive>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.attend-class-warp {
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;
    display: flex;
    flex-direction: column;
    .header {
        height: 60px;
        background-color: #fff;
        padding-left: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .tab {
            display: flex;
            align-items: center;
            height: 100%;
            font-size: 24px;
            font-weight: 600;
            color: #a7aab4;
            margin-right: 32px;
            cursor: pointer;
            &.active {
                color: var(--app-color-dark);
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background-color: var(--app-color-primary);
                    bottom: 0;
                }
            }
        }
    }
    .content-warp {
        flex: 1;
        background-color: #fff;
        display: flex;
        .empty-warp {
            padding: 8px 20px 20px;
            flex: 1;
            background-color: #F5F6FA;
            .empty-container {
                width: 100%;
                height: 100%;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                color: #5F626F;
                font-size: 20px;
                flex-direction: column;
                img {
                    margin-bottom: 40px;
                }
            }
        }
    }
    .schedule-management {
        padding: 20px;
        background: #fff;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }
}
</style>
