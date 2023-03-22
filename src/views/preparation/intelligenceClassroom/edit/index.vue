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
            <div class="left" :class="{collapse:!showCollapse}">
                <div class="placeholder"/>
                <div class="card" ref="cardListRef">
                    <div class="folder" v-for="folder in windowCards" :key="folder.ID">
                        <div class="title" @click="folder.Fold = !folder.Fold">
                            <i class="triangle" :class="{rotate:!folder.Fold}"></i>
                            <img class="file-icon" src="@/assets/edit/icon_file.png" alt=""/>
                            <span>{{ folder.Name }}</span>
                            <card-popover :data="folder" @handle="handleCartItem" class="more">
                                <img src="@/assets/edit/icon_file_more.png" alt="" :id="`popover-${folder.ID}`" @click.stop/>
                            </card-popover>
                        </div>
                        <vue-draggable-next v-model="folder.PageList" group="site" tag="div" class="pages" v-show="folder.Fold" @end="sortWindowCards">
                            <transition-group>
                                <div
                                    class="page"
                                    @click="handlePageClick(page, $event)"
                                    @mousedown="handleSelect($event,page.ID)"
                                    v-contextmenu="() => contextMenus(page)"
                                    v-for="page in folder.PageList" :key="page.ID"
                                >
                                    <div class="page-left">
                                        <p class="index">{{ page.Index }}</p>
                                        <img src="@/assets/edit/icon_donghua.png" alt="" v-if="checkIsHandle(2,page.Json)"/>
                                        <img src="@/assets/edit/icon_shijian.png" alt="" v-if="checkIsHandle(1,page.Json)"/>
                                    </div>
                                    <div class="page-right" :class="{active:currentPage.ID === page.ID}">
                                        <el-image v-if="(page.Type === 20 || page.Type === 16) && page.Url" :src="page.Url" fit="fill" style="width: 100%;height: 100%">
                                            <template #error>
                                                <div class="image-slot">加载失败...</div>
                                            </template>
                                        </el-image>
                                        <template v-else>
                                            <thumbnail-slide
                                                :size="228"
                                                :slide="pageMap.get(page.ID) || {}"
                                                v-if="[pageType.listen,pageType.element].includes(page.Type)"
                                            />
                                            <div class="view-empty" v-else>{{ page.Name }}</div>
                                        </template>

                                        <template v-if="!page.State">
                                            <img class="down" src="@/assets/edit/icon_yc1.png" alt=""/>
                                            <div class="masks"></div>
                                        </template>

                                        <div class="handle">
                                            <div class="name" v-if="[pageType.listen,pageType.element].includes(page.Type)">{{ page.Name }}</div>
                                            <card-popover :data="page" add @handle="handleCartItem" class="handler-item add">
                                                <img :id="`popover-add-${page.ID}`" src="@/assets/edit/icon_add_hover.png" alt=""/>
                                            </card-popover>

                                            <card-popover :data="page" @handle="handleCartItem" class="handler-item more">
                                                <img :id="`popover-more-${page.ID}`" src="@/assets/edit/icon_more_big.png" alt=""/>
                                            </card-popover>
                                        </div>
                                    </div>

                                    <img v-if="selectPageIds.length > 0" class="select-icon" :src="require(`@/assets/edit/icon_${selectPageIds.includes(page.ID) ? 'clicked' : 'unclick'}.png`)" alt=""/>
                                </div>
                            </transition-group>
                        </vue-draggable-next>
                    </div>
                </div>
                <div class="pagination">
                    当前页{{ currentPage?.Index || 1 }}/{{ total }}
                </div>
                <div class="shrink" @click="showCollapse = !showCollapse">
                    <el-icon :style="{ transform:'rotate(' + (showCollapse ? 0 : 180) + 'deg)'}">
                        <ArrowLeft/>
                    </el-icon>
                </div>
            </div>
            <div class="right" :class="{collapse:!showCollapse}">
                <win-card-edit
                    ref="editRef"
                    @onSave="winCardSave"
                    :winId="windowInfo?.id"
                    :allPageSlideListMap="pageMap"
                    @updateMaterial="updateMaterial"
                    @updatePageSlide="updatePageSlide"
                    :slide="{ ...pageMap.get(currentPage?.ID ) }"
                    @applyBackgroundAllSlide="applyBackgroundAllSlide"
                    :subjectID="subjectPublisherBookValue?.SubjectId || ''"
                />
            </div>
        </div>
    </div>

    <!--预览界面-->
    <win-card-view
        ref="winCardViewRef"
        v-if="winScreenView"
        @offScreen="offScreen"
        :pageList="previewPageList"
        :activePageIndex="previewIndex"
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
    <add-page-dialog v-if="addPageVisible" v-model:dialogVisible="addPageVisible" @addPage="addInteractionPage"/>

    <!-- 资源库 -->
    <material-center
        ref="materialCenterRef"
        @insertData="handleInsertData"
        @insertTools="handleInsertTool"
        :lessonId="windowInfo?.lessonId || ''"
        :subjectID="subjectPublisherBookValue?.SubjectId || ''"
    />
