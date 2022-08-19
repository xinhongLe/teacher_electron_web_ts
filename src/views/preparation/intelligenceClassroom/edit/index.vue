<template>
    <div class="home">
        <div
            class="left"
            :style="{
                width: showCollapse ? '280px' : '0px',
                padding: showCollapse ? '0px' : '0px 9px',
            }"
        >
            <div class="left-content">
                <div>
                    <el-row :gutter="20" v-if="windowInfo.id.length > 0">
                        <el-col :span="8">
                            <el-button
                                class="add-card"
                                @click="dialogVisibleCard = true"
                                size="small"
                                type="primary"
                                plain
                                >新增卡</el-button
                            >
                        </el-col>
                        <el-col :span="8">
                            <el-button
                                class="add-card"
                                @click="importPPT()"
                                size="small"
                                type="primary"
                                plain
                                >导入</el-button
                            >
                        </el-col>
                        <el-col :span="8">
                            <el-popover
                                placement="bottom-start"
                                :width="50"
                                trigger="focus"
                            >
                                <template #reference>
                                    <el-button
                                        class="add-card"
                                        @click.stop
                                        size="small"
                                        type="primary"
                                        plain
                                        >预览窗</el-button
                                    >
                                </template>
                                <div class="operation-box">
                                    <div
                                        @click="
                                            handleView(allPageList, 'first')
                                        "
                                    >
                                        首页预览
                                    </div>
                                    <div
                                        @click="
                                            handleView(allPageList, 'active')
                                        "
                                    >
                                        当前页预览
                                    </div>
                                </div>
                            </el-popover>
                        </el-col>
                    </el-row>
                </div>
                <div class="card-list" ref="cardListRef">
                    <el-tree
                        default-expand-all
                        node-key="ID"
                        draggable
                        :allow-drop="allowDrop"
                        :expand-on-click-node="false"
                        :highlight-current="false"
                        :data="windowCards"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                    >
                        <template #default="{ node, data }">
                            <div
                                :class="[
                                    'custom-tree-node',
                                    pageValue.ID === data.ID
                                        ? 'active-text'
                                        : '',
                                ]"
                            >
                                <span class="label-class">
                                    <span
                                        :style="{
                                            color:
                                                !data.State && node.level === 2
                                                    ? '#c0c4cc'
                                                    : pageValue.ID === data.ID
                                                    ? '#409Eff'
                                                    : '#333',
                                        }"
                                        >{{ node.label }}</span
                                    >
                                </span>
                                <div class="icon-box">
                                    <el-popover
                                        placement="right-start"
                                        :width="50"
                                        trigger="focus"
                                    >
                                        <template #reference>
                                            <el-button size="mini" @click.stop>
                                                <el-icon :size="18"
                                                    ><more-filled
                                                /></el-icon>
                                            </el-button>
                                        </template>
                                        <div class="operation-box">
                                            <div
                                                v-show="node.level === 1"
                                                @click.stop="
                                                    handleView(
                                                        data.PageList,
                                                        'first'
                                                    )
                                                "
                                            >
                                                预览
                                            </div>
                                            <div
                                                v-show="node.level === 1"
                                                @click.stop="
                                                    handleAdd(node, data)
                                                "
                                            >
                                                新增页
                                            </div>
                                            <div
                                                @click.stop="
                                                    handleUpdateName(node, data)
                                                "
                                            >
                                                修改名称
                                            </div>
                                            <div
                                                v-show="node.level === 2"
                                                @click.stop="
                                                    handleUpdateState(
                                                        node,
                                                        data
                                                    )
                                                "
                                            >
                                                {{
                                                    data.State ? "下架" : "上架"
                                                }}
                                            </div>
                                            <div
                                                v-show="node.level === 1"
                                                @click.stop="handlePaste(data)"
                                            >
                                                粘贴页
                                            </div>
                                            <div
                                                v-show="node.level === 2"
                                                @click.stop="
                                                    handleCopy(node, data)
                                                "
                                            >
                                                复制页
                                            </div>
                                            <div
                                                @click.stop="
                                                    handleDel(node, data)
                                                "
                                            >
                                                删除
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="shrink" ref="shrinkRef">
                <div @click="showCollapse = !showCollapse">
                    <i
                        :style="{
                            transform:
                                'rotate(' + (showCollapse ? 0 : 180) + 'deg)',
                        }"
                        class="el-icon-arrow-left"
                    ></i>
                </div>
            </div>
        </div>
        <div class="right">
            <win-card-edit
                ref="editRef"
                :slide="currentSlide"
                :allPageSlideListMap="allPageSlideListMap"
                @onSave="saveClick"
                @updatePageSlide="updatePageSlide"
                @updateAllPageSlideListMap="updateAllPageSlideListMap"
                :winId="windowInfo?.id"
            ></win-card-edit>
