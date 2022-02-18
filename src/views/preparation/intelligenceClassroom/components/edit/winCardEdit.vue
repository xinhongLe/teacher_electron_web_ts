<template>
    <div class="ppt-container">
        <PPTEditor
            ref="PPTEditRef"
            :slide="slide"
            @onSave="onSave"
            @addCard="addCard"
            @selectVideo="selectVideo"
            @setQuoteVideo="setQuoteVideo"
            @updateQuoteVideo="updateQuoteVideo"
        />
        <!--选择弹卡-->
        <card-select-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
            @selectCard="selectCard"
        ></card-select-dialog>
        <!--选择跟读页视频-->
        <select-video-dialog
            v-if="dialogVisibleVideo"
            v-model:dialogVisible="dialogVisibleVideo"
            @selectVideoVal="selectVideoVal"
        ></select-video-dialog>
    </div>
</template>
<script lang="ts">
import { watch, defineComponent, reactive, toRefs, PropType, ref, onUnmounted, computed } from "vue";
import useHome from "@/hooks/useHome";
import { Slide, IWin, PPTVideoElement } from "wincard/src/types/slides";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
import { useRoute } from "vue-router";
import { getWinCardDBData } from "@/utils/database";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { Debugger } from "@electron/remote";
export default defineComponent({
    name: "winCardEdit",
    components: { SelectVideoDialog, CardSelectDialog },
    props: {
        pageValue: {
            type: Object as PropType<IPageValue>,
            required: true
        },
        isSetCache: {
            type: Boolean,
            default: () => false
        },
        allPageList: {
            type: Array as PropType<IPageValue[]>,
            default: () => []
        },
        isWatchChange: {
            type: Boolean,
            default: () => true
        }
    },
    setup(props) {
        const route = useRoute();
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false,
            slide: {}
        });
        const page = ref<IPageValue>();
        const originType: any = route.params.originType as string;
        let timer: any = null;
        let noResPages: IPageValue[] = []; // 未请求的页面集合
        let resPagesIds: string[] = []; // 已经请求过的页面ids
        let pageIdIng: string | null = null; // 正在请求的页id
        const { getPageDetail, savePage, transformType } = useHome();
        const watchChange = computed(() => props.isWatchChange);
        const updateVideoElement = ref<PPTVideoElement | null>(null);
        watch(() => props.pageValue, async (val: IPageValue, oldVal) => {
            if (transformType(val.Type) === -1 || !val.ID) {
                page.value = {
                    ID: val.ID,
                    Type: val.Type,
                    State: val.State,
                    TeachPageRelationID: val.TeachPageRelationID
                };
                state.slide = {};
                return;
            }
            if (val && val !== oldVal) {
                page.value = val;
                if (watchChange.value && props.isSetCache) return; // 更新窗且执行默认选中第一个走props.allPageList监听
                if (val.ID) {
                    const dbResArr = await getWinCardDBData(val.ID);
                    if (dbResArr.length > 0) {
                        const data = JSON.parse(JSON.stringify(dbResArr[0].result));
                        setSlide(JSON.parse(data));
                    } else {
                        if (pageIdIng) {
                            if (pageIdIng !== val.ID) {
                                getAllPageList([]);
                                const interval = setInterval(() => {
                                    if (!pageIdIng) {
                                        noResPages.unshift(val);
                                        clearInterval(interval);
                                        getAllPageList(noResPages);
                                    }
                                }, 300);
                            }
                        } else {
                            if (noResPages.length === 0) {
                                getAllPageList([val]);
                            } else {
                                getAllPageList([]);
                                timer = setTimeout(() => {
                                    getAllPageList([val, ...noResPages]);
                                }, 300);
                            }
                        }
                    }
                }
            }
        });

        watch(() => props.allPageList, async (val: IPageValue[]) => {
            if (props.isSetCache) {
                noResPages = [];
                resPagesIds = [];
                getAllPageList([]);
                if (val && val.length > 0) {
                    const interval = setInterval(() => {
                        if (!pageIdIng) {
                            clearInterval(interval);
                            getAllPageList(JSON.parse(JSON.stringify(val)));
                        }
                    }, 300);
                }
            }
        }, { deep: true });

        const getAllPageList = async (allPageList: IPageValue[]) => {
            if (timer) clearTimeout(timer);
            if (allPageList.length > 0) {
                if (resPagesIds.includes(allPageList[0].ID) || transformType(allPageList[0].Type) === -1) {
                    allPageList.shift();
                    noResPages = allPageList;
                    timer = setTimeout(() => {
                        getAllPageList(noResPages);
                    }, 300);
                } else {
                    pageIdIng = allPageList[0].ID;
                    set(STORAGE_TYPES.SET_PAGEIDING, pageIdIng);
                    await getPageDetail(allPageList[0], 1, (res: any) => {
                        if (res.from === "DB") {
                            // 被点击的页时正在请求时
                            if (page.value?.ID === allPageList[0].ID) {
                                setSlide(res.result);
                            }
                        } else {
                            if (res.id) { // 肯定是请求成功的
                                // 被点击的页时正在请求的
                                if (page.value?.ID === allPageList[0].ID) {
                                    setSlide(res);
                                }
                            }
                            pageIdIng = null;
                            set(STORAGE_TYPES.SET_PAGEIDING, pageIdIng);
                            if (allPageList.length > 0) {
                                if (res.id) { // 成功请求
                                    resPagesIds.push(allPageList[0].ID);
                                }
                                allPageList.shift();
                                noResPages = allPageList;
                                // set(STORAGE_TYPES.SET_NORESPAGES, pageIdIng);
                                timer = setTimeout(() => {
                                    getAllPageList(noResPages);
                                }, 300);
                            }
                        }
                    });
                }
            }
        };
        onUnmounted(() => {
            // 页面销毁,断开请求，token过期
            noResPages = [];
            getAllPageList([]);
        });

        let timeOut:any = null;
        const setSlide = (res: any) => {
            state.slide = {}; // 要先置空 否则wincard组件有些值监听不到改变
            timeOut = setTimeout(() => {
                state.slide = res;
            }, 100);
        };

        const onSave = async (slide: Slide) => {
            if (props.pageValue.ID) {
                const data = await savePage(slide);
                if (data) {
                    state.slide = {};
                    setTimeout(() => {
                        state.slide = data;
                    }, 100);
                }
            } else {
                ElMessage({ type: "warning", message: "请先选择页，再进行保存" });
            }
        };

        let fun: (win: IWin[]) => void;
        const addCard = (callback: (win: IWin[]) => void) => {
            state.dialogVisible = true;
            fun = callback;
        };

        const selectCard = (cards: ICards[]) => {
            state.dialogVisible = false;
            const newCards = {
                id: page.value!.ID,
                cards: cards
            };
            fun([newCards]);
        };

        const selectVideo = () => {
            updateVideoElement.value = null;
            isSetQuoteVideo.value = false;
            state.dialogVisibleVideo = true;
        };

        const selectVideoVal = (val: any) => {
            if (isSetQuoteVideo.value) {
                isSetQuoteVideo.value = false;
                console.log(val);
                if (updateVideoElement.value) {
                    PPTEditRef.value.updateVideoElement({ ...updateVideoElement.value, src: val.src, fileID: val.fileID, pauseList: val.pauseList, ossSrc: "", ossPoster: "", ossIcon: "" });
                    updateVideoElement.value = null;
                } else {
                    PPTEditRef.value.createQuoteVideo(val.src, val.fileID, val.pauseList);
                }
            } else {
                delete val.fileID;
                state.slide = Object.assign({}, state.slide, { follow: val });
            }
            state.dialogVisibleVideo = false;
        };

        const PPTEditRef = ref();
        const closeScreen = () => {
            PPTEditRef.value.closeScreen();
        };
        const getIsScreening = () => {
            return PPTEditRef.value.getIsScreening();
        };
        const execPrev = () => {
            PPTEditRef.value.execPrev();
        };
        const execNext = () => {
            PPTEditRef.value.execNext();
        };

        const getDataIsChange = () => {
            return PPTEditRef.value.getDataIsChange();
        };

        // 插入引用视频
        const isSetQuoteVideo = ref(false);
        const setQuoteVideo = () => {
            updateVideoElement.value = null;
            isSetQuoteVideo.value = true;
            state.dialogVisibleVideo = true;
        };

        const updateQuoteVideo = (element: PPTVideoElement) => {
            isSetQuoteVideo.value = true;
            updateVideoElement.value = element;
            state.dialogVisibleVideo = true;
        };

        return {
            ...toRefs(state),
            onSave,
            addCard,
            selectCard,
            selectVideo,
            selectVideoVal,
            PPTEditRef,
            closeScreen,
            getIsScreening,
            execPrev,
            execNext,
            getDataIsChange,
            setQuoteVideo,
            updateQuoteVideo
        };
    }
});
</script>

<style scoped lang="scss">
.ppt-container {
    padding: 0px !important;
    height: 100%;
}
.ppt-editor {
    width: 100%;
}
</style>
