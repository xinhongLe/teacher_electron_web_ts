<template>
    <div
        @drop.prevent="isDrop && colData.Schedules ? onDrop($event, colData) : null"
        @dragover="isDrop && colData.Schedules ? $event.preventDefault() : null"
        @dragenter="isDrop && colData.Schedules ? isActive = true : null"
        @dragleave="isDrop && colData.Schedules ? isActive = false : null"
        class="course cell"
        :class="[
            isActive ? 'active' : '',
            isDragging ? 'drag-event-class' : '',
        ]"
    >
        <el-popover
            trigger="hover"
            placement="top"
            popper-class="preparation-popper-class"
            v-if="className"
        >
            <div>
                <p v-show="colData.LessonName">
                    课程名称：{{ colData.LessonName }}
                </p>
                <p>上课时间：{{ colData.fontShowTime }}</p>
                <p>科目：{{ subjectNames.join(",") }}</p>
                <p>
                    班级：{{
                        className
                    }}
                </p>
            </div>
            <template #reference>
                <div class="course-content-warp" >
                    <div class="course-content" :class="{'has-course': colData.LessonName, 'end': isEnd}" @click="goToClass">
                        <div class="course-name">
                            {{ colData.LessonName }}
                        </div>
                        <div class="bottom">
                            <div class="class-name">
                                {{className}}
                            </div>
                            <div
                                class="content-class"
                                :style="{
                                    backgroundColor: bgColor,
                                }"
                            >
                                {{ subjectNames[0]?.substring(0, 1) }}
                            </div>
                        </div>
                        <div class="delete-icon-warp" v-if="colData.LessonID && isShowDelete" @click.stop="deleteCourse">
                            <span class="line"></span>
                        </div>
                    </div>
                </div>
            </template>
        </el-popover>
    </div>
</template>

<script lang="ts" setup>
import { ColData, Schedule } from "@/hooks/useSchedules";
import { CourseBag, SchoolLesson } from "@/types/preparation";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import { computed, inject, PropType, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { updateSchedule } from "@/api/timetable";
import { store } from "@/store";

const CourseBgColor: Record<string, string> = {
    语文: "#4FCC94",
    数学: "#63D1FA",
    英语: "#9A69EB",
    拼音: "#FFD152"
};

const props = defineProps({
    rowData: {
        type: Object as PropType<Schedule>,
        default: () => ({})
    },
    colData: {
        type: Object as PropType<ColData>,
        default: () => ({})
    },
    isShowText: {
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
    },
    isDrop: {
        type: Boolean,
        default: false
    }
});

const isActive = ref(false);
const router = useRouter();

const isDragging = computed(() => store.state.common.isDragging);

const className = computed(() => {
    if (!props.colData.Schedules) return "";
    const classNames = new Set(props.colData.Schedules.map(item => item.ClassName));
    return [...classNames].join("，");
});

const subjectNames = computed(() => {
    if (!props.colData.Schedules) return [];
    const subjectNames = new Set(props.colData.Schedules.flatMap(item => {
        if (item.MajorCourseName && item.MinorCourseName) {
            return [item.MajorCourseName, item.MinorCourseName];
        } else if (item.MinorCourseName) {
            return [item.MinorCourseName];
        } else if (item.MajorCourseName) {
            return [item.MajorCourseName];
        } else {
            return [];
        }
    }));

    return [...subjectNames];
});

const bgColor = computed(() => CourseBgColor[subjectNames.value[0]] || "#0057FE");
const isEnd = computed(() => props.colData.ScheduleTime && moment().isAfter(props.colData.ScheduleTime));
const scheduleIDs = computed(() => props.colData.Schedules ? props.colData.Schedules?.map(item => item.SchedulesID) : []);
const scheduleTime = computed(() => props.colData.colDate + " " + props.colData.EndTime);

const updateSchedules = inject(
    "updateSchedules"
) as () => Promise<void>;

const deleteCourse = () => {
    ElMessageBox.confirm("确定要删除这堂课吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        const res = await updateSchedule({
            lessonID: "",
            scheduleTime: scheduleTime.value,
            timetableMainID: props.colData.timetableID,
            scheduleIDs: scheduleIDs.value
        });
        if (res.resultCode === 200) {
            ElMessage.success("删除成功");
            updateSchedules();
        }
    });
};

const addSchedule = async (id: string) => {
    const res = await updateSchedule({
        lessonID: id,
        timetableMainID: props.colData.timetableID,
        scheduleTime: scheduleTime.value,
        scheduleIDs: scheduleIDs.value
    });
    return res;
};

const onDrop = async (ev: DragEvent, colData: ColData) => {
    isActive.value = false;
    const dragInfo = JSON.parse(
                ev.dataTransfer?.getData("dragInfo") as string
    ) as SchoolLesson;
    if (!colData.Schedules) return;
    if (isEnd.value) {
        return ElMessage.error("已经结束的课程无法重新排课");
    }
    if (props.colData.LessonID) {
        return ElMessageBox.confirm(
            "当前时间点已有排课，是否覆盖？",
            "覆盖提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        ).then(async () => {
            const res = await addSchedule(dragInfo.ID);
            if (res.resultCode === 200) {
                ElMessage.success("更新成功");
                updateSchedules();
            }
        });
    }
    const res = await addSchedule(dragInfo.ID);
    if (res.resultCode === 200) {
        ElMessage.success("排课成功");
        updateSchedules();
    }
};

const goToClass = () => {
    if (!props.colData.LessonName) return;
    router.push(`/attend-class/${props.colData.LessonID}/${props.colData.SubjectID}`);
};

</script>

<style lang="scss" scoped>
.course {
    &.active {
        border: 2px solid #a5b8f6 !important;
    }
    .course-content-warp {
        padding: 2px;
        height: 100%;
        width: 100%;
        position: relative;
        .course-content {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #f0f2f6;
            border-radius: 2px;
            &.has-course {
                border: 1px solid #456CED;
                background: #CBDAFF;
            }
            &.end {
                background: #D7F6E7;
                border: none;
            }
            .course-name {
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                padding: 8px 12px 0;
                font-size: 14px;
                flex: 1;
                font-weight: 600;
                line-height: 16px;
                color: #19203d;
                margin-bottom: 6px;
            }
            .bottom {
                padding: 0 2px 2px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .class-name {
                color: #19203d;
                font-size: 12px;
                flex: 1;
                margin-right: 8px;
                @include text-ellipsis();
            }
            .content-class {
                height: 20px;
                padding: 0 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
                font-size: 12px;
                border-radius: 2px;
            }
            .delete-icon-warp {
                position: absolute;
                right: 0;
                top: 0;
                width: 14px;
                height: 14px;
                background-color: #ff6b6b;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .line {
                    background-color: #ffffff;
                    height: 2px;
                    width: 6px;
                }
            }
        }
    }
}
</style>
