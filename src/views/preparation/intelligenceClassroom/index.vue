<template>
    <div class="intelligence" :class="{ 'full-screen': isFullScreen }">
        <win-preview
            :pages="pages"
            ref="previewRef"
            :r-visit="rVisit"
            :cards="winCards"
            :resource="resource"
            v-model:index="index"
            v-model:l-visit="lVisit"
            v-model:isCanUndo="isCanUndo"
            v-model:isCanRedo="isCanRedo"
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
            @openPaintTool="openPaintTool"
            @openClassDialog="openClassDialog"
            @clockFullScreen="clockFullScreen"
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
        <share-current-page v-if="sharePageVisible" v-model:share-visible="sharePageVisible"/>
    </div>
</template>

<script lang="ts" setup>
import mqtt from "mqtt";
import { Slide } from "wincard";
import useHome from "@/hooks/useHome";
import { getWindowsElements } from "./api";
import WinPreview from "./preview/index.vue";
import { YUN_API_ONECARD_MQTT } from "@/config";
import { IViewResourceData } from "@/types/store";
import Tools from "./components/preview/tools.vue";
import { dealAnimationData } from "@/utils/dataParse";
import { CardProps, PageProps } from "./preview/props";
import SelectClassDialog from "./components/preview/selectClassDialog.vue";
import ShareCurrentPage from "./components/preview/ShareCurrentPage.vue";
import { onActivated, onDeactivated, ref, watchEffect, PropType, onUnmounted, computed } from "vue";

const props = defineProps({
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
});

const lVisit = ref(true);
const rVisit = ref(false);
const index = ref(0);
const isFullScreen = ref(false);
const winCards = ref<CardProps[]>([]);

const pages = computed(() => {
    let allPages: PageProps[] = [];
    winCards.value.forEach(item => {
        allPages = allPages.concat(...item.Pages);
    });
    return allPages;
});
const currentSlide = computed(() => pages.value[index.value]);

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

function getWinCardData() {
    getWindowsElements({
        WindowID: props.resource.id,
        OriginType: props.resource.isSystem ? 0 : 1
    }).then(async res => {
        if (res.resultCode !== 200) return;

        const cardList = res.result;

        let index = 1;
        for (let i = 0; i < cardList.length; i++) {
            const item = cardList[i];
            item.Fold = true;

            for (let j = 0; j < item.Pages.length; j++) {
                const page = item.Pages[j];
                const json = JSON.parse(page.Json || "{}");
                const slide: Slide = await transformPageDetail({ ID: page.PageID, Type: page.PageType }, json);

                page.Json = dealAnimationData(slide);
                if (page.PageState) {
                    page.Index = index;
                    index++;
                }
            }
        }
        console.log(cardList);
        winCards.value = cardList;
    });
}

const client = mqtt.connect(YUN_API_ONECARD_MQTT || "", {
    port: 1883,
    username: "u001",
    password: "p001",
    keepalive: 30
});

client && client.on("connect", function (err) {
    window.electron.log.info("client connect sharestudent", err);
});

client && client.on("message", function (topic: any, message: any) {
    const infoString = JSON.parse(message.toString());
    console.log(infoString);
});

onActivated(() => {
    document.onkeydown = (event) => {
        event.preventDefault();
    };
});

onDeactivated(() => {
    document.onkeydown = null;
});

onUnmounted(() => {
    client.end();
});
</script>

<style lang="scss" scoped>
.intelligence {
    width: 100%;
    height: 100%;
}
</style>
