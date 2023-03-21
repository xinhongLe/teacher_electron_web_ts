<template>
    <div @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @mousedown.stop.prevent="onMouseDownEnd($event, colData)"
        class="course cell" :class="[
            isActive ? 'active' : '',
            isDragging ? 'drag-event-class' : '',
        ]">
        <!-- @drop.prevent="isDrop && colData.ID ? onDrop($event, colData) : null"
        @dragover="isDrop && colData.ID ? $event.preventDefault() : null"
        @dragenter="isDrop && colData.ID ? (isActive = true) : null"
        @dragleave="isDrop && colData.ID ? (isActive = false) : null" -->
        <el-popover trigger="hover" popper-class="preparation-popper-class-adjust" :append-to-body="false"
            @hide="currentWillDelPackageId = ''" v-if="colData.ClassName">
            <div class="lesson-contents">
                <div class="lesson-title">
                    {{ colData.ClassName }}
                    <img style="cursor: pointer;" @click="editClass(colData)"
                        src="@/assets/images/preparation/icon_deit_cebianlan.png" alt="" />
                </div>
                <p class="lesson-time">
                    {{ formTime(colData.colDate) + `（周${formWeek(colData.index + 1)}）` }} {{ colData.fontShowTime }}
                </p>
                <div class="lesson-packages" v-if="colData.PackageList && colData.PackageList.length"
                    v-for="item in colData.PackageList">
                    <div class="left">
                        <img src="@/assets/images/preparation/icon_kebao_yellow.png" alt="" />
                    </div>
                    <div class="right">
                        <div class="has-kebao">
                            <p class="kebao-name">{{ item.PackageName }}</p>
                            <p class="keshi">{{ item.PublisherName }} {{ item.AlbumName }} {{ item.ChapterName }} {{
                                item.LessonName }}</p>
                        </div>
                        <div class="kebao-del-btn">
                            <div class="kebao-delete" @click="openDelLesson($event, item.PackageId as string)">
                                <img src="@/assets/images/preparation/icon_delete_new.png" alt="" />
                                删除
                            </div>
                            <div class="delete-btn" v-if="currentWillDelPackageId === item.PackageId">
                                <p class="del-text">
                                    <img style="width: 14px;height: 14px;"
                                        src="@/assets/images/preparation/icon_tips_popup.png" alt="">
                                    确定要删除这堂课吗？
                                </p>
                                <div class="btns">
                                    <el-button size="small" @click="currentWillDelPackageId = ''">取消</el-button>
                                    <el-button size="small" type="primary" @click="confirmDel">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="false" class="no-kebao">
                        未排课包
                    </div>
                </div>
            </div>
            <template #reference>
                <div class="course-content-warp" @mouseenter="currentClassId = colData.SchedulingNewDetailId"
                    @mouseleave="currentClassId = ''">
                    <div class="course-content" :class="{
                        'has-course': colData.PackageList && colData.PackageList[0]?.LessonName,
                        end: isEnd,
                    }" @click.stop.prevent="goToClass(), clicKBuryPoint()"
                        @touchstart.stop.prevent="goToClass(), clicKBuryPoint()">
                        <div class="course-name">
                            {{ colData.PackageList && colData.PackageList[0]?.LessonName }}
                        </div>
                        <div class="middle">
                            <div v-if="colData.PackageList && colData.PackageList.length"
                                v-for="item in computedPackagelist"
                                :class="isEnd ? 'end-lesson-package' : 'lesson-package'">
                                {{ item.PackageName }}
                            </div>
                            <span v-if="colData.PackageList && colData.PackageList.length > 1">...</span>
                        </div>
                        <div class="bottom">
                            <div class="class-name">
                                {{ colData.ClassName }}
                            </div>
                            <div v-if="colData.TotalCount && colData.TotalCount > 0" class="my-course-cart"
                                :num="colData.TotalCount">
                                <img src="@/assets/images/preparation/cart.png" alt="" />
                            </div>
                            <div v-if="colData.SubjectName" class="content-class" :style="{
                                backgroundColor: bgColor,
                            }">
                                {{ colData.SubjectName?.substring(0, 1) }}
                            </div>
                        </div>
                        <div class="delete-icon-warp"
                            v-if="colData.PackageList && colData.PackageList[0]?.LessonName && isShowDelete" 
                            @click.stop.prevent="deleteCourse(colData)" @touchstart.stop.prevent="deleteCourse(colData)">
                            <span class="line"></span>
                        </div>
                    </div>
                </div>
            </template>
        </el-popover>

    </div>
</template>

