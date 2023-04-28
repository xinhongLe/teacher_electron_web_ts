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
import { defineComponent, reactive, ref, computed, PropType } from "vue";
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
import { getOssUrl } from "@/utils/oss";

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
        subjectID: {
            type: String,
            required: true
        }
    },
    emits: [
        "onSave",
        "syncLesson",
        "updatePageSlide",
        "updateMaterial",
        "applyBackgroundAllSlide"
    ],
    setup(props, { emit }) {
        const { saveElements } = useSaveElements();
        const TeacherID = computed(() => store.state.userInfo.id);
        const windowInfo = computed(() => store.state.preparation.editWindowInfo);

        const page = ref<IPageValue>();
        const dialogVisible = ref(false);
        const addGameVisible = ref(false);
        const gameTypeVisible = ref(false);
        const dialogVisibleVideo = ref(false);
        const windowName = ref(windowInfo.value.name);
        const updateVideoElement = ref<PPTVideoElement | null>(null);

        const currentGame = reactive({
            id: "",
            name: "",
            src: "",
            ossSrc: ""
        });

        const PPTEditRef = ref();

        const updateLesson = (lessonProcessList: any) => {
            let list: any = [];
            lessonProcessList.LessonPlanDetailPages.forEach((item: any) => {
                list = list.concat(item.Childrens);
            });
            list = list.map((item: any) => {
                return {
                    id: item.TeachPageID,
                    DesignIntent: item.DesignIntent,
                    AcademicPresupposition: item.AcademicPresupposition
                };
            });
            emit("syncLesson", list);
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
            dialogVisible.value = true;
            fun = callback;
        };

        const selectCard = (cards: ICards[]) => {
            dialogVisible.value = false;
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
                addGameVisible.value = true;
            } else {
                gameTypeVisible.value = true;
            }
        };

        const addGame = async (valueGame: IGameItem) => {
            currentGame.id = valueGame.ID;
            currentGame.name = valueGame.Name;
            currentGame.src = valueGame.Url;
            currentGame.ossSrc = await formatOssUrl(valueGame.File);
            const slide = Object.assign(props.slide, {
                game: currentGame
            });
            emit("updatePageSlide", slide);
        };

        const formatOssUrl = async (file: any) => {
            const key = `${file?.FilePath}/${file?.FileMD5}.${
                file?.FileExtention || file?.Extention
            }`;
            return await getOssUrl(key, "axsfile");
        };

        const selectVideo = () => {
            updateVideoElement.value = null;
            dialogVisibleVideo.value = true;
        };

        const selectVideoVal = async (val: any) => {
            delete val.fileID;
            val.ossSrc = await formatOssUrl(val.File);
            emit("updatePageSlide", Object.assign({}, props.slide, { follow: val }));
            dialogVisibleVideo.value = false;
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

        // 插入引用视频
        const isSetQuoteVideo = ref(false);
        const setQuoteVideo = () => {
            updateVideoElement.value = null;
            isSetQuoteVideo.value = true;
            dialogVisibleVideo.value = true;
        };

        const lessonDesignVisible = ref(false);
        const openLessonDesign = () => {
            lessonDesignVisible.value = true;
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

        const collapse = () => {
            PPTEditRef.value.collapse();
        };

        return {
            dialogVisible,
            addGameVisible,
            dialogVisibleVideo,
            gameTypeVisible,
            getSlide,
            addCard,
            addGame,
            selectGame,
            selectCard,
            selectVideo,
            selectVideoVal,
            PPTEditRef,
            execPrev,
            execNext,
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
            setScreening,
            currentGame,
            collapse
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
