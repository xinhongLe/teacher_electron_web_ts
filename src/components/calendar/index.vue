<template>
    <div ref="calendarRef" class="calendar" :style="calendarStyles">
        <slot :initSchedules="initSchedules"/>
        <div class="content-header">
            <div class="item">上课时间</div>
            <div v-for="(day, index) in days" :key="day" class="item" :class="{ current: isCurrentDay(day) }">
                {{ `${formTime(day)} 周${formWeek(index + 1)}` }}
            </div>
        </div>
        <div class="content">
            <div class="no-newSchedules" v-if="newSchedules?.length === 0">
                <img src="@/assets/indexImages/pic_none.png" alt=""/>
                未检测到教师课表
            </div>
            <div class="content-box" ref="contentRef">
                <div class="col" v-for="col in newSchedules" :key="col.SectionIndex">
                    <div class="time cell">
                        <span>{{ col.fontShowTime }}</span>
                        <span>{{ col.SectionName }}</span>
                    </div>
                    <Course v-for="item in col.colData" :key="item.index" :rowData="col" :colData="item"
                            :isDrop="isDrop"
                            :isShowText="isShowText" :isShowDelete="isShowDelete" :isShowDetailBtn="isShowDetailBtn"
                            @openCourse="openCourse" @createHomePoint="createHomePoint"
                            @openClassDialog="openClassDialog"
                            @openLessonDialogTip="openLessonDialogTip" @openDeleteDialogTip="openDeleteDialogTip"
                            :ref="'courseRef' + col.APMP + col.SectionName + item.index"/>
                </div>
            </div>
        </div>
    </div>
    <selectClass v-if="classVisible" v-model:classVisible="classVisible" @selectedClassList="selectedClassList"/>
    <hasLessonDialogTip v-model:hasLessonVisible="hasLessonVisible" @replaceOrAddPackage="replaceOrAddPackage"/>
    <deleteLessonDialogTip v-if="deleteLessonVisible" v-model:deleteLessonVisible="deleteLessonVisible"
                           :currentPackageList="currentPackageList" @sureDeletePackage="sureDeletePackage"/>
</template>

