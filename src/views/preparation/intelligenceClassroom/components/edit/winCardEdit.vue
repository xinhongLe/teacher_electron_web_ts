<template>
    <div class="ppt-container">
        <PPTEditor
            ref="PPTEditRef"
            :slide="slide"
            v-model:windowName="windowName"
            @onSave="onSave"
            @selectGame="selectGame"
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
        <lesson-design
            v-model:lessonDesignVisible="lessonDesignVisible"
            @updateLesson="updateLesson"
            :winId="winId"
        />

        <!--选择游戏-->
        <add-game-dialog
            v-if="addGameVisible"
            v-model="addGameVisible"
            @addGame="addGame"
        ></add-game-dialog>

        <!--游戏配置-->
        <game-type
            v-if="gameTypeVisible"
            :slide="slide"
            @addGame="addGame"
            v-model="gameTypeVisible"
        ></game-type>
    </div>
</template>
<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs,
    ref,
    watch,
    computed,
    PropType,
} from "vue";
import { Slide, IWin, IGame, PPTVideoElement, SaveType } from "wincard";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
import LessonDesign from "./lessonDesign.vue";
import { store } from "@/store";
import { useRoute } from "vue-router";
import AddGameDialog from "./addGameDialog.vue";
import GameType from "./games/index.vue";
import { IGameItem } from "@/types/game";
export default defineComponent({
    name: "winCardEdit",
    components: {
        GameType,
        AddGameDialog,
        SelectVideoDialog,
        CardSelectDialog,
        LessonDesign,
    },
    props: {
        slide: {
            type: Object as PropType<Slide>,
            default: () => ({}),
        },
        winId: {
            type: String,
            required: true,
        },
        allPageSlideListMap: {
            type: Object as PropType<Map<string, Slide>>,
            required: true,
        },
    },

    setup(props, { emit }) {
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false,
            addGameVisible: false,
            gameTypeVisible: false,
            currentGame: { id: "", name: "", src: "" },
            // slide: {}
        });
        const page = ref<IPageValue>();
        const windowInfo = computed(
            () => store.state.preparation.editWindowInfo
        );
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

        const onSave = async (slide: Slide) => {
            // 保存时更新slide
            emit("updatePageSlide", slide);
            emit("onSave");
        };

        let fun: (win: IWin[]) => void;
        const addCard = (callback: (win: IWin[]) => void) => {
            state.dialogVisible = true;
            fun = callback;
        };

        const selectCard = (cards: ICards[]) => {
            state.dialogVisible = false;
            const newCards = {
                id: page.value?.ID || "",
                cards: cards,
            };
            fun([newCards]);
        };

        let gameFun: (IGame: IGame) => void;
        let type: string;
        const selectGame = (obj: {
            type: string;
            fun: (game: IGame) => void;
        }) => {
            type = obj.type;
            gameFun = obj.fun;
            if (type === "selectGame") {
                state.addGameVisible = true;
            } else {
                state.gameTypeVisible = true;
            }
        };

        const addGame = (valueGame: IGameItem) => {
            state.currentGame = {
                id: valueGame.ID,
                name: valueGame.Name,
                src: valueGame.Url,
            };
            const slide = Object.assign(props.slide, {
                game: state.currentGame,
            });
            emit("updatePageSlide", slide);
            emit("onSave");
            // gameFun(state.currentGame);
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
                    PPTEditRef.value.updateVideoElement({
                        ...updateVideoElement.value,
                        src: val.src,
                        fileID: val.fileID,
                        pauseList: val.pauseList.map((item: any) => item.time),
                        ossSrc: "",
                        ossPoster: "",
                        ossIcon: "",
                    });
                    updateVideoElement.value = null;
                } else {
                    PPTEditRef.value.createQuoteVideo(
                        val.src,
                        val.fileID,
                        val.pauseList.map((item: any) => item.time)
                    );
                }
            } else {
                delete val.fileID;
                emit(
                    "updatePageSlide",
                    Object.assign({}, props.slide, { follow: val })
                );
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
            addGame,
            selectGame,
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
            updateQuoteVideo,
            lessonDesignVisible,
            openLessonDesign,
            updateLesson,
        };
    },
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
