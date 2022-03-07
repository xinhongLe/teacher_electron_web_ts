<template>
    <div class="home">
        <div class="left" :style="{ width: showCollapse ? '280px': '0px',
        padding: showCollapse ? '0px' : '0px 9px'}">
           <div class="left-content">
               <div>
                   <el-row :gutter="20" v-if="winValue.length > 0">
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
                           <el-popover placement="bottom-start" :width="50" trigger="focus">
                               <template #reference>
                                   <el-button class="add-card" @click.stop size="small" type="primary" plain>预览窗</el-button>
                               </template>
                               <div class="operation-box">
                                   <div @click="handleView(allPageList, 'first')">首页预览</div>
                                   <div @click="handleView(allPageList, 'active')">当前页预览</div>
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
                       @node-drag-end="handleDragEnd"
                       @node-click="handleNodeClick"
                   >
                       <template #default="{ node, data }">
                           <div
                               :class="[
                                    'custom-tree-node',
                                    pageValue.ID === data.ID
                                        ? 'active-text'
                                        : ''
                                ]"
                           >
                                <span
                                    class="label-class"
                                >
                                    <span :style="{color: !data.State &&node.level === 2 ? '#c0c4cc': pageValue.ID === data.ID ? '#409Eff' : '#333'}">{{ node.label }}</span>
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
                                           <div v-show="node.level === 1" @click.stop=" handleView(data.PageList, 'first')">
                                               预览
                                           </div>
                                           <div v-show="node.level === 1" @click.stop=" handleAdd(node, data)">
                                               新增页
                                           </div>
                                           <div @click.stop=" handleUpdateName(node, data)">
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
            <div class="shrink"  ref="shrinkRef">
                <div @click="showCollapse = !showCollapse"><i :style="{'transform': 'rotate(' + (showCollapse ? 0 : 180) + 'deg)'}" class="el-icon-arrow-left"></i></div>
            </div>
        </div>
        <div class="right">
            <win-card-edit
                ref="editRef"
                :isWatchChange="isWatchChange"
                :pageValue="pageValue"
                :isSetCache="isSetCache"
                :allPageList="allPageList"
                :slide="currentSlide"
            ></win-card-edit>
            <div
                v-show="!pageValue.ID"
                class="mask-right"
                @click.stop="handleMask"
            ></div>
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
</template>

