<template>
    <div
        @drop.prevent="isDrop? onDrop($event, colData) : null"
        @dragover="isDrop ? $event.preventDefault() : null"
        @dragenter="isActive = true"
        @dragleave="isActive = false"
        class="course cell"
        :class="[isActive? 'active': '', isDragging? 'drag-event-class': '']"
    >
        <el-popover
            trigger="hover"
            placement="top"
            popper-class="preparation-popper-class"
            v-if="colData.ClassName"
        >
            <div>
                <p v-show="colData.Classes">
                    课程名称：{{
                        colData.Classes ? colData.ClassName : ""
                    }}
                </p>
                <p>上课时间：{{ colData.fontShowTime }}</p>
                <p>科目：{{ colData.SubjectName }}</p>
                <p>
                    班级：{{
                        colData.Classes
                            ? colData.Classes[0].ClassName
                            : colData.ClassName
                    }}
                </p>
                <p v-show="colData.Classes">
                    课包：{{
                        colData.Classes ? colData.ClassName : ""
                    }}
                </p>
            </div>
            <template #reference>
                <div
                    class="course-content"
                        :style="{
                        backgroundColor:
                            colData.ClassActualEndTime
                                ? '#DDFBE8'
                                : colData.Classes
                                ? '#CBDAFF'
                                : '#FFE8E8'
                    }"
                >
                    <div>
                        <div class="title">
                            <template v-if="colData.Classes">
                                <span class="course-name">{{colData.Classes && colData.ClassName}}</span>
                                <i
                                    class="el-icon-delete del-class"
                                    v-if="colData.Classes"
                                    @click.stop="deleteCourse((colData.ID))"
                                />
                            </template>
                            <span class="course-name" v-if="isShowText && !colData.Classes">缺课包</span>
                        </div>
                        <div class="class-name">
                            {{
                                colData.Classes
                                ? colData.Classes.map(
                                        (i) => i.ClassName
                                    ).join()
                                : colData.ClassName
                            }}
                        </div>
                    </div>
                    <div
                        class="content-detail"
                        v-if="!colData.ClassActualEndTime && colData.Classes"
                        @click="$router.push({
                            path:'/attend-class'
                        })"

                    >
                        去上课
                    </div>
                    <div
                        class="content-class"
                        :style="{
                            backgroundColor: colData.bgColor
                        }"
                    >
                        {{colData.SubjectName}}
                    </div>
                </div>
            </template>
        </el-popover>
        <ClassDialog
            v-model:dialogVisible="dialogVisible"
            v-if="dialogVisible"
            :colData="colData"
            :rowData="rowData"
            :courseBag="courseBag"
        />
    </div>
</template>

<script lang="ts">
import { getCourseByCourseBag, HaveClassData, HaveClassWithDefaultBagData, updateClass } from "@/api";
import useDeleteCourse from "@/hooks/useDeleteCourse";
import { ColData, Schedule } from "@/hooks/useSchedules";
import { store } from "@/store";
import { CourseBag } from "@/types/preparation";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, defineComponent, inject, PropType, ref } from "vue";
import ClassDialog from "./ClassDialog.vue";
import { addClasses } from "./logic";
export default defineComponent({
    props: {
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
        isDrop: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const dialogVisible = ref(false);
        const courseBag = ref<CourseBag>();
        const isActive = ref(false);

        const updateSchedules = inject("updateSchedules") as () => Promise<void>;

        const { deleteCourse } = useDeleteCourse(updateSchedules);

        const onDrop = async (ev: DragEvent, colData: ColData) => {
            isActive.value = false;
            const dragInfo = JSON.parse(ev.dataTransfer?.getData("dragInfo") as string) as CourseBag;
            if (!dragInfo.ID) {
                return ElMessage.error("此课时无课包内容，请维护后再排课");
            }
            const courseBagData = dragInfo.Type === 1 ? {
                courseBagID: dragInfo.CourseBagID! ? dragInfo.CourseBagID! : dragInfo.ID!
            } : {
                courseBagTeacherID: dragInfo.ID!
            };
            const courseBagDetail = await getCourseByCourseBag(dragInfo.Type!, courseBagData);
            if (courseBagDetail.resultCode === 200) {
                if (!(Array.isArray(courseBagDetail.result.CourseWares) &&
                    courseBagDetail.result.CourseWares.some(item => item.Process === 2))) {
                    return ElMessage.error("此课包无课中内容，请维护后再排课");
                }
                /// 第一种情况：有排课计划有课包，未上课
                /// 第二种情况：有排课计划无课包
                /// 第三种情况：未排课无大课表
                if (colData.SubjectName) {
                    // 有排课 肯定有学科
                    // 课包科目与当前排课科目一致
                    const isSameSubjectName = courseBagDetail.result.SubjectName === colData.SubjectName;
                    if (!isSameSubjectName) {
                        return ElMessage.error("选择课包科目与当前排课科目不一致，请重新选择！");
                    }
                    const [startTime, endTime] = colData.fontShowTime!.split("~");
                    const classPlanStartTime = `${colData.colDate} ${startTime}`;
                    const classPlanEndTime = `${colData.colDate} ${endTime}`;
                    let classIds: string[] = [];
                    if (colData.Classes) {
                        classIds = colData.Classes.map(i => i.ClassID);
                    } else {
                        classIds = [colData.ClassID!];
                    }
                    const data = {
                        className: dragInfo.Name!,
                        classPlanStartTime,
                        classPlanEndTime,
                        subjectID: colData.SubjectID!,
                        classIDs: classIds
                    };
                    if (dragInfo.Type === 1) {
                        (data as HaveClassWithDefaultBagData).courseBagID = dragInfo.ID;
                    } else {
                        (data as HaveClassData).courseBagTeacherID = dragInfo.ID;
                    }
                    if (colData.Classes) {
                        // 第一种情况：有排课计划有课包
                        // 已上课 结束
                        if (colData.ClassActualEndTime) {
                            ElMessage.error("已经结束的课程无法重新排课");
                        }
                        // 未上课
                        ElMessageBox.confirm("当前时间点已有排课，是否覆盖？", "覆盖提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(async () => {
                            const res = await updateClass(dragInfo.Type!, {
                                ...data,
                                courseBagTeacherLogID: colData.ID!,
                                courseBagTeacherID: dragInfo.ID!
                            });
                            if (res.resultCode === 200) {
                                ElMessage.success("更新成功");
                                updateSchedules();
                            }
                        });
                    } else {
                        // 第二种情况：有排课计划无课包
                        addClasses(dragInfo.Type!, data as HaveClassWithDefaultBagData | HaveClassData, updateSchedules);
                    }
                } else {
                    dialogVisible.value = true;
                    courseBag.value = dragInfo;
                }
            }
        };

        return {
            onDrop,
            dialogVisible,
            courseBag,
            isActive,
            isDragging: computed(() => store.state.common.isDragging),
            deleteCourse
        };
    },
    components: { ClassDialog }
});
</script>

<style lang="scss" scoped>

.course {
    position: relative;
    &.active {
        border: 2px solid #a5b8f6 !important;
    }
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
</style>
