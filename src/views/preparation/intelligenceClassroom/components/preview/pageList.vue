<template>
    <div class="pageListComponents">
        <div class="me-work">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                :isInit="isInitPage"
                ref="screenRef"
                :slide="currentSlide"
                :writeBoardVisible="writeBoardVisible"
                :keyDisabled="keyDisabled"
                :useScale="false"
                :winList="cardList"
                :canvasData="canvasData"
                @openCard="openCard"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
                @closeWriteBoard="closeWriteBoard"
            />
            <open-card-view-dialog
                @closeOpenCard="closeOpenCard"
                v-if="dialogVisible"
                :dialog="dialog"
                :cardList="dialogCardList"
                v-model:dialogVisible="dialogVisible"
            ></open-card-view-dialog>
            <div class="me-pager">
                {{ currentPageNum + "/" + pageListCount.length }}
            </div>
            <transition name="fade">
                <div
                    class="me-page"
                    :class="{
                        hidden: isFullScreen && !isShowCardList,
                    }"
                >
                    <PageItem
                        :pageList="pageList"
                        :selected="currentPageIndex"
                        @selectPage="selectPage"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from "vue";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useHome from "@/hooks/useHome";
import OpenCardViewDialog from "../edit/openCardViewDialog.vue";
import { getCardDetail } from "../../api";
import { getWinCardDBData } from "@/utils/database";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import PageItem from "../pageItem.vue";
import { windowInfoKey } from "@/hooks/useWindowInfo";
import { SchoolWindowPageInfo } from "@/types/preparation";
import { find } from "lodash";
import { IElement } from "mwhiteboard";
import { useStore } from "@/store";
export default defineComponent({
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },
        isShowCardList: {
            type: Boolean,
            default: true,
        },
        isFullScreen: {
            type: Boolean,
            default: false,
        },
    },
    components: { OpenCardViewDialog, PageItem },
    setup(props, { emit }) {
        const store = useStore();
        const { getPageDetail, transformType } = useHome();
        const {
            currentCard,
            currentWindowInfo,
            cardList,
            currentPageIndex,
            currentSlide,
            pageList,
            currentPageInfo,
        } = inject(windowInfoKey)!;

        const selectPageInfo = ref(currentPageInfo.value);
        const pageListCount = computed(() => {
            const data: any = [];
            cardList.value.forEach((item: any) => {
                data.push(...item.PageList);
            });
            return data;
        });
        const currentPageNum = computed(() => {
            return (
                pageListCount.value.findIndex((item: any) => {
                    return item.ID === selectPageInfo.value?.ID;
                }) + 1
            );
        });

        const dialogVisible = ref(false);
        const prevPageFlag = ref(false);
        const keyDisabled = ref(false);
        const canvasData = computed(() => {
            return (
                canvasDataMap.get(
                    currentSlide.value ? currentSlide.value.id : ""
                ) || []
            );
        });
        const canvasDataMap = new Map();

        watch(
            () => dialogVisible.value,
            () => {
                if (!dialogVisible.value) {
                    keyDisabled.value = false;
                }
            }
        );

        watch(
            [pageList, currentCard],
            (newValues: any, prevValues: any) => {
                const findPage: any = find(newValues[0], {
                    ID: currentPageInfo.value?.ID,
                });
                selectPageInfo.value = pageList.value[currentPageIndex.value];
                if (newValues[1]?.ID === prevValues[1]?.ID && findPage) {
                    return;
                }
                if (prevPageFlag.value === true) {
                    prevPageFlag.value = false;
                    currentPageIndex.value = newValues[0].length - 1;
                    selectPageInfo.value =
                        pageList.value[currentPageIndex.value];

                    pageNextEnd();
                } else {
                    currentPageIndex.value = -1;
                    pageNext();
                }
            },
            {
                deep: true,
            }
        );
        const writeBoardVisible = ref(false);
        const selectPage = (index: number, item: SchoolWindowPageInfo) => {
            selectPageInfo.value = item;
            currentPageIndex.value = index;
            const DataContext = {
                Type: EnumTrackEventType.SelectPage,
                LessonID: currentWindowInfo.LessonID,
            };
            getDataBase(pageList.value[index].ID, pageList.value[index]);
            TrackService.setTrack(
                EnumTrackEventType.SelectPage,
                currentWindowInfo.WindowID,
                currentWindowInfo.WindowName,
                currentCard.value?.ID,
                currentCard.value?.Name,
                item.ID,
                item.Name,
                "选择页",
                JSON.stringify(DataContext),
                item.ID,
                store.state.userInfo.schoolId
            );
        };
        const getDataBase = async (str: string, obj: SchoolWindowPageInfo) => {
            const elements = screenRef.value.whiteboard.getElements();
            currentSlide.value.id &&
                canvasDataMap.set(currentSlide.value.id, elements);
            if (transformType(obj.Type) === -1) {
                ElMessage({ type: "warning", message: "暂不支持该页面类型" });
                currentSlide.value = {};
                return false;
            }
            const dbResArr = await getWinCardDBData(str);
            if (dbResArr.length > 0) {
                currentSlide.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(obj, obj.OriginType, (res: any) => {
                    if (res && res.id) {
                        currentSlide.value = res;
                    }
                });
            }
        };
        const screenRef = ref();
        const isInitPage = ref(true);
        const prevCard = () => {
            isInitPage.value = false;
            screenRef.value.execPrev();
        };
        const showWriteBoard = () => {
            writeBoardVisible.value = true;
        };
        const hideWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const closeWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const openShape = (event: MouseEvent) => {
            screenRef.value.openShape(event);
        };
        //橡皮擦
        const openEraser = (event: MouseEvent) => {
            screenRef.value.openEraser(event);
        };
        const route = useRoute();
        watch(
            () => route.path,
            () => {
                if (route.path !== "/preparation") {
                    keyDisabled.value = true;
                } else {
                    keyDisabled.value = false;
                }
            }
        );
        const pagePrev = async () => {
            if (currentPageIndex.value > 0) {
                currentPageIndex.value--;
                isInitPage.value = false;
                getDataBase(
                    pageList.value[currentPageIndex.value].ID,
                    pageList.value[currentPageIndex.value]
                );
                selectPageInfo.value = pageList.value[currentPageIndex.value];
                return;
            }
            if (currentPageIndex.value === 0 || currentPageIndex.value === -1) {
                isInitPage.value = false;
                prevPageFlag.value = true;
                emit("firstPage");
            }
        };

        const nextCard = () => {
            isInitPage.value = true;
            screenRef.value.execNext();
        };

        const pageNext = async () => {
            if (pageList.value.length === 0) {
                currentSlide.value = {};
            }
            if (currentPageIndex.value === pageList.value.length - 1) {
                isInitPage.value = true;
                emit("lastPage");
            } else {
                currentPageIndex.value++;
                isInitPage.value = true;
                const DataContext = {
                    Type: EnumTrackEventType.SelectPage,
                    LessonID: currentWindowInfo.LessonID,
                };
                TrackService.setTrack(
                    EnumTrackEventType.SelectPage,
                    currentWindowInfo.WindowID,
                    currentWindowInfo.WindowName,
                    currentCard.value?.ID,
                    currentCard.value?.Name,
                    pageList.value[currentPageIndex.value].ID,
                    pageList.value[currentPageIndex.value].Name,
                    "选择页",
                    JSON.stringify(DataContext),
                    pageList.value[currentPageIndex.value].ID,
                    store.state.userInfo.schoolId
                );
                getDataBase(
                    pageList.value[currentPageIndex.value].ID,
                    pageList.value[currentPageIndex.value]
                );
                selectPageInfo.value = pageList.value[currentPageIndex.value];
            }
        };
        const updateFlags = () => {
            prevPageFlag.value = false;
        };
        const pageNextEnd = async () => {
            if (pageList.value.length > 0) {
                getDataBase(
                    pageList.value[currentPageIndex.value].ID,
                    pageList.value[currentPageIndex.value]
                );
            } else {
                currentSlide.value = {};
            }
        };
        const dialogCardList = ref<any[]>([]);
        const openCard = async (wins: any) => {
            if (wins[0] && wins[0].cards) {
                keyDisabled.value = true;
                const cards = wins[0].cards;
                let pages: any[] = [];
                const newPages: any[] = [];
                cards.map((card: any) => {
                    pages = pages.concat(
                        card.slides.map((page: any) => {
                            return {
                                ID: page.id,
                                Type: page.type,
                                Name: page.name,
                                OriginType: card.type,
                            };
                        })
                    );
                });
                if (pages.length > 0) {
                    const pageIDs = pages.map((page) => page.ID);
                    const obj = {
                        pageIDs,
                        // OriginType: pages[0].OriginType
                    };
                    const res = await getCardDetail(obj);
                    if (
                        res.resultCode === 200 &&
                        res.result &&
                        res.result.length > 0
                    ) {
                        // 页名称可能会修改
                        pages.map((item) => {
                            const value = res.result.find(
                                (page: any) => page.ID === item.ID
                            );
                            if (value) {
                                newPages.push({
                                    Type: item.Type,
                                    ID: item.ID,
                                    Name: value.Name,
                                });
                            } else {
                                newPages.push({
                                    Type: item.Type,
                                    ID: item.ID,
                                    Name: item.Name,
                                });
                            }
                        });
                        dialogCardList.value = newPages;
                        dialogVisible.value = true;
                    } else {
                        keyDisabled.value = false;
                    }
                }
            }
        };
        const closeOpenCard = () => {
            dialogVisible.value = false;
            keyDisabled.value = false;
        };

        return {
            screenRef,
            isInitPage,
            currentSlide,
            currentPageIndex,
            pageList,
            dialogVisible,
            dialogCardList,
            keyDisabled,
            writeBoardVisible,
            openCard,
            prevCard,
            pagePrev,
            selectPage,
            nextCard,
            cardList,
            pageNext,
            updateFlags,
            closeOpenCard,
            showWriteBoard,
            hideWriteBoard,
            openShape,
            closeWriteBoard,
            openEraser,
            canvasData,
            pageListCount,
            currentPageNum,
            selectPageInfo,
        };
    },
});
</script>