<script lang="ts" setup>
import useTime from "@/hooks/useTime";
import { NewColData, NewSchedule } from "@/hooks/useSchedules";
import { SchoolLesson } from "@/types/preparation";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import {
    computed,
    inject,
    PropType,
    ref,
    onMounted,
    defineExpose,
    nextTick
} from "vue";
import { useRouter } from "vue-router";
import { updateSchedule } from "@/api/timetable";
import { store } from "@/store";
import { addSchedulePackage, removeSchedulePackage } from "@/api/resource";
import usePageEvent from "@/hooks/usePageEvent";
import { EVENT_TYPE } from "@/config/event";
import useClickDrag from "@/hooks/useClickDrag";
import { UserInfoState } from "@/types/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { INewScheduleInDto, NewCourseScheduling, SetCourseScheduling, ISetNewScheduleInDto, IDelNewSchedulingInDto, DelCourseScheduling, EditClass, IEditClassInDto } from "@/api/prepare";
const { createBuryingPointFn } = usePageEvent("备课");
const { clickOutSide } = useClickDrag();
const { weekNext, weekPre, initDays, formTime, formWeek } = useTime();
const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
const CourseBgColor: Record<string, string> = {
    语文: "#4FCC94",
    数学: "#63D1FA",
    英语: "#9A69EB",
    拼音: "#FFD152",
    其他: "#0057FE",
};

const props = defineProps({
    rowData: {
        type: Object as PropType<NewSchedule>,
        default: () => ({}),
    },
    colData: {
        type: Object as PropType<NewColData>,
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
    }
});
const showDeleteLesson = ref(false);
const delLeft = ref('');
const delTop = ref('');
const currentClassId: any = ref("");
const isMobile = ref(false);
const currentMouseEvent = ref<MouseEvent>();
const colData = computed(() => props.colData);
const rowData = computed(() => props.rowData);
const currentcolData = ref<NewColData>();
const computedPackagelist = computed(() => {
    const data = JSON.parse(JSON.stringify(colData.value.PackageList?.length && colData.value.PackageList));
    return data && data.length > 1 ? data.splice(0, 1) : data
})
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
    () => CourseBgColor[colData.value.SubjectName || "其他"] || "#84AAF7"
);
// const scheduleID = computed(() => colData.ID || "");
// const originScheduleID = computed(() => colData.OriginScheduleID || "");
const scheduleTime = computed(
    () => colData.value.StartTime + " " + colData.value.EndTime
);
const subjectPublisherBookValue = computed(
    () => store.state.preparation.subjectPublisherBookValue
);
const isEnd = computed(
    () => scheduleTime.value && moment().isAfter(scheduleTime.value)
);

const updateSchedules = inject("updateSchedules") as () => Promise<void>;



// const addSchedule = async (dragInfo: SchoolLesson) => {
//     const schoolID = store.state.userInfo.schoolId;
//     if (!colData.LessonID) {
//         await addSchedulePackage({
//             scheduleId: scheduleID.value,
//             schoolId: schoolID,
//             acaSectionCode: subjectPublisherBookValue.value!.AcaSectionId,
//             lessonId: dragInfo.ID,
//             lessonName: dragInfo.Name,
//             lessonTime: colData.colDate + " " + colData.StartTime,
//         });
//     }

//     const res = await updateSchedule({
//         ID: originScheduleID.value,
//         LessonID: dragInfo.ID,
//         LessonName: dragInfo.Name,
//         Type: 1,
//     });
//     return res;
// };

const onMouseEnter = async (ev: MouseEvent) => {
    if (isDragging.value && !isEnd.value) {
        isActive.value = true;
    } else {
        const dom: HTMLElement = document.querySelector('.dragging-click-dom-ele') as HTMLElement;//备课包虚拟dom
        // dom. = `url(${require('@/assets/images/preparation/bg_kebao_not.png')})`;
        const notDom: HTMLElement = document.createElement('div');
        notDom!.classList.add("not-allowed");
        dom && dom.appendChild(notDom)

    }
};
const onMouseLeave = async (ev: MouseEvent) => {
    if (isDragging.value) {
        isActive.value = false;
        const dom: HTMLElement = document.querySelector('.dragging-click-dom-ele') as HTMLElement;//备课包虚拟dom
        const notDom: HTMLElement = document.querySelector('.not-allowed') as HTMLElement;
        if (!notDom) return;
        dom && dom.removeChild(notDom)
    }
};
const isAddClass = ref(true);
// 鼠标在课表区域按下
const onMouseDownEnd = async (ev: MouseEvent, colData: NewColData) => {
    currentcolData.value = colData;//当前点击的课表
    currentMouseEvent.value = ev;
    if (!currentPackageData.value) return;
    if (isEnd.value) {
        return ElMessage.error("已经结束的课程无法重新排课");
    }
    if (isDragging.value && !isEnd.value && colData.SchedulingNewDetailId) {
        isActive.value = false;
        if (colData.PackageList && colData.PackageList[0]?.LessonName) {
            closePackageDom(ev)
            emit("openLessonDialogTip", rowData.value.SectionName + colData.index)
        } else {
            let scheduleInDto: ISetNewScheduleInDto = {
                packageId: currentPackageData.value.Id,
                schedulingNewDetailId: currentcolData.value.SchedulingNewDetailId,
                type: 1
            }
            setCourseScheduling(scheduleInDto);
        }
    }
    if (isDragging.value && !colData.SchedulingNewDetailId && !isEnd.value) {
        closePackageDom(ev)
        isAddClass.value = true
        emit("openClassDialog", rowData.value.SectionName + colData.index)
    }

};

