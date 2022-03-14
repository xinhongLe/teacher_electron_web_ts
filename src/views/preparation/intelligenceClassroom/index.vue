<template>
    <div class="intelligence" :class="{'full-screen': isFullScreen}">
        <div class="top">
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
                <div class="fold-btn" v-show="isFullScreen" @click="isShowCardList = !isShowCardList">
                    <i :class="isShowCardList ? 'el-icon-arrow-left': 'el-icon-arrow-right'"></i>
                </div>
            </div>
            <div class="card-detail">
                <div class="card-detail-content">
                    <PreviewSection
                        ref="previewSection"
                        @lastPage="lastPage"
                        @firstPage="firstPage"
                        @changeWinSize="changeWinSize"
                    />
                </div>
            </div>
        </div>
        <Tools
            :showRemark="previewSection?.showRemark"
            @toggleRemark="toggleRemark"
            @prevStep="prevStep"
            @nextStep="nextStep"
            @fullScreen="fullScreen"
            @clockFullScreen="clockFullScreen"
            @showWriteBoard="showWriteBoard"
            @openShape="openShape"
            @hideWriteBoard="hideWriteBoard"
        />
    </div>
</template>

<script lang="ts" setup>
import {
    inject,
    onActivated,
    onDeactivated,
    onMounted,
    provide,
    ref,
    defineProps,
    watchEffect,
    defineEmits,
    toRef
} from "vue";
import CardList from "./cardList/index.vue";
import PreviewSection from "./components/preview/previewSection.vue";
import { useRouter } from "vue-router";
import Tools from "./components/preview/tools.vue";
import emitter from "@/utils/mitt";
import { windowInfoKey } from "@/hooks/useWindowInfo";
const router = useRouter();
const isFullScreen = ref(false);
const isShowCardList = ref(true);
const cardListComponents = ref<InstanceType<typeof CardList>>();
const props = defineProps({
    selectLessonId: {
        type: String,
        default: ""
    }
});
const emits = defineEmits(["update:isWindowLoadEnd"]);
const selectLessonId = toRef(props, "selectLessonId");
provide("isShowCardList", isShowCardList);
const { getSchoolWindowList, winList, updateCurrentWindow, cardList, currentWindowInfo, refreshWindow } = inject(windowInfoKey)!;

watchEffect(() => {
    if (selectLessonId.value) {
        getSchoolWindowList(selectLessonId.value).then(() => {
            emits("update:isWindowLoadEnd", true);
            updateCurrentWindow(winList.value[0]);
        });
    }
});
const changeWinSize = () => {
    cardList.value = [...cardList.value]; // 切换窗口大小，清除缓存的笔记列表
};
onMounted(() => {
    emitter.on("preparationReLoad", () => {
        refreshWindow(selectLessonId.value);
    });
});
const windowEdit = async () => {
    router.push(`/windowcard-edit/${currentWindowInfo.WindowID}/${currentWindowInfo.OriginType}/${currentWindowInfo.WindowName}/${selectLessonId.value}`);
};
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
    previewSection.value && previewSection.value.fullScreen();
};
const clockFullScreen = () => {
    isFullScreen.value = false;
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

const hideWriteBoard = () => {
    previewSection.value && previewSection.value.hideWriteBoard();
};

onActivated(() => {
    document.onkeydown = (event) => {
        event.preventDefault();
    };
    selectLessonId.value && refreshWindow(selectLessonId.value);
    emitter.on("editWindow", windowEdit);
});
onDeactivated(() => {
    document.onkeydown = null;
    emitter.off("editWindow", windowEdit);
});
</script>

<style lang="scss" scoped>
$border-color: #f5f6fa;
.intelligence {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    background-color: #f5f6fa;
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
            background: #f5f6fa;
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
                background: #F5F6FA;
                cursor: pointer;
                z-index: 1;
                i {
                    color: #7E7F83;
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
            padding-top: 12px;
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
