<template>
    <div @drop.prevent="isDrop && colData.ID ? onDrop($event, colData) : null"
        @dragover="isDrop && colData.ID ? $event.preventDefault() : null"
        @dragenter="isDrop && colData.ID ? (isActive = true) : null"
        @dragleave="isDrop && colData.ID ? (isActive = false) : null"
        @mouseenter="isDragging && colData.ID ? (isActive = true) : null"
        @mouseleave="isDragging && colData.ID ? (isActive = false) : null"
        @mousedown.prevent="onMouseDownEnd($event, colData)" class="course cell" :class="[
            isActive ? 'active' : '',
            isDragging ? 'drag-event-class' : '',
        ]">
        <el-popover :visible="currentClassId === colData.ID && !isMobile" popper-class="preparation-popper-class-adjust"
            :append-to-body="false" v-if="colData.ClassName">
            <div>
                <p v-show="colData.LessonName">
                    课程名称：{{ colData.LessonName }}
                </p>
                <p>上课时间：{{ colData.fontShowTime }}</p>
                <p>科目：{{ colData.CourseName }}</p>
                <p>班级：{{ colData.ClassName }}</p>
            </div>
            <template #reference>
                <div class="course-content-warp" @mouseenter="currentClassId = colData.ID"
                    @mouseleave="currentClassId = ''">
                    <div class="course-content" :class="{
                        'has-course': colData.LessonName,
                        end: isEnd,
                    }" @click="goToClass(), clicKBuryPoint()">
                        <div class="course-name">
                            {{ colData.LessonName }}
                        </div>
                        <div class="bottom">
                            <div class="class-name">
                                {{ colData.ClassName }}
                            </div>
                            <div v-if="colData.count > 0" class="my-course-cart" :num="colData.count">
                                <img src="@/assets/images/preparation/cart.png" alt="" />
                            </div>
                            <div v-if="colData.CourseName" class="content-class" :style="{
                                backgroundColor: bgColor,
                            }">
                                {{ colData.CourseName?.substring(0, 1) }}
                            </div>
                        </div>
                        <div class="delete-icon-warp" v-if="colData.LessonName && isShowDelete" @click.stop="deleteCourse">
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
import { SchoolLesson } from "@/types/preparation";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import {
    computed,
    inject,
    PropType,
    ref,
    defineProps,
    defineEmits,
    onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { updateSchedule } from "@/api/timetable";
import { store } from "@/store";
import { addSchedulePackage, removeSchedulePackage } from "@/api/resource";
import usePageEvent from "@/hooks/usePageEvent";
import { EVENT_TYPE } from "@/config/event";
import useClickDrag from "@/hooks/useClickDrag";
const { createBuryingPointFn } = usePageEvent("备课");
const { clickOutSide } = useClickDrag();
const CourseBgColor: Record<string, string> = {
    语文: "#4FCC94",
    数学: "#63D1FA",
    英语: "#9A69EB",
    拼音: "#FFD152",
    其他: "#0057FE",
};

const props = defineProps({
    rowData: {
        type: Object as PropType<Schedule>,
        default: () => ({}),
    },
    colData: {
        type: Object as PropType<ColData>,
        default: () => ({}),
    },
    isShowText: {
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
    isDrop: {
        type: Boolean,
        default: false,
    },
});
const currentClassId: any = ref("");
const isMobile = ref(false);
const getMobile = () => {
    isMobile.value = navigator.maxTouchPoints ? true : false;
};
onMounted(() => {
    getMobile();
});

const isActive = ref(false);
const router = useRouter();

const isDragging = computed(() => store.state.common.isDragging);
const currentPackageData = computed(() => store.state.common.currentPackageData);

const bgColor = computed(
    () => CourseBgColor[props.colData.CourseName || "其他"] || "#84AAF7"
);
const scheduleID = computed(() => props.colData.ID || "");
const originScheduleID = computed(() => props.colData.OriginScheduleID || "");
const scheduleTime = computed(
    () => props.colData.colDate + " " + props.colData.EndTime
);
const subjectPublisherBookValue = computed(
    () => store.state.preparation.subjectPublisherBookValue
);
const isEnd = computed(
    () => scheduleTime.value && moment().isAfter(scheduleTime.value)
);

const updateSchedules = inject("updateSchedules") as () => Promise<void>;

const deleteCourse = () => {
    ElMessageBox.confirm("确定要删除这堂课吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async () => {
        await removeSchedulePackage({
            id: props.colData.bagId,
        });

        const res = await updateSchedule({
            ID: props.colData.OriginScheduleID,
            LessonID: props.colData.LessonID,
            LessonName: props.colData.LessonName,
            Type: 2,
        });
        if (res.resultCode === 200) {
            ElMessage.success("删除成功");
            updateSchedules();
            createBuryingPointFn(
                EVENT_TYPE.ScheduleOff,
                "取消排课",
                "删除",
                props.colData
            );
        }
    });
};

const addSchedule = async (dragInfo: SchoolLesson) => {
    const schoolID = store.state.userInfo.schoolId;
    if (!props.colData.LessonID) {
        await addSchedulePackage({
            scheduleId: scheduleID.value,
            schoolId: schoolID,
            acaSectionCode: subjectPublisherBookValue.value!.AcaSectionId,
            lessonId: dragInfo.ID,
            lessonName: dragInfo.Name,
            lessonTime: props.colData.colDate + " " + props.colData.StartTime,
        });
    }

    const res = await updateSchedule({
        ID: originScheduleID.value,
        LessonID: dragInfo.ID,
        LessonName: dragInfo.Name,
        Type: 1,
    });
    return res;
};

// 鼠标在课表区域按下
const onMouseDownEnd = async (ev: MouseEvent, colData: ColData) => {
    const dom: any = document.querySelector('.dragging-click-dom-ele');//备课包虚拟dom
    const dragInfo: SchoolLesson = currentPackageData.value;
    if (!dragInfo) return;
    if (isDragging && colData.ID) {
        isActive.value = false;
        clickOutSide(ev, dom)
        if (!colData.ID) return;
        if (props.colData.LessonID) {
            return ElMessageBox.confirm(
                "当前时间点已有排课，是否覆盖？",
                "覆盖提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).then(async () => {
                const res = await addSchedule(dragInfo);
                // console.log("dragInfo", dragInfo, colData);

                if (res.resultCode === 200) {
                    ElMessage.success("更新成功");
                    updateSchedules();
                    //拖动课程进入课表成功后，调用埋点接口
                    createBuryingPointFn(
                        EVENT_TYPE.ScheduleStart,
                        "排课",
                        "课表",
                        colData
                    );
                }
            });
        }
        const res = await addSchedule(dragInfo);
        if (res.resultCode === 200) {
            ElMessage.success("排课成功");
            updateSchedules();
            //拖动课程进入课表成功后，调用埋点接口
            createBuryingPointFn(EVENT_TYPE.ScheduleStart, "排课", "课表", colData);
        }
    } else {
        clickOutSide(ev, dom);
    }
};