//删除某个课包
const deleteCourse = (colData: NewColData) => {
    currentcolData.value = colData;//当前点击的课表
    if (colData.PackageList?.length === 1) {
        sureDeletePackage([colData.PackageList[0].PackageId])
    } else {
        const params = {
            id: rowData.value.SectionName + colData.index,
            packageList: colData.PackageList
        }
        emit("openDeleteDialogTip", params)
    }
    // ElMessageBox.confirm("确定要删除这堂课吗？", "删除", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    // }).then(async () => {
    //     await removeSchedulePackage({
    //         id: colData.bagId,
    //     });

    //     const res = await updateSchedule({
    //         ID: colData.OriginScheduleID,
    //         LessonID: colData.LessonID,
    //         LessonName: colData.LessonName,
    //         Type: 2,
    //     });
    //     if (res.resultCode === 200) {
    //         ElMessage.success("删除成功");
    //         updateSchedules();
    //         createBuryingPointFn(
    //             EVENT_TYPE.ScheduleOff,
    //             "取消排课",
    //             "删除",
    //             colData
    //         );
    //     }
    // });
};

//close 关闭 附着课包
const closePackageDom = (ev: MouseEvent) => {
    isActive.value = false;
    const dom: any = document.querySelector('.dragging-click-dom-ele');//备课包虚拟dom
    dom && clickOutSide(ev, dom);
}

// 排课
const setCourseScheduling = async (val: ISetNewScheduleInDto) => {
    const res = await SetCourseScheduling(val);
    if (res.resultCode === 200 && res.success) {
        ElMessage.success("排课成功");
        updateSchedules();
        createBuryingPointFn(EVENT_TYPE.ScheduleStart, "排课", "课表", colData.value);
        currentMouseEvent.value && closePackageDom(currentMouseEvent.value)
        //拖动课程进入课表成功后，调用埋点接口
    }
}

// const onDrop = async (ev: DragEvent, colData: ColData) => {
//     isActive.value = false;
//     const dragInfo = JSON.parse(
//         ev.dataTransfer?.getData("dragInfo") as string
//     ) as SchoolLesson;
//     if (!colData.ID) return;
//     if (isEnd.value) {
//         return ElMessage.error("已经结束的课程无法重新排课");
//     }
//     if (colData.LessonID) {
//         return ElMessageBox.confirm(
//             "当前时间点已有排课，是否覆盖？",
//             "覆盖提示",
//             {
//                 confirmButtonText: "确定",
//                 cancelButtonText: "取消",
//                 type: "warning",
//             }
//         ).then(async () => {
//             const res = await addSchedule(dragInfo);
//             // console.log("dragInfo", dragInfo, colData);

//             if (res.resultCode === 200) {
//                 ElMessage.success("更新成功");
//                 updateSchedules();
//                 //拖动课程进入课表成功后，调用埋点接口
//                 createBuryingPointFn(
//                     EVENT_TYPE.ScheduleStart,
//                     "排课",
//                     "课表",
//                     colData
//                 );
//             }
//         });
//     }
//     const res = await addSchedule(dragInfo);
//     if (res.resultCode === 200) {
//         ElMessage.success("排课成功");
//         updateSchedules();
//         //拖动课程进入课表成功后，调用埋点接口
//         createBuryingPointFn(EVENT_TYPE.ScheduleStart, "排课", "课表", colData);
//     }
// };

const emit = defineEmits(["openCourse", "createHomePoint", "openClassDialog", "openLessonDialogTip", "openDeleteDialogTip"]);