<style lang="scss" scoped>
.pageListComponents {
    :deep(.el-overlay) {
        z-index: 9999 !important;
    }
    :deep(.el-dialog.is-fullscreen) {
        --el-dialog-width: 94%;
        --el-dialog-margin-top: 0;
        margin-bottom: 0;
        height: 96%;
        overflow: auto;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    :deep(.el-dialog__body) {
        width: 100%;
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
    }
}
.pageListComponents {
    display: flex;
    flex: 1;
    min-width: 0;
    margin-right: 8px !important;
    ::v-deep .slide-list {
        background-color: #fff;
    }
}
.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 22rem);
    height: calc(100% - 84px);
    transition-property: left, width;
    transition-duration: 0.3s;
}
.me-work {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    .fold-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        height: 104px;
        width: 18px;
        border-radius: 0px 8px 8px 0px;
        background: #f5f6fa;
        cursor: pointer;
        i {
            color: #7e7f83;
            font-size: 18px;
            font-weight: 700;
        }
    }
    .me-pager {
        position: absolute;
        right: 4px;
        bottom: 65px;
    }
}
.me-work-screen {
    width: 100%;
    height: 100%;
}
.me-page {
    min-width: 0;
    background-color: #fff;
    display: flex;
    flex-wrap: nowrap;
    padding: 16px 20px;
    background-color: #fff;
    overflow-y: hidden;
    overflow-x: auto;
    border-top: 1px solid #e9ecf0;
    transition: height 0.3s;
    &.hidden {
        height: 0;
        padding: 0;
    }
}

.me-page-item {
    background-color: #f0f4ff;
    color: var(--app-color-primary);
    padding: 0px 20px;
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 16px;
    white-space: nowrap;
    margin-right: 12px;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    font-weight: 600;
}

.me-page-item.active {
    border: 2px solid var(--app-color-primary);
}

.page-checkbox {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
