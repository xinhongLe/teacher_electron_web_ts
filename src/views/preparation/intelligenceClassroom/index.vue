<template>
    <div class="intelligence" :class="{ 'full-screen': isFullScreen }">
        <div class="top">
            <transition name="fade">
                <div class="card-box-left" :class="{  hidden: isFullScreen && !isShowCardList}">
                    <div class="card-box-lefts">
                        <CardList ref="cardListComponents" @updateFlag="updateFlag"/>
                    </div>
                    <div class="fold-btn" v-show="isFullScreen" @click="isShowCardList = !isShowCardList">
                        <i :class="isShowCardList ? 'el-icon-arrow-left'  : 'el-icon-arrow-right' "></i>
                    </div>
                </div>
            </transition>
            <div class="card-detail">
                <div class="card-detail-content">
                    <PreviewSection
                        :dialog="dialog"
                        :isSystem="isSystem"
                        ref="previewSection"
                        @lastPage="lastPage"
                        @firstPage="firstPage"
                        :resourceId="resourceId"
                        :isFullScreen="isFullScreen"
                        v-model:isCanUndo="isCanUndo"
                        v-model:isCanRedo="isCanRedo"
                        @changeWinSize="changeWinSize"
                        :isShowCardList="isShowCardList"
                        v-model:currentDrawColor="currentDrawColor"
                        v-model:currentLineWidth="currentLineWidth"
                    />
                </div>
            </div>
        </div>
        <Tools
            @redo="redo"
            @undo="undo"
            :dialog="dialog"
            :id="resourceId"
            @prevStep="prevStep"
            @nextStep="nextStep"
            @openShape="openShape"
            :isCanUndo="isCanUndo"
            :isCanRedo="isCanRedo"
            @fullScreen="fullScreen"
            cardClass="intelligence"
            @toggleRemark="toggleRemark"
            @openPaintTool="openPaintTool"
            @hideWriteBoard="hideWriteBoard"
            @showWriteBoard="showWriteBoard"
            @clockFullScreen="clockFullScreen"
            :currentDrawColor="currentDrawColor"
            @whiteboardOption="whiteboardOption"
            :currentLineWidth="currentLineWidth"
            :showRemark="previewSection?.showRemark"
            :isFullScreenStatus="isFullScreenStatus"
            @openClassDialog="openClassDialog"
        />
        <!--        页发送至 学生端-->
        <SelectClassDialog v-if="selectClassVisible" v-model:class-visible="selectClassVisible"
                           :currentSlide="currentSlide" v-model:send-success="sharePageVisible"/>
        <!--        正在分享该页-->
        <!--        暂时注释！！！！！-->
        <!--        <ShareCurrentPage v-if="sharePageVisible" v-model:share-visible="sharePageVisible"></ShareCurrentPage>-->
    </div>
</template>

<script lang="ts" setup>
import emitter from "@/utils/mitt";
import CardList from "./cardList/index.vue";
import {IResourceItem} from "@/api/resource";
import Tools from "./components/preview/tools.vue";
import useWindowInfo, {windowInfoKey} from "@/hooks/useWindowInfo";
import PreviewSection from "./components/preview/previewSection.vue";
import {onActivated, onDeactivated, onMounted, provide, ref, watchEffect, PropType, toRef, onUnmounted} from "vue";
import SelectClassDialog from "@/views/preparation/intelligenceClassroom/components/preview/selectClassDialog.vue";
import ShareCurrentPage from "@/views/preparation/intelligenceClassroom/components/preview/ShareCurrentPage.vue";
import mqtt from "mqtt";
import {YUN_API_ONECARD_MQTT} from "@/config";

