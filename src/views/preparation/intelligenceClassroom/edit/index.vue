<template>
    <div class="container">
        <div class="top">
            <div class="handles">
                <div class="btn" @click="handleSave">
                    <img src="@/assets/edit/icon_save.png" alt=""/>
                    保存
                </div>
                <div class="btn preview" @click="handleView(allPageList, 'active')">
                    <img src="@/assets/edit/icon_start1.png" alt=""/>
                    从当前开始
                </div>
                <div class="btn" @click="handleView(allPageList, 'first')">
                    <img src="@/assets/edit/icon_start2.png" alt=""/>
                    从头开始
                </div>
                <div class="btn" @click="importPPT">
                    <img src="@/assets/edit/icon_export.png" alt=""/>
                    导入ppt
                </div>
                <div class="btn" @click="handleOpenLessonDesign">
                    <img src="@/assets/edit/icon_design.png" alt=""/>
                    教案设计
                </div>
            </div>
            <div class="help" @click="handleHelper">
                <img src="@/assets/edit/icon_help.png" alt=""/>
                帮助
            </div>
        </div>
        <div class="wrapper">
            <div class="left" :class="{collapse:!showCollapse}">
                <div class="placeholder"/>
                <div class="card">
                    <el-tree
                        draggable
                        node-key="ID"
                        default-expand-all
                        :props="defaultProps"
                        :data="newWindowCards"
                        :allow-drop="allowDrop"
                        :highlight-current="false"
                        @node-drop="handleNodedrop"
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick"
                        :class="viewTree ? 'view-tree-box' : 'tree-box'"
                    >
                        <template #default="{ node, data }">
                            <div :class="['custom-tree-node', pageValue.ID === data.ID ? 'active-text': '']">
                                <div class="label-class" @mouseenter="mouseenter($event, node.label)" @mouseleave="mouseleave">
                                    <span v-if="!viewTree" :style="{ color:!data.State && node.level === 2? '#c0c4cc' : pageValue.ID === data.ID ? '#409Eff': '#333'}">
                                        {{ node.label }}
                                    </span>
                                    <div v-else>
                                        <span v-if="node.level === 1">{{ node.label }}</span>
                                        <div v-else v-contextmenu="(el: any) => contextmenus(el, data)">
                                            <div class="select-page">
                                                <span class="chapter-num">{{ data.count }}</span>
                                            </div>
                                            <div class="status" :style="{background: data.State ? '#5CD494' : '#90949E'}"></div>
                                            <!-- 游戏页或者教具页显示封面图 -->
                                            <el-image v-if="(data.Type === 20 || data.Type === 16) && data.url" :src="data.url" fit="cover">
                                                <template #error>
                                                    <div class="image-slot">加载失败...</div>
                                                </template>
                                            </el-image>
                                            <template v-else>
                                                <ThumbnailSlide
                                                    :size="190"
                                                    style="border: 1px solid #ebeff1"
                                                    :slide=" allPageListMap.get(data.ID ) || {}"
                                                    v-if="data.Type ===pageType.element ||data.Type === pageType.listen"
                                                />
                                                <div class="view-empty" v-else>{{ data.Name }}</div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="icon-box">
                                    <el-popover placement="right-start" :width="50" trigger="focus">
                                        <template #reference>
                                            <el-button size="small" @click.stop>
                                                <el-icon :size="18">
                                                    <more-filled/>
                                                </el-icon>
                                            </el-button>
                                        </template>
                                        <div class="operation-box">
                                            <div v-show="node.level === 1" @click.stop="dialogVisibleCard = true">新增文件夹</div>
                                            <div v-show="node.level === 1" @click.stop="handleAddBlank(node,data)">新增空白页</div>
                                            <div @click.stop="handleUpdateName(node, data)">重命名</div>
                                            <div v-show="node.level === 2" @click.stop="handleUpdateState(node, data)">
                                                {{ data.State ? "隐藏" : "显示" }}
                                            </div>
                                            <div v-show="node.level === 1" @click.stop="handlePaste(data)">粘贴页</div>
                                            <!--游戏页暂不支持复制-->
                                            <div v-show="node.level === 2 && data.Type !== 20" @click.stop="handleCopy(node, data)">复制页</div>
                                            <div @click.stop="handleDel(node, data) ">删除</div>
                                        </div>
                                    </el-popover>
                                </div>
                                <div class="icon-add" v-if="node.level === 2">
                                    <el-popover placement="right-start" :width="50" trigger="focus">
                                        <template #reference>
                                            <el-button size="small" @click.stop>
                                                <img src="@/assets/edit/icon_add_hover.png" alt="" class="add"/>
                                            </el-button>
                                        </template>
                                        <div class="operation-box">
                                            <div @click.stop="handleAddBlank(node,data)">新增空白页</div>
                                            <div @click.stop="handleAddInteraction(node, data)">新增互动页</div>
                                        </div>
                                    </el-popover>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                    <div class="page-intro">
                        当前页{{ currentActivePage || 1 }}/{{ pptCount }}
                    </div>
                </div>

                <div class="shrink" ref="shrinkRef">
                    <div @click="handleCollapse">
                        <el-icon :style="{ transform:'rotate(' + (showCollapse ? 0 : 180) + 'deg)'}">
                            <ArrowLeft/>
                        </el-icon>
                    </div>
                </div>
            </div>
            <div class="right" :class="{collapse:!showCollapse}">
                <win-card-edit
                    ref="editRef"
                    @onSave="onSave"
                    :slide="{ ...currentSlide }"
                    :winId="windowInfo?.id"
                    @updateMaterial="updateMaterial"
                    @updatePageSlide="updatePageSlide"
                    :allPageSlideListMap="allPageListMap"
                    :subjectID="subjectPublisherBookValue?.SubjectId || ''"
                    @updateAllPageSlideListMap="updateAllPageSlideListMap"
                />
            </div>
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
        v-if="winScreenView"
        @offScreen="offScreen"
        :pageList="previewPageList"
        :activePageIndex="activePreviewPageIndex"
    />

    <!-- 新增卡弹框-->
    <add-card-dialog v-model:dialogVisible="dialogVisibleCard" @handleAddCard="handleAddCard"/>

    <!-- 新增页弹框-->
    <add-page-dialog v-if="dialogVisible" v-model:dialogVisible="dialogVisible" @addPage="addPage"/>

    <!-- 修改名称弹框-->
    <update-name-card-or-page v-model:dialogVisible="dialogVisibleName" :currentValue="currentValue" @updateName="updateName"/>

    <!-- 保存模板弹框-->
    <save-template-dialog
        v-if="dialogVisibleTemplate"
        v-model:dialogVisible="dialogVisibleTemplate"
        :showTemplateType="showTemplateType"
        @handleAddTemplate="handleAddTemplate"
        :subjectID="subjectPublisherBookValue?.SubjectId || ''"
        :lessonId="windowInfo?.lessonId || ''"
        @cacleTemplateDialog="cacleTemplateDialog"
        :dialogStatus="dialogStatus"
        :selectPageData="selectPageData"
    />

    <!-- 资源库 -->
    <materialCenter
        ref="materialCenterRef"
        @insertData="handleInsertData"
        @insertTools="handleInsertTool"
        @editTemplate="editTemplate"
        :subjectID="subjectPublisherBookValue?.SubjectId || ''"
        :lessonId="windowInfo?.lessonId || ''"
    />

    <!-- 查看我的模板：老师才有，教研没有 -->
    <div v-if="isshowCusTooltip" class="cus-open-tooltip">
        前往<span @click="gotoMyTemplate">「我的」</span>查看已保存模板
    </div>
