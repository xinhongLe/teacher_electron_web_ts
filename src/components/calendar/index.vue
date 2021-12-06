<template>
    <div class="calendar">
        <slot/>
        <div class="content-header">
            <div class="item">上课时间</div>
            <div v-for="(day, index) in days" :key="day" class="item">
                {{`${formTime(day)} 周${formWeek(index+1)}`}}
            </div>
        </div>
        <div class="content">
            <div class="col" v-for="col in schedules" :key="col.ClassIndex">
                <div class="time cell">{{col.fontShowTime}}</div>
                <Course
                    v-for="item in col.colData"
                    :key="item.ID"
                    :rowData="col"
                    :colData="item"
                    :isDrop="isDrop"
                    :isShowText="isShowText"
                    :isShowDetailBtn="isShowDetailBtn"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useSchedules from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
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
        isShowDetailBtn: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const { weekNext, weekPre, initDays, formTime, formWeek } = useTime();
        initDays();
        const days = computed(() => props.days);
        const { schedules, updateSchedules, updateClassSchedule } = useSchedules(days);
        provide("updateSchedules", updateSchedules);

        return {
            weekNext,
            weekPre,
            schedules,
            formTime,
            updateClassSchedule,
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
    }

    .content-header {
        display: flex;
        align-items: center;
        .item {
            flex: 1;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5f626f;
            user-select: none;
            cursor: default;
            font-size: 14px;
            text-align: center;
            border-left: 2px solid #e0e2e7;
            border-bottom: 1px solid #e0e2e7;
            &:last-child {
                border-right: 2px solid #e0e2e7;
            }
        }
    }
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow-y:overlay;
        border-left: 2px solid #e0e2e7;
        border-bottom: 1px solid #e0e2e7;
        border-right: 2px solid #e0e2e7;
        .col {
            height: 11rem;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            &:last-child {
                border-bottom: none;
            }
            .cell {
                height: 100%;
                flex: 1;
                border: 1px solid #e0e2e7;
                overflow: hidden;
                &:last-child {
                    border-right: none;
                }
            }
            .time {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #5f626f;
                user-select: none;
                flex: 1;
                border-left: none;
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
