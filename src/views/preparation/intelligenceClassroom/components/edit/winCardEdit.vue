<template>
    <div class="ppt-container">
        <PPTEditor
            ref="PPTEditRef"
            :slide="slide"
            v-model:windowName="windowName"
            @onSave="onSave"
            @onDeleteWin="onDeleteWin"
            @addCard="addCard"
            @selectVideo="selectVideo"
            @setQuoteVideo="setQuoteVideo"
            @updateQuoteVideo="updateQuoteVideo"
            @updateSlide="updateSlide"
            @openLessonDesign="openLessonDesign"
        />
        <!--选择弹卡-->
        <card-select-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
            @selectCard="selectCard"
        ></card-select-dialog>
        <!--选择跟读页视频-->
        <select-video-dialog
            v-if="dialogVisibleVideo"
            v-model:dialogVisible="dialogVisibleVideo"
            @selectVideoVal="selectVideoVal"
        ></select-video-dialog>

        <!--教案设计-->
        <lesson-design v-model:lessonDesignVisible="lessonDesignVisible" @updateLesson="updateLesson" :winId="winId" />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch, computed, PropType } from "vue";
import { Slide, IWin, PPTVideoElement, SaveType } from "wincard";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
import LessonDesign from "./lessonDesign.vue";
import { isEqual } from "lodash";
import { store } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteWindow } from "../../api";
import { useRoute } from "vue-router";
import emitter from "@/utils/mitt";
import { getWindowCards } from "@/api/home";
export default defineComponent({
    name: "winCardEdit",
    components: { SelectVideoDialog, CardSelectDialog, LessonDesign },
    props: {
        slide: {
            type: Object as PropType<Slide>,
            default: () => ({})
        },
        winId: {
            type: String,
            required: true
        },
        allPageSlideListMap: {
            type: Object as PropType<Map<string, Slide>>,
            required: true
        }
    },

    setup(props, { emit }) {
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false
            // slide: {}
        });
        const page = ref<IPageValue>();
        const windowInfo = computed(() => store.state.preparation.editWindowInfo);
        const updateVideoElement = ref<PPTVideoElement | null>(null);
        const windowName = ref(windowInfo.value.name);
        const route = useRoute();

        const PPTEditRef = ref();

        const updateLesson = (lessonProcessList: any) => {
            let allPageList: any[] = [];
            lessonProcessList.LessonPlanDetailPages.forEach((item: any) => {
                allPageList = allPageList.concat(item.Childrens);
            });
            emit("updateAllPageSlideListMap", allPageList);
        };

        const updateSlide = (slide: Slide) => {
            // if (!isEqual(props.slide, slide)) {
                // emit("updatePageSlide", storeSilde);
            // }
        };

        const isShowSaveDialog = ref(false);
        const isShowSaveAsDialog = ref(false);

        const onSave = async (slide: Slide, type: SaveType) => {
            // 保存时更新slide
            emit("updatePageSlide", slide);
            emit("onSave", type, windowName.value);
        };

        const onDeleteWin = () => {
            ElMessageBox.confirm("确定要删除当前课件吗？", "提示", {
                confirmButtonText: "确定删除",
                cancelButtonText: "取消"
            }).then(async () => {
                const res = await deleteWindow({
                    windowID: windowInfo.value.id
                });
                if (res.resultCode === 200) {
                    ElMessage.success("删除成功");
                    emitter.emit("closeTab", {
                        name: route.name as string,
                        path: route.path
                    });
                }
            });
        };

        let fun: (win: IWin[]) => void;
        const addCard = (callback: (win: IWin[]) => void) => {
            state.dialogVisible = true;
            fun = callback;
        };

        const selectCard = (cards: ICards[]) => {
            state.dialogVisible = false;
            const newCards = {
                id: page.value!.ID,
                cards: cards
            };
            fun([newCards]);
        };

        const selectVideo = () => {
            updateVideoElement.value = null;
            isSetQuoteVideo.value = false;
            state.dialogVisibleVideo = true;
        };

        const selectVideoVal = (val: any) => {
            if (isSetQuoteVideo.value) {
                isSetQuoteVideo.value = false;
                if (updateVideoElement.value) {
                    PPTEditRef.value.updateVideoElement({ ...updateVideoElement.value, src: val.src, fileID: val.fileID, pauseList: val.pauseList.map((item: any) => item.time), ossSrc: "", ossPoster: "", ossIcon: "" });
                    updateVideoElement.value = null;
                } else {
                    PPTEditRef.value.createQuoteVideo(val.src, val.fileID, val.pauseList.map((item: any) => item.time));
                }
            } else {
                delete val.fileID;
                emit("updatePageSlide", Object.assign({}, props.slide, { follow: val }));
                // state.slide = Object.assign({}, state.slide, { follow: val });
            }
            state.dialogVisibleVideo = false;
        };

        const closeScreen = () => {
            PPTEditRef.value.closeScreen();
        };
        const getIsScreening = () => {
            return PPTEditRef.value.getIsScreening();
        };
        const getCurrentSlide = () => {
            return PPTEditRef.value.getCurrentSlide();
        };
        const execPrev = () => {
            PPTEditRef.value.execPrev();
        };
        const execNext = () => {
            PPTEditRef.value.execNext();
        };

        const getDataIsChange = () => {
            return PPTEditRef.value.getDataIsChange();
        };

        // 插入引用视频
        const isSetQuoteVideo = ref(false);
        const setQuoteVideo = () => {
            updateVideoElement.value = null;
            isSetQuoteVideo.value = true;
            state.dialogVisibleVideo = true;
        };

        const updateQuoteVideo = (element: PPTVideoElement) => {
            isSetQuoteVideo.value = true;
            updateVideoElement.value = element;
            state.dialogVisibleVideo = true;
        };

        const lessonDesignVisible = ref(false);
        const openLessonDesign = () => {
            lessonDesignVisible.value = true;
        };

        return {
            ...toRefs(state),
            onSave,
            addCard,
            selectCard,
            selectVideo,
            selectVideoVal,
            PPTEditRef,
            closeScreen,
            getIsScreening,
            execPrev,
            execNext,
            getDataIsChange,
            getCurrentSlide,
            setQuoteVideo,
            windowInfo,
            isShowSaveDialog,
            updateSlide,
            isShowSaveAsDialog,
            windowName,
            onDeleteWin,
            updateQuoteVideo,
            lessonDesignVisible,
            openLessonDesign,
            updateLesson
        };
    }
});
</script>

<style scoped lang="scss">
.ppt-container {
    padding: 0px !important;
    height: 100%;
}
.ppt-editor {
    width: 100%;
}
</style>
