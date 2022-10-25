<template>
    <div class="intelligence">
        <NavBar :resourceName="WindowName" />
        <div class="right">
            <div class="right-bottom">
                <div
                    class="card-box-left"
                    :class="{
                        fullScreen: isFullScreen,
                        hidden: isFullScreen && !isShowCardList,
                    }"
                >
                    <div class="card-box-lefts">
                        <CardList
                            ref="cardListComponents"
                            :winActiveId="winActiveId"
                            :WindowName="WindowName"
                            :cardList="cardList"
                            @updatePageList="updatePageList"
                            @updateFlag="updateFlag"
                        />
                    </div>
                    <div
                        class="card-box-outbottom"
                        v-show="!isFullScreen"
                    ></div>
                </div>
                <div class="card-detail">
                    <div class="card-detail-content">
                        <PreviewSection
                            ref="previewSectionRef"
                            :options="previewOptions"
                            :winActiveId="winActiveId"
                            :WindowName="WindowName"
                            :winList="cardList"
                            :isPreview="true"
                            @lastPage="lastPage"
                            @firstPage="firstPage"
                            @changeWinSize="changeWinSize"
                            @fullScreen="fullScreen"
                            @clockFullScreen="clockFullScreen"
                        />
                    </div>
                    <Tools
                        :id="winActiveId"
                        :dialog="false"
                        :showClose="true"
                        :showRemark="previewSection?.showRemark"
                        @toggleRemark="toggleRemark"
                        @prevStep="prevStep"
                        @nextStep="nextStep"
                        @fullScreen="fullScreen"
                        @clockFullScreen="clockFullScreen"
                        @showWriteBoard="showWriteBoard"
                        @openShape="openShape"
                        @hideWriteBoard="hideWriteBoard"
                        @closeWincard="close"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    nextTick,
    onMounted,
    provide,
    ref
} from "vue";
import CardList from "./CardList.vue";
import PreviewSection from "./previewSection.vue";
import NavBar from "./NavBar.vue";
import Tools from "@/views/preparation/intelligenceClassroom/components/preview/tools.vue";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
export default defineComponent({
    components: {
        CardList,
        PreviewSection,
        NavBar,
        Tools
    },
    setup() {
        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);
        
        const isFullScreen = ref(false);
        const isShowCardList = ref(true);
        const cardListComponents = ref();
        const winActiveId = ref("");
        const WindowName = ref("");
        const previewOptions = ref({});
        provide("isShowCardList", isShowCardList);
        const windowInfo = useWindowInfo(false);
        provide(windowInfoKey, windowInfo);
        const { cardList } = windowInfo;
        const appjson = ref<{ cards?: any, pages?: any, slides?: any, windowId?: string, windowName?: string }>({});
        provide("appjson", appjson);
        const updatePageList = (card: any) => {
            previewOptions.value = card;
        };

        const changeWinSize = () => {
            
        };

        const lastPage = () => {
            cardListComponents.value.changeReducePage();
        };
        const firstPage = () => {
            cardListComponents.value.changeAddPage();
        };
        const previewSectionRef = ref();
        const updateFlag = () => {
            previewSectionRef.value.updateFlag();
        };

        const fullScreen = () => {
            isFullScreen.value = true;
            isShowCardList.value = false;
            previewSectionRef.value && previewSectionRef.value.fullScreen();
        };
        const clockFullScreen = () => {
            isFullScreen.value = false;
            isShowCardList.value = true;
            previewSectionRef.value && previewSectionRef.value.clockFullScreen();
        };

        const toggleRemark = () => {
            previewSectionRef.value && previewSectionRef.value.toggleRemark();
        };

        const prevStep = () => {
            previewSectionRef.value && previewSectionRef.value.prevStep();
        };

        const nextStep = () => {
            previewSectionRef.value && previewSectionRef.value.nextStep();
        };

        const showWriteBoard = () => {
            previewSectionRef.value && previewSectionRef.value.showWriteBoard();
        };

        const openShape = (event: MouseEvent) => {
            previewSectionRef.value && previewSectionRef.value.openShape(event);
        };

        const hideWriteBoard = () => {
            previewSectionRef.value && previewSectionRef.value.hideWriteBoard();
        };

        onMounted(async () => {
            const urlSearchParams = new URLSearchParams(window.location.search.replace(/\&/g, '%26'));
            const params = Object.fromEntries(urlSearchParams.entries());
            appjson.value = await window.electron.unpackCacheFile(params.file)
            if (appjson) {
                winActiveId.value = appjson.value.windowId!;
                WindowName.value = appjson.value.windowName!;
                appjson.value.cards.forEach((c: any) => {
                    c.PageList = c.PageList.filter((p: any) => p.State === true);
                });
                console.log(appjson.value);
                cardList.value = appjson.value.cards;
                document.title = WindowName.value;
                await nextTick(() => {
                    cardListComponents.value.handleClick(0, cardList.value[0]);
                });
            }
        });

        const close = () => {
            window.electron.remote.getCurrentWindow().close();
        };

        return {
            lastPage,
            firstPage,
            previewSectionRef,
            updateFlag,
            updatePageList,
            changeWinSize,
            isFullScreen,
            fullScreen,
            isShowCardList,
            clockFullScreen,
            toggleRemark,
            prevStep,
            nextStep,
            showWriteBoard,
            openShape,
            hideWriteBoard,
            cardListComponents,
            cardList,
            previewOptions,
            winActiveId,
            WindowName,
            close
        };
    }
});
</script>

<style lang="scss" scoped>
$border-color: #f5f6fa;
.intelligence {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 0;
    background-color: #f5f6fa;
    .right {
        display: flex;
        justify-content: space-between;
        flex: 1;
        min-height: 0;
        background-color: #fff;
        .right-top {
            height: 80px;
            line-height: 80px;
            border-bottom: 1px solid $border-color;
            text-align: center;
            padding: 0 20px;
            > p {
                float: left;
            }
            > div {
                cursor: pointer;
            }
        }

        .right-bottom {
            position: relative;
            display: flex;
            flex: 1;
            min-width: 0;
            justify-content: space-between;
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
                // position: relative;
                // height: 100%;
                // overflow-y: auto;
                width: 180px;
                text-align: center;
                padding: 20px 0 0 0;
                box-sizing: border-box;
                display: flex;
                min-width: 0;
                min-height: 0;
                flex-direction: column;
                background: #fff;
                &.fullScreen {
                    background: #f5f6fa;
                    position: fixed;
                    left: 0;
                    top: 0;
                    height: calc(100% - 84px);
                    transition: width 0.3s;
                }
                &.hidden {
                    width: 0;
                }
            }
            .card-box-lefts {
                display: flex;
                flex: 1;
                min-width: 0px;
                min-height: 0;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            .card-box-outbottom {
                width: 100%;
                height: 87px;
                background: #bccfff;
            }

            .card-detail {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
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
    }
}
</style>