</template>

<script lang="ts">
import WinCardEdit from "../components/edit/winCardEdit.vue";
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, toRef, toRefs, watch } from "vue";
import useTooltipShow from "@/views/preparation/intelligenceClassroom/edit/hooks/useTooltipShow";
import useSelectBookInfo from "@/hooks/useSelectBookInfo";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";
import usePreview from "@/views/preparation/intelligenceClassroom/edit/hooks/usePreview";
import useCopyPage from "@/views/preparation/intelligenceClassroom/edit/hooks/useCopyPage";
import useSelectPage from "@/views/preparation/intelligenceClassroom/edit/hooks/useSelectPage";
import useDragPage from "@/views/preparation/intelligenceClassroom/edit/hooks/useDragPage";
import useAddPage from "@/views/preparation/intelligenceClassroom/edit/hooks/useAddPage";
import useUpdateName from "@/views/preparation/intelligenceClassroom/edit/hooks/useUpdateName";
import { onBeforeRouteLeave } from "vue-router";
import { MutationTypes, store } from "@/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import useAddCard from "@/views/preparation/intelligenceClassroom/edit/hooks/useAddCard";
import Node from "element-plus/es/components/tree/src/model/node";
import { ICardList, IPageValue } from "@/types/home";
import { ElMessage, ElMessageBox } from "element-plus";
import { cloneDeep, find, isEqual, pullAllBy } from "lodash";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import { saveWindows } from "@/views/preparation/intelligenceClassroom/api";
import useImportPPT from "@/hooks/useImportPPT";
import { v4 as uuidv4 } from "uuid";
import { pageType, pageTypeList } from "@/config";
import { Slide } from "wincard";
import { isFullscreen } from "@/utils/fullscreen";
import exitDialog, { ExitType } from "@/views/preparation/intelligenceClassroom/edit/exitDialog";
import AddCardDialog from "@/views/preparation/intelligenceClassroom/components/edit/addCardDialog.vue";
import WinCardView from "@/views/preparation/intelligenceClassroom/components/edit/winScreenView.vue";
import UpdateNameCardOrPage from "@/views/preparation/intelligenceClassroom/components/edit/updateNameCardOrPage.vue";
import AddPageDialog from "@/views/preparation/intelligenceClassroom/components/edit/addPageDialog.vue";
import { MoreFilled } from "@element-plus/icons-vue";
import materialCenter from "@/views/preparation/intelligenceClassroom/components/edit/materialCenter/index.vue";
import SaveTemplateDialog from "@/views/preparation/intelligenceClassroom/components/edit/saveTemplateDialog.vue";

