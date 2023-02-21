<template>
    <div class="intelligence" :class="{ 'full-screen': isFullScreen }">
        <div class="top">
            <transition name="fade">
                <div
                    class="card-box-left"
                    :class="{
                        hidden: isFullScreen && !isShowCardList,
                    }"
                >
                    <div class="card-box-lefts">
                        <CardList
                            ref="cardListComponents"
                            @updateFlag="updateFlag"
                        />
                    </div>
                    <div
                        class="fold-btn"
                        v-show="isFullScreen"
                        @click="isShowCardList = !isShowCardList"
                    >
                        <i
                            :class="
                                isShowCardList
                                    ? 'el-icon-arrow-left'
                                    : 'el-icon-arrow-right'
                            "
                        ></i>
                    </div>
                </div>
            </transition>
            <div class="card-detail">
                <div class="card-detail-content">
                    <PreviewSection
                        ref="previewSection"
                        :dialog="dialog"
                        :isSystem="isSystem"
                        :resourceId="resourceId"
                        :isShowCardList="isShowCardList"
                        :isFullScreen="isFullScreen"
                        @lastPage="lastPage"
                        @firstPage="firstPage"
                        @changeWinSize="changeWinSize"
                        v-model:isCanUndo="isCanUndo"
                        v-model:isCanRedo="isCanRedo"
                    />
                </div>
            </div>
        </div>
        <Tools
            :cardClass="'intelligence'"
            :id="resourceId"
            :dialog="dialog"
            :showRemark="previewSection?.showRemark"
            @toggleRemark="toggleRemark"
            @prevStep="prevStep"
            @nextStep="nextStep"
            @fullScreen="fullScreen"
            @clockFullScreen="clockFullScreen"
            @showWriteBoard="showWriteBoard"
            @openShape="openShape"
            @openPaintTool="openPaintTool"
            @hideWriteBoard="hideWriteBoard"
            :isCanUndo="isCanUndo"
            :isCanRedo="isCanRedo"
            :isFullScreenStatus="isFullScreenStatus"
        />
    </div>
</template>

<script lang="ts" setup>
import {
    onActivated,
    onDeactivated,
    onMounted,
    provide,
    ref,
    watchEffect,
    PropType,
    toRef,
    onUnmounted,
    watch
} from "vue";
import CardList from "./cardList/index.vue";
import PreviewSection from "./components/preview/previewSection.vue";
import Tools from "./components/preview/tools.vue";
import emitter from "@/utils/mitt";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import { IResourceItem } from "@/api/resource";
const isFullScreen = ref(false);
const isShowCardList = ref(true);
const cardListComponents = ref<InstanceType<typeof CardList>>();
const props = defineProps({
    resourceId: {
        type: String,
        default: "",
    },
    dialog: {
        type: Boolean,
        default: false,
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
    resource: {
        type: Object as PropType<IResourceItem | undefined>,
        required: true,
    },
    isFullScreenStatus: {
        type: Boolean,
        default: false,
    },
});
watch(
    () => props.isFullScreenStatus,
    (val: any) => {
        console.log("isFullScreenStatus", props.isFullScreenStatus);
    },
    { deep: true }
);
const isCanUndo = ref(false);
const isCanRedo = ref(false);
const resourceId = toRef(props, "resourceId");
provide("isShowCardList", isShowCardList);
const windowInfo = useWindowInfo(true, props.resource);
provide(windowInfoKey, windowInfo);
const { cardList, refreshWindow, getCardList } = windowInfo;

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
//工具栏-画笔
const openPaintTool = (event: MouseEvent, type: string) => {
    // console.log("previewSection.value", event, type);
    previewSection.value && previewSection.value.openPaintTool(event, type);
};

const hideWriteBoard = () => {
    previewSection.value && previewSection.value.hideWriteBoard();
};

onActivated(() => {
    document.onkeydown = (event) => {
        event.preventDefault();
    };
    // selectLessonId.value && refreshWindow(selectLessonId.value);
});
onDeactivated(() => {
    document.onkeydown = null;
});

onUnmounted(() => {
    emitter.off("preparationReLoad", preparationReLoad);
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