<script lang="ts">
import useSchedules, {NewColData} from "@/hooks/useSchedules";
import useTime from "@/hooks/useTime";
import moment from "moment";
import selectClass from "@/components/selectClass/index.vue";
import hasLessonDialogTip from "./hasLessonDialogTip.vue";
import deleteLessonDialogTip from "./deleteLessonDialogTip.vue";
import {
    computed,
    defineComponent,
    PropType,
    provide,
    ref,
    watch,
    nextTick,
    onUnmounted,
    getCurrentInstance
} from "vue";
import Course from "./Course.vue";
import usePageEvent from "@/hooks/usePageEvent";
import {EVENT_TYPE} from "@/config/event";
import {useRoute} from "vue-router";

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
    setup(props, {expose, emit}) {
        const proxy = getCurrentInstance();
        //首页上课区域点击埋点
        const {createBuryingPointFn} = usePageEvent("首页");
        const {weekNext, weekPre, initDays, formTime, formWeek} = useTime();
        initDays();
        const days = computed(() => props.days);
        const classVisible = ref(false);// 选择班级弹框
        const hasLessonVisible = ref(false);// 已排课包弹框提示
        const deleteLessonVisible = ref(false);// 删除发现多个课程包提示
        const currentDay = new Date().getDate();
        const {
            newSchedules,
            updateSchedules,
            updateClassSchedule,
            initSchedules,
        } = useSchedules(days);
        const isCurrentDay = (day: string) => {
            return moment().isSame(day, "d");
        };

        provide("updateSchedules", updateSchedules);

        const openCourse = (data: NewColData) => {
            emit("openCourse", data);
        };
        //创建首页上课区域埋点事件
        const createHomePoint = (data: NewColData) => {
            // createBuryingPointFn(
            //     EVENT_TYPE.PageClick,
            //     data.LessonName,
            //     "上课",
            //     data
            // );
        };
        const resize = () => {
            nextTick(() => {
                if (route.path === "/home" && calendarRef.value) {
                    // width.value = window.innerWidth * 0.6;
                    // height.value = calendarRef.value.parentElement.clientHeight;
                    // const calendarHeight = height.value;
                    // const contentHeight = calendarHeight - 128;
                    // const contentScrollHeight = contentRef.value.scrollHeight;
                    // if (contentHeight < contentScrollHeight) {
                    //     // 内容放置不下
                    //     scale.value = calendarHeight / (contentScrollHeight + 128);
                    //     height.value = height.value / scale.value;
                    // }

                    // if (calendarRef.value.parentElement.clientHeight !== height.value * scale.value) {
                    //     // 内容高度小，需要重新计算
                    //     calendarRef.value.parentElement.style.width = calendarRef.value.parentElement.clientHeight / height.value / scale.value * calendarRef.value.parentElement.clientWidth;
                    //     // resize();
                    // } else {
                    // calendarRef.value.parentElement.style.width = width.value * (scale.value > 1 ? 1 : scale.value) + "px";
                    // }

                    // window.electron.log.info("====== 就算元素大小 ====", width.value, scale.value, width.value * scale.value, calendarRef.value.parentElement.style.width, calendarRef.value.parentElement.clientWidth);
                }
            });
        };
        watch(() => newSchedules.value, (val) => {
            if (val) {
                nextTick(() => {
                    console.log('---------reLoadLayout',)
                    emit("reLoadLayout");
                })
            }
        })
        const route = useRoute();
        nextTick(() => {
            if (route.path === "/home") {
                // calendarRef.value.parentElement.style.width = window.innerWidth * 0.6 + "px";
            }
        });

        // window.addEventListener("resize", resize);
        // onUnmounted(() => {
        //     window.removeEventListener("resize", resize);
        // });

        expose({initSchedules, resize, updateClassSchedule});

        const scale = ref(1);
        const height = ref(0);
        const width = ref(window.innerWidth * 0.6);
        const calendarRef = ref();
        const contentRef = ref();
        // watch(newSchedules, resize);

        const calendarStyles = computed(() => {
            // return route.path === "/home" ? {
            //     transform: `scale(${scale.value})`,
            //     height: `${height.value}px`,
            //     width: `${width.value}px`,
            // } : {};

            return route.path === "/home" ? {
                height: `100%`,
                width: `100%`,
            } : {};
        });
        const currentCourseId = ref("");
        // 打开选择班级弹框
        const openClassDialog = (id: string) => {
            currentCourseId.value = id;
            classVisible.value = true;
        };
        // 打开已有课程弹框提示
        const openLessonDialogTip = (id: string) => {
            currentCourseId.value = id;
            hasLessonVisible.value = true;
        };
        const currentPackageList: any = ref();
        // 打开删除课程时提示有多个课包
        const openDeleteDialogTip = (val: any) => {
            currentCourseId.value = val.id;
            deleteLessonVisible.value = true;
            currentPackageList.value = val.packageList
        };
        // 选择好班级后
        const selectedClassList = (val: string) => {
            nextTick(() => {
                const courseRef: any = proxy?.refs['courseRef' + currentCourseId.value];
                courseRef[0] && courseRef[0].selectedClassList(val)
            })
        };
        // 替换还是添加备课包
        const replaceOrAddPackage = (type: number) => {
            nextTick(() => {
                const courseRef: any = proxy?.refs['courseRef' + currentCourseId.value];
                courseRef[0] && courseRef[0].replaceOrAddPackage(type)
            })
        };
        //选择好要删除的课包
        const sureDeletePackage = (val: string[]) => {
            nextTick(() => {
                const courseRef: any = proxy?.refs['courseRef' + currentCourseId.value];
                courseRef[0] && courseRef[0].sureDeletePackage(val)
            })
        };
        return {
            weekNext,
            weekPre,
            newSchedules,
            formTime,
            updateClassSchedule,
            initSchedules,
            currentDay,
            isCurrentDay,
            formWeek,
            openCourse,
            createHomePoint,
            openClassDialog,
            openLessonDialogTip,
            openDeleteDialogTip,
            selectedClassList,
            replaceOrAddPackage,
            sureDeletePackage,
            calendarRef,
            contentRef,
            scale,
            height,
            width,
            calendarStyles,
            classVisible,
            hasLessonVisible,
            deleteLessonVisible,
            currentCourseId,
            currentPackageList
        };
    },

    components: {Course, selectClass, hasLessonDialogTip, deleteLessonDialogTip}
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

    .no-newSchedules {
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
        min-height: 30px;
        //min-height: 35px;
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

        @media screen and (max-width: 1100px) {
            .time {
                font-size: 8px;
            }
        }
        @media screen and (min-width: 1100px) and (max-width: 1500px) {
            .time {
                font-size: 12px;
            }
        }
        @media screen and (min-width: 1500px) and (max-width: 1920px) {
            .time {
                font-size: 14px;
            }
        }
        @media screen and (min-width: 1920px) {
            .time {
                font-size: 16px;
            }
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
