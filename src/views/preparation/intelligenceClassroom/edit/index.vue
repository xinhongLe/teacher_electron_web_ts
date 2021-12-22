<template>
    <div class="home">
        <div class="left" :style="{ width: showCollapse ? '280px': '0px',
        padding: showCollapse ? '0px' : '0px 9px'}">
           <div class="left-content">
               <div>
                   <el-row :gutter="20">
                       <el-col :span="12">
                           <el-button
                               class="add-card"
                               v-if="winValue.length > 0"
                               @click="dialogVisibleCard = true"
                               size="small" type="primary" plain>新增卡</el-button>
                       </el-col>
                       <el-col :span="12">
                           <el-button
                               class="add-card"
                               v-if="winValue.length > 0"
                               @click="handleView(allPageList)"
                               size="small" type="primary" plain>预览窗</el-button>
                       </el-col>
                   </el-row>
               </div>
                <div class="card-list">
                   <el-tree
                       default-expand-all
                       node-key="ID"
                       draggable
                       :allow-drop="allowDrop"
                       :expand-on-click-node="false"
                       :highlight-current="true"
                       :data="windowCards"
                       :props="defaultProps"
                       @node-drag-end="handleDragEnd"
                       @node-click="handleNodeClick">
                       <template #default="{ node, data }">
                           <div class="custom-tree-node">
                           <span class="label-class"
                                 @mouseenter="mouseenter($event, node.label)"
                                 @mouseleave="mouseleave">
                                  <span :style="{color: !data.State && node.level === 2 ? '#c0c4cc' : '#333'}">{{ node.label }}</span>
                              </span>

                               <div class="icon-box">
                                   <el-popover placement="right-start" :width="50" trigger="focus">
                                       <template #reference>
                                           <el-button  size="mini"  @click.stop>
                                               <el-icon :size="18"><more-filled/></el-icon>
                                           </el-button>
                                       </template>
                                       <div class="operation-box">
                                           <div v-show="node.level === 1" @click.stop="handleView(data.PageList)">预览</div>
                                           <div v-show="node.level === 1" @click.stop="handleAdd(node, data)">新增</div>
                                           <div  @click.stop="handleUpdateName(node, data)">修改名称</div>
                                           <div v-show="node.level === 2"  @click.stop="handleUpdateState(node, data)">{{data.State ? "下架" : "上架"}}</div>
                                           <div  v-show="node.level === 1" @click.stop="handlePaste(data)">粘贴页</div>
                                           <div  v-show="node.level === 2" @click.stop="handleCopy(node, data)">复制页</div>
                                           <div @click.stop="handleDel(node, data)">删除</div>
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
            <win-card-edit ref="editRef" :pageValue="pageValue" :isSetCache="isSetCache" :allPageList="allPageList"></win-card-edit>
        </div>
    </div>

    <!--预览界面-->
    <win-card-view ref="winCardViewRef" v-if= winScreenView :pageList="pageList" @stopGetAllPageList="stopGetAllPageList"></win-card-view>

    <!-- 新增卡弹框-->
    <add-card-dialog v-model:dialogVisible = "dialogVisibleCard" @handleAddCard="handleAddCard"></add-card-dialog>

    <!-- 新增页弹框-->
    <add-page-dialog v-model:dialogVisible = "dialogVisible" @addPage="addPage" ></add-page-dialog>

    <!-- 修改名称弹框-->
    <update-name-card-or-page v-model:dialogVisible = "dialogVisibleName"
                              :currentValue="currentValue"
                              @updateName="updateName"
    ></update-name-card-or-page>
</template>