const goToClass = () => {
    if (!colData.value.PackageList?.length) return;
    if (props.isDrop) return emit("openCourse", colData.value);
    // router.push(
    //     `/attend-class/${colData.chapterId}/${colData.LessonID}/${colData.bookId}`
    // );
    const bagIds = JSON.stringify(colData.value.PackageList.map(item => item.PackageId));
    router.push(
        `/attend-class/${bagIds}`
    );
};

//首页页面上课区域点击埋点事件
const clicKBuryPoint = () => {
    //没有课程的话，就不埋点了
    // if (!colData.LessonName) return;
    // emit("createHomePoint", colData);
};
const currentWillDelPackageId = ref<string>();
//打开删除课得弹层
const openDelLesson = (event: MouseEvent, id: string) => {
    showDeleteLesson.value = true;
    currentWillDelPackageId.value = id;
};
//编辑班级名称
const editClass = (colData: NewColData) => {
    currentcolData.value = colData;
    isAddClass.value = false;
    emit("openClassDialog", rowData.value.SectionName + colData.index)
}
//确认删除这个课包
const confirmDel = () => {
    sureDeletePackage([currentWillDelPackageId.value])
};
//选择班级回调
const selectedClassList = async (val: string) => {
    if (isAddClass.value) {
        const newScheduleInDto: INewScheduleInDto = {
            schoolId: currentUserInfo.schoolId,
            termCode: store.state.preparation.term.code,
            packageId: currentPackageData.value.Id,
            classId: val,
            date: colData.value.colDate,
            apmp: rowData.value.APMP,
            sectionId: rowData.value.SectionID,
            sectionIndex: rowData.value.SectionIndex,
        };
        const res = await NewCourseScheduling(newScheduleInDto);
        if (res.resultCode === 200 && res.success) {
            ElMessage.success("排课成功");
            updateSchedules();
            currentMouseEvent.value && closePackageDom(currentMouseEvent.value)
        }
    } else {
        const editClassParams: IEditClassInDto = {
            schedulingNewDetailId: currentcolData.value?.SchedulingNewDetailId || colData.value?.SchedulingNewDetailId,
            classId: val
        }
        const res = await EditClass(editClassParams);
        if (res.resultCode === 200 && res.success) {
            ElMessage.success("修改班级成功");
            updateSchedules();
        }
    }
};
//是添加还是替换新的点击的课包
const replaceOrAddPackage = async (type: number) => {
    let scheduleInDto: ISetNewScheduleInDto = {
        packageId: currentPackageData.value.Id,
        schedulingNewDetailId: currentcolData.value?.SchedulingNewDetailId || colData.value?.SchedulingNewDetailId,
        type: type
    }
    await setCourseScheduling(scheduleInDto);
};

//删除选中的课包
const sureDeletePackage = async (data: any) => {
    const delNewSchedulingInDto: IDelNewSchedulingInDto = {
        packageIds: data,
        schedulingNewDetailId: currentcolData.value?.SchedulingNewDetailId || colData.value?.SchedulingNewDetailId,
    }
    await DelCourseScheduling(delNewSchedulingInDto);
    ElMessage.success("删除成功");
    updateSchedules();
};

defineExpose({ selectedClassList, replaceOrAddPackage, sureDeletePackage })
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
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                padding: 8px 12px 0;
                font-size: 14px;
                // flex: 1;
                font-weight: 600;
                line-height: 16px;
                color: #19203d;
                margin-bottom: 6px;
            }

            .middle {
                padding: 0 12px;
                display: flex;

                .end-lesson-package {
                    width: 40px;
                    height: 18px;
                    background: rgba(77, 211, 146, 0.2);
                    border-radius: 2px;
                    border: 1px solid rgba(77, 211, 146, 0.3);
                    font-size: 12px;
                    font-weight: 600;
                    color: #4DD392;
                    text-align: center;
                    line-height: 18px;
                }

                .lesson-package {
                    margin-right: 4px;
                    background: rgba(69, 108, 237, 0.2);
                    border-radius: 2px;
                    border: 1px solid rgba(69, 108, 237, 0.2);
                    font-size: 12px;
                    font-weight: 600;
                    color: #4B71EE;
                    text-align: center;
                    padding: 4px;

                }

                span {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4B71EE
                }
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

.delete-btn {
    z-index: 20000;
    padding: 16px;
    border-radius: 4px;
    position: fixed;
    width: 207px;
    height: 90px;
    background: #FFFFFF;
    box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);

    .del-text {
        font-size: 14px;
        font-weight: 400;
        color: #19203D;
        display: flex;
        align-items: center;

        img {
            margin-right: 4px;
        }
    }

    .btns {
        text-align: right;
        margin-top: 18px;

    }
}
</style>
