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
                                size="default"
                                type="primary"
                                plain
                                >新增卡</el-button
                            >
                        </el-col>
                        <el-col :span="8">
                            <el-button
                                class="add-card"
                                @click="importPPT()"
                                size="default"
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
                                        size="default"
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
                        :class="viewTree ? 'view-tree-box' : 'tree-box'"
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
                                <div
                                    class="label-class"
                                    @mouseenter="mouseenter($event, node.label)"
                                    @mouseleave="mouseleave"
                                >
                                    <span
                                        v-if="!viewTree"
                                        :style="{
                                            color:
                                                !data.State && node.level === 2
                                                    ? '#c0c4cc'
                                                    : pageValue.ID === data.ID
                                                    ? '#409Eff'
                                                    : '#333',
                                        }"
                                    >
                                        {{ node.label }}
                                    </span>

                                    <div v-else>
                                        <span v-if="node.level === 1">{{
                                            node.label
                                        }}</span>
                                        <div
                                            v-else
                                            v-contextmenu="(el: any) => contextmenus(el, data)"
                                        >
                                            <div
                                                @click.stop="
                                                    handleSelectPages(data)
                                                "
                                                :style="{ backgroundColor: (selectPageData.map(((item: any) => item.ID)).includes(data.ID) ? 'var(--el-color-primary)' : '#fff') }"
                                                class="select-page"
                                            >
                                                <el-icon color="#fff">
                                                    <Check />
                                                </el-icon>
                                            </div>
                                            <div
                                                class="status"
                                                :style="{
                                                    background: data.State
                                                        ? '#5CD494'
                                                        : '#90949E',
                                                }"
                                            ></div>
                                            <ThumbnailSlide
                                                v-if="
                                                    data.Type ===
                                                        pageType.element ||
                                                    data.Type ===
                                                        pageType.listen
                                                "
                                                :slide="
                                                    allPageListMap.get(
                                                        data.ID
                                                    ) || {}
                                                "
                                                :size="190"
                                                style="
                                                    border: 1px solid #ebeff1;
                                                "
                                            ></ThumbnailSlide>
                                            <div class="view-empty" v-else>
                                                {{ data.Name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="icon-box">
                                    <el-popover
                                        placement="right-start"
                                        :width="50"
                                        trigger="focus"
                                    >
                                        <template #reference>
                                            <el-button size="small" @click.stop>
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
                                            <!--游戏页暂不支持复制-->
                                            <div
                                                v-show="
                                                    node.level === 2 &&
                                                    data.Type !== 20
                                                "
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
                    <el-icon
                        :style="{
                            transform:
                                'rotate(' + (showCollapse ? 0 : 180) + 'deg)',
                        }"
                        ><ArrowLeft
                    /></el-icon>
                </div>
            </div>
        </div>
        <div class="right">
            <win-card-edit
                ref="editRef"
                :slide="{ ...currentSlide }"
                :allPageSlideListMap="allPageListMap"
                @onSave="onSave"
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
    >
    </save-template-dialog>
    <!-- 资源库 -->
    <materialCenter
        ref="materialCenterRef"
        @insertData="handleInsertData"
        @insertTools="handleInsertTool"
        @editTemplate="editTemplate"
        :subjectID="subjectPublisherBookValue?.SubjectId || ''"
        :lessonId="windowInfo?.lessonId || ''"
    ></materialCenter>
    <!-- 查看我的模板：老师才有，教研没有 -->
    <div v-if="isshowCusTooltip" class="cus-open-tooltip">
        前往<span @click="gotoMyTemplate">「我的」</span>查看已保存模板
    </div>
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
    computed,
    nextTick,
} from "vue";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import { IPageValue, ICardList } from "@/types/home";
import Node from "element-plus/es/components/tree/src/model/node";
import useSelectBookInfo from "@/hooks/useSelectBookInfo";
import { isFullscreen } from "@/utils/fullscreen";
import { MoreFilled } from "@element-plus/icons-vue";
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
import useSaveTemplate from "./hooks/useSaveTemplate";
// import useGetPageSlide from "./hooks/useGetPageSlide";
import isElectron from "is-electron";
import { Slide } from "wincard";
import { saveWindows, saveAsWindows } from "../api";
import { find, isEqual, pullAllBy, cloneDeep } from "lodash";
import emitter from "@/utils/mitt";
import exitDialog, { ExitType } from "./exitDialog";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useImportPPT from "@/hooks/useImportPPT";
import useTooltipShow from "./hooks/useTooltipShow";
import { v4 as uuidv4 } from "uuid";
import { pageType } from "@/config";
import { MutationTypes, store } from "@/store";
import SaveDialog from "../components/edit/saveDialog/saveDialog.vue";
import SaveAsDialog from "../components/edit/saveDialog/saveAsDialog.vue";
import materialCenter from "../components/edit/materialCenter/index.vue";
import SaveTemplateDialog from "../components/edit/saveTemplateDialog.vue";

