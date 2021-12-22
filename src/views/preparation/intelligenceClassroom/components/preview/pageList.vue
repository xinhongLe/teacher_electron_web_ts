<template>
    <div class="pageListComponents">
        <div class="me-work" :style="showRemarks ? 'width: calc(100% - 22rem)' : 'width: 100%;'" :class=" fullscreenStyle ? 'fullscreen' : ''">
            <ScreenView
                class="me-work-screen"
                :inline="true"
                :isInit="isInitPage"
                ref="screenRef"
                :slide="page"
                :keyDisabled="keyDisabled"
                :useScale="false"
                @openCard="openCard"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
            />
            <open-card-view-dialog @closeOpenCard="closeOpenCard" v-if="dialogVisible" :cardList="cardList" v-model:dialogVisible="dialogVisible"></open-card-view-dialog>
            <div
                v-if="!fullscreenStyle"
                class="me-page"
            >
                <!-- :style="{ paddingBottom: hasCheck ? '40px' : '15px' }" -->
                <div
                    class="me-page-item"
                    :class="selected === index && 'active'"
                    v-for="(item, index) in pageList"
                    :key="index"
                    @click="selectPage(index)"
                >
                    {{ item.Name }}
                    <div
                        class="page-checkbox"
                        v-if="hasCheck"
                        @click.stop="() => null"
                    >
                        <el-checkbox v-model="item.isChecked"></el-checkbox>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue-demi";
import pageListServer from "../../hooks/pageList";
import useHome from "@/hooks/useHome";
import OpenCardViewDialog from "../edit/openCardViewDialog.vue";
import { getCardDetail } from "../../api";
import { exitFullscreen } from "@/utils/fullscreen";
import isElectron from "is-electron";
import { getWinCardDBData } from "@/utils/database";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
export default defineComponent({
    props: ["pageListOption", "showRemark"],
    components: { OpenCardViewDialog },
    setup(props, { emit }) {
        const { getPageDetail, transformType } = useHome();
        const pageList = ref([]);
        const page = ref({});
        const { hasCheck, selected } = pageListServer();
        const dialogVisible = ref(false);
        const prevPageFlag = ref(false);
        const showRemarks = ref(false);
        const keyDisabled = ref(false);
        watch(
            () => props.showRemark,
            () => {
                showRemarks.value = props.showRemark;
            }
        );
        watch(
            () => dialogVisible.value,
            () => {
                if (!dialogVisible.value) {
                    keyDisabled.value = false;
                }
            }
        );
        watch(
            () => props.pageListOption,
            () => {
                if (prevPageFlag.value === true) {
                    prevPageFlag.value = false;
                    pageList.value = props.pageListOption;
                    selected.value = props.pageListOption.length - 1;
                    pageNextEnd(selected.value);
                } else {
                    pageList.value = props.pageListOption;
                    selected.value = -1;
                    pageNext(selected.value);
                }
            }
        );
        const selectPage = (index) => {
            selected.value = index;
            getDataBase(pageList.value[index].ID, pageList.value[index]);
        };
        const getDataBase = async (str, obj) => {
            if (transformType(obj.Type) === -1) {
                ElMessage({ type: "warning", message: "暂不支持该页面类型" });
                page.value = {};
                return false;
            }
            const dbResArr = await getWinCardDBData(str);
            if (dbResArr.length > 0) {
                page.value = JSON.parse(dbResArr[0].result);
                console.log(page.value, "value");
            } else {
                await getPageDetail(obj, obj.originType, (res) => {
                    if (res && res.id) {
                        page.value = res;
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
        const route = useRoute();
        watch(() => route.path, () => {
            if (route.path !== "/preparation") {
                keyDisabled.value = true;
            } else {
                keyDisabled.value = false;
            }
        });
        const pagePrev = async () => {
            if (selected.value > 0) {
                selected.value--;
                isInitPage.value = false;
                emit("changeRemark", pageList.value[selected.value].Remark);
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
                return;
            }
            if (selected.value === 0) {
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
                page.value = {};
            }
            if (selected.value === pageList.value.length - 1) {
                isInitPage.value = true;
                emit("lastPage");
            } else {
                selected.value++;
                isInitPage.value = true;
                emit("changeRemark", pageList.value[selected.value].Remark);
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
            }
        };
        const updateFlags = () => {
            prevPageFlag.value = false;
        };
        const pageNextEnd = async () => {
            if (pageList.value.length > 0) {
                emit("changeRemark", pageList.value[selected.value].Remark);
                getDataBase(pageList.value[selected.value].ID, pageList.value[selected.value]);
            } else {
                emit("changeRemark", " ");
                page.value = [];
            }
        };
        const fullscreenStyle = ref(false);
        const fullScreen = () => {
            fullscreenStyle.value = true;
        };
        const clockFullScreen = () => {
            fullscreenStyle.value = false;
        };
        const cardList = ref([]);
        const openCard = async (wins) => {
            console.log(wins, "wins");
            if (wins[0] && wins[0].cards) {
                keyDisabled.value = true;
                const cards = wins[0].cards;
                let pages = [];
                const newPages = [];
                cards.map(card => {
                    pages = pages.concat(card.slides.map(page => {
                        return {
                            ID: page.id,
                            Type: page.type,
                            Name: page.name,
                            OriginType: card.type
                        };
                    }));
                });
                if (pages.length > 0) {
                    console.log(pages, "pages");
                    const pageIDs = pages.map(page => page.ID);
                    const obj = {
                        pageIDs,
                        OriginType: pages[0].OriginType || 1
                    };
                    const res = await getCardDetail(obj);
                    if (res.resultCode === 200 && res.result && res.result.length > 0) {
                        // 页名称可能会修改
                        res.result.map(item => {
                            pages.map(page => {
                                if (page.ID === item.ID) {
                                    newPages.push(
                                        { Type: page.Type, ID: page.ID, Name: item.Name }
                                    );
                                }
                            });
                        });
                        cardList.value = newPages;
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
            page,
            hasCheck,
            selected,
            pageList,
            dialogVisible,
            cardList,
            showRemarks,
            keyDisabled,
            openCard,
            prevCard,
            pagePrev,
            selectPage,
            nextCard,
            fullScreen,
            fullscreenStyle,
            pageNext,
            clockFullScreen,
            updateFlags,
            closeOpenCard
        };
    }
});
</script>

<style lang="scss" scoped>
.pageListComponents{
    :deep(.el-overlay){
        z-index: 999999 !important;
    }
    :deep(.el-dialog.is-fullscreen){
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
    :deep(.el-dialog__body){
        width: 100%;
        display: flex;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
    }
}
.pageListComponents{
    display: flex;
    flex: 1;
    min-width: 0;
    ::v-deep .slide-list{
        background-color: #fff;
    }
}
.fullscreen{
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 22rem);
    height: calc(100% - 85px);
}
.me-work {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    padding: 15px;
    background-color: #fff;
    overflow-y: hidden;
    overflow-x: auto;
}

.me-page-item {
    background-color: #f0f3ff;
    color: #5560f1;
    padding: 0px 10px;
    box-sizing: border-box;
    text-align: center;
    height: 32px;
    display: flex;
    align-items: center;
    // min-width: 100px;
    font-size: 16px;
    white-space: nowrap;
    margin-right: 10px;
    border: 1px solid #f0f3ff;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
}

.me-page-item.active {
    border: 2px solid #6675f4;
}

.page-checkbox {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
