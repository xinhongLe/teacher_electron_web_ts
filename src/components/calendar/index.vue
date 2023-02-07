<template>
    <div
        ref="calendarRef"
        class="calendar"
        :style="calendarStyles"
    >
        <slot :initSchedules="initSchedules" />
        <div class="content-header">
            <div class="item">上课时间</div>
            <div
                v-for="(day, index) in days"
                :key="day"
                class="item"
                :class="{ current: isCurrentDay(day) }"
            >
                {{ `${formTime(day)} 周${formWeek(index + 1)}` }}
            </div>
        </div>
        <div class="content">
            <div class="no-schedules" v-if="schedules.length === 0">
                <img src="@/assets/indexImages/pic_none.png" alt="" />
                未检测到教师课表
            </div>
            <div class="content-box" ref="contentRef">
                <div class="col" v-for="col in schedules" :key="col.ClassIndex">
                    <div class="time cell">
                        <span>{{ col.fontShowTime }}</span>
                        <span>{{ col.SectionName }}</span>
                    </div>
                    <Course
                        v-for="item in col.colData"
                        :key="item.index"
                        :rowData="col"
                        :colData="item"
                        :isDrop="isDrop"
                        :isShowText="isShowText"
                        :isShowDelete="isShowDelete"
                        :isShowDetailBtn="isShowDetailBtn"
                        @openCourse="openCourse"
                        @createHomePoint="createHomePoint"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useSchedules, { ColData } from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
import moment from "moment";
import {
    computed,
    defineComponent,
    PropType,
    provide,
    ref,
    watch,
    nextTick,
    onUnmounted,
} from "vue";
import Course from "./Course.vue";
import usePageEvent from "@/hooks/usePageEvent";
import { EVENT_TYPE } from "@/config/event";
import { useRoute } from "vue-router";
export default defineComponent({
    name: "Calendar",
    props: {
        days: {
            type: Array as PropType<string[]>,
            required: true,
        },
        isShowText: {
            type: Boolean,
            default: false,
        },
        isDrop: {
            type: Boolean,
            default: false,
        },
        isShowDelete: {
            type: Boolean,
            default: false,
        },
        isShowDetailBtn: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { expose, emit }) {
        //首页上课区域点击埋点
        const { createBuryingPointFn } = usePageEvent("首页");
        const { weekNext, weekPre, initDays, formTime, formWeek } = useTime();
        initDays();
        const days = computed(() => props.days);
        const currentDay = new Date().getDate();
        const {
            schedules,
            updateSchedules,
            updateClassSchedule,
            initSchedules,
        } = useSchedules(days);
        const isCurrentDay = (day: string) => {
            return moment().isSame(day, "d");
        };

        provide("updateSchedules", updateSchedules);

        const openCourse = (data: ColData) => {
            emit("openCourse", data);
        };
        //创建首页上课区域埋点事件
        const createHomePoint = (data: ColData) => {
            createBuryingPointFn(
                EVENT_TYPE.PageClick,
                data.LessonName,
                "上课",
                data
            );
        };

        const resize = () => {
            nextTick(() => {
                if (route.path === "/home" && calendarRef.value) {
                    width.value = window.innerWidth * 0.6;
                    height.value = calendarRef.value.parentElement.clientHeight;
                    const calendarHeight = height.value;
                    const contentHeight = calendarHeight - 128;
                    const contentScrollHeight = contentRef.value.scrollHeight;
                    if (contentHeight < contentScrollHeight) {
                        // 内容放置不下
                        scale.value = calendarHeight / (contentScrollHeight + 128);
                        height.value = height.value / scale.value;
                    }

                    if (calendarRef.value.parentElement.clientHeight !== height.value * scale.value) {
                        // 内容高度小，需要重新计算
                        calendarRef.value.parentElement.style.width = calendarRef.value.parentElement.clientHeight / height.value / scale.value * calendarRef.value.parentElement.clientWidth;
                        // resize();
                    } else {
                        calendarRef.value.parentElement.style.width = width.value * (scale.value > 1 ? 1 : scale.value) + "px";
                    }
                }
            });
        };

        const route = useRoute();
        nextTick(() => {
            if (route.path === "/home") {
                calendarRef.value.parentElement.style.width = window.innerWidth * 0.6 + "px";
            }
        });

        // window.addEventListener("resize", resize);

        // onUnmounted(() => {
        //     window.removeEventListener("resize", resize);
        // });

        expose({ initSchedules, resize });

        const scale = ref(1);
        const height = ref(0);
        const width = ref(window.innerWidth * 0.6);
        const calendarRef = ref();
        const contentRef = ref();
        // watch(schedules, resize);

        const calendarStyles = computed(() => {
            return route.path === "/home" ? {
                transform: `scale(${scale.value})`,
                height: `${height.value}px`,
                width: `${width.value}px`,
            } : {};
        });

        return {
            weekNext,
            weekPre,
            schedules,
            formTime,
            updateClassSchedule,
            initSchedules,
            currentDay,
            isCurrentDay,
            formWeek,
            openCourse,
            createHomePoint,
            calendarRef,
            contentRef,
            scale,
            height,
            width,
            calendarStyles
        };
    },

    components: { Course },
});
</script>

<style lang="scss" scoped>
.calendar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    border-radius: 16px;
    transform-origin: top left;

    .no-schedules {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 500;
        color: #9e9ea7;
        flex-direction: column;
        img {
            margin-bottom: 20px;
            display: block;
        }
    }
}

.content-header {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0 16px;
    height: 32px;
    .item {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5f626f;
        user-select: none;
        cursor: default;
        font-size: 12px;
        text-align: center;
        background-color: #f5f6fa;
        border-top: 1px solid #e0e2e7;
        border-bottom: 1px solid #e0e2e7;
        &.current {
            background: #98aef6;
            color: #fff;
            border: 1px solid #98aef6;
        }
    }
}

.content-box {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.content {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: overlay;
    background-color: #fff;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    padding: 0 16px 16px;
    .col {
        min-height: 80px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        flex: 1;
        &:last-child {
            .cell {
                border-bottom: none;
            }
        }
        .cell {
            height: 100%;
            flex: 1;
            min-width: 0;
            border-right: 1px solid #e0e2e7;
            border-bottom: 1px solid #e0e2e7;
            &:last-child {
                border-right: none;
            }
        }
        .time {
            display: flex;
            align-items: center;
            justify-content: space-around;
            font-size: 16px;
            color: var(--app-color-dark);
            font-weight: 600;
            user-select: none;
            flex: 1;
            border-left: none;
            flex-direction: column;
        }
        .course {
            position: relative;
            .course-content {
                height: 100%;
                width: 100%;
                padding: 10px 6px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    height: 24px;
                    .course-name {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        color: #19203d;
                    }
                    .del-class {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        font-size: 14px;
                        color: #fff;
                        background: #000000;
                        border-radius: 2px;
                        opacity: 0.2;
                    }
                }
                .class-name {
                    margin-top: 6px;
                    color: #5f626f;
                    font-size: 12px;
                }
                .content-detail {
                    cursor: pointer;
                    font-size: 14px;
                    color: #19203d;
                }
                .content-class {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    color: #ffffff;
                    font-size: 14px;
                    padding: 6px;
                }
            }
        }
    }
}
</style>
