<template>
    <div class="intelligence" :class="{ 'full-screen': isFullScreen }">
        <win-preview
            :pages="pages"
            ref="previewRef"
            :cards="winCards"
            :resource="resource"
            v-model:index="index"
            v-model:r-visit="rVisit"
            v-model:l-visit="lVisit"
            v-model:mode="previewMode"
            v-model:isCanUndo="isCanUndo"
            v-model:isCanRedo="isCanRedo"
            v-model:eraserLineWidth="eraserLineWidth"
            v-model:currentDrawColor="currentDrawColor"
            v-model:currentLineWidth="currentLineWidth"
        />
        <Tools
            @redo="redo"
            @undo="undo"
            :dialog="dialog"
            :id="resource.id"
            :showRemark="rVisit"
            @prevStep="prevStep"
            @nextStep="nextStep"
            :isCanUndo="isCanUndo"
            :isCanRedo="isCanRedo"
            @openShape="openShape"
            @fullScreen="fullScreen"
            @toggleRemark="toggleRemark"
            :currentSlide="currentSlide"
            @openPaintTool="openPaintTool"
            @handleMinSize="handleMinSize"
            @openClassDialog="openClassDialog"
            @clockFullScreen="clockFullScreen"
            :eraserLineWidth="eraserLineWidth"
            :currentDrawColor="currentDrawColor"
            :currentLineWidth="currentLineWidth"
            @whiteboardOption="whiteboardOption"
            :isFullScreenStatus="isFullScreenStatus"
        />
        <!--页发送至 学生端-->
        <select-class-dialog
            v-if="selectClassVisible"
            :currentSlide="currentSlide"
            v-model:send-success="sharePageVisible"
            v-model:class-visible="selectClassVisible"
        />
        <!--正在分享该页-->
        <!--        <share-current-page v-if="sharePageVisible" v-model:share-visible="sharePageVisible"/>-->
    </div>
</template>

<script lang="ts">
import mqtt from "mqtt";
import { Slide } from "wincard";
import useHome from "@/hooks/useHome";
import WinPreview from "./preview/index.vue";
import { VUE_APP_YUN_API_MQTT } from "@/config";
import { IViewResourceData } from "@/types/store";
import Tools from "./components/preview/tools.vue";
import { dealAnimationData } from "@/utils/dataParse";
import SelectClassDialog from "./components/preview/selectClassDialog.vue";
import { ref, watchEffect, PropType, onUnmounted, computed, defineComponent } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";
import { getOssUrl } from "@/utils/oss";
import { getWindowStruct } from "@/api/home";
import { store } from "@/store";

