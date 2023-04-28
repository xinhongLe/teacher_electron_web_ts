<template>
    <div class="container">
        <div class="top">
            <div class="handles">
                <div class="btn" @click="handleSave">
                    <img src="@/assets/edit/icon_save.png" alt=""/>
                    保存
                </div>
                <div class="btn preview" @click="preview(1,editRef)">
                    <img src="@/assets/edit/icon_start1.png" alt=""/>
                    从当前开始
                </div>
                <div class="btn" @click="preview(2,editRef)">
                    <img src="@/assets/edit/icon_start2.png" alt=""/>
                    从头开始
                </div>
                <div class="btn" @click="importPPT">
                    <img src="@/assets/edit/icon_export.png" alt=""/>
                    导入ppt
                </div>
                <div class="btn" @click="pageAction(1)">
                    <img src="@/assets/edit/icon_design.png" alt=""/>
                    教案设计
                </div>
            </div>
            <div class="help" @click="pageAction(2)">
                <img src="@/assets/edit/icon_help.png" alt=""/>
                帮助
            </div>
        </div>
        <div class="wrapper">
            <card-preview
                :cards="windowCards"
                :collapse="showCollapse"
                :page-id="currentPage?.ID"
                @handle="cardPreviewHandle"
                :select-page-ids="selectPageIds"
            />
            <div class="right" :class="{collapse:!showCollapse}">
                <win-card-edit
                    ref="editRef"
                    :winId="windowInfo?.id"
                    @syncLesson="handleSyncLesson"
                    @updateMaterial="updateMaterial"
                    :slide="currentPage?.Json || {}"
                    :subjectID="publication?.SubjectId || ''"
                    @applyBackgroundAllSlide="applyBackgroundAllSlide"
                />
            </div>
        </div>
    </div>

    <!--预览界面-->
    <win-card-view
        :list="windowCards"
        ref="winCardViewRef"
        v-if="winScreenView"
        @offScreen="offPreview"
        :active-page-index="previewIndex"
    />

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

    <!-- 新增页弹框-->
    <add-page-dialog
        v-if="addPageVisible"
        @addPage="addInteractionPage"
        v-model:dialogVisible="addPageVisible"
    />

    <!-- 资源库 -->
    <material-center
        ref="materialCenterRef"
        @insertData="handleInsertData"
        @insertTools="handleInsertTool"
        :lessonId="windowInfo?.lessonId || ''"
        :subjectID="publication?.SubjectId || ''"
    />
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Slide } from "wincard";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { saveWindows } from "../api";
import { getWindowStruct } from "@/api/home";
import { arrIsEqual } from "@/utils/dataParse";
import useImportPPT from "@/hooks/useImportPPT";
import useHandlePPT from "./hooks/useHandlePPT";
import { pageType, pageTypeList } from "@/config";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import useSaveTemplate from "./hooks/useSaveTemplate";
import { ElMessage, ElMessageBox } from "element-plus";
import exitDialog, { ExitType } from "../edit/exitDialog";
import CardPreview from "../components/edit/CardPreview.vue";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import WinCardView from "../components/edit/winScreenView.vue";
import AddPageDialog from "../components/edit/addPageDialog.vue";
import { CardProps, MaterialProp, PageProps } from "../api/props";
import materialCenter from "../components/edit/materialCenter/index.vue";
import { computed, defineComponent, nextTick, ref, onMounted } from "vue";