export default defineComponent({
    components: {
        AddCardDialog,
        WinCardView,
        UpdateNameCardOrPage,
        AddPageDialog,
        WinCardEdit,
        MoreFilled,
        materialCenter,
        SaveTemplateDialog,
    },
    name: "Edit",
    setup() {
        const materialCenterRef = ref(); //资源库组件实例
        const isshowCusTooltip = ref(false); //展示查看已保存模板提示框

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

        // const {
        // fetchAllPageSlide,
        // allPageSlideListMap,
        // oldAllPageSlideListMap,
        // isLoadEnd,
        // resetPageSlide
        // } = useGetPageSlide(pageValue);

        const {
            selectPageData,
            contextmenus,
            handleSelectPages,
            dialogVisibleTemplate,
            showTemplateType,
            handleSaveTemplate,
            saveTemplateFrom,
            editTemplate,
            dialogStatus,
            templateFormData,
        } = useSaveTemplate(allPageListMap);

        const {
            previewPageList,
            handleView,
            winScreenView,
            keyDown,
            offScreen,
            activePreviewPageIndex,
        } = usePreview(pageValue);

        const { handleCopy, handlePaste, pastePage } = useCopyPage(
            windowCards,
            allPageListMap
        );

        const {
            handleNodeClick,
            selectPageValue,
            editRef,
            activeAllPageListIndex,
            allPageList,
            isWatchChange,
            cardListRef,
        } = useSelectPage(pageValue, allPageListMap);

        const { allowDrop } = useDragPage();

        const { handleAdd, addPageCallback, dialogVisible } = useAddPage(
            shrinkRef,
            windowCards,
            allPageListMap
        );

        const {
            dialogVisibleName,
            currentValue,
            handleUpdateName,
            updateName,
        } = useUpdateName(shrinkRef);

        const route = useRoute();
        const router = useRouter();
        const windowInfo = computed(
            () => store.state.preparation.editWindowInfo
        );
        const subjectPublisherBookValue = computed(
            () => store.state.preparation.subjectPublisherBookValue
        );
        // console.log(
        //     "windowInfo===================>",
        //     windowInfo,
        //     store.state.preparation.subjectPublisherBookValue
        // );

        const { handleAddCard, dialogVisibleCard } = useAddCard(
            windowCards,
            windowInfo
        );

        const handleDel = (node: Node, data: ICardList) => {
            ElMessageBox.confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
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
                                Type: 11,
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
                                Type: 11,
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
            const cardData = windowCards.value.map((card, index) => {
                const cardID = card.isAdd ? "" : card.ID;
                const cardName = card.Name;
                const sort = index + 1;
                const pageList = card.PageList;
                const pageData = pageList.map((page, pageIndex) => {
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
                                        PageWordID: word.pageWordID
                                            ? null
                                            : word.pageWordID,
                                        WordInterval: 2,
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
                        state: Number(State),
                    };
                });

                return {
                    cardID,
                    sort,
                    pageData,
                    cardName,
                };
            });

            const data = {
                franchiseeID: store.state.userInfo.schoolId,
                teacherID: store.state.userInfo.id,
                cardData,
                originType: 1,
                windowName: windowInfo.value.name,
                windowID: windowInfo.value.id,
            };

            const lessonId = (windowInfo.value.lessonId as string) || "";
            const message = "保存成功";

            const res = await saveWindows(data);
            if (res.resultCode === 200) {
                ElMessage.success({
                    message,
                    duration: 2000,
                });
                store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, {
                    ...windowInfo.value,
                });
                allPageListMap.value.forEach((item, key) => {
                    oldAllPageListMap.value.set(key, cloneDeep(item));
                });
                oldWindowCards.value = cloneDeep(windowCards.value);
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
                            ...pageValue.value,
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
                deep: true,
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
            percentage,
        } = useImportPPT();

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
                        State: true,
                    };
                });
                const card = {
                    Name: name[name.length - 1],
                    ID: uuidv4(),
                    Sort: windowCards.value.length,
                    isAdd: true,
                    PageList: pageList,
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
                    design: item.DesignIntent || "",
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
                OriginType: windowInfo.value.originType,
            }).then(() => {
                console.log("111111111111================");
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
            )
                return true;
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

        //资源库-模板素材操作
        //插入左侧窗卡页
        const handleInsertData = async (data: any) => {
            if (editRef.value.getDataIsChange() && data.type === "elements") {
                const slide = editRef.value.getCurrentSlide();
                // console.log('slde', slide);
                state.allPageListMap.set(pageValue.value.ID, slide);
            }
            const res: any = await insertData(data);
            if (res) {
                nextTick(() => {
                    materialCenterRef.value.addLinkCount(
                        data.teachPageTemplateID || ""
                    );
                });
            }
        };
        //插入教具内容以及教具页
        const handleInsertTool = async (data: any) => {
            if (pageValue.value.ID) {
                const params = {
                    name: "教具页",
                    type: "teach",
                    value: 16,
                };
                state.windowCards.forEach((item: any, windex: number) => {
                    item.PageList.forEach((page: any, index: number) => {
                        if (page.ID === pageValue.value.ID) {
                            currentValue.value = item;
                        }
                    });
                });
                await addPageCallback(params, currentValue.value);
                console.log("windowCards---", state.windowCards);

                pageValue.value =
                    currentValue.value.PageList[
                        currentValue.value.PageList?.length - 1
                    ];
                console.log("pageValue.value", pageValue.value);
                const res: any = await insertData(data);
            } else {
                ElMessage.warning("请先选择页，再进行插入");
                return;
            }
        };
        //保存模板
        const handleAddTemplate = async (formData: any) => {
            // onSave();
            const res: any = await saveTemplateFrom(formData);
            if (res) {
                dialogVisibleTemplate.value = false;
                isshowCusTooltip.value = true;
                setTimeout(() => {
                    isshowCusTooltip.value = false;
                }, 5000);
                //弹窗关闭，页面中间跳出提示：前往 我的 查看已保存模板保留三秒消失
                nextTick(() => {
                    materialCenterRef.value.queryTemplateList();
                });
            }
        };
        //去我的模板
        const gotoMyTemplate = () => {
            nextTick(() => {
                nextTick(() => {
                    materialCenterRef.value.handleClick(3);
                });
            });
        };
        //取消保存-清空已选中的页
        const cacleTemplateDialog = () => {
            selectPageData.value = [];
        };

        return {
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
            // allPageSlideListMap,
            // oldAllPageSlideListMap,
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
        };
    },
});
</script>