<script lang="ts">
import { onMounted, onUnmounted, defineComponent, toRefs, ref } from "vue";
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
        const {
            state, allPageList, cardsValue, defaultProps, pageValue, isSetCache, _getSubjectPublisherBookList, _getWindowCards,
            _deleteCardOrPage, _addPage, _renameCardOrPage,
            _setCardOrPageState, _addCard, _copyPage, dragDealData
        } = useSelectBookInfo();
        const handleNodeClick = (data :IPageValue, Node: Node) => {
            if (editRef.value.getDataIsChange()) {
                ElMessageBox.confirm("尚未保存修改, 是否继续操作?", "提示",
                    {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    if (Node.level === 1) {
                        cardsValue.value = data;
                        pageValue.value = { ID: "", Type: 11 };
                    } else if (Node.level === 2) {
                        pageValue.value = data;
                        cardsValue.value = { ID: "" };
                    }
                }).catch((err) => {
                    return err;
                });
            } else {
                if (Node.level === 1) {
                    cardsValue.value = data;
                    pageValue.value = { ID: "", Type: 11 };
                } else if (Node.level === 2) {
                    pageValue.value = data;
                    cardsValue.value = { ID: "" };
                }
            }
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
            _addCard({ WindowID: route.params.winValue as string, Sort: 0, Name: name });
            dialogVisibleCard.value = false;
        };

        const handleDel = (node:Node, data:ICardList) => {
            // 删除的是卡 判断当前页是否在删除卡下
            if (node.level === 1 && pageValue.value.ID) {
                const flag = data.PageList.find(item => item.ID === pageValue.value.ID);
                if (flag) {
                    cardsValue.value = data;
                }
            }
            _deleteCardOrPage(data.ID, { TeachPageRelationID: data.TeachPageRelationID });
        };

        let copyValue = {
            OldCardID: "",
            PageID: ""
        };
        const handleCopy = (node:Node, data:ICardList) => {
            copyValue = {
                OldCardID: node.parent.data.ID,
                PageID: data.ID
            };
            if (copyValue.OldCardID && copyValue.PageID) {
                ElMessage({ type: "success", message: "复制页成功" });
            }
        };

        const handlePaste = (data:ICardList) => {
            if (copyValue.OldCardID && copyValue.PageID) {
                const value = {
                    ...copyValue,
                    CardID: data.ID
                };
                _copyPage(value);
            } else {
                ElMessage({ type: "warning", message: "请先复制的卡" });
            }
        };

        const currentValue = ref();
        const handleAdd = (node:Node, data:ICardList) => {
            shrinkRef.value.click();
            dialogVisible.value = true;
            currentValue.value = data;
        };

        const pageList = ref();
        // 预览
        const handleView = async (data:IPageValue[]) => {
            // 预览只支持 已上架数据
            pageList.value = data.filter((item: IPageValue) => item.State);
            if (pageList.value.length > 0) {
                if ((window as any).electron && !(window as any).electron.isFullScreen() && !(window as any).electron.isMac()) {
                    (window as any).electron.setFullScreen();
                    await sleep(300);
                }
                winScreenView.value = true;
                enterFullscreen();
            } else {
                ElMessage({ type: "warning", message: "请先添加页，在进行预览" });
            }
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
                Type: data.value
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
        const winCardViewRef = ref();
        onMounted(() => {
            _getWindowCards({ WindowID: route.params.winValue as string, OriginType: 1 }, true);
            document.addEventListener("keydown", keyDown);
            if (isElectron()) {
                (window as any).electron.registerEscKeyUp(() => {
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
            document.removeEventListener("keydown", keyDown);
        });
        const shrinkRef = ref();
        return {
            editRef,
            shrinkRef,
            winCardViewRef,
            ...toRefs(state),
            winValue,
            allPageList,
            isSetCache,
            defaultProps,
            pageValue,
            currentValue,
            pageList,
            showCollapse,
            dialogVisible,
            dialogVisibleCard,
            dialogVisibleName,
            tooltipShow,
            winScreenView,
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
            _getWindowCards
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
    }

    .right {
        flex: 1;
        padding: 0px 10px;
        height: 100%;
        background-color: #fff;
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
