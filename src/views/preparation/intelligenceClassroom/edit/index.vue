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
                            <card-popover :data="folder" @handle="handleCartItem">
                                <el-button class="more no-border" @click.stop>
                                    <img src="@/assets/edit/icon_file_more.png" alt=""/>
                                </el-button>
                            </card-popover>
                        </div>
                        <vue-draggable-next v-model="folder.PageList" group="site" tag="div" class="pages" v-show="folder.Fold" @end="sortWindowCards">
                            <transition-group>
                                <div class="page" v-for="page in folder.PageList" :key="page.ID" @click="handlePageClick(page, $event)">
                                    <div class="page-left">
                                        <p class="index">{{ page.Index }}</p>
                                    </div>
                                    <div class="page-right" :class="{active:currentPage.ID === page.ID}">
                                        <el-image v-if="(page.Type === 20 || page.Type === 16) && page.Url" :src="page.Url" fit="cover">
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
                                            <card-popover :data="page" add @handle="handleCartItem">
                                                <el-button @click.stop class="no-border">
                                                    <el-icon color="#2D93FD" :size="20" @click.stop>
                                                        <CirclePlusFilled/>
                                                    </el-icon>
                                                </el-button>
                                            </card-popover>

                                            <card-popover :data="page" @handle="handleCartItem">
                                                <el-button class="more no-border" @click.stop>
                                                    <img src="@/assets/edit/icon_file_more.png" alt="" @click.stop/>
                                                </el-button>
                                            </card-popover>
                                        </div>
                                    </div>
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
                    :subjectID="subjectPublisherBookValue?.SubjectId || ''"
                    @updateAllPageSlideListMap="updateAllPageSlideListMap"
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
</template>

<script lang="ts">
import { VueDraggableNext } from "vue-draggable-next";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import WinCardEdit from "../components/edit/winCardEdit.vue";
import CardPopover from "../components/edit/CardPopover.vue";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";
import { getWindowStruct } from "@/api/home";
import { store } from "@/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { Slide } from "wincard";
import { getOssUrl } from "@/utils/oss";
import useHome from "@/hooks/useHome";
import { pageType, pageTypeList } from "@/config";
import usePreview from "@/views/preparation/intelligenceClassroom/edit/hooks/usePreview";
import WinCardView from "../components/edit/winScreenView.vue";
import { isFullscreen } from "@/utils/fullscreen";
import { v4 as uuidv4 } from "uuid";
import useImportPPT from "@/hooks/useImportPPT";
import useHandlePPT from "@/views/preparation/intelligenceClassroom/edit/hooks/useHandlePPT";

export default defineComponent({
    name: "Edit",
    components: {
        CardPopover,
        WinCardEdit,
        WinCardView,
        VueDraggableNext,
        CirclePlusFilled
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
        const total = ref(0);
        const showCollapse = ref(true);
        const currentPage = ref<PageProps>();
        const pageMap = ref(new Map<string, Slide>());
        const allPages = ref<PageProps[]>([]);
        const windowCards = ref<CardProps[]>([]);

        getWindowCardsData();

        const pptHandle = useImportPPT();
        const previewHandle = usePreview(allPages, currentPage);
        const addHandle = useHandlePPT(windowCards, allPages, pageMap, currentPage);

        // 切换ppt页面
        const handlePageClick = (data: PageProps, e?: KeyboardEvent) => {
            if (e?.shiftKey || e?.ctrlKey) return;
            if (data.ID === currentPage.value?.ID) return;

            currentPage.value = data;
        };

        // 教研设计
        const handleOpenLessonDesign = () => {
            if (!editRef.value) return;
            editRef.value.openLessonDesign();
        };

        // 帮助按钮
        const handleHelper = () => {
            if (!editRef.value) return;
            editRef.value.handleHelper();
        };

        // 整体保存
        const handleSave = () => {
            if (!editRef.value) return;
            editRef.value.handleSave();
        };

        // win-card-edit插件保存回调
        const winCardSave = () => {
            console.log("保存");
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
                        Json: {},
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

        // PPT悬浮操作（1-新增文件夹，2-新增空白页，3-重命名，4-隐藏/显示，5-粘贴页，6-复制页，7-保存模板，8-删除，9-新增互动页）
        const handleCartItem = (type: number, data: PageProps | CardProps) => {
            switch (type) {
                case 1:
                    addHandle.createFolder();
                    break;
                case 2:
                    addHandle.createCardPage(pageTypeList[0], data);
                    break;
                case 3:
                    addHandle.rename(data);
                    break;
                case 4:
                    (data as PageProps).State = (data as PageProps).State ? 0 : 1
                    break;
                case 5:
                    addHandle.paste(data as CardProps);
                    break;
                case 6:
                    addHandle.copy(data as PageProps);
                    break;
                default:
                    console.log("1");
            }
        };

        function getWindowCardsData() {
            getWindowStruct({
                WindowID: windowInfo.value.id,
                OriginType: windowInfo.value.originType
            }).then(res => {
                if (res.resultCode !== 200) return;

                const arr = res.result.CardData;
                assembleCardData(arr);
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
            window.addEventListener("keydown", previewHandle.keyDown);

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
            subjectPublisherBookValue,
            importPPT,
            handleSave,
            winCardSave,
            handleHelper,
            handleCartItem,
            handlePageClick,
            handleOpenLessonDesign,
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
                position: relative;
                cursor: pointer;

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
                    cursor: pointer;

                    .page-left {
                        width: 24px;

                        .index {
                            color: #5D5D5D;
                            font-size: 12px;
                        }
                    }

                    .page-right {
                        flex: 1;
                        position: relative;

                        &.active {
                            border: 2px solid #2E95FF;
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
                            z-index: 999;
                        }

                        .handle {
                            position: absolute;
                            bottom: 0;
                            right: 0;

                            .more img {
                                width: 15px;
                                height: 3px;
                            }
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
            z-index: 999;
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
    margin: 0 !important;

    &:hover, &:active, &:focus {
        background-color: transparent;
    }
}
</style>

<style lang="scss">
.tips {
    .title {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        img {
            width: 19px;
            height: 21px;
            margin-right: 8px;
        }
    }

    i {
        color: #2E95FF;
    }
}
</style>