const props = defineProps({
    resourceId: {
        type: String,
        default: ""
    },
    dialog: {
        type: Boolean,
        default: false
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    resource: {
        type: Object as PropType<IResourceItem>,
        required: true
    },
    isFullScreenStatus: {
        type: Boolean,
        default: false
    }
});

const isFullScreen = ref(false);
const isShowCardList = ref(true);
const cardListComponents = ref<InstanceType<typeof CardList>>();

const isCanUndo = ref(false);
const isCanRedo = ref(false);
const currentDrawColor = ref("#f60000");
const currentLineWidth = ref(2);
const resourceId = toRef(props, "resourceId");
provide("isShowCardList", isShowCardList);
const windowInfo = useWindowInfo(true);
provide(windowInfoKey, windowInfo);
const {cardList, getCardList, currentSlide} = windowInfo;
// 教具页分享-选择班级
const selectClassVisible = ref(false);
// 正在分享该页
const sharePageVisible = ref(false);
watchEffect(() => {
    if (resourceId.value) {
        getCardList(resourceId.value, props.isSystem ? 0 : 1);
    }
});
const changeWinSize = () => {
    cardList.value = [...cardList.value]; // 切换窗口大小，清除缓存的笔记列表
};

const preparationReLoad = () => {
    // refreshWindow(selectLessonId.value);
};

onMounted(() => {
    emitter.on("preparationReLoad", preparationReLoad);
});
const lastPage = () => {
    cardListComponents.value && cardListComponents.value.changeReducePage();
};
const firstPage = () => {
    cardListComponents.value && cardListComponents.value.changeAddPage();
};
const previewSection = ref<InstanceType<typeof PreviewSection>>();
const updateFlag = () => {
    previewSection.value && previewSection.value.updateFlag();
};
const fullScreen = () => {
    isFullScreen.value = true;
    isShowCardList.value = false;
    previewSection.value && previewSection.value.fullScreen();
};
const clockFullScreen = () => {
    isFullScreen.value = false;
    isShowCardList.value = true;
    previewSection.value && previewSection.value.clockFullScreen();
};

const toggleRemark = () => {
    previewSection.value && previewSection.value.toggleRemark();
};

const prevStep = () => {
    previewSection.value && previewSection.value.prevStep();
};

const nextStep = () => {
    previewSection.value && previewSection.value.nextStep();
};

const showWriteBoard = () => {
    previewSection.value && previewSection.value.showWriteBoard();
};

const openShape = (event: MouseEvent) => {
    previewSection.value && previewSection.value.openShape(event);
};
// 工具栏-画笔
const openPaintTool = (event: MouseEvent, type: string) => {
    // console.log("previewSection.value", event, type);
    previewSection.value && previewSection.value.openPaintTool(event, type);
};
// 工具栏 画笔配置
const whiteboardOption = (option: string, value?: number) => {
    previewSection.value && previewSection.value.whiteboardOption(option, value);
};
// 退回
const redo = () => {
    previewSection.value && previewSection.value.redo();
};
// 撤回
const undo = () => {
    previewSection.value && previewSection.value.undo();
};

const hideWriteBoard = () => {
    previewSection.value && previewSection.value.hideWriteBoard();
};

onActivated(() => {
    document.onkeydown = (event) => {
        event.preventDefault();
    };
});
onDeactivated(() => {
    document.onkeydown = null;
});
//打开选择班级弹框
const openClassDialog = () => {
    selectClassVisible.value = true;
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
    // message is Buffer
    const infoString = JSON.parse(message.toString());
    console.log("infoString", infoString);
});
onUnmounted(() => {
    emitter.off("preparationReLoad", preparationReLoad);
    client.end();
});
</script>

<style lang="scss" scoped>
$border-color: #f5f6fa;

.intelligence {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
    background-color: $border-color;

    &.full-screen {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .top {
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;

        .card-box-away {
            position: absolute;
            top: calc(50% - 60px);
            left: -20px;
            width: 20px;
            height: 120px;
            background: #fff;
            display: flex;
            align-items: center;
            font-size: 20px;
        }

        .card-box-left {
            width: 200px;
            text-align: center;
            padding: 20px 0;
            box-sizing: border-box;
            display: flex;
            min-width: 0;
            min-height: 0;
            flex-direction: column;
            background: #ffffff;
            margin-right: 8px;
            transition: width 0.3s;
            position: relative;

            &.hidden {
                width: 0;
            }

            .fold-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 50%;
                transform: translateX(100%) translateY(-50%);
                right: 0;
                height: 104px;
                width: 18px;
                border-radius: 0px 8px 8px 0px;
                background: #f5f6fa;
                cursor: pointer;
                z-index: 1;

                i {
                    color: #7e7f83;
                    font-size: 18px;
                    font-weight: 700;
                }
            }
        }

        .card-box-lefts {
            display: flex;
            flex: 1;
            min-width: 0px;
            min-height: 0;
            overflow-y: auto;
        }

        .card-detail {
            flex: 1;
            min-width: 0;
            display: flex;
            justify-content: space-between;

            .card-detail-content {
                height: 100%;
                display: flex;
                flex: 1;
                min-width: 0;
                justify-content: space-between;
            }

            .me-page {
                background-color: #fff;
                display: flex;
                flex-wrap: nowrap;
                padding: 15px;
                background-color: #fff;
                border-top: 1px solid #ccc;

                .me-page-item {
                    background-color: #f0f3ff;
                    color: #444;
                    padding: 10px 20px;
                    box-sizing: border-box;
                    text-align: center;
                    min-width: 100px;
                    font-size: 14px;
                    white-space: nowrap;
                    margin-right: 10px;
                    border: 2px solid #f0f3ff;
                    cursor: pointer;
                    position: relative;

                    &.active {
                        border: 2px solid #6675f4;
                    }
                }
            }
        }
    }

    .bottom {
        height: 88px;
    }
}
</style>
