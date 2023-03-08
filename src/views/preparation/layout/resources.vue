<template>
    <div class="p-layout">
        <div class="tip" v-if="isLaoding && resourceList.length === 0">
            <img src="@/assets/images/preparation/pic_loading.png" alt="" />
            资源正在加载，请稍候…
        </div>
        <div class="tip" v-if="!isLaoding && resourceList.length === 0">
            <img src="@/assets/images/preparation/pic_finish_buzhi.png" alt="" />
            没有相关资源
        </div>
        <div class="p-layout-lesson" v-if="resourceList.length && source == 'me'">
            <LessonPackage :isMouseDrag="false" :lessonPackageList="lessonPackageList" />
        </div>
        <div class="p-layout-list" ref="resourceScroll" v-infinite-scroll="load"
            :infinite-scroll-disabled="disabledScrollLoad">
            <ResourceItem :class="[
                `resource-${item.ResourceId}`,
                item.ResourceId === resourceId ? 'doing' : 'custom',
            ]" v-for="(item, index) in resourceList" :key="index" :data="item" :name="name" :lessonId="course.lessonId"
                :source="source" @eventEmit="eventEmit" @addLessonPackage="addLessonPackage" :lessonPackageList="lessonPackageList"/>

            <DeleteTip :target="targetDelete" v-model:visible="deleteTipVisible" @onDeleteSuccess="onDeleteSuccess" />

            <EditTip @update="update" :resource="resource" v-model:visible="editTipVisible" />

            <ResourceVersion :target="target" v-model:visible="resourceVersionVisible" />

            <DeleteVideoTip :target="target" :resource="resource" v-model:visible="deleteVideoTipVisible" />

            <ResourceView :name="name" :target="target" :resource="resource" :lessonId="course.lessonId"
                v-model:visible="resourceVisible" :data="resourceData" @closeDetail="closeDetail" @eventEmit="eventEmit" />

            <div class="download-progress-dialog">
                <el-dialog class="custom-dialog" title="下载" center align-center destroy-on-close width="300px"
                    :show-close="true" :before-close="cancelDownload" :close-on-click-modal="false" v-model="showDownload">
                    <div class="download-progress-bar">
                        <div class="download-progress-line" :style="{ width: downloadProgress + '%' }"></div>
                    </div>
                    <div class="download-progress-tip">打包下载中，请稍等...</div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    onDeactivated,
    onMounted,
    onUnmounted,
    PropType,
    ref,
    toRefs,
    watch
} from "vue";
import ResourceItem from "./resourceItem.vue";
import LessonPackage from "./lessonPackage.vue";
import DeleteTip from "./dialog/deleteTip.vue";
import EditTip from "./dialog/editTip.vue";
import ResourceVersion from "./dialog/resourceVersion.vue";
import DeleteVideoTip from "./dialog/deleteVideoTip.vue";
import ResourceView from "./dialog/resourceView.vue";
import { getDomOffset, sleep } from "@/utils/common";
import useDownloadFile from "@/hooks/useDownloadFile";
import { RESOURCE_TYPE } from "@/config/resource";
import {
    addPreparationPackage,
    fetchResourceList,
    IResourceItem,
    logDownload,
    logView,
    removePreparationPackage
} from "@/api/resource";
import { MutationTypes, useStore } from "@/store";
import emitter from "@/utils/mitt";
import { getOssUrl } from "@/utils/oss";
import { IViewResourceData } from "@/types/store";
import { ElMessage } from "element-plus";
import LocalCache from "@/utils/localcache";
import isElectron from "is-electron";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import useLessonPackage, { IPackage } from "@/hooks/useLessonPackage";
interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}
export default defineComponent({
    components: {
        ResourceItem,
        LessonPackage,
        DeleteTip,
        EditTip,
        ResourceVersion,
        DeleteVideoTip,
        ResourceView
    },
    props: {
        course: {
            type: Object as PropType<ICourse>,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        bookId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: ""
        },
        lessonPackageList: {
            type: Object as PropType<IPackage[]>,
            default: () => [],
        }
    },
    emits: ["updateResourceList", "addLessonPackage","toMyLessonPackage"],
    setup(props, { expose, emit }) {
        const resourceList = ref<IResourceItem[]>([]);
        const deleteTipVisible = ref(false);
        const editTipVisible = ref(false);
        const resourceVersionVisible = ref(false);
        const deleteVideoTipVisible = ref(false);
        const resourceVisible = ref(false);
        const target = ref("");
        const targetDelete = ref("");
        const leftEnd = ref(0);
        const topEnd = ref(0);
        const resource = ref<IResourceItem>();
        const name = computed(() => props.name);
        const resourceId = ref("");
        const resourceScroll = ref<HTMLDivElement>();
        const resourceData = ref<null | IViewResourceData>(null);
        const showDownload = ref(false);
        const downloadProgress = ref(0);

        // 加入备课包
        const addPackage = async (data: IResourceItem) => {
            let book;
            if (RESOURCE_TYPE.TOOL !== data.ResourceType) {
                book = data.TextBooks.find((item) => {
                    return (
                        item.LessonID === course.value.lessonId ||
                        (item.ChapterID === course.value.chapterId &&
                            !item.LessonID) ||
                        (!item.ChapterID && item.BookId === bookId.value)
                    );
                });
                if (!book) return;
            }
            const res = await addPreparationPackage({
                resourceId: data.ResourceId,
                acaSectionId: book ? book.AcaSectionId : "",
                acaSectionName: book ? book.AcaSectionName : "",
                subjectId: book ? book.SubjectID : "",
                subjectName: book ? book.SubjectName : "",
                publisherId: book ? book.PublisherID : "",
                publisherName: book ? book.PublisherName : "",
                albumId: book ? book.AlbumID : "",
                albumName: book ? book.AlbumName : "",
                chapterId: (book && book.ChapterID) || course.value.chapterId,
                chapterName:
                    (book && book.ChapterName) || course.value.chapterName,
                lessonId: (book && book.LessonID) || course.value.lessonId,
                lessonName:
                    (book && book.LessonName) || course.value.lessonName
            });

            if (res.success) {
                data.IsBag = !data.IsBag;
                data.BagId = res.result;
                emitter.emit("updatePackageCount", null);
            }
        };

        // 移出备课包
        const removePackage = async (data: IResourceItem) => {
            const res = await removePreparationPackage({ id: data.BagId });
            if (res.success) {
                data.IsBag = !data.IsBag;
                emitter.emit("updatePackageCount", null);
                if (source.value === "me") {
                    // 当前列表处理我的备课包，需要将数据从list中移除
                    const i = resourceList.value.findIndex(
                        (item) => item.ResourceId === data.ResourceId
                    );
                    resourceList.value.splice(i, 1);
                }
            }
        };

        const loadingShow = ref(false);
        const { download } = useDownloadFile();
        let localCache: any = null;

        const downloadFile = async (data: IResourceItem) => {
            if (data.ResourceShowType === 1) {
                // 下载窗卡页
                window.electron
                    .showOpenDialog({
                        title: "选择保存路径",
                        buttonLabel: "确定",
                        properties: ["openDirectory"],
                    })
                    .then(async (file: any) => {
                        if (!file.canceled) {
                            const path = file.filePaths[0];
                            downloadProgress.value = 0;
                            showDownload.value = true;
                            localCache = new LocalCache({
                                cachingStatus: (status) => {
                                    console.log(`status: ${status}`);
                                    downloadProgress.value = status;
                                    if (status === 100 && showDownload.value) {
                                        showDownload.value = false;
                                        ElMessage.success("打包下载完成！");
                                        logDownload({ id: data.ResourceId });
                                        data.DownloadNum++;
                                    }
                                },
                            });

                            localCache.doCache(
                                {
                                    WindowID: data.OldResourceId,
                                    OriginType: data.IsSysFile === 1 ? 0 : 1,
                                },
                                data.Name,
                                path,
                                () => {
                                    showDownload.value = false;
                                    ElMessage.error("网络异常，打包下载失败！");
                                }
                            );
                        }
                    })
                    .catch((err: any) => {
                        ElMessage({ type: "error", message: "下载失败" });
                    });
                return;
            }
            if (data.File) {
                const url = await getOssUrl(
                    `${data.File.FilePath}/${data.File.FileMD5}.${data.File.FileExtention}`,
                    data.File.FileBucket
                );
                const success = await download(
                    url,
                    data.File.FileName,
                    data.File.FileExtention
                );

                if (success) {
                    logDownload({ id: data.ResourceId });
                    data.DownloadNum++;
                }
            }
        };

        const cancelDownload = () => {
            localCache.cancel();
            showDownload.value = false;
            ElMessage.warning("打包下载取消！");
        };

        const eventEmit = (
            event: string,
            data: IResourceItem,
            e?: MouseEvent | TouchEvent
        ) => {
            switch (event) {
                case "delete":
                    targetDelete.value = data.ResourceId;
                    deleteTipVisible.value = true;
                    break;
                case "edit":
                    if (
                        (data.ResourceShowType === 1 ||
                            data.ResourceShowType === 0) &&
                        data.UserId !== userId.value
                    ) {
                        resource.value = data;
                        editTipVisible.value = true;
                    } else if (data.IsMine === 1 && data.IsSchool !== 1) {
                        editWincard(data);
                    }
                    break;
                case "version":
                    target.value = data.ResourceId;
                    resourceVersionVisible.value = true;
                    break;
                case "download":
                    downloadFile(data);
                    break;
                case "add":
                    if (e) dealFly(e);
                    addPackage(data);
                    break;
                case "move":
                    removePackage(data);
                    break;
                case "detail":
                    // if (props.name === "attendClass") {
                    if (data.ResourceShowType === 2) {
                        // 断点视频
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "LookVideo",
                                resource: {
                                    id: data.OldResourceId,
                                    openMore: true,
                                },
                            }
                        );
                    } else if (data.ResourceShowType === 3) {
                        // 练习卷
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "LookQuestion",
                                resource: {
                                    id: data.OldResourceId,
                                    courseBagId: "",
                                    deleteQuestionIds: [],
                                    type: 1,
                                    openMore: true,
                                },
                            }
                        );
                    } else if (data.ResourceShowType === 1) {
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "Wincard",
                                resource: {
                                    id: data.OldResourceId,
                                    isSystem: data.IsSysFile === 1,
                                    openMore: true,
                                },
                            }
                        );
                    } else if (
                        data.ResourceShowType === 0 ||
                        data.ResourceShowType === 4
                    ) {
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "ScreenViewFile",
                                resource: {
                                    ...data,
                                    id: data.OldResourceId,
                                    openMore: true,
                                },
                            }
                        );
                    } else if (data.ResourceShowType === 5) {
                        store.commit(
                            MutationTypes.SET_FULLSCREEN_RESOURCE,
                            {
                                component: "AnswerMachine",
                                resource: {
                                    ...data,
                                    lessonId: course.value.lessonId,
                                    id: new Date().getTime(),
                                    openMore: true,
                                },
                            }
                        );
                    }
                    // } else {
                    //     openResource(data);
                    // }

                    logView({ id: data.ResourceId });
                    data.BrowseNum++;
                    break;
                case "property":
                    emitter.emit("openEditResource", data);

                    break;
            }
        };
        // 直接打开编辑窗口
        const editWincard = (data: any) => {
            set(
                STORAGE_TYPES.SUBJECT_BOOK_INFO,
                store.state.preparation.subjectPublisherBookValue
            );
            const cacheResource = data;
            const windowInfo = {
                id: cacheResource.OldResourceId,
                name: cacheResource.Name,
                lessonId: store.state.preparation.selectLessonId,
                originType: 1,
            };
            set(STORAGE_TYPES.WINDOW_INFO, windowInfo);
            openWinCard(cacheResource.Name);
            // router.push("/windowcard-edit");
        };
        // 直接打开编辑窗口
        const openWinCard = (name: any) => {
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke(
                    "openWinCardWin",
                    name
                );
            }
        };
        const openResource = (data: IResourceItem) => {
            console.log("data------", data);
            if (data.ResourceShowType === 1) {
                store.commit(
                    MutationTypes.SET_FULLSCREEN_RESOURCE,
                    {
                        component: "Wincard",
                        resource: {
                            id: data.OldResourceId,
                            isSystem: data.IsSysFile === 1,
                            openMore: true
                        }
                    }
                );
            } else {
                if (data.ResourceShowType === 2) {
                    resourceData.value = { id: data.OldResourceId };
                } else if (data.ResourceShowType === 3) {
                    resourceData.value = {
                        id: data.OldResourceId,
                        courseBagId: "",
                        deleteQuestionIds: [],
                        type: 1
                    };
                }
                resource.value = data;
                target.value = data.OldResourceId;
                resourceVisible.value = true;
            }
        };
        const dealFly = async (event: MouseEvent | TouchEvent) => {
            // 简单的加入购物车动画
            const x =
                event instanceof MouseEvent
                    ? event.pageX
                    : event.changedTouches[0].pageX;
            const y =
                event instanceof MouseEvent
                    ? event.pageY
                    : event.changedTouches[0].pageY;
            const img = document.createElement("img");
            img.src = require("@/assets/images/preparation/resources/icon_cjkejian_star.png");
            img.style.position = "fixed";
            img.style.display = "block";
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.borderRadius = "25px";
            img.style.top = y + "px";
            img.style.left = x + "px";
            img.style.transition =
                "all 0.5s linear,top 0.5s cubic-bezier(.28,.94,0,.8)";
            img.onload = async () => {
                document.body.appendChild(img);
                await sleep(100);
                img.style.left = leftEnd.value + "px";
                img.style.top = topEnd.value + "px";
                await sleep(500);
                img.remove();
            };
        };

        onMounted(() => {
            const cart = document.getElementById("myCourseCart");
            if (cart) {
                const { left, top } = getDomOffset(cart);
                leftEnd.value = left + 20;
                topEnd.value = top - 40;
            }
            emitter.on("updateResourceList", (id: string) => {
                update(id);
            });
        });

        onUnmounted(() => {
            emitter.off("updateResourceList");
        });

        const pageNumber = ref(1);
        const pageSize = ref(200);
        const store = useStore();
        const schoolId = computed(() => store.state.userInfo.schoolId);
        const userId = computed(() => store.state.userInfo.userCenterUserID);

        const { source, type, course, bookId } = toRefs(props);

        watch([source, type, course, schoolId, bookId], () => {
            console.log('source.value', source.value);
            if (source.value === 'me') return;
            update("");
        });

        const update = (id: string) => {
            resourceList.value = [];
            pageNumber.value = 1;
            resourceId.value = id;
            getResources();
        };
        const isLaoding = ref(false);
        const getResources = async () => {
            if (course.value.chapterId && course.value.lessonId) {
                isLaoding.value = true;

                const res = await fetchResourceList({
                    chapterId: course.value.chapterId,
                    lessonId: course.value.lessonId,
                    resourceTypeId: type.value,
                    resourceType: source.value,
                    schoolId: schoolId.value,
                    bookId: bookId.value,
                    pager: {
                        pageNumber: pageNumber.value,
                        pageSize: pageSize.value
                    }
                });
                isLaoding.value = false;

                resourceList.value =
                    pageNumber.value === 1
                        ? res.result.list
                        : resourceList.value.concat(res.result.list);
                disabledScrollLoad.value =
                    res.result.list.length === 0
                        ? true
                        : res.result.pager.IsLastPage;

                emit("updateResourceList", resourceList.value);

                nextTick(() => {
                    if (resourceId.value && resourceScroll.value) {
                        const resourceDom =
                            resourceScroll.value.getElementsByClassName(
                                `resource-${resourceId.value}`
                            );
                        if (resourceDom.length > 0) {
                            // 找到目标dom
                            const top = (resourceDom[0] as HTMLElement)
                                .offsetTop;
                            resourceScroll.value.scrollTo({
                                top,
                                behavior: "smooth"
                            });
                        }
                    }
                });
            }
        };

        const closeDetail = () => {
            resourceVisible.value = false;
            update("");
        };

        const disabledScrollLoad = ref(true);
        const load = () => {
            pageNumber.value++;
            getResources();
        };

        const onDeleteSuccess = (id: string) => {
            const i = resourceList.value.findIndex(
                (item) => item.ResourceId === id
            );
            resourceList.value.splice(i, 1);
            // 更新一下备课包数量
            emitter.emit("updatePackageCount", null);
            if (resourceVisible.value) resourceVisible.value = false;
        };
        const addLessonPackage = () => {
            emit("toMyLessonPackage")
            emit("addLessonPackage");
        };
        expose({ update, openResource, eventEmit });

        return {
            resourceList,
            target,
            targetDelete,
            resource,
            deleteTipVisible,
            editTipVisible,
            resourceVersionVisible,
            deleteVideoTipVisible,
            addLessonPackage,
            eventEmit,
            resourceVisible,
            load,
            closeDetail,
            disabledScrollLoad,
            onDeleteSuccess,
            update,
            openResource,
            name,
            resourceScroll,
            resourceId,
            resourceData,
            showDownload,
            downloadProgress,
            cancelDownload,
            isLaoding,
            editWincard,
            openWinCard
        };
    },
});
</script>

<style lang="scss" scoped>
.p-layout {
    display: flex;
    position: relative;

    .p-layout-lesson {
        height: calc(100vh - 165px);
        overflow-y: auto;
    }

    .p-layout-list {
        height: calc(100vh - 165px);
        flex: 1;
        min-height: 0;
        min-width: 0;
        position: relative;
        padding: 0 20px;
        overflow-y: auto;
        // display: flex; 

        .doing {
            border-left: 4px solid #4b71ee;
            box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.16);
        }
    }

}

.tip {
    width: 240px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 400;

    img {
        margin-bottom: 10px;
    }
}

.download-progress-dialog {
    .download-progress-bar {
        height: 10px;
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid #4b71ee;

        .download-progress-line {
            background: #4b71ee;
            height: 100%;
            width: 0;
            transition: 0.1s all;
        }
    }

    .download-progress-tip {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #888;
    }
}
</style>