</template>

<script lang="ts">
import { store } from "@/store";
import { Slide } from "wincard";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { saveWindows } from "../api";
import useHome from "@/hooks/useHome";
import { getOssUrl } from "@/utils/oss";
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
import { VueDraggableNext } from "vue-draggable-next";
import { ElMessage, ElMessageBox } from "element-plus";
import exitDialog, { ExitType } from "../edit/exitDialog";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import CardPopover from "../components/edit/CardPopover.vue";
import WinCardView from "../components/edit/winScreenView.vue";
import AddPageDialog from "../components/edit/addPageDialog.vue";
import materialCenter from "../components/edit/materialCenter/index.vue";
import { addTeachPageTemplateLinkCount, saveTemplate } from "@/api/material";
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
    name: "Edit",
    components: {
        CardPopover,
        WinCardEdit,
        WinCardView,
        VueDraggableNext,
        AddPageDialog,
        materialCenter
    },
    setup() {
        const { transformPageDetail } = useHome();
        const windowInfo = computed(() =>
            store.state.preparation.editWindowInfo.id
                ? store.state.preparation.editWindowInfo
                : get(STORAGE_TYPES.WINDOW_INFO));
        const subjectPublisherBookValue = computed(() =>
            store.state.preparation.editWindowInfo.id
                ? store.state.preparation.subjectPublisherBookValue
                : get(STORAGE_TYPES.SUBJECT_BOOK_INFO)
        );

        const editRef = ref();
        const winCardViewRef = ref();
        const materialCenterRef = ref();
        const total = ref(0);
        const showCollapse = ref(true);
        const addPageVisible = ref(false);
        const currentPage = ref<PageProps | null>(null);
        const allPages = ref<PageProps[]>([]);
        const pageMap = ref(new Map<string, Slide>());
        const selectPageIds = ref<string[]>([]);
        const windowCards = ref<CardProps[]>([]);

        getWindowCardsData();

        const pptHandle = useImportPPT();
        const previewHandle = usePreview(allPages, currentPage, editRef, winCardViewRef);
        const addHandle = useHandlePPT(windowCards, allPages, pageMap, currentPage, editRef);

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
                    const slide: Slide | undefined = pageMap.value.get(it.ID);

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
            pptHandle.importByElectron(result => {
                const name = pptHandle.uploadFileName.value.split("\\");
                const parentId = uuidv4();
                const pageList = result.slides.map((item, index) => {
                    const id = uuidv4();
                    pageMap.value.set(id, item);
                    const page = {
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
                    allPages.value.push(page);
                    return page;
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
                    addHandle.createFolder(value);
                });
            }
            if (type === 2) {
                loading.show();
                addHandle.createCardPage(pageTypeList[0], data);
            }
            if (type === 3) {
                addHandle.rename(data);
            }
            if (type === 4) {
                (data as PageProps).State = (data as PageProps).State ? 0 : 1;
            }
            if (type === 5) {
                loading.show();
                handlePaste();
            }
            if (type === 6) {
                loading.show();
                addHandle.copy(data as PageProps);
            }
            if (type === 7) {
                handleSaveTemplate(data as PageProps);
            }
            if (type === 8) {
                addHandle.remove(data);
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
            addHandle.createCardPage(pageType, selectPage as PageProps);
            addPageVisible.value = false;
            selectPage = null;
            loading.hide();
        };

        // 按住shift和ctrl选中
        const handleSelect = (e: KeyboardEvent, id: string) => {
            if (e.shiftKey && e.ctrlKey) return;
            if (!(e.shiftKey || e.ctrlKey)) return;

            const index = selectPageIds.value.findIndex(item => item === id);

            if (index > 0) {
                selectPageIds.value.splice(index, 1);
            } else {
                selectPageIds.value.push(id);
            }
        };

        // 保存模板
        const handleSaveTemplate = (page?: PageProps) => {
            if (!page && selectPageIds.value.length === 0) {
                ElMessage.warning("请先选中需要保存的模板");
                return;
            }
            ElMessageBox.prompt("", "保存模板", {
                inputPattern: /\S/,
                inputErrorMessage: "请填写模板名称"
            }).then(async ({ value }) => {
                const list: any = selectPageIds.value.length === 0 ? [page] : selectPageIds.value.map(item => allPages.value.find(it => it.ID === item));

                const params = {
                    ID: "",
                    Status: 1,
                    Name: value,
                    HavingAudio: 0,
                    HavingVideo: 0,
                    EstimatedDuration: 0,
                    TeachPageClassroomLink: null,
                    LessonID: windowInfo.value.lessonId,
                    SubjectID: subjectPublisherBookValue.value?.SubjectId || "",
                    TeacherID: store.state.userInfo.id ? store.state.userInfo.id : get(STORAGE_TYPES.USER_INFO).ID
                };

                for (let i = 0; i < list.length; i++) {
                    const item = list[i];

                    if (!item.ID) continue;

                    const temPage: Slide | undefined = pageMap.value.get(item.ID);

                    if (!temPage) continue;

                    params.HavingAudio = temPage.elements.some(item => item.type === "audio") ? 1 : 0;
                    params.HavingVideo = temPage.elements.some(item => item.type === "video") ? 1 : 0;
                    item.AcademicPresupposition = temPage.remark;
                    item.DesignIntent = temPage.design;

                    if (temPage.type === "element") {
                        item.Json = JSON.stringify(temPage);
                    }
                    if (temPage.type === "listen") {
                        const words = temPage.listenWords?.map((word: any, index: number) => {
                            return {
                                sort: index + 1,
                                WordID: word.id,
                                PageWordID: word.pageWordID ? null : word.pageWordID,
                                WordInterval: 2
                            };
                        });
                        item.Json = JSON.stringify(words);
                    }
                    if (temPage.type === "follow") {
                        item.Json = temPage.follow?.id || "";
                    }
                    if (temPage.type === "teach") {
                        item.Json = temPage.teach?.id || "";
                    }
                    if (temPage.type === "game") {
                        item.Json = temPage.game?.id || "";
                    }
                }

                const res = await saveTemplate({ ...params, PageData: list });

                if (res.resultCode !== 200) return;
                ElMessage.success("保存成功，请前往「我的」查看已保存模板");
                selectPageIds.value = [];
                await nextTick(() => {
                    materialCenterRef.value.queryTemplateList();
                });
            });
        };

        const contextMenus = (page: PageProps) => {
            return [
                {
                    text: "保存模板",
                    subText: "",
                    handler: () => {
                        handleSaveTemplate(page);
                    }
                },
                {
                    text: "复制",
                    subText: "",
                    handler: () => {
                        handleCopy(page);
                    }
                }
            ];
        };

        // 复制
        const handleCopy = (page: PageProps) => {
            const index = selectPageIds.value.findIndex(item => item === page.ID);

            if (index === -1) {
                selectPageIds.value.push(page.ID);
            }
        };

        // 粘贴
        const handlePaste = () => {
            if (selectPageIds.value.length === 0) {
                ElMessage.warning("请选择要粘贴的内容");
                return;
            }
            if (!currentPage.value) {
                ElMessage.warning("请选中页");
                return;
            }
            const list: PageProps[] = [];
            for (let i = 0; i < selectPageIds.value.length; i++) {
                const item = selectPageIds.value[i];
                const find = allPages.value.find(it => it.ID === item) as PageProps;
                const id = uuidv4();

                list.push({
                    ...find,
                    ID: id
                });
                pageMap.value.set(id, find.Json);
            }
            selectPageIds.value = [];
            const index = windowCards.value.findIndex(item => item.ID === currentPage.value?.ParentID);
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === currentPage.value?.ID);
            windowCards.value[index].PageList.splice(subIndex + 1, 0, ...list);
            addHandle.sortWindowCards();
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
                addHandle.sortWindowCards();

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

                await addHandle.replaceCurrentPage(page);
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
                Json: {
                    TeachPageID: id,
                    TeachingMiniToolID: obj.data.ID,
                    ToolFileModel: {
                        ID: obj.data.ID,
                        Name: obj.data.Name,
                        File: obj.data.File,
                        Url: obj.data.Url
                    }
                }
            };
            const index = windowCards.value.findIndex(item => item.ID === currentPage.value?.ParentID);
            const subIndex = windowCards.value[index].PageList.findIndex(item => item.ID === currentPage.value?.ID);

            addHandle.insertWindowsCards(page, index, subIndex);
            addHandle.sortWindowCards();
        };

        // 保存完组件后刷新素材列表
        const updateMaterial = () => {
            nextTick(() => {
                materialCenterRef.value.updateMaterialList();
            });
        };

        const updatePageSlide = (slide: Slide) => {
            if (!currentPage.value) return;
            currentPage.value.Json = slide;

            const teach: any = slide.teach;
            if (teach && teach.ossSrc) {
                currentPage.value.Url = teach.ossSrc;
            }
            const game: any = slide.game;
            if (game && game.ossSrc) {
                currentPage.value.Url = game.ossSrc;
            }

            addHandle.replaceCurrentPage(currentPage.value);
        };

        const applyBackgroundAllSlide = (data: any) => {
            const list = cloneDeep<CardProps[]>(windowCards.value);
            for (let i = 0; i < list.length; i++) {
                const item = list[i];

                for (let j = 0; j < item.PageList.length; j++) {
                    const it = item.PageList[j];

                    if (!it.Json.background) continue;
                    pageMap.value.set(it.ID, it.Json);

                    it.Json.background = data;
                }
            }

            windowCards.value = list;

            for (let i = 0; i < allPages.value.length; i++) {
                const item = allPages.value[i];

                if (!item.Json.background) continue;
                item.Json.background = data;
            }
        };

        // 整体保存
        const handleSave = () => {
            if (!editRef.value) return;
            editRef.value.saveSlide();

            setTimeout(() => {
                winCardSave();
            }, 500);
        };

        // 判断该PPT有无事件，动画，超链接素材（1-事件，2-动画，3-超链接素材）
        const checkIsHandle = (type: 1 | 2 | 3, json: any) => {
            if (!json) return false;
            if (type === 1) {
                return (json.elements || []).filter((item: any) => item.actions && item.actions.length > 0).length > 0;
            }
            if (type === 2) {
                return json.animations && json.animations.length > 0;
            }
            return false;
        };

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
                if (!list || list.length === 0) return;
                assembleCardData(list);
            });
        }

        const formatOssUrl = async (file: any) => {
            const key = `${file?.FilePath}/${file?.FileMD5}.${
                file?.FileExtention || file?.Extention
            }`;
            return await getOssUrl(key, "axsfile");
        };

        // 组装ppt列表数据
        async function assembleCardData(arr: CardProps[]) {
            const list = [];
            const backupPages = [];
            let index = 1;

            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                const pageList: PageProps[] = [];

                for (let j = 0; j < item.PageList.length; j++) {
                    const it = item.PageList[j];
                    if (!it) continue;

                    const json = JSON.parse(it.Json || "{}");
                    let url = it.Url || "";
                    if (!url && (it.Type === 20 || it.Type === 16)) {
                        url = json?.ToolFileModel ? await formatOssUrl(json?.ToolFileModel?.File) : "";
                    }

                    const slide: Slide = await transformPageDetail(it, json);
                    pageMap.value.set(it.ID, slide);

                    const obj = {
                        ID: it.ID,
                        TeachPageRelationID: it.TeachPageRelationID,
                        Name: it.Name,
                        Height: it.Height,
                        Width: it.Width,
                        Type: it.Type,
                        Sort: it.Sort,
                        State: it.State,
                        AcademicPresupposition: it.AcademicPresupposition,
                        DesignIntent: it.DesignIntent,
                        Json: json,
                        Index: index,
                        Url: url,
                        ParentID: item.ID
                    };

                    pageList.push(obj);
                    backupPages.push(obj);
                    index++;
                }
                list.push({
                    ID: item.ID,
                    TeachPageRelationID: item.TeachPageRelationID,
                    Name: item.Name,
                    Sort: item.Sort,
                    PageList: pageList,
                    Fold: true
                });
            }
            windowCards.value = list;
            allPages.value = backupPages;
            total.value = pageMap.value.size;
            currentPage.value = list[0].PageList[0];
        }

        onMounted(() => {
            window.addEventListener("keydown", function (e: KeyboardEvent) {
                console.log(e);
                const key = e.code;
                if (key === "Escap") {
                    previewHandle.keyDown();
                }
                if (e.ctrlKey && key === "KeyC") {
                    handleCopy(currentPage.value as PageProps);
                }
                if (e.ctrlKey && key === "KeyV") {
                    handlePaste();
                }
            });

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
            total,
            editRef,
            pageMap,
            pageType,
            windowInfo,
            currentPage,
            windowCards,
            showCollapse,
            selectPageIds,
            addPageVisible,
            winCardViewRef,
            materialCenterRef,
            subjectPublisherBookValue,
            importPPT,
            handleSave,
            winCardSave,
            handleSelect,
            contextMenus,
            checkIsHandle,
            handleCartItem,
            updateMaterial,
            handleInsertData,
            updatePageSlide,
            handleInsertTool,
            addInteractionPage,
            closeCurrentWinCard,
            applyBackgroundAllSlide,
            ...addHandle,
            ...pptHandle,
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

        .card {
            height: calc(100% - 96px);
            overflow-y: auto;

            .folder {
                margin: 0 16px 0 12px;
                width: calc(100% - 28px);
            }

            .title {
                height: 44px;
                display: flex;
                align-items: center;
                cursor: pointer;
                position: relative;
                width: 100%;

                .triangle {
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 5px 3px 0 3px;
                    border-color: #414E65 transparent transparent transparent;
                    border-radius: 1px;
                    transition: 0.5s;
                    transform-origin: center;

                    &.rotate {
                        transform: rotate(-90deg);
                    }
                }

                .file-icon {
                    height: 14px;
                    width: 14px;
                    margin: 0 8px 0 5px;
                }

                .more {
                    position: absolute;
                    right: 0;
                    width: 15px;
                    height: 30px;
                    display: flex;
                    align-items: center;

                    img {
                        width: 15px;
                        height: 3px;
                    }
                }
            }

            .pages {
                transition: 0.5s;

                & .page:last-child {
                    margin-bottom: 0;
                }

                .page {
                    display: flex;
                    margin-bottom: 16px;
                    position: relative;
                    cursor: pointer;

                    .select-icon {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        left: 20px;
                        z-index: 9999;
                    }

                    .page-left {
                        width: 24px;

                        .index {
                            color: #5D5D5D;
                            font-size: 12px;
                        }

                        img {
                            width: 14px;
                            height: 14px;
                            margin-top: 8px;
                            margin-left: -3px;
                            display: block;
                        }
                    }

                    .page-right {
                        flex: 1;
                        position: relative;
                        width: 228px;
                        height: 128px;

                        &.active {
                            outline: 2px solid #2E95FF;

                            .handler-item {
                                display: flex !important;
                            }
                        }

                        &:hover .handler-item {
                            display: flex !important;
                        }

                        .down {
                            position: absolute;
                            width: 16px;
                            height: 16px;
                            top: 8px;
                            right: 10px;
                        }

                        .masks {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            background-color: rgba(255, 255, 255, 0.5);
                            z-index: 99;
                        }

                        .handle {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 40px;
                            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);

                            .handler-item {
                                position: absolute;
                                align-items: center;
                                justify-content: center;
                                width: 32px;
                                height: 32px;
                                display: none;

                                &.add {
                                    right: 36px;
                                    bottom: -16px;
                                    margin-right: 15px;

                                    img {
                                        width: 32px;
                                        height: 32px;
                                        display: block;
                                        z-index: 99;
                                    }
                                }

                                &.more {
                                    right: 0;
                                    bottom: 0;

                                    img {
                                        width: 15px;
                                        height: 3px;
                                        display: block;
                                        z-index: 99;
                                    }
                                }
                            }
                        }

                        .view-empty {
                            width: 100%;
                            height: 128px;
                            padding: 10px;
                            border: 1px solid #ebeff1;
                            display: flex;
                            align-items: flex-end;
                        }

                        .name {
                            color: #FFFFFF;
                            font-size: 12px;
                            position: absolute;
                            left: 10px;
                            bottom: 10px;
                        }
                    }
                }
            }
        }

        .pagination {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 13px;
            padding-right: 12px;
            box-sizing: border-box;
            color: #333;
            text-align: right;
        }

        .shrink {
            position: absolute;
            width: 12px;
            height: 64px;
            border-radius: 6px;
            top: 50%;
            margin-top: -32px;
            right: -6px;
            z-index: 99;
            cursor: pointer;
            overflow: hidden;
            background: #414E65;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
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
    position: fixed;
    left: 26px;
    height: 56px;
    display: flex;
    align-items: center;
}
</style>
