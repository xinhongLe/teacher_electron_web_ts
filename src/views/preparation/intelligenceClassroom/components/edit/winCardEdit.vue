<template>
    <div class="ppt-container">
        <PPTEditor
            ref="PPTEditRef"
            :slide="slide"
            :isShowSaveAs="originType === 1"
            v-model:windowName="windowName"
            :isShowName="originType === 1"
            @onSave="onSave"
            @addCard="addCard"
            @selectVideo="selectVideo"
            @setQuoteVideo="setQuoteVideo"
            @updateQuoteVideo="updateQuoteVideo"
            @updateSlide="updateSlide"
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
        <SaveDialog v-if="isShowSaveDialog" v-model:isShow="isShowSaveDialog" :name="$route.params.winName" @onSave="saveCallback"/>
        <SaveAsDialog v-if="isShowSaveAsDialog" v-model:isShow="isShowSaveAsDialog" :name="$route.params.winName" @onSave="saveCallback"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { Slide, IWin, PPTVideoElement, SaveType } from "wincard/src/types/slides";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import SaveDialog from "./saveDialog/saveDialog.vue";
import SaveAsDialog from "./saveDialog/saveAsDialog.vue";
import { isEqual } from "lodash";
export default defineComponent({
    name: "winCardEdit",
    components: { SelectVideoDialog, CardSelectDialog, SaveDialog, SaveAsDialog },
    props: {
        slide: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const route = useRoute();
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false
            // slide: {}
        });
        const page = ref<IPageValue>();
        const originType = Number(route.params.originType as string);
        const updateVideoElement = ref<PPTVideoElement | null>(null);
        const windowName = ref(route.params.winName as string);

        const PPTEditRef = ref();

        const updateSlide = (slide: Slide) => {
            if (!isEqual(props.slide, slide)) {
                emit("updatePageSlide", slide);
            }
        };

        const isShowSaveDialog = ref(false);
        const isShowSaveAsDialog = ref(false);

        const saveCallback = (name: string) => {
            emit("onSave", SaveType.SaveAs, name);
        };

        const onSave = async (slide: Slide, type: SaveType) => {
            if (originType === 0) {
                isShowSaveAsDialog.value = true;
            } else {
                if (type === SaveType.Save) {
                    if (!windowName.value) {
                        return ElMessage.warning("名称不能为空");
                    }
                    emit("onSave", type, windowName.value);
                } else {
                    isShowSaveDialog.value = true;
                }
            }
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
            setQuoteVideo,
            originType,
            isShowSaveDialog,
            updateSlide,
            isShowSaveAsDialog,
            windowName,
            saveCallback,
            updateQuoteVideo
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
