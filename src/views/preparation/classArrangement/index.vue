<template>
    <div class="class-arrangement-warp">
        <Calendar
            :days="days"
            ref="calendarRef"
            :isShowText="true"
            :isDrop="true"
            :isShowDetailBtn="true"
            :isShowDelete="true"
        >
            <template v-slot:default="slotProps">
                <header class="header">
                    <div class="left">
                        <div class="left-content-warp">
                            <span class="square"></span>
                            <span>历史课程</span>
                        </div>
                        <div class="left-content-warp">
                            <span class="square"></span>
                            <span>待上课程</span>
                        </div>
                        <div class="left-content-warp">
                            <span class="square"></span>
                            <span>缺课包</span>
                        </div>
                    </div>
                    <div class="date-warp">
                        <span @click="weekPre" class="arrow-icon">
                            <el-icon><arrow-left-bold /></el-icon>
                        </span>
                        <span class="date">
                            {{ nowTime }} ~ {{ lateTime }}</span
                        >
                        <span @click="weekNext" class="arrow-icon">
                            <el-icon><arrow-right-bold /></el-icon
                        ></span>
                    </div>
                    <div class="right">
                        <div
                            class="right-content-warp"
                            @click="slotProps.initSchedules"
                        >
                            <img
                                src="@/assets/images/preparation/icon_shuaxin_rest.svg"
                                alt=""
                            />
                            <span>刷新</span>
                        </div>
                    </div>
                </header>
            </template>
        </Calendar>
        <div class="templates-dialog">
        </div>
    </div>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { defineComponent, ref } from "vue";
import Calendar from "@/components/calendar/index.vue";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
export default defineComponent({
    setup() {
        const templatesVisible = ref(false);
        const calendarRef = ref<InstanceType<typeof Calendar>>();
        const { days, initDays, nowTime, lateTime, weekPre, weekNext } =
            useTime();
        initDays();

        const success = () => {
            calendarRef.value && calendarRef.value.updateClassSchedule();
        };
        return {
            days,
            nowTime,
            lateTime,
            weekPre,
            success,
            calendarRef,
            templatesVisible,
            weekNext
        };
    },
    components: { Calendar, ArrowRightBold, ArrowLeftBold }
});
</script>

<style lang="scss" scoped>
.class-arrangement-warp {
    flex: 1;
    padding: 12px 0 0 12px;
    .templates-dialog {
        :deep(.el-overlay-dialog) {
            display: flex;
            .el-dialog {
                display: flex;
                flex-direction: column;
                .el-dialog__body {
                    flex: 1;
                    overflow: auto;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
    .calendar {
        border-radius: 0;
        :deep(.content-header) {
            height: 44px;
        }
        :deep(.content) {
            .col {
                height: 94px;
            }
        }
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 73px;
        padding: 0 20px;
        .left {
            display: flex;
            font-size: 14px;
            font-weight: 600;
            color: #5f626f;
            .left-content-warp {
                display: flex;
                margin-right: 24px;
                align-items: center;
                &:last-child {
                    margin-right: 0;
                }
                &:nth-child(2) {
                    .square {
                        background: #dce6ff;
                        border-color: #98aef6;
                    }
                }
                &:nth-child(3) {
                    .square {
                        background: #f0f2f6;
                        border-color: #ccced3;
                    }
                }

                .square {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                    border: 1px solid #86d4ae;
                    margin-right: 6px;
                    background: #d7f6e7;
                }
            }
        }
        .date-warp {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .arrow-icon {
                color: var(--app-color-primary);
                cursor: pointer;
            }
            .date {
                font-size: 18px;
                font-weight: 600;
                color: var(--app-color-dark);
                margin: 0 32px;
            }
        }
        .right {
            display: flex;
            font-size: 16px;
            color: var(--app-color-dark);
            font-weight: 400;
            .right-content-warp {
                margin-right: 32px;
                display: flex;
                align-items: center;
                cursor: pointer;
                img {
                    margin-right: 6px;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
