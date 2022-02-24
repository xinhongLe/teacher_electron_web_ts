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
                        :winActiveId="winActiveId"
                        :WindowName="WindowName"
                        :cardList="cardList"
                        :LessonID="LessonID"
                        @updatePageList="updatePageList"
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
                        :winList="cardList"
                        :uuid="cardUuid"
                        :isPreview="isPreview"
                        :winActiveId="winActiveId"
                        :WindowName="WindowName"
                        :LessonID="LessonID"
                        :options="previewOptions"
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

<script lang="ts">
import { store } from "@/store";
import {
    defineComponent,
    onActivated,
    onDeactivated,
    onMounted,
    provide,
    ref,
    toRefs,
    watch
} from "vue";
import userSelectBookInfo, { TeachPageList } from "./hooks/userSelectBookInfo";
import CardList from "./cardList/index.vue";
import PreviewSection from "./components/preview/previewSection.vue";
import { useRouter } from "vue-router";
import { CopyWindow } from "./api/index";
import Tools from "./components/preview/tools.vue";
import emitter from "@/utils/mitt";
export default defineComponent({
    components: {
        CardList,
        PreviewSection,
        Tools
    },
    setup() {
        const router = useRouter();
        const showList = ref(false);
        const isFullScreen = ref(false);
        const isShowCardList = ref(true);
        const {
            allPageList,
            activeIndex,
            allData,
            cardListComponents,
            _getSchoolLessonWindow,
            handleClickWin,
            _getWindowCards,
            updatePageList
        } = userSelectBookInfo();
        provide("isShowCardList", isShowCardList);
        watch(
            () => store.state.preparation.selectChapterID,
            () => {
                if (!store.state.preparation.selectChapterID) return false;
                const obj = {
                    chapterID: store.state.preparation.selectChapterID
                };
                _getSchoolLessonWindow(obj);
            }
        );
        watch(
            () => activeIndex.winActiveId,
            (val) => {
                if (val) {
                    _getWindowCards(val, true);
                }
            }
        );
        const changeWinSize = () => {
            allData.cardList = [...allData.cardList]; // 切换窗口大小，清除缓存的笔记列表
        };
        onMounted(() => {
            const obj = { chapterID: store.state.preparation.selectChapterID };
            _getSchoolLessonWindow(obj);
            emitter.on("preparationReLoad", () => {
                _getSchoolLessonWindow(obj);
                _getWindowCards(activeIndex.winActiveId, true);
            });
        });
        const windowEdit = async (j: TeachPageList) => {
            if (j.OriginType === 0) {
                const obj = {
                    id: j.WindowID,
                    originType: null,
                    sourceLessonID: j.LessonID,
                    targetLessonID: j.LessonID
                };
                const res = await CopyWindow(obj);
                if (res.resultCode === 200) {
                    router.push(`/windowcard-edit/${res.result.ID}/1`);
                    j.OriginType = 1;
                    j.WindowID = res.result.ID;
                }
            } else {
                router.push(`/windowcard-edit/${j.WindowID}/1`);
            }
        };
        const lastPage = () => {
            cardListComponents.value.changeReducePage();
        };
        const firstPage = () => {
            cardListComponents.value.changeAddPage();
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
            if (activeIndex.winActiveId) {
                _getWindowCards(activeIndex.winActiveId, true);
            }
        });
        onDeactivated(() => {
            document.onkeydown = null;
        });
        return {
            showList,
            ...toRefs(allData),
            ...toRefs(activeIndex),
            handleClickWin,
            updatePageList,
            windowEdit,
            cardListComponents,
            lastPage,
            firstPage,
            previewSection,
            updateFlag,
            allPageList,
            _getWindowCards,
            changeWinSize,
            isFullScreen,
            fullScreen,
            toggleRemark,
            prevStep,
            nextStep,
            openShape,
            isShowCardList,
            showWriteBoard,
            hideWriteBoard,
            clockFullScreen
        };
    }
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