const onDrop = async (ev: DragEvent, colData: ColData) => {
    isActive.value = false;
    const dragInfo = JSON.parse(
        ev.dataTransfer?.getData("dragInfo") as string
    ) as SchoolLesson;
    if (!colData.ID) return;
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
                type: "warning",
            }
        ).then(async () => {
            const res = await addSchedule(dragInfo);
            // console.log("dragInfo", dragInfo, colData);

            if (res.resultCode === 200) {
                ElMessage.success("更新成功");
                updateSchedules();
                //拖动课程进入课表成功后，调用埋点接口
                createBuryingPointFn(
                    EVENT_TYPE.ScheduleStart,
                    "排课",
                    "课表",
                    colData
                );
            }
        });
    }
    const res = await addSchedule(dragInfo);
    if (res.resultCode === 200) {
        ElMessage.success("排课成功");
        updateSchedules();
        //拖动课程进入课表成功后，调用埋点接口
        createBuryingPointFn(EVENT_TYPE.ScheduleStart, "排课", "课表", colData);
    }
};

const emit = defineEmits(["openCourse", "createHomePoint"]);

const goToClass = () => {
    if (!props.colData.LessonName) return;
    if (props.isDrop) return emit("openCourse", props.colData);
    router.push(
        `/attend-class/${props.colData.chapterId}/${props.colData.LessonID}/${props.colData.bookId}`
    );
};

//首页页面上课区域点击埋点事件
const clicKBuryPoint = () => {
    //没有课程的话，就不埋点了
    if (!props.colData.LessonName) return;
    emit("createHomePoint", props.colData);
};
</script>

<style lang="scss" scoped>
.course {
    &.active {
        cursor: copy;
        // border: 2px solid #a5b8f6 !important;
        // outline: #a5b8f6;
        outline: solid 2px #a5b8f6
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
            background-color: #fff;
            border-radius: 2px;

            &.has-course {
                border: 1px solid #456ced;
                background: #cbdaff;
            }

            &.end {
                background: #d7f6e7;
                border: none;
            }

            .course-name {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                padding: 8px 12px 0;
                font-size: 14px;
                // flex: 1;
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
                overflow: hidden;
                min-width: 0;
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

.my-course-cart {
    margin: 0 10px;
    font-size: 14px;
    position: relative;

    &:before {
        content: attr(num);
        display: block;
        padding: 3px;
        border-radius: 15px;
        font-size: 12px;
        color: #fff;
        background: var(--app-color-red);
        position: absolute;
        right: 5px;
        transform: translateX(50%);
        top: -10px;
        z-index: 1;
        min-width: 18px;
        text-align: center;
        line-height: 1;
    }

    img {
        width: 30px;
        display: block;
    }
}
</style>