<!--            <div-->
<!--                v-show="!pageValue.ID"-->
<!--                class="mask-right"-->
<!--                @click.stop="handleMask"-->
<!--            ></div>-->
        </div>
    </div>
    <!--上传ppt遮罩-->
    <div class="mask-ppt" v-if="loading">
        <div class="ppt-content">
            <el-progress
                :text-inside="true"
                :stroke-width="30"
                :percentage="percentage"
            />
            <div v-if="parsePptPage === 0" class="ppt-text">正在上传中···</div>
            <div v-else class="ppt-text">
                正在解析{{ parsePptPage }}/{{ pptPages }}
            </div>
        </div>
    </div>
    <!--预览界面-->
    <win-card-view
        ref="winCardViewRef"
        @offScreen="offScreen"
        v-if="winScreenView"
        :pageList="previewPageList"
        :activePageIndex="activePreviewPageIndex"
    ></win-card-view>

    <!-- 新增卡弹框-->
    <add-card-dialog
        v-model:dialogVisible="dialogVisibleCard"
        @handleAddCard="handleAddCard"
    ></add-card-dialog>

    <!-- 新增页弹框-->
    <add-page-dialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        @addPage="addPageCallback"
    ></add-page-dialog>

    <!-- 修改名称弹框-->
    <update-name-card-or-page
        v-model:dialogVisible="dialogVisibleName"
        :currentValue="currentValue"
        @updateName="updateName"
    ></update-name-card-or-page>
    <SaveDialog
        v-if="isShowSaveDialog"
        v-model:isShow="isShowSaveDialog"
        :name="windowInfo.name"
        @onSave="saveCallback"
        :allNames="windowInfo.allWindowNames"
    />
    <SaveAsDialog
        v-if="isShowSaveAsDialog"
        v-model:isShow="isShowSaveAsDialog"
        :name="windowInfo.name"
        @onSave="saveCallback"
        :allNames="windowInfo.allWindowNames"
    />
</template>

