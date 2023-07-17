<template>
    <div class="preparation" @mousedown="clickOutSide($event)" v-click-outside="clickOutSide">
        <LeftMenu v-model:course="course" v-model:bookId="bookId"/>
        <div class="content-wrapper">
            <head-com
                ref="HeadRef"
                :course="course"
                v-model:type="type"
                v-model:source="source"
                @updateBagList="updateBagList"
                @learnPlanDesign="learnPlanDesign"
            />
            <div class="content-p-layout">
                <div class="p-layout-lesson" v-if="source === 'me'">
                    <LessonPackage
                        :course="course"
                        ref="LessonPackageRef"
                        @closeCalendar="closeCalendar"
                        @toArrangeClass="toArrangeClass"
                        @updateSchedules="updateSchedules"
                        :isMouseDrag="showClassArrangement"
                    />
                </div>
                <div class="p-layout-right" v-show="!showPackage && !showClassArrangement">
                    <Resources
                        :course="course"
                        :source="source"
                        ref="resourcesRef"
                        :type="type" :bookId="bookId"
                        @toArrangeClass="toArrangeClass"
                        @toMyLessonPackage="toMyLessonPackage"
                        :showClassArrangement="showClassArrangement"
                    />
                </div>
                <div class="p-layout-right" v-if="showPackage && showClassArrangement">
                    <ClassArrangement ref="ClassArrangementRef" @closeCalendar="closeCalendar"/>
                </div>
            </div>

        </div>
        <!--        导学案设计组件-->
        <LearnPlanDesign v-model:learnSelectVisible="learnSelectVisible"></LearnPlanDesign>
    </div>
</template>

<script lang="ts">
import HeadCom from "./layout/head.vue";
import LeftMenu from "./layout/leftMenu.vue";
import {IAddLessonBag} from "@/api/prepare";
import Resources from "./layout/resources.vue";
import usePageEvent from "@/hooks/usePageEvent";
import useClickDrag from "@/hooks/useClickDrag";
import {RESOURCE_TYPE} from "@/config/resource";
import LessonPackage from "./layout/lessonPackage.vue";
import useLessonPackage from "@/hooks/useLessonPackage";
import ClassArrangement from "./classArrangement/index.vue";
import LearnPlanDesign from "@/views/preparation/learnPlanDesign/index.vue";
import {defineComponent, nextTick, watch, ref} from "vue";

export default defineComponent({
    name: "Preparation",
    components: {
        HeadCom,
        LeftMenu,
        Resources,
        LessonPackage,
        ClassArrangement,
        LearnPlanDesign
    },
    setup() {
        const {clickOutSide} = useClickDrag();
        const {lessonPackageList, addLessonPackage, deleteLessonPackage} = useLessonPackage();
        // 埋点需求
        const {createBuryingPointFn} = usePageEvent("备课", true);
        const showClassArrangement = ref(false);
        const showPackage = ref(false);
        const course = ref({
            chapterId: "",
            lessonId: "",
            lessonName: "",
            chapterName: ""
        });
        const source = ref("");
        const type = ref(RESOURCE_TYPE.COURSEWARD);
        const bookId = ref("");
        const HeadRef = ref();
        const toMyLessonPackage = () => {
            HeadRef.value && HeadRef.value.toMyLessonPackage();
        };
        const ClassArrangementRef = ref();

        // 新增课包数据
        const addLessonBag = ref<IAddLessonBag>({
            lessonId: course.value.lessonId,
            acaSectionName: "",
            subjectName: "",
            lessonName: course.value.lessonName,
            albumId: "",
            subjectId: null,
            sort: 0,
            resourceId: "",
            publisherId: null,
            schoolId: null,
            name: "",
            id: null,
            publisherName: "",
            chapterName: course.value.chapterName,
            chapterId: course.value.chapterId,
            albumName: "",
            acaSectionId: null
        });
        // 监听课时变化了就赋值
        watch(() => course.value, (val) => {
            addLessonBag.value.chapterId = val.chapterId;
            addLessonBag.value.chapterName = val.chapterName;
            addLessonBag.value.lessonId = val.lessonId;
            addLessonBag.value.lessonName = val.lessonName;
        }, {deep: true});
        // 去排课
        const toArrangeClass = async (data: any, type: number, ev?: TouchEvent) => {
            HeadRef.value && HeadRef.value.toMyLessonPackage();
            showPackage.value = true;
            showClassArrangement.value = true;
            toLessonBagArrange(data, type, ev);
        };
        const resourcesRef = ref();
        // 刷新备课包中的资源列表
        const updateBagList = async () => {
            nextTick(() => {
                LessonPackageRef.value.getMyLessonBagNew({id: course.value.lessonId});
                if (showPackage.value && showClassArrangement.value) {
                    ClassArrangementRef.value.success();
                } else {
                    LessonPackageRef.value.selectPackage();
                }
            });
        };
        // 刷新备课包中的资源列表
        watch(() => source.value, (val) => {
            if (val === "me") {
                // showClassArrangement.value = false;
            } else {
                showClassArrangement.value = false;
                showPackage.value = false;
            }
        }, {deep: true});
        const LessonPackageRef = ref();
        // 去备课包排课
        const toLessonBagArrange = (data: any, type: number, ev?: TouchEvent) => {
            nextTick(() => {
                console.log("showClassArrangement", data, type, ev);
                LessonPackageRef.value && LessonPackageRef.value.toLessonBagArrange(data, type, ev);
            });
        };
        // 关闭课表并显示我的课包以及资源
        const closeCalendar = () => {
            if (!showPackage.value && !showClassArrangement.value) return;
            showPackage.value = false;
            showClassArrangement.value = false;
            LessonPackageRef.value.selectPackage();
        };
        // 更新课表信息
        const updateSchedules = () => {
            nextTick(() => {
                ClassArrangementRef.value && ClassArrangementRef.value.updateSchedules();
            });
        };
        const learnSelectVisible = ref(false);
        // 导学案设计
        const learnPlanDesign = () => {
            learnSelectVisible.value = true
        };
        return {
            course,
            showClassArrangement,
            source,
            type,
            bookId,
            HeadRef,
            ClassArrangementRef,
            lessonPackageList,
            showPackage,
            LessonPackageRef,
            addLessonBag,
            resourcesRef,
            learnSelectVisible,
            clickOutSide,
            addLessonPackage,
            toMyLessonPackage,
            toArrangeClass,
            updateBagList,
            deleteLessonPackage,
            toLessonBagArrange,
            closeCalendar,
            updateSchedules,
            learnPlanDesign,

        };
    }
});
</script>

<style lang="scss" scoped>
.preparation {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 0;
    min-height: 0;
    background-color: #f5f6fa;

    .content-wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        min-width: 0;
        background-color: #f5f6fa;

        .content-p-layout {
            display: flex;
            position: relative;

            .p-layout-lesson {
                height: calc(100vh - 160px);
                margin-left: 20px;
                overflow-y: auto;
                background-color: #fff;
            }

            .p-layout-right {
                flex: 1;
            }
        }

    }
}
</style>