<script lang="ts">
import { onMounted, onUnmounted, defineComponent, toRefs, ref, watch, nextTick, toRef, computed } from "vue";
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
import { useRoute } from "vue-router";
import usePreview from "./hooks/usePreview";
import useCopyPage from "./hooks/useCopyPage";
import useSelectPage from "./hooks/useSelectPage";
import useDragPage from "./hooks/useDragPage";
import useAddCard from "./hooks/useAddCard";
import useAddPage from "./hooks/useAddPage";
import useUpdateName from "./hooks/useUpdateName";
import useGetPageSlide from "./hooks/useGetPageSlide";
import isElectron from "is-electron";
export default defineComponent({
    components: { AddCardDialog, WinCardView, UpdateNameCardOrPage, AddPageDialog, WinCardEdit, MoreFilled },
    name: "Edit",
    setup() {
        const showCollapse = ref(true);
        const shrinkRef = ref();

        const {
            state, cardsValue, defaultProps, pageValue, isSetCache, _getSubjectPublisherBookList, _getWindowCards,
            _deleteCardOrPage, _addPage, _renameCardOrPage,
            _setCardOrPageState, _addCard, _copyPage, dragDealData
        } = useSelectBookInfo();

        const { previewPageList, handleView, winScreenView, keyDown, offScreen, activePreviewPageIndex } = usePreview(pageValue);

        const { handleCopy, handlePaste } = useCopyPage(_copyPage);

        const { handleNodeClick, selectPageValue, editRef, activeAllPageListIndex, allPageList, isWatchChange, cardListRef } = useSelectPage(pageValue);

        const { handleDragEnd, allowDrop } = useDragPage(dragDealData);

        const { handleAddCard, dialogVisibleCard } = useAddCard(_addCard, toRef(state, "windowCards"));

        const { handleAdd, addPageCallback, dialogVisible } = useAddPage(shrinkRef, _addPage);

        const { dialogVisibleName, currentValue, handleUpdateName, updateName } = useUpdateName(shrinkRef, _renameCardOrPage);

        const { fetchAllPageSlide, allPageSlideListMap } = useGetPageSlide(pageValue);

        _getSubjectPublisherBookList();
        const route = useRoute();
        const winValue = route.params.winValue as string;

        const handleDel = (node: Node, data: ICardList) => {
            // 删除的是卡 判断当前页是否在删除卡下
            if (node.level === 1 && pageValue.value?.ID) {
                const flag = data.PageList.find(
                    (item) => item.ID === pageValue.value?.ID
                );
                if (flag) {
                    cardsValue.value = data;
                }
            }
            _deleteCardOrPage(data.ID, {
                TeachPageRelationID: data.TeachPageRelationID
            });
        };

        const handleUpdateState = (node:Node, data:ICardList) => {
            _setCardOrPageState({ ID: data.TeachPageRelationID, State: data.State ? 0 : 1 });
        };

        watch(
            () => state.windowCards,
            () => {
                allPageList.value = getAllPageList();
                if (state.windowCards.length > 0) {
                    // 先判断是否是粘贴/新增的卡 如果是粘贴/新增卡先选中粘贴/新增卡
                    if (state.pastePage && state.pastePage.ID) {
                        selectPageValue(state.pastePage, false);
                        activeAllPageListIndex.value = allPageList.value.findIndex(item => item.ID === state.pastePage!.ID);
                        state.pastePage = null;
                        return;
                    }

                    // 拖拽排序选中当前页
                    if (pageValue.value?.ID) {
                        // 需要更新当前选中页的上下架状态等
                        const newPageValue = allPageList.value.find(item => item.ID === pageValue.value?.ID);
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

        const importPPT = () => {
            ElMessage({
                type: "warning",
                message: "功能尚未完善，敬请期待"
            });
            // importByElectron((result) => {
            //     console.log("=====", result);
            // });
        };

        const winCardViewRef = ref();
        onMounted(() => {
            _getWindowCards({ WindowID: route.params.winValue as string, OriginType: Number(route.params.originType) }, true).then(() => {
                fetchAllPageSlide(getAllPageList());
            });
            window.addEventListener("keydown", keyDown);
            if (isElectron()) {
                (window as any).electron.registerEscKeyUp(() => {
                    if (!(window as any).electron.isFullScreen()) return;
                    (window as any).electron.minimizeWindow();
                    winScreenView.value = false;
                    editRef.value.closeScreen();
                });
            }
            // 监听退出全屏事件浏览器
            window.onresize = function() {
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

        return {
            editRef,
            shrinkRef,
            winCardViewRef,
            cardListRef,
            ...toRefs(state),
            winValue,
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
            handleDragEnd,
            handleAddCard,
            handleAdd,
            handleCopy,
            handlePaste,
            handleDel,
            handleView,
            handleUpdateName,
            handleUpdateState,
            addPageCallback,
            updateName,
            allPageSlideListMap,
            _getWindowCards,
            offScreen,
            handleMask,
            currentSlide: computed(() => allPageSlideListMap.value.get(pageValue.value.ID) || {}),
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
        transition: all .5s;
        .left-content{
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 280px;
            padding: 10px 28px 10px 10px;
            :deep(.el-cascader), :deep(.el-select) {
                width: 100%;
                margin-bottom: 10px;
            }
            .add-card{
                width: 100%;
                margin-bottom: 10px
            }
            .card-list{
                flex: 1;
                overflow-y: auto;
                :deep(.el-tree-node__content){
                    height: 46px;
                }
                :deep(.el-tree-node:focus>.el-tree-node__content){
                    background-color: #fff;
                }
                .custom-tree-node{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 80%;
                    position: relative;
                    .label-class{
                        width: 100%;
                        text-overflow : ellipsis;
                        white-space : nowrap;
                        overflow : hidden;
                    }
                    .icon-box{
                        .el-button{
                            border: none !important;
                            padding: 6px;
                            background-color: transparent;
                            &:hover{
                                background-color: transparent;
                            }
                        }
                        .el-icon{
                            svg{
                                width: 18px;
                                height: 18px;
                            }
                        }
                    }
                }
            }
        }
        .shrink {
            background: #DDE1F1;
            width: 18px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            >div {
                background: #CCD1E3;
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
                    transition: all .2s;
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
        .mask-right{
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
.operation-box{
    text-align: center;
    div{
        cursor: pointer;
        padding: 4px 0;
    }
}
</style>
