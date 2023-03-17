<template>
    <div class="ppt-container">
        <PPTEditor
            ref="PPTEditRef"
            :slide="slide"
            @addCard="addCard"
            @onSave="getSlide"
            :showThemeAllUse="true"
            @selectGame="selectGame"
            @selectVideo="selectVideo"
            @outElements="outElements"
            @setQuoteVideo="setQuoteVideo"
            v-model:windowName="windowName"
            @openLessonDesign="openLessonDesign"
            @applyBackgroundAllSlide="applyBackgroundAllSlide"
        />
        <!--选择弹卡-->
        <card-select-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
            @selectCard="selectCard"
        />
        <!--选择跟读页视频-->
        <select-video-dialog
            v-if="dialogVisibleVideo"
            v-model:dialogVisible="dialogVisibleVideo"
            @selectVideoVal="selectVideoVal"
        />

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
        />

        <!--游戏配置-->
        <game-type
            v-if="gameTypeVisible"
            :slide="slide"
            @addGame="addGame"
            v-model="gameTypeVisible"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed, PropType } from "vue";
import { Slide, IWin, IGame, PPTVideoElement, PPTElement } from "wincard";
import useSaveElements from "../edit/materialCenter/hooks/useSaveElements";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
import LessonDesign from "./lessonDesign.vue";
import AddGameDialog from "./addGameDialog.vue";
import GameType from "./games/index.vue";
import { IGameItem } from "@/types/game";
import { store } from "@/store";

export default defineComponent({
    name: "winCardEdit",
    components: {
        GameType,
        AddGameDialog,
        SelectVideoDialog,
        CardSelectDialog,
        LessonDesign
    },
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
        },
        subjectID: {
            type: String,
            required: true
        }
    },
    emits: [
        "onSave",
        "updatePageSlide",
        "updateMaterial",
        "applyBackgroundAllSlide",
        "updateAllPageSlideListMap"
    ],
    setup(props, { emit }) {
        const { saveElements } = useSaveElements();
        const TeacherID = computed(() => store.state.userInfo.id);
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false,
            addGameVisible: false,
            gameTypeVisible: false,
            currentGame: { id: "", name: "", src: "" }
        });
        const page = ref<IPageValue>();
        const windowInfo = computed(
            () => store.state.preparation.editWindowInfo
        );
        const updateVideoElement = ref<PPTVideoElement | null>(null);
        const windowName = ref(windowInfo.value.name);

        const PPTEditRef = ref();

        const updateLesson = (lessonProcessList: any) => {
            let allPageList: any[] = [];
            lessonProcessList.LessonPlanDetailPages.forEach((item: any) => {
                allPageList = allPageList.concat(item.Childrens);
            });
            emit("updateAllPageSlideListMap", allPageList);
        };

        const outElements = async (elements: PPTElement[]) => {
            const res: boolean = await saveElements(
                elements,
                props.subjectID,
                TeacherID.value
            );
            if (res) {
                emit("updateMaterial");
            }
        };
        const isShowSaveDialog = ref(false);
        const isShowSaveAsDialog = ref(false);

        const getSlide = async (slide: Slide) => {
            // 保存时更新slide
            emit("updatePageSlide", slide);
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
                cards: cards
            };
            fun([newCards]);
        };

        let gameFun: (IGame: IGame) => void;
        let type: string;
        const selectGame = (obj: { type: string; fun: (game: IGame) => void; }) => {
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
                src: valueGame.Url
            };
            const slide = Object.assign(props.slide, {
                game: state.currentGame
            });
            emit("updatePageSlide", slide);
            emit("onSave");
            // gameFun(state.currentGame);
        };

        const selectVideo = () => {
            updateVideoElement.value = null;
            state.dialogVisibleVideo = true;
        };

        const selectVideoVal = (val: any) => {
            delete val.fileID;
            emit("updatePageSlide", Object.assign({}, props.slide, { follow: val }));
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

        const lessonDesignVisible = ref(false);
        const openLessonDesign = () => {
            lessonDesignVisible.value = true;
        };

        const saveSlide = () => {
            if (!PPTEditRef.value) return;

            PPTEditRef.value.onSave();
        };

        const handleHelper = () => {
            if (!PPTEditRef.value) return;

            PPTEditRef.value.handleHelper();
        };

        const applyBackgroundAllSlide = (data: any) => {
            emit("applyBackgroundAllSlide", data);
        };

        const setScreening = (flag: boolean) => {
            PPTEditRef.value.setScreening(flag);
        };

        return {
            ...toRefs(state),
            saveSlide,
            getSlide,
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
            outElements,
            isShowSaveAsDialog,
            windowName,
            lessonDesignVisible,
            openLessonDesign,
            updateLesson,
            TeacherID,
            handleHelper,
            applyBackgroundAllSlide,
            setScreening
        };
    }
});
</script>

<style scoped lang="scss">
.ppt-container {
    padding: 0 !important;
    height: 100%;
}

.ppt-editor {
    width: 100%;
}
</style>
