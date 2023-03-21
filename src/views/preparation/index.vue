<template>
    <div class="preparation" @mousedown="clickOutSide($event)">
        <LeftMenu v-model:course="course" v-model:bookId="bookId" />
        <div class="content-wrapper">

            <Head :course="course" v-model:source="source" v-model:type="type" ref="HeadRef"
                @updateBagList="updateBagList" />
            <div class="content-p-layout">
                <div class="p-layout-lesson" v-if="source == 'me'">
                    <LessonPackage ref="LessonPackageRef" :isMouseDrag="showClassArrangement ? true : false"
                        @toArrangeClass="toArrangeClass" :course="course" @updateSchedules="updateSchedules" @closeCalendar="closeCalendar"/>
                </div>
                <div class="p-layout-right" v-show="!showPackage && !showClassArrangement">
                    <Resources ref="resourcesRef" :course="course" :source="source" :type="type" :bookId="bookId"
                        :showClassArrangement="showClassArrangement" @toMyLessonPackage="toMyLessonPackage"
                        @toArrangeClass="toArrangeClass" />
                </div>
                <div class="p-layout-right" v-if="showPackage && showClassArrangement">
                    <ClassArrangement ref="ClassArrangementRef" @closeCalendar="closeCalendar" />
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    provide,
    ref,
    onActivated,
    onDeactivated,
    nextTick,
    watch
} from "vue";
import LeftMenu from "./layout/leftMenu.vue";
import Head from "./layout/head.vue";
import Resources from "./layout/resources.vue";
import ClassArrangement from "./classArrangement/index.vue";
import usePageEvent from "@/hooks/usePageEvent";
import { RESOURCE_TYPE } from "@/config/resource";
import useClickDrag from "@/hooks/useClickDrag";
import useLessonPackage from "@/hooks/useLessonPackage";
import LessonPackage from "./layout/lessonPackage.vue";
import { IAddLessonBag } from "@/api/prepare";
export default defineComponent({
    name: "Preparation",
    setup() {
        const { lessonPackageList, addLessonPackage, deleteLessonPackage, } = useLessonPackage();
        const { startDrag, clickOutSide } = useClickDrag();
        //埋点需求
        const { createBuryingPointFn } = usePageEvent("备课", true);
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
            HeadRef.value && HeadRef.value.toMyLessonPackage()
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
        }, { deep: true })
        // 去排课
        const toArrangeClass = async (data: any, type: number) => {
            HeadRef.value && HeadRef.value.toMyLessonPackage();
            source.value = 'me';
            showPackage.value = true;
            showClassArrangement.value = true;
            // const res = await addLessonPackage(addLessonBag.value);
            toLessonBagArrange(data, type)
        };
        const resourcesRef = ref();
        //刷新备课包中的资源列表
        const updateBagList = async () => {
            nextTick(() => {
                LessonPackageRef.value.getMyLessonBagNew({ id: course.value.lessonId });
                if (showPackage.value && showClassArrangement.value) {
                    ClassArrangementRef.value.success();
                } else {
                    LessonPackageRef.value.selectPackage();
                }
            })
        };
        //刷新备课包中的资源列表
        watch(() => source.value, (val) => {
            if (val === 'me') {
                // showClassArrangement.value = false;
            } else {
                showClassArrangement.value = false;
                showPackage.value = false;
            }

        }, { deep: true });
        const LessonPackageRef = ref();
        // 去备课包排课
        const toLessonBagArrange = (data: any, type: number) => {
            nextTick(() => {
                LessonPackageRef.value.toLessonBagArrange(data, type)
            })
        };
        //关闭课表并显示我的课包以及资源
        const closeCalendar = () => {
            showPackage.value = false;
            showClassArrangement.value = false;
        };
        // 更新课表信息
        const updateSchedules = () => {
            nextTick(() => {
                ClassArrangementRef.value &&  ClassArrangementRef.value.updateSchedules();
            })
        }
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
            clickOutSide,
            addLessonPackage,
            toMyLessonPackage,
            toArrangeClass,
            updateBagList,
            deleteLessonPackage,
            toLessonBagArrange,
            closeCalendar,
            updateSchedules

        };
    },
    components: {
        LeftMenu,
        Head,
        Resources,
        ClassArrangement,
        LessonPackage
    },
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