export default defineComponent({
    name: "EditWinCard",
    components: {
        CardPreview,
        WinCardEdit,
        WinCardView,
        AddPageDialog,
        materialCenter
    },
    setup() {
        let cardSource: CardProps[] = [];
        const store = useStore();

        const windowInfo = computed(() => get(STORAGE_TYPES.WINDOW_INFO));
        const publication = computed(() => get(STORAGE_TYPES.SUBJECT_BOOK_INFO));

        const editRef = ref();
        const currentPageId = ref("");
        const showCollapse = ref(true);
        const addPageVisible = ref(false);
        const selectPageIds = ref<string[]>([]);
        const windowCards = ref<CardProps[]>([]);

        getWindowCardsData();

        const handleImport = useImportPPT();
        const handlePPT = useHandlePPT(windowCards, currentPageId);
        const { materialCenterRef, saveWindowTemplate, syncLesson, insertTemplateOrMaterial, insertTool } = useSaveTemplate();

        const currentPage = computed(() => handlePPT.getPageById(currentPageId.value));

        // 页面操作
        const pageAction = (type: 1 | 2) => {
            if (!editRef.value) return;
            // 教研设计
            if (type === 1) {
                editRef.value.openLessonDesign();
            }
            // 帮助按钮
            if (type === 2) {
                editRef.value.handleHelper();
            }
        };

        // 左侧预览窗操作
        const cardPreviewHandle = (obj: { type: number, params: any }) => {
            // 关闭预览窗
            if (obj.type === 1) {
                showCollapse.value = !showCollapse.value;
            }
            // 重新排序
            if (obj.type === 2) {
                windowCards.value = obj.params;
                handlePPT.sortWindowCards();
            }
            // 悬浮框操作
            if (obj.type === 3) {
                handleCartItem(obj.params.type, obj.params.data);
            }
            // 切换页
            if (obj.type === 4) {
                const currentPage = handlePPT.getPageById(currentPageId.value);
                currentPage.Json = editRef.value.getCurrentSlide();
                currentPageId.value = obj.params;
            }
            // 按住shift和ctrl选中
            if (obj.type === 5) {
                const index = selectPageIds.value.findIndex(item => item === obj.params);

                if (index >= 0) {
                    selectPageIds.value.splice(index, 1);
                } else {
                    selectPageIds.value.push(obj.params);
                }
                storageCopyData();
            }
            // 保存模板
            if (obj.type === 6) {
                saveTemplate(obj.params);
            }
        };

        // 导入PPT
        const importPPT = () => {
            handleImport.importByElectron((pages, name) => {
                const card = handlePPT.createFolder(name);
                card.PageList = pages;
                handlePPT.sortWindowCards();
            });
        };

        let selectPage: PageProps | null = null;
        // PPT悬浮操作（1-新增文件夹，2-新增空白页，3-重命名，4-隐藏/显示，5-粘贴页，6-复制页，7-保存模板，8-删除，9-新增互动页）
        const handleCartItem = async (type: number, data: PageProps | CardProps) => {
            // 新增文件夹
            if (type === 1) {
                ElMessageBox.prompt("", "新建文件夹", {
                    inputPattern: /\S/,
                    inputErrorMessage: "请填写文件夹名称"
                }).then(async ({ value }) => {
                    const card = handlePPT.createFolder(value);
                    const page = await handlePPT.createPage(pageTypeList[0], card);
                    handlePPT.sortWindowCards();
                    currentPageId.value = page.ID;
                });
            }
            // 新增空白页
            if (type === 2) {
                const page = await handlePPT.createPage(pageTypeList[0], data);
                handlePPT.sortWindowCards();
                currentPageId.value = page.ID;
            }
            // 重命名
            if (type === 3) {
                ElMessageBox.prompt("", "重命名", {
                    inputPattern: /\S/,
                    inputValue: data.Name,
                    inputErrorMessage: "请填写名称！"
                }).then(async ({ value }) => {
                    data.Name = value;
                });
            }
            // 隐藏/显示
            if (type === 4 && "ParentID" in data) {
                data.State = data.State ? 0 : 1;
            }
            // 粘贴页
            if (type === 5) {
                const pages: PageProps[] = get("WIN_COPY_VALUE") || [];
                if (pages.length === 0) {
                    ElMessage.warning("请选择要粘贴的内容");
                    return;
                }
                if (!currentPageId.value) {
                    ElMessage.warning("请选中页");
                    return;
                }
                for (let i = 0; i < pages.length; i++) {
                    const item = pages[i];
                    item.ID = uuidv4();
                    item.TeachPageRelationID = "";
                }
                const index = windowCards.value.findIndex(item => item.ID === (data as PageProps).ParentID);
                const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === data.ID);
                windowCards.value[index].PageList.splice(subIndex + 1, 0, ...pages);
                handlePPT.sortWindowCards();
                window.electron.ipcRenderer.send("replicated");
            }
            // 复制页
            if (type === 6) {
                const index = selectPageIds.value.findIndex(item => item === data.ID);
                if (index === -1) {
                    selectPageIds.value.push(data.ID);
                }
                storageCopyData();
                ElMessage.success("复制成功");
            }
            // 保存模板
            if (type === 7) {
                saveTemplate(data as PageProps);
            }
            // 删除
            if (type === 8) {
                handlePPT.remove(data);
            }
            // 新增互动页
            if (type === 9) {
                selectPage = cloneDeep<PageProps>(data as PageProps);
                addPageVisible.value = true;
            }
        };

        // 存储拷贝内容
        const storageCopyData = () => {
            const pages = selectPageIds.value.map(item => {
                return handlePPT.getPageById(item);
            });

            set("WIN_COPY_VALUE", pages);
        };

        // 新增互动页
        const addInteractionPage = async (pageType: any) => {
            const page = await handlePPT.createPage(pageType, selectPage as PageProps);
            handlePPT.sortWindowCards();
            currentPageId.value = page.ID;
            addPageVisible.value = false;
            selectPage = null;
        };

        // 插入左侧窗卡页 资源库-模板素材操作
        const handleInsertData = async (data: MaterialProp) => {
            if (!currentPageId.value) {
                ElMessage.warning("请先选择页，再进行插入");
                return;
            }
            const page = handlePPT.getPageById(currentPageId.value);
            if (data.type === "elements") {
                page.Json = editRef.value.getCurrentSlide();
            }
            const result = await insertTemplateOrMaterial(data, page);
            if (data.type === "page") {
                const index = windowCards.value.findIndex(item => item.ID === page?.ParentID);
                const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === page?.ID);
                windowCards.value[index].PageList.splice(subIndex + 1, 0, ...(result as PageProps[]));
                handlePPT.sortWindowCards();
            }
        };

        // 插入教具内容以及教具页
        const handleInsertTool = async (obj: MaterialProp) => {
            if (!currentPageId.value) {
                ElMessage.warning("请先选择页，再进行插入");
                return;
            }
            const page = handlePPT.getPageById(currentPageId.value);
            const index = windowCards.value.findIndex(item => item.ID === page.ParentID);
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === page.ID);
            const toolPage = await insertTool(obj.data);

            windowCards.value[index].PageList.splice(subIndex + 1, 0, toolPage);
            currentPageId.value = page.ID;
            handlePPT.sortWindowCards();
        };

        // 保存完组件后刷新素材列表
        const updateMaterial = () => {
            nextTick(() => {
                materialCenterRef.value.updateMaterialList();
            });
        };

        // 整体保存
        const handleSave = async () => {
            if (!editRef.value) return;
            const page = handlePPT.getPageById(currentPageId.value);
            page.Json = editRef.value.getCurrentSlide();

            const list = [];
            for (let i = 0; i < windowCards.value.length; i++) {
                const item = windowCards.value[i];

                const obj: any = {
                    cardID: item.ID,
                    sort: item.Sort,
                    cardName: item.Name,
                    pageData: []
                };

                for (let j = 0; j < item.PageList.length; j++) {
                    const it = item.PageList[j];
                    const slide: Slide = it.Json;

                    let json = "";
                    if (slide?.type === "element") {
                        json = JSON.stringify(slide);
                    }
                    if (slide?.type === "listen") {
                        const words = slide.listenWords?.map((word: any, index: number) => {
                            return {
                                sort: index + 1,
                                WordID: word.id,
                                PageWordID: word.pageWordID ? null : word.pageWordID,
                                WordInterval: 2
                            };
                        });
                        json = JSON.stringify(words);
                    }
                    if (slide?.type === "follow") {
                        json = slide.follow?.id || "";
                    }
                    if (slide?.type === "teach") {
                        json = slide.teach?.id || "";
                    }
                    if (slide?.type === "game") {
                        json = slide.game?.id || "";
                    }

                    obj.pageData.push({
                        pageID: it.ID,
                        pageName: it.Name,
                        type: it.Type,
                        academicPresupposition: slide?.remark,
                        designIntent: slide?.design,
                        sort: it.Sort,
                        state: it.State,
                        json
                    });
                }

                list.push(obj);
            }

            const res = await saveWindows({
                originType: 1,
                cardData: list,
                windowID: windowInfo.value.id,
                windowName: windowInfo.value.name,
                teacherID: store.state.userInfo.id,
                franchiseeID: store.state.userInfo.schoolId
            });
            if (res.resultCode !== 200) return false;

            ElMessage.success("保存成功");
            cardSource = cloneDeep(windowCards.value);
            return true;
        };

        // 同步教案的数据
        const handleSyncLesson = (slides: { id: string, AcademicPresupposition: string, DesignIntent: string }[]) => {
            windowCards.value = syncLesson(windowCards.value, slides);
        };

        // 子窗体关闭 提示
        const closeCurrentWinCard = async () => {
            const page = handlePPT.getPageById(currentPageId.value);
            page.Json = editRef.value.getCurrentSlide();

            const flag = arrIsEqual(cardSource, windowCards.value);
            if (flag) return true;

            const res = await exitDialog();
            if (res === ExitType.Cancel) return false;
            if (res === ExitType.Save) {
                await handleSave();
            }
            return true;
        };

        // 保存模板
        function saveTemplate(page: PageProps) {
            let allPages: PageProps[] = [];
            windowCards.value.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            const list: PageProps[] = selectPageIds.value.length === 0 ? [page] : selectPageIds.value.map(item => allPages.find(it => it.ID === item) as PageProps);
            if (list.length === 0) {
                ElMessage.warning("请先选中需要保存的模板");
                return;
            }
            ElMessageBox.prompt("", "保存模板", {
                inputPattern: /\S/,
                inputErrorMessage: "请填写模板名称"
            }).then(async ({ value }) => {
                await saveWindowTemplate(
                    value,
                    cloneDeep(list),
                    windowInfo.value.lessonId,
                    publication.value?.SubjectId,
                    get(STORAGE_TYPES.USER_INFO).ID
                );
                selectPageIds.value = [];
            });
        }

        function getWindowCardsData() {
            getWindowStruct({
                WindowID: windowInfo.value.id,
                OriginType: windowInfo.value.originType
            }).then(async res => {
                if (res.resultCode !== 200) return;

                const list = res.result.CardData;
                if (!list || list.length === 0) {
                    windowCards.value = [];
                    return;
                }
                cardSource = await handlePPT.assembleCardData(list);
            });
        }

        onMounted(() => {
            window.electron.ipcRenderer.on("copy-end", () => {
                selectPageIds.value = [];
                set("WIN_COPY_VALUE", []);
            });
            document.addEventListener("keydown", (e: KeyboardEvent) => {
                e.stopPropagation();
                const key = e.code;

                if (key === "Escape") {
                    handlePPT.offPreview();
                }
                if (e.ctrlKey && key === "KeyF") {
                    handlePPT.preview(1, editRef.value);
                }
            });
        });

        return {
            editRef,
            pageType,
            importPPT,
            windowInfo,
            handleSave,
            pageAction,
            currentPage,
            windowCards,
            publication,
            showCollapse,
            selectPageIds,
            addPageVisible,
            updateMaterial,
            handleInsertData,
            handleSyncLesson,
            handleInsertTool,
            materialCenterRef,
            cardPreviewHandle,
            addInteractionPage,
            closeCurrentWinCard,
            ...handlePPT,
            ...handleImport
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

    .right {
        width: calc(100% - 280px);
        transition: all 0.5s;

        &.collapse {
            width: 100%;
        }
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

.no-border {
    border: none !important;
    background-color: transparent;
    margin: 0 7px 0 0 !important;
    padding: 8px;

    &:hover, &:active, &:focus {
        background-color: transparent;
    }
}
</style>
