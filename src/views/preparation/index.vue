<template>
    <div class="preparation" @mousedown.stop.prevent="clickOutSide($event)">
        <LeftMenu v-model:showClassArrangement="showClassArrangement" v-model:course="course" v-model:bookId="bookId" />
        <div class="content-wrapper" v-show="!showClassArrangement">

            <Head :course="course" v-model:source="source" v-model:type="type" ref="HeadRef" />
            <Resources :course="course" :source="source" :type="type" :bookId="bookId"
                :lessonPackageList="lessonPackageList" @addLessonPackage="addLessonPackage"
                @toMyLessonPackage="toMyLessonPackage" />
        </div>
        <div class="content-wrapper" v-if="showClassArrangement">
            <ClassArrangement :lessonPackageList="lessonPackageList" />
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
} from "vue";
import LeftMenu from "./layout/leftMenu.vue";
import Head from "./layout/head.vue";
import Resources from "./layout/resources.vue";
import ClassArrangement from "./classArrangement/index.vue";
import usePageEvent from "@/hooks/usePageEvent";
import { RESOURCE_TYPE } from "@/config/resource";
import useClickDrag from "@/hooks/useClickDrag";
import useLessonPackage from "@/hooks/useLessonPackage";
export default defineComponent({
    name: "Preparation",
    setup() {
        const { lessonPackageList, addLessonPackage } = useLessonPackage();
        const { startDrag, clickOutSide } = useClickDrag();
        //埋点需求
        const { createBuryingPointFn } = usePageEvent("备课", true);
        const showClassArrangement = ref(false);
        const course = ref({
            chapterId: "",
            lessonId: "",
            lessonName: "",
        });
        const source = ref("");
        const type = ref(RESOURCE_TYPE.COURSEWARD);
        const bookId = ref("");
        const HeadRef = ref();
        const toMyLessonPackage = () => {
            console.log('HeadRef.value',HeadRef.value);
            
            HeadRef.value && HeadRef.value.toMyLessonPackage()
        };
        return {
            course,
            showClassArrangement,
            source,
            type,
            bookId,
            HeadRef,
            clickOutSide,
            addLessonPackage,
            toMyLessonPackage,
            lessonPackageList

        };
    },
    components: {
        LeftMenu,
        Head,
        Resources,
        ClassArrangement,
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
    }
}
</style>
