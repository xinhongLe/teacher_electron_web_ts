<template>
    <div class="container">
        <div class="top">
            <div class="handles">
                <div class="btn" @click="handleSave">
                    <img src="@/assets/edit/icon_save.png" alt=""/>
                    保存
                </div>
                <div class="btn preview" @click="handlePreview(1)">
                    <img src="@/assets/edit/icon_start1.png" alt=""/>
                    从当前开始
                </div>
                <div class="btn" @click="handlePreview(2)">
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
                    @onSave="winCardSave"
                    :winId="windowInfo?.id"
                    @syncLesson="syncLesson"
                    @updateMaterial="updateMaterial"
                    @updatePageSlide="updatePageSlide"
                    :slide="currentPage?.Json || {}"
                    @applyBackgroundAllSlide="applyBackgroundAllSlide"
                    :subjectID="publication?.SubjectId || ''"
                />
            </div>
        </div>
    </div>

    <!--预览界面-->
    <win-card-view
        ref="winCardViewRef"
        v-if="winScreenView"
        :list="windowCards"
        :active-page-index="previewIndex"
        @offScreen="offScreen"
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
import useHome from "@/hooks/useHome";
import loading from "@/components/loading";
import usePreview from "./hooks/usePreview";
import { getImageSize } from "@/utils/image";
import { getWindowStruct } from "@/api/home";
import useImportPPT from "@/hooks/useImportPPT";
import useHandlePPT from "./hooks/useHandlePPT";
import { isFullscreen } from "@/utils/fullscreen";
import { pageType, pageTypeList } from "@/config";
import { CardProps, PageProps } from "../api/props";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage, ElMessageBox } from "element-plus";
import exitDialog, { ExitType } from "../edit/exitDialog";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import WinCardView from "../components/edit/winScreenView.vue";
import AddPageDialog from "../components/edit/addPageDialog.vue";
import materialCenter from "../components/edit/materialCenter/index.vue";
import { addTeachPageTemplateLinkCount } from "@/api/material";
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref } from "vue";
import CardPreview from "@/views/preparation/intelligenceClassroom/components/edit/CardPreview.vue";
import useSaveTemplate from "@/views/preparation/intelligenceClassroom/edit/hooks/useSaveTemplate";

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
        const store = useStore();

        const windowInfo = computed(() => get(STORAGE_TYPES.WINDOW_INFO));
        const publication = computed(() => get(STORAGE_TYPES.SUBJECT_BOOK_INFO));

        const editRef = ref();
        const winCardViewRef = ref();
        const showCollapse = ref(true);
        const addPageVisible = ref(false);
        const currentPageId = ref<string>("");
        const selectPageIds = ref<string[]>([]);
        const windowCards = ref<CardProps[]>([]);

        getWindowCardsData();

        const handleImport = useImportPPT();
        const { transformPageDetail } = useHome();
        const handlePPT = useHandlePPT(windowCards, currentPageId);
        const { materialCenterRef, saveWindowTemplate } = useSaveTemplate();

        const currentPage = computed(() => handlePPT.getPageById(currentPageId.value));

        const previewHandle = usePreview(windowCards, currentPage, editRef, winCardViewRef);

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
            }
            // 保存模板
            if (obj.type === 6) {
                saveTemplate(obj.params);
            }
        };

        // win-card-edit插件保存回调
        const winCardSave = async () => {
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
            return true;
        };

        // 导入PPT
        const importPPT = () => {
            handleImport.importByElectron(result => {
                const name = handleImport.uploadFileName.value.split("\\");
                const parentId = uuidv4();
                const pageList = result.slides.map((item, index) => {
                    const id = uuidv4();
                    return {
                        ID: id,
                        Name: name[name.length - 1] + "-" + (index + 1),
                        Type: pageType.element,
                        State: 1,
                        Json: item,
                        TeachPageRelationID: "",
                        Height: 0,
                        Width: 0,
                        Sort: index + 1,
                        AcademicPresupposition: "",
                        DesignIntent: "",
                        Index: windowCards.value.length + index + 1,
                        Url: "",
                        ParentID: parentId
                    };
                });
                const card = {
                    Name: name[name.length - 1],
                    ID: parentId,
                    Sort: windowCards.value.length,
                    isAdd: true,
                    PageList: pageList,
                    TeachPageRelationID: "",
                    Fold: true
                };
                windowCards.value.push(card);
            });
        };

        let selectPage: PageProps | null = null;
        // PPT悬浮操作（1-新增文件夹，2-新增空白页，3-重命名，4-隐藏/显示，5-粘贴页，6-复制页，7-保存模板，8-删除，9-新增互动页）
        const handleCartItem = (type: number, data: PageProps | CardProps) => {
            if (type === 1) {
                ElMessageBox.prompt("", "新建文件夹", {
                    inputPattern: /\S/,
                    inputErrorMessage: "请填写文件夹名称"
                }).then(async ({ value }) => {
                    const card = handlePPT.createFolder(value);
                    const page = await handlePPT.createCardPage(pageTypeList[0], card);
                    handlePPT.sortWindowCards();
                    currentPageId.value = page.ID;
                });
            }
            if (type === 2) {
                loading.show();
                handlePPT.createCardPage(pageTypeList[0], data);
            }
            if (type === 3) {
                handlePPT.rename(data);
            }
            if (type === 4) {
                (data as PageProps).State = (data as PageProps).State ? 0 : 1;
            }
            if (type === 5) {
                loading.show();
                handlePPT.paste(data as CardProps);
            }
            if (type === 6) {
                loading.show();
                handlePPT.copy(data as PageProps);
            }
            if (type === 7) {
                saveTemplate(data as PageProps);
            }
            if (type === 8) {
                handlePPT.remove(data);
            }
            if (type === 9) {
                selectPage = cloneDeep<PageProps>(data as PageProps);
                addPageVisible.value = true;
            }

            setTimeout(() => {
                loading.hide();
            }, 500);
        };

        // 新增互动页
        const addInteractionPage = (pageType: any) => {
            loading.show();
            handlePPT.createCardPage(pageType, selectPage as PageProps);
            addPageVisible.value = false;
            selectPage = null;
            loading.hide();
        };

        // 子窗体关闭 提示
        const closeCurrentWinCard = async () => {
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
                    return (await winCardSave()) ? "save" : false;
                }
            }
        };

        // 插入左侧窗卡页 资源库-模板素材操作
        const handleInsertData = async (obj: { type: "elements" | "page", data: any, teachPageTemplateID?: string }) => {
            if (!currentPage.value) {
                ElMessage.warning("请先选择页，再进行插入");
                return;
            }
            const page = currentPage.value;
            const index = windowCards.value.findIndex(item => item.ID === page?.ParentID);
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === page?.ID);

            if (obj.type === "page") {
                windowCards.value[index].PageList.splice(subIndex + 1, 0, ...obj.data);
                handlePPT.sortWindowCards();

                // 插入成功后调用一下增加次数的接口
                await addTeachPageTemplateLinkCount({
                    TeacherID: "",
                    TeachPageTemplateID: obj.teachPageTemplateID || ""
                });
                await nextTick(() => {
                    materialCenterRef.value.addLinkCount(
                        obj.teachPageTemplateID || ""
                    );
                });
            }
            if (obj.type === "elements") {
                if (page?.Type === pageType.game || page?.Type === pageType.teach || page?.Type === pageType.listen || page?.Type === pageType.follow) {
                    ElMessage.warning("当前页无法添加素材，请先切换到素材页哦！");
                    return;
                }
                const data = obj.data;
                if (!(page.Json.elements instanceof Array)) {
                    page.Json.elements = [];
                }

                if ([2, 3].includes(data.Type)) {
                    const element = await getImageData(data);
                    page.Json.elements.push(element);
                }

                if (data.Type === 4) {
                    const file = data.Files?.length ? data.Files.find((item: any) => item.Type === 0) : null;
                    if (!file) return;

                    const element = JSON.parse(file.Json);
                    element.offSetElements.forEach((item: any) => (item.id = uuidv4()));

                    page.Json.elements.push(...element.offSetElements);
                }

                if ([5, 6].includes(data.Type)) {
                    const element = getAudioVideoData(data, data.Type === 5 ? "video" : "audio");
                    page.Json.elements.push(element);
                }

                await handlePPT.replaceCurrentPage(page);
            }
        };

        // 插入教具内容以及教具页
        const handleInsertTool = async (obj: any) => {
            if (!currentPage.value) {
                ElMessage.warning("请先选择页，再进行插入");
                return;
            }
            const id = uuidv4();
            const page = {
                ID: id,
                TeachPageRelationID: "",
                Name: "教具页",
                Height: 0,
                Width: 0,
                Type: pageType.teach,
                Sort: 0,
                State: 1,
                AcademicPresupposition: "",
                DesignIntent: "",
                Index: 0,
                Url: obj.data.url,
                ParentID: currentPage.value?.ID,
                Json: await transformPageDetail({ Type: pageType.teach }, {
                    TeachPageID: id,
                    TeachingMiniToolID: obj.data.ID,
                    ToolFileModel: {
                        ID: obj.data.ID,
                        Name: obj.data.Name,
                        File: obj.data.File,
                        Url: obj.data.Url
                    }
                })
            };
            const index = windowCards.value.findIndex(item => item.ID === currentPage.value?.ParentID);
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === currentPage.value?.ID);

            handlePPT.insertWindowsCards(page, index, subIndex);
            handlePPT.sortWindowCards();
        };

        // 保存完组件后刷新素材列表
        const updateMaterial = () => {
            nextTick(() => {
                materialCenterRef.value.updateMaterialList();
            });
        };

        const updatePageSlide = (slide: Slide) => {
            if (!currentPage.value) return;
            const index = windowCards.value.findIndex(item => item.ID === currentPage.value?.ParentID);
            const page = windowCards.value[index].PageList.find(item => item.ID === currentPage.value?.ID) as PageProps;
            page.Json = slide;

            const teach: any = slide.teach;
            if (teach && teach.ossSrc) {
                page.Url = teach.ossSrc;
            }
            const game: any = slide.game;
            if (game && game.ossSrc) {
                page.Url = game.ossSrc;
            }

            handlePPT.replaceCurrentPage(page);
        };

        const applyBackgroundAllSlide = (data: any) => {
            const list = cloneDeep<CardProps[]>(windowCards.value);
            for (let i = 0; i < list.length; i++) {
                const item = list[i];

                for (let j = 0; j < item.PageList.length; j++) {
                    const it = item.PageList[j];

                    if (!it.Json.background) continue;

                    it.Json.background = data;
                }
            }

            windowCards.value = list;
        };

        // 整体保存
        const handleSave = () => {
            if (!editRef.value) return;
            editRef.value.saveSlide();

            setTimeout(() => {
                winCardSave();
            }, 500);
        };

        // 同步教案的数据
        const syncLesson = (slides: { id: string, AcademicPresupposition: string, DesignIntent: string }[]) => {
            const winCards = cloneDeep<CardProps[]>(windowCards.value);

            for (let i = 0; i < winCards.length; i++) {
                const item = winCards[i];

                for (let j = 0; j < item.PageList.length; j++) {
                    const page = item.PageList[j];
                    const find = slides.find(it => it.id === page.ID);
                    if (!find) continue;

                    if (currentPage.value?.ID === find.id) {
                        currentPage.value.Json.remark = find.AcademicPresupposition || "";
                        currentPage.value.Json.design = find.DesignIntent || "";
                    }

                    page.Json.remark = find.AcademicPresupposition || "";
                    page.Json.design = find.DesignIntent || "";
                }
            }
            windowCards.value = winCards;
        };

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

        const VIEWPORT_RATIO = 0.5625;
        const VIEWPORT_SIZE = 1280;

        function getImageData(data: any) {
            return new Promise(resolve => {
                getImageSize(data.url).then(({ width, height }) => {
                    const scale = height / width;
                    if (scale < VIEWPORT_RATIO && width > VIEWPORT_SIZE) {
                        width = VIEWPORT_SIZE;
                        height = width * scale;
                    } else if (height > VIEWPORT_SIZE * VIEWPORT_RATIO) {
                        height = VIEWPORT_SIZE * VIEWPORT_RATIO;
                        width = height / scale;
                    }

                    const file = data.Files?.length ? data.Files.find((item: any) => item.Type === 0) : data.SourceMaterialMainID ? data : null;

                    if (!file) return resolve(null);

                    return resolve({
                        id: uuidv4(),
                        fixedRatio: true,
                        name: data.name,
                        rotate: 0,
                        src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
                        stretch: 1,
                        eft: (VIEWPORT_SIZE - width) / 2,
                        top: (VIEWPORT_SIZE * VIEWPORT_RATIO - height) / 2,
                        type: "image",
                        width,
                        height
                    });
                });
            });
        }

        function getAudioVideoData(data: any, type: "video" | "audio") {
            const file = data.Files?.length ? data.Files.find((item: any) => item.Type === 1) : null;
            const width = data.showType === 0 ? 500 : 100;
            const height = data.showType === 0 ? 300 : 100;

            return {
                name: data.Name,
                type: type,
                id: uuidv4(),
                width,
                height,
                rotate: 0,
                left: (VIEWPORT_SIZE - width) / 2,
                top: (VIEWPORT_SIZE * VIEWPORT_RATIO - height) / 2,
                src: `${file.FilePath}/${file.FileMD5}.${file.FileExtention}`,
                showType: data.showType,
                clip: data.clip ? data.clip : undefined
            };
        }

        function getWindowCardsData() {
            getWindowStruct({
                WindowID: windowInfo.value.id,
                OriginType: windowInfo.value.originType
            }).then(res => {
                if (res.resultCode !== 200) return;

                const list = res.result.CardData;
                if (!list || list.length === 0) {
                    windowCards.value = [];
                    return;
                }
                handlePPT.assembleCardData(list);
            });
        }

        onMounted(() => {
            window.addEventListener("keydown", previewHandle.keyDown, true);

            // 监听退出全屏事件浏览器
            window.onresize = function () {
                if (!isFullscreen()) {
                    previewHandle.winScreenView.value = false;
                }
            };
        });

        onUnmounted(() => {
            window.removeEventListener("keydown", previewHandle.keyDown);
        });

        return {
            cardPreviewHandle,
            editRef,
            pageType,
            windowInfo,
            currentPage,
            windowCards,
            showCollapse,
            selectPageIds,
            addPageVisible,
            winCardViewRef,
            materialCenterRef,
            publication,
            importPPT,
            syncLesson,
            winCardSave,
            handleSave,
            updateMaterial,
            handleInsertData,
            updatePageSlide,
            handleInsertTool,
            addInteractionPage,
            closeCurrentWinCard,
            applyBackgroundAllSlide,
            ...handlePPT,
            ...handleImport,
            ...previewHandle
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

<style lang="scss">
.canvas-tool .left-handler {
    position: fixed !important;
    left: 26px !important;;
    height: 56px !important;;
    display: flex !important;;
    align-items: center !important;;
}
</style>