<style lang="scss" scoped>
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
                overflow-x: hidden;

                :deep(.el-tree-node:focus > .el-tree-node__content) {
                    background-color: #fff;
                }

                .el-tree {
                    :deep(.el-tree-node__label) {
                        width: 100%;
                    }
                }

                .view-tree-box {
                    :deep(.el-tree-node__children) {
                        .el-tree-node__content {
                            height: auto;
                            padding: 10px 0 !important;
                            margin-bottom: 10px;
                        }

                        .icon-box {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                        }
                    }

                    .select-page {
                        position: absolute;
                        left: -12px;
                        top: -8px;
                        width: 16px;
                        height: 16px;
                        border: 1px solid var(--el-color-primary);
                        border-radius: 50%;
                        cursor: pointer;
                        z-index: 2;
                        //background-color: var(--el-color-primary);
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

                    .view-empty {
                        width: 190px;
                        height: 106px;
                        padding: 10px;
                        border: 1px solid #ebeff1;
                    }

                    .custom-tree-node {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 86%;
                        position: relative;
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

                .tree-box {
                    :deep(.el-tree-node__content) {
                        height: 46px;
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
        }

        .shrink {
            background: #dde1f1;
            width: 18px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;

            > div {
                display: flex;
                align-items: center;
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

                .el-icon {
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
                    color: var(--el-color-primary);
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