<script lang="ts">
import {
    onMounted,
    onUnmounted,
    defineComponent,
    toRefs,
    ref,
    watch,
    toRef,
    computed
} from "vue";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import { IPageValue, ICardList } from "@/types/home";
import Node from "element-plus/es/components/tree/src/model/node";
import useSelectBookInfo from "@/hooks/useSelectBookInfo";
import { isFullscreen } from "@/utils/fullscreen";
import { MoreFilled } from "@element-plus/icons";
import { ElMessage, ElMessageBox } from "element-plus";
import AddPageDialog from "../components/edit/addPageDialog.vue";
import UpdateNameCardOrPage from "../components/edit/updateNameCardOrPage.vue";
import WinCardView from "../components/edit/winScreenView.vue";
import AddCardDialog from "../components/edit/addCardDialog.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import usePreview from "./hooks/usePreview";
import useCopyPage from "./hooks/useCopyPage";
import useSelectPage from "./hooks/useSelectPage";
import useDragPage from "./hooks/useDragPage";
import useAddCard from "./hooks/useAddCard";
import useAddPage from "./hooks/useAddPage";
import useUpdateName from "./hooks/useUpdateName";
import useGetPageSlide from "./hooks/useGetPageSlide";
import isElectron from "is-electron";
import { SaveType, Slide } from "wincard/src/types/slides";
import { saveWindows, saveAsWindows } from "../api";
import { find, isEqual, pullAllBy, cloneDeep } from "lodash";
import emitter from "@/utils/mitt";
import exitDialog, { ExitType } from "./exitDialog";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useImportPPT from "@/hooks/useImportPPT";
import { v4 as uuidv4 } from "uuid";
import { pageType } from "@/config";
import { MutationTypes, store } from "@/store";
import SaveDialog from "../components/edit/saveDialog/saveDialog.vue";
import SaveAsDialog from "../components/edit/saveDialog/saveAsDialog.vue";
export default defineComponent({
    components: {
        AddCardDialog,
        WinCardView,
        UpdateNameCardOrPage,
        AddPageDialog,
        WinCardEdit,
        MoreFilled,
        SaveDialog,
        SaveAsDialog
    },
    name: "Edit",
    setup() {
        const showCollapse = ref(true);
        const shrinkRef = ref();

        const { state, defaultProps, pageValue, isSetCache, _getWindowCards } =
            useSelectBookInfo();

        const windowCards = toRef(state, "windowCards");

        const oldWindowCards = toRef(state, "oldWindowCards");

        const {
            fetchAllPageSlide,
            allPageSlideListMap,
            oldAllPageSlideListMap,
            isLoadEnd,
            resetPageSlide
        } = useGetPageSlide(pageValue);

        const {
            previewPageList,
            handleView,
            winScreenView,
            keyDown,
            offScreen,
            activePreviewPageIndex
        } = usePreview(pageValue);

        const { handleCopy, handlePaste, pastePage } = useCopyPage(
            windowCards,
            allPageSlideListMap
        );

        const {
            handleNodeClick,
            selectPageValue,
            editRef,
            activeAllPageListIndex,
            allPageList,
            isWatchChange,
            cardListRef
        } = useSelectPage(pageValue, allPageSlideListMap);

        const { allowDrop } = useDragPage();

        const { handleAdd, addPageCallback, dialogVisible } = useAddPage(
            shrinkRef,
            windowCards,
            allPageSlideListMap
        );

        const {
            dialogVisibleName,
            currentValue,
            handleUpdateName,
            updateName
        } = useUpdateName(shrinkRef);

        const route = useRoute();
        const router = useRouter();
        const windowInfo = computed(
            () => store.state.preparation.editWindowInfo
        );
        let oldWindowName = windowInfo.value.name;

        const { handleAddCard, dialogVisibleCard } = useAddCard(windowCards, windowInfo);

        const handleDel = (node: Node, data: ICardList) => {
            ElMessageBox.confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // 删除的是卡 判断当前页是否在删除卡下
                    if (node.level === 1) {
                        const flag = data.PageList.find(
                            (item) => item.ID === pageValue.value?.ID
                        );
                        pullAllBy(windowCards.value, [{ ID: data.ID }], "ID");
                        if (flag) {
                            pageValue.value = {
                                ...pageValue.value!,
                                ID: "",
                                Type: 11
                            };
                        }
                    } else {
                        const cardId = node.parent.data.ID;
                        const pageList =
                            find(windowCards.value, { ID: cardId })?.PageList ||
                            [];
                        pullAllBy(pageList, [{ ID: data.ID }], "ID");
                        if (pageValue.value.ID === data.ID) {
                            pageValue.value = {
                                ...pageValue.value!,
                                ID: "",
                                Type: 11
                            };
                        }
                        windowCards.value = [...windowCards.value];
                    }
                    TrackService.setTrack(
                        EnumTrackEventType.DeleteCard,
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "删除卡或页"
                    );
                })
                .catch((err) => {
                    return err;
                });
        };

        const handleUpdateState = (node: Node, data: IPageValue) => {
            data.State = !data.State;
        };

        const isShowSaveDialog = ref(false);
        const isShowSaveAsDialog = ref(false);

        const saveClick = (type: SaveType, windowName: string) => {
            if (windowInfo.value.originType === 0) {
                isShowSaveAsDialog.value = true;
            } else {
                if (type === SaveType.Save) {
                    if (!windowName) {
                        return ElMessage.warning("名称不能为空");
                    }
                    onSave(type, windowName);
                } else {
                    isShowSaveDialog.value = true;
                }
            }
        };

        const saveCallback = (name: string) => {
            onSave(SaveType.SaveAs, name);
        };

        const onSave = async (type: SaveType, windowName: string) => {
            window.electron.log.info(
                "user click save type:",
                SaveType[type],
                isLoadEnd.value
            );
            if (!isLoadEnd.value) {
                return ElMessage.warning("资源正在加载，请稍后再试...");
            }
            const cardData = windowCards.value.map((card, index) => {
                const cardID = card.isAdd ? "" : card.ID;
                const cardName = card.Name;
                const sort = index + 1;
                const pageList = card.PageList;
                const pageData = pageList.map((page, pageIndex) => {
                    const { ID, Name, Type, State, isAdd } = page;
                    const slide = allPageSlideListMap.value.get(ID);
                    let json = "";
                    const academicPresupposition = slide?.remark || "";
                    const designIntent = slide?.design || "";
                    if (slide) {
                        if (slide.type === "element") {
                            json = JSON.stringify(slide);
                        } else if (slide.type === "listen") {
                            const Words = slide.listenWords?.map(
                                (word, index) => {
                                    return {
                                        sort: index + 1,
                                        WordID: word.id,
                                        PageWordID: word.pageWordID
                                            ? null
                                            : word.pageWordID,
                                        WordInterval: 2
                                    };
                                }
                            );
                            json = JSON.stringify(Words);
                        } else if (slide.type === "follow") {
                            json = slide.follow?.id || "";
                        } else if (slide.type === "teach") {
                            json = slide.teach?.id || "";
                        }
                    }
                    return {
                        pageID: isAdd ? "" : ID,
                        pageName: Name || "",
                        type: Type,
                        academicPresupposition,
                        designIntent,
                        sort: pageIndex + 1,
                        json,
                        state: Number(State)
                    };
                });

                return {
                    cardID,
                    sort,
                    pageData,
                    cardName
                };
            });

            const data = {
                franchiseeID: store.state.userInfo.schoolId,
                teacherID: store.state.userInfo.id,
                cardData,
                originType: 1,
                windowName,
                windowID: type === SaveType.Save ? windowInfo.value.id : ""
            };

            const lessonId = (windowInfo.value.lessonId as string) || "";
            const message = "保存成功";

            if (type === SaveType.Save) {
                const res = await saveWindows(data);
                if (res.resultCode === 200) {
                    ElMessage.success({
                        message,
                        duration: 2000
                    });
                    store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, {
                        ...windowInfo.value,
                        name: windowName
                    });
                    oldWindowName = editRef.value?.windowName;
                    allPageSlideListMap.value.forEach((item, key) => {
                        oldAllPageSlideListMap.value.set(key, cloneDeep(item));
                    });
                    oldWindowCards.value = cloneDeep(windowCards.value);
                }
            } else {
                saveAsWindows({ ...data, lessonID: lessonId }).then((res) => {
                    if (res.resultCode === 200) {
                        allPageSlideListMap.value.forEach((item, key) => {
                            oldAllPageSlideListMap.value.set(
                                key,
                                cloneDeep(item)
                            );
                        });
                        oldWindowCards.value = cloneDeep(windowCards.value);
                        oldWindowName = editRef.value?.windowName;
                        // 回到备课页，打开最新的窗
                        emitter.emit("windowSaveAsSuc", null);
                        ElMessage.success({
                            message,
                            duration: 2000
                        });
                        router.push({ path: "/preparation" });
                        emitter.emit("closeTab", {
                            name: route.name as string,
                            path: route.path
                        });
                    }
                });
            }
        };

        watch(
            () => state.windowCards,
            () => {
                allPageList.value = getAllPageList();
                if (state.windowCards.length > 0) {
                    // 先判断是否是粘贴/新增的卡 如果是粘贴/新增卡先选中粘贴/新增卡
                    if (pastePage.value && pastePage.value.ID) {
                        selectPageValue(pastePage.value, false);
                        activeAllPageListIndex.value =
                            allPageList.value.findIndex(
                                (item) => item.ID === pastePage.value!.ID
                            );
                        pastePage.value = undefined;
                        return;
                    }

                    // 拖拽排序选中当前页
                    if (pageValue.value?.ID) {
                        // 需要更新当前选中页的上下架状态等
                        const newPageValue = allPageList.value.find(
                            (item) => item.ID === pageValue.value?.ID
                        );
                        if (newPageValue) {
                            pageValue.value = newPageValue;
                        }
                        const obj = {
                            ...pageValue.value
                        };
                        selectPageValue(obj, true);
                    } else {
                        const winCard = selectFirstPage(state.windowCards);
                        if (winCard) {
                            selectPageValue(winCard.PageList[0], true);
                        }
                    }
                }
            },
            {
                deep: true
            }
        );
        const getAllPageList = () => {
            let data: IPageValue[] = [];
            state.windowCards.map((card) => {
                data = data.concat(card.PageList);
            });
            return data;
        };
        const selectFirstPage = (list: ICardList[]) => {
            return list.find((item) => item.PageList.length > 0);
        };
        const handleMask = () => {
            ElMessage({ type: "warning", message: "请先选择页，在进行编辑" });
        };

        const {
            importByElectron,
            uploadFileName,
            loading,
            parsePptPage,
            pptPages,
            percentage
        } = useImportPPT();

        const importPPT = () => {
            importByElectron((result) => {
                const name = uploadFileName.value.split("\\");
                const pageList = result.slides.map((item, index) => {
                    const id = uuidv4();
                    allPageSlideListMap.value.set(id, item);
                    return {
                        ID: id,
                        Name: name[name.length - 1] + "-" + (index + 1),
                        Type: pageType.element,
                        isAdd: true,
                        State: true
                    };
                });
                const card = {
                    Name: name[name.length - 1],
                    ID: uuidv4(),
                    Sort: windowCards.value.length,
                    isAdd: true,
                    PageList: pageList
                };
                windowCards.value.push(card);
            });
        };

        const updatePageSlide = (slide: Slide) => {
            if (!pageValue.value.ID) return;
            allPageSlideListMap.value.set(pageValue.value.ID, slide);
        };

        // 同步教案的数据
        const updateAllPageSlideListMap = (newAllPageList:any[]) => {
            newAllPageList.forEach((item:any) => {
                const value = allPageSlideListMap.value.get(item.TeachPageID);
                const newValue = {
                    ...value,
                    remark: item.AcademicPresupposition || "",
                    design: item.DesignIntent || ""
                };
                allPageSlideListMap.value.set(item.TeachPageID, newValue as Slide);
                oldAllPageSlideListMap.value.set(item.TeachPageID, cloneDeep(newValue as Slide));
            });
        };

        const winCardViewRef = ref();
        onMounted(() => {
            _getWindowCards(
                {
                    WindowID: windowInfo.value.id,
                    OriginType: windowInfo.value.originType
                },
                true
            ).then(() => {
                fetchAllPageSlide(getAllPageList());
            });
            window.addEventListener("keydown", keyDown);

            // 监听退出全屏事件浏览器
            window.onresize = function () {
                if (!isFullscreen()) {
                    winScreenView.value = false;
                }
            };
        });
        onUnmounted(() => {
            window.removeEventListener("keydown", keyDown);
            if (isElectron()) {
                (window as any).electron.unRegisterEscKeyUp();
            }
        });

        onBeforeRouteLeave(async () => {
            // 先更新一下当前页
            const slide = editRef.value.getCurrentSlide();
            allPageSlideListMap.value.set(pageValue.value.ID, slide);
            if (
                isEqual(
                    allPageSlideListMap.value,
                    oldAllPageSlideListMap.value
                ) &&
                isEqual(windowCards.value, oldWindowCards.value) &&
                oldWindowName === editRef.value?.windowName
            ) { return true; }
            const res = await exitDialog();
            if (res === ExitType.Cancel) {
                return false;
            }
            if (res === ExitType.Save) {
                if (windowInfo.value.originType === 0) {
                    isShowSaveDialog.value = true;
                    return false;
                } else {
                    await onSave(SaveType.Save, editRef.value?.windowName);
                }
            }
        });

        return {
            editRef,
            shrinkRef,
            winCardViewRef,
            cardListRef,
            ...toRefs(state),
            allPageList,
            isSetCache,
            defaultProps,
            pageValue,
            currentValue,
            previewPageList,
            activePreviewPageIndex,
            showCollapse,
            dialogVisible,
            dialogVisibleCard,
            dialogVisibleName,
            winScreenView,
            isWatchChange,
            handleNodeClick,
            allowDrop,
            handleAddCard,
            handleAdd,
            handleCopy,
            handlePaste,
            handleDel,
            handleView,
            handleUpdateName,
            handleUpdateState,
            addPageCallback,
            onSave,
            updateName,
            loading,
            percentage,
            parsePptPage,
            pptPages,
            updatePageSlide,
            updateAllPageSlideListMap,
            allPageSlideListMap,
            oldAllPageSlideListMap,
            _getWindowCards,
            offScreen,
            handleMask,
            currentSlide: computed(
                () => allPageSlideListMap.value.get(pageValue.value.ID) || {}
            ),
            windowInfo,
            saveClick,
            isShowSaveDialog,
            saveCallback,
            isShowSaveAsDialog,
            importPPT
        };
    }
});
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;
    padding: 10px;

    .left {
        position: relative;
        height: 100%;
        margin-right: 10px;
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;
        transition: all 0.5s;
        .left-content {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 280px;
            padding: 10px 28px 10px 10px;
            :deep(.el-cascader),
            :deep(.el-select) {
                width: 100%;
                margin-bottom: 10px;
            }
            .add-card {
                width: 100%;
                margin-bottom: 10px;
            }
            .card-list {
                flex: 1;
                overflow-y: auto;
                :deep(.el-tree-node__content) {
                    height: 46px;
                }
                :deep(.el-tree-node:focus > .el-tree-node__content) {
                    background-color: #fff;
                }
                .custom-tree-node {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 80%;
                    position: relative;
                    .label-class {
                        width: 100%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .icon-box {
                        .el-button {
                            border: none !important;
                            padding: 6px;
                            background-color: transparent;
                            &:hover {
                                background-color: transparent;
                            }
                        }
                        .el-icon {
                            svg {
                                width: 18px;
                                height: 18px;
                            }
                        }
                    }
                }
            }
        }
        .shrink {
            background: #dde1f1;
            width: 18px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            > div {
                background: #ccd1e3;
                width: 100%;
                position: absolute;
                top: 30%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin: auto;
                height: 100px;
                text-align: center;
                cursor: pointer;
                i {
                    line-height: 100px;
                    color: #fff;
                    font-size: 14px;
                    transition: all 0.2s;
                }
            }
        }
        .active-text {
            .label-class {
                > span {
                    color: #409eff;
                }
            }
        }
        :deep(#activeBackground) {
            background-color: #ecf5ff;
        }
    }

    .right {
        flex: 1;
        padding: 0px 10px;
        height: 100%;
        background-color: #fff;
        position: relative;
        .mask-right {
            width: 100%;
            height: 100%;
            cursor: pointer;
            position: absolute;
            left: 0;
            top: 0;
            background: transparent;
        }
    }
}
.operation-box {
    text-align: center;
    div {
        cursor: pointer;
        padding: 4px 0;
    }
}
.mask-ppt {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.6);
    .ppt-content {
        width: 300px;
        text-align: center;
        .ppt-text {
            margin-top: 20px;
            font-size: 18px;
            color: #409eff;
            font-weight: 600;
        }
    }
}
</style>
