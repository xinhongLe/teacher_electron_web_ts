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
import { computed, provide, ref, watch } from "vue";
import ScheduleManagement from "../preparation/scheduleManagement/index.vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import { useRoute } from "vue-router";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import useBag, { bagKey } from "@/hooks/useBag";
import WindowList from "@/components/windowList/index.vue";
import useOpenWindow from "@/hooks/useOpenWindow";
import { isEmpty } from "lodash";

const titleList = [
    { title: "翻转课堂", type: ClassroomType.Classes },
    { title: "数智课堂", type: ClassroomType.WindowClasses }
];
const currentTab = ref(ClassroomType.WindowClasses);
const route = useRoute();

const selectLessonId = computed(() => route.params.lessonId as string);
const subjectId = computed(() => route.params.subjectId as string);

const windowInfo = useWindowInfo();
const bagInfo = useBag(selectLessonId);
const isWindowLoadEnd = ref(false);
const isBagLoadEnd = ref(false);

provide(windowInfoKey, windowInfo);
provide(bagKey, bagInfo);
provide(
    "subjectId",
    computed(() => subjectId.value)
);

watch([isBagLoadEnd, isWindowLoadEnd], (v) => {
    if (v[0] && v[1]) {
        if (isEmpty(windowInfo.winList.value) && !isEmpty(bagInfo.bagList.value)) {
            currentTab.value = ClassroomType.Classes;
        }
    }
});

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
            <div
                v-show="currentTab === ClassroomType.Classes"
                class="schedule-management"
            >
                <ScheduleManagement
                    :selectLessonId="selectLessonId"
                    :isOperator="false"
                    v-model:isBagLoadEnd="isBagLoadEnd"
                />
            </div>
            <div v-show="currentTab === ClassroomType.WindowClasses" class="intelligence-classroom-container">
                <div
                    v-show="windowInfo.winList.value.length === 0"
                    class="empty-warp"
                >
                    <div class="empty-container">
                        <img
                            src="@/assets/images/attend-class/pic_wuneirong_big.svg"
                        />
                        <span>暂无课件</span>
                    </div>
                </div>
                <IntelligenceClassroom
                    v-model:isWindowLoadEnd="isWindowLoadEnd"
                    :selectLessonId="selectLessonId"
                    v-show="windowInfo.winList.value.length !== 0"
                />
            </div>
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
        flex-shrink: 0;
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
        overflow: hidden;
        .intelligence-classroom-container {
            width: 100%;
            height: 100%;
            display: flex;
        }
        .empty-warp {
            padding: 8px 20px 20px;
            flex: 1;
            background-color: #f5f6fa;
            .empty-container {
                width: 100%;
                height: 100%;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                color: #5f626f;
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