export default defineComponent({
    name: "IntelligenceClassroom",
    components: { WinPreview, Tools, SelectClassDialog },
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true
        },
        isFullScreenStatus: {
            type: Boolean,
            default: false
        }
    },
    emits: ["setMinimize"],
    setup(props, { emit }) {
        const index = ref(0);
        const lVisit = ref(true);
        const rVisit = ref(false);
        const previewMode = ref(true);
        const isFullScreen = ref(false);
        const winCards = ref<CardProps[]>([]);
        const currentDrawColor = ref("#f60000");
        const currentLineWidth = ref(2);
        const eraserLineWidth = ref(30);
        const pages = computed(() => {
            let allPages: PageProps[] = [];
            winCards.value.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            return allPages;
        });
        const currentSlide = computed(() => pages.value.filter(item => item.State)[index.value].Json);

        const { transformPageDetail } = useHome();

        // 教具页分享-选择班级
        const selectClassVisible = ref(false);
        // 正在分享该页
        const sharePageVisible = ref(false);

        watchEffect(() => {
            if (props.resource.id) {
                getWinCardData();
            }
        });
        const previewRef = ref();
        const isCanUndo = ref(false);
        const isCanRedo = ref(false);
        const fullScreen = () => {
            lVisit.value = false;
            rVisit.value = false;
        };
        const clockFullScreen = () => {
            lVisit.value = true;
            rVisit.value = false;
        };

        const toggleRemark = () => {
            rVisit.value = !rVisit.value;
            if (Number(store.state.common.resourceIntoType) === 1) {
                store.state.common.currentBeikeResource = rVisit.value;
            } else {
                store.state.common.currentKebiaoResource = rVisit.value;
            }
        };

        const prevStep = () => {
            previewRef.value.previewHandle({
                type: 7
            });
        };

        const nextStep = () => {
            previewRef.value.previewHandle({
                type: 6
            });
        };

        // 工具栏-形状
        const openShape = (event: MouseEvent) => {
            previewRef.value.previewHandle({
                type: 1,
                e: event
            });
        };

        // 工具栏-画笔
        const openPaintTool = (event: MouseEvent, type: string) => {
            previewRef.value.previewHandle({
                type: 2,
                e: event,
                option: type
            });
        };

        // 工具栏 画笔配置
        const whiteboardOption = (option: string, value?: number) => {
            previewRef.value.previewHandle({
                type: 3,
                option,
                value
            });
        };

        // 退回
        const redo = () => {
            previewRef.value.previewHandle({
                type: 4
            });
        };

        // 撤回
        const undo = () => {
            previewRef.value.previewHandle({
                type: 5
            });
        };

        // 打开选择班级弹框
        const openClassDialog = () => {
            selectClassVisible.value = true;
        };
        const currentCouresData = ref();
        // 最小化课件
        const handleMinSize = async () => {
            emit("setMinimize", currentCouresData.value);
        };

        function getWinCardData() {
            const OriginType = (props.resource.isSystem as number) === 1 ? 0 : 1;
            getWindowStruct({ WindowID: props.resource.id, OriginType }).then(async res => {
                if (res.resultCode !== 200) return;
                previewMode.value = !res.result.ShowType;
                currentCouresData.value = res.result;
                const cardList = res.result.CardData;

                let index = 1;
                for (let i = 0; i < cardList.length; i++) {
                    const item = cardList[i];
                    item.Fold = true;

                    for (let j = 0; j < item.PageList.length; j++) {
                        const page = item.PageList[j];
                        const json = JSON.parse(page.Json || "{}");
                        let url = page.Url || "";
                        if (!url && (page.Type === 20 || page.Type === 16)) {
                            const file = json?.ToolFileModel?.File;
                            const key = `${file?.FilePath}/${file?.FileMD5}.${file?.FileExtention || file?.Extention}`;
                            url = json?.ToolFileModel ? await getOssUrl(key, "axsfile") : "";
                        }
                        const slide: Slide = await transformPageDetail({ ID: page.ID, Type: page.Type }, json);
                        page.Url = url;

                        page.Json = dealAnimationData(slide);
                        if (page.State) {
                            page.Index = index;
                            index++;
                        }
                    }
                }
                winCards.value = cardList;
            });
        }

        const client = mqtt.connect(VUE_APP_YUN_API_MQTT || "", {
            port: process.env.NODE_ENV === "development" ? 8083 : 0,
            keepalive: 30
        });

        client && client.on("connect", function (err) {
            window.electron.log.info("client connect sharestudent", err);
        });

        client && client.on("message", function (topic: any, message: any) {
            const infoString = JSON.parse(message.toString());
            console.log(infoString);
        });

        onUnmounted(() => {
            client.end();
        });

        return {
            redo,
            undo,
            index,
            pages,
            lVisit,
            rVisit,
            nextStep,
            prevStep,
            winCards,
            isCanRedo,
            openShape,
            isCanUndo,
            previewRef,
            fullScreen,
            previewMode,
            currentSlide,
            isFullScreen,
            toggleRemark,
            openPaintTool,
            openClassDialog,
            clockFullScreen,
            whiteboardOption,
            sharePageVisible,
            selectClassVisible,
            handleMinSize,
            currentDrawColor,
            currentLineWidth,
            eraserLineWidth,
            currentCouresData
        };
    }
});
</script>

<style lang="scss" scoped>
.intelligence {
    width: 100%;
    height: 100%;
}
</style>
