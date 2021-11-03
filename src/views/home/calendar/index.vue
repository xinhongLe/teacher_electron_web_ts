<template>
    <div class="calendar">
        <header class="header">
            <div @click="weekPre"><i class="el-icon-arrow-left"></i>上周</div>
            <div>上课</div>
            <div @click="weekNext">下周<i class="el-icon-arrow-right"></i></div>
        </header>
        <div class="content-header">
            <div class="item">上课时间</div>
            <div v-for="(day, index) in days" :key="day" class="item">
                {{`${formTime(day)} 周${formWeek(index+1)}`}}
            </div>
        </div>
        <div class="content">
            <div class="col" v-for="col in schedules" :key="col.ClassIndex">
                <div class="time cell">{{col.fontShowTime}}</div>
                <div v-for="item in col.colData" :key="item.ID" class="course cell">
                    <el-popover
                        trigger="hover"
                        placement="top"
                        popper-class="preparation-popper-class"
                        v-if="item.ClassName"
                    >
                        <div>
                            <p v-show="item.Classes">
                                课程名称：{{
                                    item.Classes ? item.ClassName : ""
                                }}
                            </p>
                            <p>上课时间：{{ item.fontShowTime }}</p>
                            <p>科目：{{ item.SubjectName }}</p>
                            <p>
                                班级：{{
                                    item.Classes
                                        ? item.Classes[0].ClassName
                                        : item.ClassName
                                }}
                            </p>
                            <p v-show="item.Classes">
                                课包：{{
                                    item.Classes ? item.ClassName : ""
                                }}
                            </p>
                        </div>
                        <template #reference>
                            <div
                                class="course-content"
                                 :style="{
                                    backgroundColor:
                                        item.ClassActualEndTime
                                            ? '#DDFBE8'
                                            : item.Classes
                                            ? '#CBDAFF'
                                            : '#FFE8E8'
                                }"
                            >
                                <div>
                                    <div class="title">
                                    <span class="course-name">{{item.Classes && item.ClassName}}</span>
                                    <i
                                        class="el-icon-delete del-class"
                                        v-if="item.Classes"
                                        @click.stop="deleteCourse((item.ID))"
                                    />
                                    </div>
                                    <div class="class-name">
                                        {{
                                            item.Classes
                                            ? item.Classes.map(
                                                    (i) => i.ClassName
                                                ).join()
                                            : item.ClassName
                                        }}
                                    </div>
                                </div>
                                <div
                                    class="content-detail"
                                    v-if="!item.ClassActualEndTime && item.Classes"
                                    @click="$router.push({
                                        path:'/attend-class'
                                    })"

                                >
                                    去上课
                                </div>
                                <div
                                    class="content-class"
                                    :style="{
                                        backgroundColor: item.bgColor
                                    }"
                                >
                                    {{item.SubjectName}}
                                </div>
                            </div>
                        </template>
                    </el-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useDeleteCourse from "@/hooks/useDeleteCourse";
import useSchedules from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
import { defineComponent, watch } from "vue";

export default defineComponent({
    name: "Calendar",
    setup() {
        const { weekNext, weekPre, initDays, days, formTime, formWeek } = useTime();
        initDays();
        const { schedules, updateSchedules } = useSchedules(days);
        watch(days, updateSchedules);

        const { deleteCourse } = useDeleteCourse(updateSchedules);

        return {
            weekNext,
            weekPre,
            days,
            schedules,
            formTime,
            deleteCourse,
            formWeek
        };
    }
});
</script>

<style lang="scss" scoped>
    .calendar {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .header {
        width: 100%;
        height: 50px;
        display: flex;
        padding: 20px;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        background: #a0b7ff;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        color: #ffffff;
        div {
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
        }
        div:nth-of-type(2) {
            font-size: 22px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #ffffff;
        }
    }
    .content-header {
        display: flex;
        align-items: center;
        .item {
            flex: 1;
            padding: 20px 6px 20px 6px;
            color: #5f626f;
            user-select: none;
            cursor: default;
            font-size: 14px;
            text-align: center;
            border-left: 2px solid #e0e2e7;
            border-bottom: 2px solid #e0e2e7;
            &:last-child {
                border-right: 2px solid #e0e2e7;
            }
        }
    }
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y:overlay;
        border-left: 2px solid #e0e2e7;
        border-bottom: 2px solid #e0e2e7;
        border-right: 2px solid #e0e2e7;
        .col {
            height: 20%;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #e0e2e7;
            flex-shrink: 0;
            &:last-child {
                border-bottom: none;
            }
            .cell {
                height: 100%;
                flex: 1;
                border-right: 2px solid #e0e2e7;
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
            }
            .course {
                position: relative;
                .course-content {
                    height: 100%;
                    width: 100%;
                    padding: 10px 6px;
                    background: red;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        .course-name {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
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
                        font-size: 16px;
                        padding: 6px;
                    }
                }
            }

        }
    }
</style>
