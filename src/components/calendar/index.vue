<template>
    <div class="calendar">
        <slot :initSchedules="initSchedules"/>
        <div class="content-header">
            <div class="item">上课时间</div>
            <div v-for="(day, index) in days" :key="day" class="item" :class="{current: isCurrentDay(day)}">
                {{`${formTime(day)} 周${formWeek(index+1)}`}}
            </div>
        </div>
        <div class="content">
            <div class="col" v-for="(col) in schedules" :key="col.ClassIndex">
                <div class="time cell">
                    <span>{{col.fontShowTime}}</span>
                    <span>{{col.SectionName}}</span>
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
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useSchedules from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
import moment from "moment";
import { computed, defineComponent, PropType, provide } from "vue";
import Course from "./Course.vue";

export default defineComponent({
    name: "Calendar",
    props: {
        days: {
            type: Array as PropType<string[]>,
            required: true
        },
        isShowText: {
            type: Boolean,
            default: false
        },
        isDrop: {
            type: Boolean,
            default: false
        },
        isShowDelete: {
            type: Boolean,
            default: false
        },
        isShowDetailBtn: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { expose }) {
        const { weekNext, weekPre, initDays, formTime, formWeek } = useTime();
        initDays();
        const days = computed(() => props.days);
        const currentDay = new Date().getDate();
        const { schedules, updateSchedules, updateClassSchedule, initSchedules } = useSchedules(days);
        const isCurrentDay = (day: string) => {
            return moment().isSame(day, "d");
        };

        provide("updateSchedules", updateSchedules);

        expose({ initSchedules });

        return {
            weekNext,
            weekPre,
            schedules,
            formTime,
            updateClassSchedule,
            initSchedules,
            currentDay,
            isCurrentDay,
            formWeek
        };
    },

    components: { Course }
});
</script>

<style lang="scss" scoped>
    .calendar {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: #fff;
        border-radius: 16px;
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
            background-color: #F5F6FA;
            border-top: 1px solid #E0E2E7;
            border-bottom: 1px solid #E0E2E7;
            &.current {
                background: #98AEF6;
                color: #fff;
                border: 1px solid #98AEF6;
            }
        }
    }
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow-y:overlay;
        background-color: #fff;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        padding: 0 16px 16px;
        .col {
            height: 80px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
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
