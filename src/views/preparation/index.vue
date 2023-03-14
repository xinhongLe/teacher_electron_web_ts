<template>
    <div class="preparation" @mousedown.stop.prevent="clickOutSide($event)">
        <LeftMenu v-model:course="course" v-model:bookId="bookId" />
        <div class="content-wrapper">

            <Head :course="course" v-model:source="source" v-model:type="type" ref="HeadRef" />
            <div class="content-p-layout">
                <div class="p-layout-lesson" v-if="source == 'me'">
                    <LessonPackage ref="LessonPackageRef" :isMouseDrag="showClassArrangement ? true : false"
                        :lessonPackageList="lessonPackageList" @addLessonPackage="addLessonPackage"
                        @toMyLessonPackage="toArrangeClass" @deleteLessonPackage="deletenPackage"/>
                </div>
                <div class="p-layout-right" v-show="!showPackage && !showClassArrangement">
                    <Resources :course="course" :source="source" :type="type" :bookId="bookId"
                        :showClassArrangement="showClassArrangement" :lessonPackageList="lessonPackageList"
                        @toMyLessonPackage="toMyLessonPackage" @toArrangeClass="toArrangeClass" />
                </div>
                <div class="p-layout-right" v-if="showPackage && showClassArrangement">
                    <ClassArrangement :lessonPackageList="lessonPackageList" ref="ClassArrangementRef"
                        @selectPackage="selectPackage" />
                </div>
            </div>

        </div>
        <deletePackage v-model:visible="deleteVisible" @onDeletePackage="deleteLessonPackage(deleteTargetId)" />
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
import deletePackage from "./layout/dialog/deletePackage.vue";
import LessonPackage from "./layout/lessonPackage.vue";

export default defineComponent({
    name: "Preparation",
    setup() {
        const { lessonPackageList, addLessonPackage, deleteLessonPackage } = useLessonPackage();
        const { startDrag, clickOutSide } = useClickDrag();
        //埋点需求
        const { createBuryingPointFn } = usePageEvent("备课", true);
        const showClassArrangement = ref(false);
        const showPackage = ref(false);
        const course = ref({
            chapterId: "",
            lessonId: "",
            lessonName: "",
        });
        const source = ref("");
        const type = ref(RESOURCE_TYPE.COURSEWARD);
        const bookId = ref("");
        const HeadRef = ref();
        const deleteVisible = ref(false);
        const toMyLessonPackage = () => {
            HeadRef.value && HeadRef.value.toMyLessonPackage()
        };
        const ClassArrangementRef = ref();
        // 去排课
        const toArrangeClass = async (data: any, type: number) => {
            HeadRef.value && HeadRef.value.toMyLessonPackage();
            source.value = 'me';
            showPackage.value = true;
            showClassArrangement.value = true;
            if (type == 1) {
                const res = await addLessonPackage(data);
                nextTick(() => {
                    ClassArrangementRef.value.toArrange(res);
                })
            } else {
                nextTick(() => {
                    ClassArrangementRef.value.toArrange(data);
                })
            }

        };
        watch(() => source.value, (val) => {
            if (val === 'me') {
                // showClassArrangement.value = false;
            } else {
                showClassArrangement.value = false;
                showPackage.value = false;
            }

        }, { deep: true });
        const deleteTargetId = ref("");
        // 删除
        const deletenPackage = (id: string) => {
            deleteTargetId.value = id;
            deleteVisible.value = true
        };
        const LessonPackageRef = ref();
        // 去排课
        const selectPackage = (data: any) => {
            LessonPackageRef.value.selectPackage(data)
        };
        return {
            course,
            showClassArrangement,
            source,
            type,
            bookId,
            HeadRef,
            deleteVisible,
            deleteTargetId,
            ClassArrangementRef,
            lessonPackageList,
            showPackage,
            LessonPackageRef,
            clickOutSide,
            addLessonPackage,
            toMyLessonPackage,
            toArrangeClass,
            deleteLessonPackage,
            deletenPackage,
            selectPackage

        };
    },
    components: {
        LeftMenu,
        Head,
        Resources,
        ClassArrangement,
        deletePackage,
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
                padding-left: 20px;
                overflow-y: auto;
            }

            .p-layout-right {
                flex: 1;
            }
        }

    }
}
</style>