export default defineComponent({
    name: "Edit",
    components: {
        WinCardEdit,
        AddCardDialog,
        WinCardView,
        UpdateNameCardOrPage,
        AddPageDialog,
        MoreFilled,
        materialCenter,
        SaveTemplateDialog
    },
    setup() {
        const pptCount = ref(0); // ppt总页数
        const newWindowCards = ref([]);
        const materialCenterRef = ref(); // 资源库组件实例
        const isshowCusTooltip = ref(false); // 展示查看已保存模板提示框

        const showCollapse = ref(true);
        const shrinkRef = ref();
        const viewTree = ref(true);

        const { tooltipShow, mouseenter, mouseleave } = useTooltipShow();
        const { state, defaultProps, pageValue, _getWindowCards, insertData } =
            useSelectBookInfo();
        const windowCards = toRef(state, "windowCards");
        const oldWindowCards = toRef(state, "oldWindowCards");

        const allPageListMap = toRef(state, "allPageListMap");
        const oldAllPageListMap = toRef(state, "oldAllPageListMap");

        const {
            selectPageData,
            handleSelectPages,
            dialogVisibleTemplate,
            showTemplateType,
            handleSaveTemplate,
            saveTemplateFrom,
            editTemplate,
            dialogStatus,
            templateFormData,
            formateOssUrl
        } = useSaveTemplate(allPageListMap);

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
            allPageListMap
        );

        const {
            handleNodeClick,
            currentActivePage,
            selectPageValue,
            editRef,
            activeAllPageListIndex,
            allPageList,
            isWatchChange,
            cardListRef
        } = useSelectPage(pageValue, allPageListMap);

        const { allowDrop } = useDragPage();

        const { handleAdd, addPageCallback, dialogVisible, assignmentCurrentValue } = useAddPage(
            shrinkRef,
            windowCards,
            allPageListMap
        );

        const { dialogVisibleName, currentValue, handleUpdateName, updateName } = useUpdateName(shrinkRef);

        const windowInfo: any = computed(() =>
            store.state.preparation.editWindowInfo.id
                ? store.state.preparation.editWindowInfo
                : get(STORAGE_TYPES.WINDOW_INFO)
        );
        const subjectPublisherBookValue = computed(() =>
            store.state.preparation.editWindowInfo.id
                ? store.state.preparation.subjectPublisherBookValue
                : get(STORAGE_TYPES.SUBJECT_BOOK_INFO)
        );

        const { handleAddCard, dialogVisibleCard } = useAddCard(
            windowCards,
            windowInfo
        );

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
                        "删除卡或页",
                        "",
                        "",
                        store.state.userInfo.schoolId
                    );
                })
                .catch((err) => {
                    return err;
                });
        };

        const handleUpdateState = (node: Node, data: IPageValue) => {
            data.State = !data.State;
        };

        const onSave = async () => {
            // if (!isLoadEnd.value) {
            //     return ElMessage.warning("资源正在加载，请稍后再试...");
            // }
            // return
            // 2023-02-03 原 WindowCards 修改为newWindowCards
            const cardData = newWindowCards.value.map(
                (card: any, index: number) => {
                    const cardID = card.isAdd ? "" : card.ID;
                    const cardName = card.Name;
                    const sort = index + 1;
                    const pageList = card.PageList;
                    const pageData = pageList.map(
                        (page: any, pageIndex: number) => {
                            const { ID, Name, Type, State, isAdd } = page;
                            const slide = allPageListMap.value.get(ID);
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
                                                PageWordID: word.pageWordID ? null : word.pageWordID,
                                                WordInterval: 2
                                            };
                                        }
                                    );
                                    json = JSON.stringify(Words);
                                } else if (slide.type === "follow") {
                                    json = slide.follow?.id || "";
                                } else if (slide.type === "teach") {
                                    json = slide.teach?.id || "";
                                } else if (slide.type === "game") {
                                    json = slide.game?.id || "";
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
                        }
                    );

                    return {
                        cardID,
                        sort,
                        pageData,
                        cardName
                    };
                }
            );

            const data = {
                franchiseeID: store.state.userInfo.schoolId,
                teacherID: store.state.userInfo.id,
                cardData,
                originType: 1,
                windowName: windowInfo.value.name,
                windowID: windowInfo.value.id
            };

            const lessonId = (windowInfo.value.lessonId as string) || "";
            const message = "保存成功";

            const res = await saveWindows(data);
            if (res.resultCode === 200) {
                ElMessage.success({
                    message,
                    duration: 2000
                });
                store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, {
                    ...windowInfo.value
                });
                allPageListMap.value.forEach((item, key) => {
                    oldAllPageListMap.value.set(key, cloneDeep(item));
                });
                oldWindowCards.value = cloneDeep(windowCards.value);
                return true;
            } else {
                return false;
            }
        };

        watch(
            () => state.windowCards,
            async () => {
                allPageList.value = getAllPageList();
                if (state.windowCards.length > 0) {
                    // 过滤教具页和游戏页的封面
                    await formataWindowCards(
                        state.windowCards,
                        allPageList.value
                    );
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
                        const obj = { ...pageValue.value };
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
        // 过滤教具页和游戏页的封面
        const formataWindowCards = async (arr: any, mapList?: any) => {
            newWindowCards.value = JSON.parse(JSON.stringify(arr));
            newWindowCards.value.forEach((item: any, idx: number) => {
                item.num = Number(idx + 1);
                item.PageList?.forEach(
                    async (page: IPageValue, cidx: number) => {
                        if (page) {
                            page.ParentNum = item.num;
                            // page.ParentID = item.ID;
                            page.Json =
                                page.Json && typeof page.Json === "string"
                                    ? JSON.parse(page.Json)
                                    : page.Json;
                            // const newSlide: Slide = await transformPageDetail(page, page.Json);
                            if (page.Type === 20 || page.Type === 16) {
                                const temJson: any = page.Json;
                                if (page.url) return;
                                page.url = temJson?.ToolFileModel
                                    ? await formateOssUrl(
                                        temJson?.ToolFileModel?.File
                                    )
                                    : "";
                            }
                        }
                    }
                );
            });
            newWindowCards.value = [...newWindowCards.value];
            flatAndRebuild();
        };
        const handleNodedrop = () => {
            flatAndRebuild();
        };
        /**
         * 构造排序
         */
        const flatAndRebuild = () => {
            newWindowCards.value.forEach((mitem: any) => {
                mitem.PageList?.forEach(
                    async (page: IPageValue, cidx: number) => {
                        page.ParentID = mitem.ID;
                    }
                );
            });
            let arr = [] as any[];
            for (const s in newWindowCards.value) {
                const idx = Number(s);
                const item = newWindowCards.value[idx] as any;
                arr = arr.concat(item.PageList);
            }
            pptCount.value = arr.length;

            arr.forEach((ele: any, i: number) => {
                ele.count = i + 1;
            });

            setTimeout(() => {
                newWindowCards.value.forEach((nitem: any) => {
                    nitem.PageList = arr.filter((m) => m.ParentID === nitem.ID);
                });
            }, 10);
        };
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
        // 保存完组件后刷新素材列表
        const updateMaterial = () => {
            nextTick(() => {
                materialCenterRef.value.updateMaterialList();
            });
        };

        const { importByElectron, uploadFileName, loading, parsePptPage, pptPages, percentage } = useImportPPT();

        const importPPT = () => {
            importByElectron((result) => {
                const name = uploadFileName.value.split("\\");
                const pageList = result.slides.map((item, index) => {
                    const id = uuidv4();
                    allPageListMap.value.set(id, item);
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
            allPageListMap.value.set(pageValue.value.ID, slide);
        };

        // 同步教案的数据
        const updateAllPageSlideListMap = (newAllPageList: any[]) => {
            newAllPageList.forEach((item: any) => {
                const value = allPageListMap.value.get(item.TeachPageID);
                const newValue = {
                    ...value,
                    remark: item.AcademicPresupposition || "",
                    design: item.DesignIntent || ""
                };
                allPageListMap.value.set(item.TeachPageID, newValue as Slide);
                oldAllPageListMap.value.set(
                    item.TeachPageID,
                    cloneDeep(newValue as Slide)
                );
            });
        };

        const winCardViewRef = ref();
        onMounted(() => {
            _getWindowCards({
                WindowID: windowInfo.value.id,
                OriginType: windowInfo.value.originType
            }).then(() => {
                // fetchAllPageSlide(getAllPageList());
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
            // if (isElectron()) {
            //     (window as any).electron.unRegisterEscKeyUp();
            // }
        });

        onBeforeRouteLeave(async () => {
            // 先更新一下当前页
            const slide = editRef.value.getCurrentSlide();
            allPageListMap.value.set(pageValue.value.ID, slide);
            if (
                isEqual(allPageListMap.value, oldAllPageListMap.value) &&
                isEqual(windowCards.value, oldWindowCards.value)
            ) {
                return true;
            }
            const res = await exitDialog();
            if (res === ExitType.Cancel) {
                return false;
            }
            if (res === ExitType.Save) {
                if (windowInfo.value.originType === 0) {
                    return false;
                } else {
                    await onSave();
                }
            }
        });

        // 子窗体关闭 提示
        const closeCurrentWinCard = async () => {
            // 先更新一下当前页
            const slide = editRef.value.getCurrentSlide();
            allPageListMap.value.set(pageValue.value.ID, slide);

            if (
                isEqual(allPageListMap.value, oldAllPageListMap.value) &&
                isEqual(windowCards.value, oldWindowCards.value)
            ) {
                return "nosave";
            }

            const res = await exitDialog();
            if (res === ExitType.Cancel) {
                return "cancel";
            }
            if (res === ExitType.Exit) {
                return "exit";
            }
            if (res === ExitType.Save) {
                if (windowInfo.value.originType === 0) {
                    return false;
                } else {
                    return (await onSave()) ? "save" : false;
                }
            }
        };

        // 资源库-模板素材操作
        // 插入左侧窗卡页
        const handleInsertData = async (data: any) => {
            const jsonData = JSON.parse(JSON.stringify(data));
            if (editRef.value.getDataIsChange() && data.type === "elements") {
                const slide = editRef.value.getCurrentSlide();
                state.allPageListMap.set(pageValue.value.ID, slide);
            }
            const res: any = await insertData(jsonData);
            if (jsonData.type === "elements") return;
            // if (res[0]) {
            //     pageValue.value = res[1][0];
            //     selectPageValue(pageValue.value, false);
            await nextTick(() => {
                materialCenterRef.value.addLinkCount(
                    jsonData.teachPageTemplateID || ""
                );
            });
            // }
        };
        // 插入教具内容以及教具页
        const handleInsertTool = async (data: any) => {
            if (pageValue.value.ID) {
                const params = {
                    name: "教具页",
                    type: "teach",
                    value: 16,
                    url: data.data?.url
                };
                state.windowCards.forEach((item: any, windex: number) => {
                    item.PageList.forEach((page: any, index: number) => {
                        if (page.ID === pageValue.value.ID) {
                            currentValue.value = item;
                        }
                    });
                });
                await addPageCallback(params, currentValue.value);
                pageValue.value =
                    currentValue.value.PageList[currentValue.value.PageList?.length - 1];
                const res: any = await insertData(data);
            } else {
                ElMessage.warning("请先选择页，再进行插入");
            }
        };
        // 保存模板
        const handleAddTemplate = async (formData: any) => {
            // onSave();
            const res: any = await saveTemplateFrom(formData);
            if (res) {
                dialogVisibleTemplate.value = false;
                isshowCusTooltip.value = true;
                setTimeout(() => {
                    isshowCusTooltip.value = false;
                }, 5000);
                // 弹窗关闭，页面中间跳出提示：前往 我的 查看已保存模板保留三秒消失
                nextTick(() => {
                    materialCenterRef.value.queryTemplateList();
                });
            }
        };
        // 去我的模板
        const gotoMyTemplate = () => {
            nextTick(() => {
                materialCenterRef.value.gotoMyTemplate();
            });
        };
        // 取消保存-清空已选中的页
        const cacleTemplateDialog = () => {
            selectPageData.value = [];
        };
        const addPage = async (data: any) => {
            const res = await addPageCallback(data);
            if (res) {
                // pageValue.value = res;
                selectPageValue(res, false);
            }
        };
        const rightClick = () => {
            const slide = editRef.value.getCurrentSlide();
            state.allPageListMap.set(pageValue.value.ID, slide);
        };
        // 窗卡页 右键-menu菜单
        const contextmenus = (el: any, data: any) => {
            return [
                {
                    text: "保存模板",
                    subText: "",
                    handler: () => {
                        rightClick();
                        handleSaveTemplate(1, data);
                    }
                }
            ];
        };

        const handleSave = () => {
            if (!editRef.value) return;
            editRef.value.handleSave();
        };

        const handleOpenLessonDesign = () => {
            if (!editRef.value) return;
            editRef.value.openLessonDesign();
        };
        const handleHelper = () => {
            if (!editRef.value) return;
            editRef.value.handleHelper();
        };

        const handleCollapse = (e: Event) => {
            e.stopPropagation();
            showCollapse.value = !showCollapse.value;
        };

        const handleAddBlank = (node: Node, data: ICardList) => {
            if (node.level === 1) {
                assignmentCurrentValue(data);
            } else {
                assignmentCurrentValue(newWindowCards.value.find((item: any) => item.ID === data.ParentID));
            }

            addPage(pageTypeList[0]);
        };

        const handleAddInteraction = (node: Node, data: ICardList) => {
            if (node.level === 1) {
                handleAdd(node, data);
            } else {
                handleAdd(node, newWindowCards.value.find((item: any) => item.ID === data.ParentID));
            }
        };

        return {
            pptCount,
            currentActivePage,
            newWindowCards,
            viewTree,
            editRef,
            shrinkRef,
            winCardViewRef,
            cardListRef,
            ...toRefs(state),
            allPageList,
            // isSetCache,
            defaultProps,
            pageValue,
            pageType,
            currentValue,
            previewPageList,
            activePreviewPageIndex,
            showCollapse,
            dialogVisible,
            dialogVisibleCard,
            dialogVisibleName,
            winScreenView,
            isWatchChange,
            tooltipShow,
            mouseenter,
            mouseleave,
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
            _getWindowCards,
            offScreen,
            handleMask,
            currentSlide: computed(
                () => allPageListMap.value.get(pageValue.value.ID) || {}
            ),
            windowInfo,
            importPPT,
            selectPageData,
            contextmenus,
            handleSelectPages,
            handleInsertData,
            dialogVisibleTemplate,
            showTemplateType,
            handleSaveTemplate,
            saveTemplateFrom,
            materialCenterRef,
            editTemplate,
            dialogStatus,
            templateFormData,
            handleAddTemplate,
            cacleTemplateDialog,
            subjectPublisherBookValue,
            isshowCusTooltip,
            gotoMyTemplate,
            handleInsertTool,
            updateMaterial,
            addPage,
            rightClick,
            closeCurrentWinCard,
            handleNodedrop,
            handleSave,
            handleOpenLessonDesign,
            handleHelper,
            handleCollapse,
            pageTypeList,
            handleAddBlank,
            handleAddInteraction
        };
    }
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
}

.top {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .handles {
        margin-left: 24px;
        display: flex;

        .btn {
            margin-right: 49px;
            display: flex;
            align-items: center;
            position: relative;
            cursor: pointer;
            font-size: 14px;

            &.preview {
                margin-right: 24px !important;

                &:after {
                    display: none;
                }
            }

            &:last-child:after {
                display: none;
            }

            &:after {
                position: absolute;
                content: '';
                display: block;
                width: 1px;
                height: 16px;
                background: #EBEFF1;
                right: -24px;
            }
        }
    }

    .help {
        margin-right: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    img {
        height: 16px;
        margin-right: 4px;
    }
}

.wrapper {
    height: calc(100% - 56px);
    display: flex;

    .left {
        width: 280px;
        height: 100%;
        position: relative;
        transition: all 0.5s;

        &.collapse {
            width: 0;
        }

        .placeholder {
            height: 56px;
            box-shadow: inset 0px -1px 0px 0px #EBEFF1;
        }

        .shrink {
            position: absolute;
            width: 12px;
            height: 64px;
            border-radius: 6px;
            top: 50%;
            margin-top: -32px;
            right: -6px;
            z-index: 999;
            cursor: pointer;
            overflow: hidden;

            & > div {
                background: #414E65;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                width: 100%;
                height: 100%;
            }
        }

        .card {
            height: calc(100% - 56px);

            :deep(.el-tree) {
                height: calc(100% - 40px);
                overflow-y: auto;
                overflow-x: hidden;

                .el-tree-node:focus > .el-tree-node__content {
                    background-color: transparent;
                }

                .el-tree-node > .el-tree-node__content {
                    height: 44px;
                }

                .el-tree-node__children .el-tree-node__content {
                    height: auto;
                    padding: 10px 0 !important;
                    margin-bottom: 10px;

                    &:hover {
                        background-color: rgba(46, 149, 255, 0.1);
                    }
                }

                .el-tree-node__children .label-class {
                    margin-left: 15px;
                }

                .el-tree-node__children .is-current {
                    background-color: rgba(46, 149, 255, 0.1);
                }

                .el-tree-node__children .icon-box {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }

                .select-page {
                    position: absolute;
                    left: -12px;
                    top: -8px;
                    cursor: pointer;
                    z-index: 2;
                    display: flex;
                    align-items: center;

                    .el-icon {
                        width: 16px;
                        height: 16px;
                        border: 1px solid var(--el-color-primary);
                        border-radius: 50%;
                    }
                }

                .status {
                    position: absolute;
                    right: -12px;
                    top: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    z-index: 2;
                }

                .el-image {
                    height: 106px;
                    width: 100%;

                    .image-slot {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        background: var(--el-fill-color-light);
                        color: var(--el-text-color-secondary);
                        font-size: 20px;
                    }
                }

                .view-empty {
                    width: 190px;
                    height: 106px;
                    padding: 10px;
                    border: 1px solid #ebeff1;
                }

                .custom-tree-node {
                    display: flex;
                    justify-content: space-between;
                    height: 100%;
                    align-items: center;
                    width: 86%;
                    position: relative;

                    .chapter-num {
                        display: block;
                        margin-right: 13px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                    }
                }

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

                .icon-add {
                    position: absolute;
                    bottom: -3px;
                    right: 36px;

                    .add {
                        width: 32px;
                        height: 32px;
                    }
                }
            }
        }

        .tree-box {
            :deep(.el-tree-node__content) {
                height: 46px;
            }

            .custom-tree-node {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 80%;
                margin-left: 5px;
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

        .page-intro {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 13px;
            padding-right: 12px;
            box-sizing: border-box;
            color: #333;
            text-align: right;
        }
    }

    .right {
        width: calc(100% - 280px);
        transition: all 0.5s;

        &.collapse {
            width: 100%;
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

.cus-open-tooltip {
    z-index: 9999;
    position: absolute;
    width: 15%;
    padding: 10px;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 14px;
    background: rgba(77, 77, 77, 0.67);

    span {
        cursor: pointer;
    }

    span:hover {
        color: #409eff;
    }
}
</style>
