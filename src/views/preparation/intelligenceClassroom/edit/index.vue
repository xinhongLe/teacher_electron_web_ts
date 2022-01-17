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
                                    @mouseenter="mouseenter($event, node.label)"
                                    @mouseleave="mouseleave"
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
        :pageList="pageList"
        :activePageIndex="activePageIndex"
        @stopGetAllPageList="stopGetAllPageList"
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
        @addPage="addPage"
    ></add-page-dialog>

    <!-- 修改名称弹框-->
    <update-name-card-or-page
        v-model:dialogVisible="dialogVisibleName"
        :currentValue="currentValue"
        @updateName="updateName"
    ></update-name-card-or-page>
</template>

<script lang="ts">
import { onMounted, onUnmounted, defineComponent, toRefs, ref, watch, nextTick } from "vue";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import { IPageValue, ICardList } from "@/types/home";
import Node from "element-plus/es/components/tree/src/model/node";
import useSelectBookInfo from "@/hooks/useSelectBookInfo";
import { enterFullscreen, isFullscreen } from "@/utils/fullscreen";
import { MoreFilled } from "@element-plus/icons";
import { ElMessage, ElMessageBox } from "element-plus";
import AddPageDialog from "../components/edit/addPageDialog.vue";
import UpdateNameCardOrPage from "../components/edit/updateNameCardOrPage.vue";
import WinCardView from "../components/edit/winScreenView.vue";
import AddCardDialog from "../components/edit/addCardDialog.vue";
import { useRoute } from "vue-router";
import { sleep } from "@/utils/common";
import isElectron from "is-electron";
export default defineComponent({
    components: { AddCardDialog, WinCardView, UpdateNameCardOrPage, AddPageDialog, WinCardEdit, MoreFilled },
    name: "Edit",
    setup() {
        const showCollapse = ref(true);
        const dialogVisible = ref(false);
        const dialogVisibleCard = ref(false);
        const dialogVisibleName = ref(false);
        const tooltipShow = ref(true);
        const winScreenView = ref(false);
        const editRef = ref();
        const cardListRef = ref();
        const activeAllPageListIndex = ref(0);
        const mouseenter = (event:any, lable: string) => {
            const labelBox = event.target;
            const labelText = event.target.firstChild;
            tooltipShow.value = labelBox.offsetWidth > labelText.offsetWidth;
            if (!tooltipShow.value) {
                const div = document.createElement("div");
                div.innerHTML = lable;
                div.setAttribute("id", "tooltipShow");
                div.setAttribute("class", "tooltip-class");
                div.style.left = event.pageX + "px";
                div.style.top = event.pageY - 60 + "px";
                document.body.appendChild(div);
            }
        };
        const mouseleave = () => {
            tooltipShow.value = true;
            const div = document.getElementById("tooltipShow");
            if (div) {
                div.remove();
            }
        };

        // const state = {  // state的值
        //     subjectPublisherBookList: [],
        //     subjectPublisherBookValue: [],
        //     chaptersList: [],
        //     chaptersValue: "",
        //     winList: [],
        //     winValue: [],
        //     windowCards: [],
        //     oldWindowCards: []
        // }
        const {
            state, cardsValue, defaultProps, pageValue, isSetCache, _getSubjectPublisherBookList, _getWindowCards,
            _deleteCardOrPage, _addPage, _renameCardOrPage,
            _setCardOrPageState, _addCard, _copyPage, dragDealData
        } = useSelectBookInfo();

        const isWatchChange = ref(true); // 是否是监听改变的pageValue

        const handleNodeClick = (data: IPageValue, Node: Node | null) => {
            if (Node) {
                activeAllPageListIndex.value = allPageList.value.findIndex(item => item.ID === data.ID);
            }
            if (data.ID === pageValue.value.ID || (Node && Node.level === 1)) return;
            if (editRef.value.getDataIsChange()) {
                ElMessageBox.confirm("尚未保存修改, 是否继续操作?", "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        selectPageValue(data, false);
                    })
                    .catch((err) => {
                        return err;
                    });
            } else {
                selectPageValue(data, false);
            }
        };

        const selectPageValue = (data: { ID: string; Type: number }, flag: boolean) => {
            isWatchChange.value = flag;
            pageValue.value = data;
            setDomClass();
        };

        const setDomClass = () => {
            nextTick(() => {
                const parentID = document.getElementById("activeBackground");
                if (parentID) {
                    parentID.removeAttribute("id");
                }
                const childrenDom: any = document.querySelector(".active-text");
                const parentDom: any = childrenDom?.parentNode;
                if (parentDom) {
                    parentDom.setAttribute("id", "activeBackground");
                }
            });
        };

        const handleDragEnd = (draggingNode: Node, dropNode: Node, env: string) => {
            dragDealData(draggingNode, dropNode, env);
        };

        const allowDrop = (draggingNode: Node, dropNode: Node, type: any) => {
            if ((draggingNode.data.PageList && dropNode.data.PageList && type !== "inner") ||
                (!draggingNode.data.PageList && !dropNode.data.PageList && type !== "inner") ||
                (!draggingNode.data.PageList && dropNode.data.PageList && type === "inner")
            ) {
                return true;
            } else {
                return false;
            }
        };

        _getSubjectPublisherBookList();
        const route = useRoute();
        const winValue = route.params.winValue as string;

        const handleAddCard = (name:string) => {
            // _addCard({ WindowID: route.params.winValue as string, Sort: 0, Name: name });
            const sort = state.windowCards ? state.windowCards.length : 0;
            _addCard({ WindowID: route.params.winValue as string, Sort: sort, Name: name });
            dialogVisibleCard.value = false;
        };

        const handleDel = (node: Node, data: ICardList) => {
            // 删除的是卡 判断当前页是否在删除卡下
            if (node.level === 1 && pageValue.value.ID) {
                const flag = data.PageList.find(
                    (item) => item.ID === pageValue.value.ID
                );
                if (flag) {
                    cardsValue.value = data;
                }
            }
            _deleteCardOrPage(data.ID, {
                TeachPageRelationID: data.TeachPageRelationID
            });
        };

        let copyValue = {
            OldCardID: "",
            PageID: "",
            Name: ""
        };
        const handleCopy = (node: Node, data: ICardList) => {
            copyValue = {
                OldCardID: node.parent.data.ID,
                PageID: data.ID,
                Name: data.Name
            };
            if (copyValue.OldCardID && copyValue.PageID) {
                ElMessage({ type: "success", message: "复制页成功" });
            }
        };

        const handlePaste = (data: ICardList) => {
            if (copyValue.OldCardID && copyValue.PageID) {
                const value = {
                    ...copyValue,
                    CardID: data.ID
                };
                _copyPage(value);
            } else {
                ElMessage({ type: "warning", message: "请先复制页" });
            }
        };

        const currentValue = ref();
        const handleAdd = (node:Node, data:ICardList) => {
            shrinkRef.value.click();
            dialogVisible.value = true;
            currentValue.value = data;
        };

        // 预览卡/窗
        const pageList = ref();
        const activePageIndex = ref(0);
        const handleView = async (data: IPageValue[], flag: string) => { // flag first 首页预览  active 当前页预览
            const activePageData: any = pageValue.value;
            if (flag === "active" && !activePageData.State) {
                return ElMessage({ type: "warning", message: "已下架的页, 暂不支持从当前页预览" });
            }

            // 预览只支持 已上架数据
            pageList.value = data.filter((item: IPageValue) => item.State);
            flag === "first" ? activePageIndex.value = 0 : activePageIndex.value = pageList.value.findIndex((item : IPageValue) => item.ID === pageValue.value.ID);
            if (pageList.value.length > 0) {
                if (
                    (window as any).electron &&
                    !(window as any).electron.isFullScreen() &&
                    !(window as any).electron.isMac()
                ) {
                    (window as any).electron.setFullScreen();
                    await sleep(300);
                }
                winScreenView.value = true;
                enterFullscreen();
            } else {
                ElMessage({
                    type: "warning",
                    message: "请先添加页，在进行预览"
                });
            }
        };
        const offScreen = () => {
            winScreenView.value = false;
        };
        const stopGetAllPageList = () => {
            editRef.value.getAllPageList([]);
        };
        const handleUpdateName = (node:Node, data:ICardList) => {
            shrinkRef.value.click();
            dialogVisibleName.value = true;
            currentValue.value = data;
        };

        const addPage = (data: { name: string, value: number}) => {
            const value = {
                CardID: currentValue.value.ID,
                Name: data.name,
                Type: data.value,
                Sort: currentValue.value.PageList ? currentValue.value.PageList.length : 0
            };
            _addPage(value);
            dialogVisible.value = false;
        };

        const updateName = (name: string) => {
            const data = {
                Name: name,
                ID: currentValue.value.ID
            };
            _renameCardOrPage(data);
            dialogVisibleName.value = false;
        };
        const handleUpdateState = (node:Node, data:ICardList) => {
            _setCardOrPageState({ ID: data.TeachPageRelationID, State: data.State ? 0 : 1 });
        };

        const keyDown = (e:any) => {
            if (e.keyCode === 27) {
                winScreenView.value = false;
            }
        };
        const allPageList = ref<IPageValue[]>([]);
        watch(
            () => state.windowCards,
            () => {
                allPageList.value = getAllPageList(state.windowCards);
                if (state.windowCards.length > 0) {
                    // 先判断是否是粘贴/新增的卡 如果是粘贴/新增卡先选中粘贴/新增卡
                    if (state.pastePage && state.pastePage.ID) {
                        selectPageValue(state.pastePage, false);
                        activeAllPageListIndex.value = allPageList.value.findIndex(item => item.ID === state.pastePage!.ID);
                        state.pastePage = null;
                        return;
                    }

                    // 拖拽排序选中当前页
                    if (pageValue.value.ID) {
                        // 需要更新当前选中页的上下架状态等
                        const newPageValue = allPageList.value.find(item => item.ID === pageValue.value.ID);
                        if (newPageValue) {
                            pageValue.value = newPageValue;
                        }
                        const obj: { ID: string; Type: number } = {
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
        const getAllPageList = (list: ICardList[]) => {
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

        const pagePrev = () => {
            if (activeAllPageListIndex.value === 0) {
                cardListRef.value.scrollTo(0, 0); // 解决快捷键切换到第一个 滚动条会滚动到最下面
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            activeAllPageListIndex.value--;
            handleNodeClick(allPageList.value[activeAllPageListIndex.value], null);
        };

        const pageNext = () => {
            if (activeAllPageListIndex.value === allPageList.value.length - 1) {
                cardListRef.value.scrollTo(0, cardListRef.value.scrollHeight); // 解决快捷键切换到最后一个 滚动条会滚动到最上面
                return ElMessage({ type: "warning", message: "已经是最后页" });
            }
            activeAllPageListIndex.value++;
            handleNodeClick(allPageList.value[activeAllPageListIndex.value], null);
        };

        const checkPageDownload = (e: any) => {
            const key = e.key.toUpperCase();
            if (key === "ARROWUP" || key === "PAGEUP") { // 上一页
                pagePrev();
            } else if (key === "ARROWDOWN" || key === "PAGEDOWN") { // 下一页
                pageNext();
            }
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
            _getWindowCards({ WindowID: route.params.winValue as string, OriginType: 1 }, true);
            window.addEventListener("keydown", keyDown);
            if (cardListRef.value) {
                cardListRef.value.addEventListener("keydown", checkPageDownload);
            }
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
        const shrinkRef = ref();
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
            pageList,
            activePageIndex,
            showCollapse,
            dialogVisible,
            dialogVisibleCard,
            dialogVisibleName,
            tooltipShow,
            winScreenView,
            isWatchChange,
            mouseenter,
            mouseleave,
            handleNodeClick,
            allowDrop,
            handleDragEnd,
            handleAddCard,
            handleAdd,
            handleCopy,
            handlePaste,
            handleDel,
            handleView,
            stopGetAllPageList,
            handleUpdateName,
            handleUpdateState,
            addPage,
            updateName,
            _getWindowCards,
            offScreen,
            handleMask,
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
