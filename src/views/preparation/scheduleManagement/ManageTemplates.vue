<template>
    <el-dialog
        title="课表模板"
        :model-value="dialogVisible"
        width="95%"
        style="user-select: none"
        :before-close="handleClose"
        center
        :close-on-click-modal="false"
    >
        <header>
            <div class="left" @click="prePage">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="center">
                <div
                    :class="
                        activeIndex === index
                            ? activeIndex < 5
                                ? `active${activeIndex}`
                                : `active${activeIndex % 5}`
                            : ''
                    "
                    v-for="(item, index) in lessonList"
                    :style="`color:${item.fontColor};background:${item.backgroundColor}`"
                    :key="index"
                    @click="selectLesson(index)"
                >
                    {{ item.GradeName }}{{ item.ClassName
                    }}{{ item.SubjectName }}
                </div>
            </div>
            <div class="right" @click="nextPage">
                <i class="el-icon-arrow-right"></i>
            </div>
        </header>
        <div class="calendar">
            <div class="content-header">
                <div class="item">上课时间</div>
                <div v-for="(day, index) in days" :key="day" class="item">
                    {{`${formTime(day)} 周${formWeek(index+1)}`}}
                </div>
            </div>
            <div class="content">
                <div class="col" v-for="(col, index) in schedules" :key="col.ClassIndex">
                    <div class="time cell">{{col.fontShowTime}}</div>
                    <div v-for="(item, colIndex) in col.colData" :key="item.ID" class="course cell">
                        <el-popover
                            trigger="hover"
                            placement="top"
                            popper-class="preparation-popper-class"
                            v-if="item.ClassName"
                        >
                            <div>
                                <p>上课时间：{{ item.fontShowTime }}</p>
                                <p>科目：{{ item.SubjectName }}</p>
                                <p>
                                    班级：{{
                                        item.Classes
                                            ? item.Classes[0].ClassName
                                            : item.ClassName
                                    }}
                                </p>
                            </div>
                            <template #reference>
                                <div
                                    class="course-content"
                                    :style="{
                                        backgroundColor: lessonListAll.find(lesson => lesson.ClassID === item.ClassID &&
                                            lesson.GradeID === item.GradeID &&
                                            lesson.SubjectID === item.SubjectID
                                        )?.backgroundColor
                                    }"
                                >
                                    <div>
                                        <div class="title">
                                            <span class="course-name">
                                                {{item.GradeName}}{{
                                                    item.Classes
                                                    ?item.Classes.map(
                                                            (i) => i.ClassName
                                                        ).join()
                                                    :item.ClassName
                                                }}
                                            </span>
                                            <i
                                                class="el-icon-delete del-class"
                                                @click="handleDel(index, colIndex)"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        class="content-class"
                                    >
                                        {{item.SubjectName}}
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                        <div v-else class="add-gray" @click="addLesson(index, colIndex)">
                            <img src="~@/assets/indexImages/icon_add_gray.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submit">保存模板</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import useSchedules from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
import { SaveTeacherClassScheduleData } from "@/types/preparation";
import { defineComponent, ref } from "vue";
import { saveTeacherClassSchedule } from "../api";
import useLessonList from "./hooks/useLessonList";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const { days, formTime, formWeek, initDays } = useTime();
        initDays();
        const { schedules } = useSchedules(days);
        const { lessonListAll, lessonList, prePage, nextPage } = useLessonList();

        const activeIndex = ref(-1);
        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const addLesson = (index: number, colIndex:number) => {
            if (activeIndex.value < 0) return;
            const activeInfo = { ...lessonList.value[activeIndex.value] };
            const targetRowValue = schedules.value[index].colData[colIndex];
            schedules.value[index].colData[colIndex] = Object.assign(targetRowValue, activeInfo, {
                BeginTime: schedules.value[index].StartTime,
                EndTime: schedules.value[index].EndTime
            });
        };

        const handleDel = (index: number, colIndex:number) => {
            const targetRowValue = schedules.value[index].colData[colIndex];
            schedules.value[index].colData[colIndex] = {
                colDate: targetRowValue.colDate,
                index: targetRowValue.index
            };
        };

        const submit = async () => {
            const list: SaveTeacherClassScheduleData = schedules.value.map(item => {
                return item.colData.filter(col => col.GradeID);
            }).flat().map(item => ({
                classID: item.ClassID!,
                subjectID: item.SubjectID!,
                beginTime: item.BeginTime!,
                endTime: item.EndTime!,
                dayOfWeek: item.index
            }));

            const res = await saveTeacherClassSchedule(list);
            if (res.resultCode === 200) {
                emit("success");
                handleClose();
            }
        };

        const selectLesson = (index: number) => {
            activeIndex.value = index;
        };

        return {
            days,
            formTime,
            formWeek,
            submit,
            lessonListAll,
            lessonList,
            prePage,
            nextPage,
            addLesson,
            selectLesson,
            activeIndex,
            handleDel,
            schedules,
            handleClose
        };
    }
});
</script>

<style lang="scss" scoped>
.active0 {
    color: #ffffff !important;
    background: #4b71ee !important;
}
.active1 {
    color: #ffffff !important;
    background: #e3850a !important;
}
.active2 {
    color: #ffffff !important;
    background: #13bb7c !important;
}
.active3 {
    color: #ffffff !important;
    background: #7b4dff !important;
}
.active4 {
    color: #ffffff !important;
    background: #f75050 !important;
}
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    > div:nth-of-type(2) {
        width: 90%;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        div {
            margin: 5px 5px 5px 5px;
            padding: 10px 20px 10px 20px;
        }
    }
}
.add-gray {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
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
            padding: 20px 6px 20px 6px;
            color: #5f626f;
            user-select: none;
            cursor: default;
            font-size: 14px;
            text-align: center;
            border-top: 2px solid #e0e2e7;
            border-left: 2px solid #e0e2e7;
            border-bottom: 2px solid #e0e2e7;
            &:last-child {
                border-right: 2px solid #e0e2e7;
            }
        }
    }
    .content {
        display: flex;
        flex-direction: column;
        overflow-y:overlay;
        border-left: 2px solid #e0e2e7;
        border-bottom: 2px solid #e0e2e7;
        border-right: 2px solid #e0e2e7;
        .col {
            height: 11rem;
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
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        .course-name {
                            color: #19203d;
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
                        background: #63d1fa;
                        font-size: 14px;
                        padding: 6px;
                    }
                }
            }

        }
    }
</style>
