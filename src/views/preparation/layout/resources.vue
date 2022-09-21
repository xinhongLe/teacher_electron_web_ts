<template>
    <div
        class="p-layout-list"
        ref="resourceScroll"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabledScrollLoad"
    >
        <div class="tip" v-if="resourceList.length === 0">
            <img
                src="@/assets/images/preparation/pic_finish_buzhi.png"
                alt=""
            />
            没有相关资源
        </div>
        <ResourceItem
            :class="[
                `resource-${item.ResourceId}`,
                item.ResourceId === resourceId ? 'doing' : 'custom',
            ]"
            v-for="(item, index) in resourceList"
            :key="index"
            :data="item"
            :name="name"
            :lessonId="course.lessonId"
            @eventEmit="eventEmit"
        />

        <DeleteTip
            :target="targetDelete"
            v-model:visible="deleteTipVisible"
            @onDeleteSuccess="onDeleteSuccess"
        />

        <EditTip
            @update="update"
            :resource="resource"
            v-model:visible="editTipVisible"
        />

        <ResourceVersion
            :target="target"
            v-model:visible="resourceVersionVisible"
        />

        <DeleteVideoTip
            :target="target"
            :resource="resource"
            v-model:visible="deleteVideoTipVisible"
        />

        <ResourceView
            :name="name"
            :target="target"
            :resource="resource"
            :lessonId="course.lessonId"
            v-model:visible="resourceVisible"
            :data="resourceData"
            @eventEmit="eventEmit"
        />
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
    watch,
} from "vue";
import ResourceItem from "./resourceItem.vue";
import DeleteTip from "./dialog/deleteTip.vue";
import EditTip from "./dialog/editTip.vue";
import ResourceVersion from "./dialog/resourceVersion.vue";
import DeleteVideoTip from "./dialog/deleteVideoTip.vue";
import ResourceView from "./dialog/resourceView.vue";
import { getDomOffset, sleep } from "@/utils/common";
import useDownloadFile from "@/hooks/useDownloadFile";
import {
    addPreparationPackage,
    fetchResourceList,
    IResourceItem,
    logDownload,
    logView,
    removePreparationPackage,
} from "@/api/resource";
import { MutationTypes, useStore } from "@/store";
import emitter from "@/utils/mitt";
import { getOssUrl } from "@/utils/oss";
import { IViewResourceData } from "@/types/store";
interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}
export default defineComponent({
    components: {
        ResourceItem,
        DeleteTip,
        EditTip,
        ResourceVersion,
        DeleteVideoTip,
        ResourceView,
    },
    props: {
        course: {
            type: Object as PropType<ICourse>,
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        bookId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            default: "",
        },
    },
    emits: ["updateResourceList"],
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

        // 加入备课包
        const addPackage = async (data: IResourceItem) => {
            const book = data.TextBooks.find((item) => {
                return (
                    item.LessonID === course.value.lessonId ||
                    (item.ChapterID === course.value.chapterId &&
                        !item.LessonID) ||
                    (!item.ChapterID && item.BookId === bookId.value)
                );
            });
            if (!book) return;
            const res = await addPreparationPackage({
                resourceId: data.ResourceId,
                acaSectionId: book.AcaSectionId,
                acaSectionName: book.AcaSectionName,
                subjectId: book.SubjectID,
                subjectName: book.SubjectName,
                publisherId: book.PublisherID,
                publisherName: book.PublisherName,
                albumId: book.AlbumID,
                albumName: book.AlbumName,
                chapterId: book.ChapterID || course.value.chapterId,
                chapterName: book.ChapterName || course.value.chapterName,
                lessonId: book.LessonID || course.value.lessonId,
                lessonName: book.LessonName || course.value.lessonName,
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

        const downloadFile = async (data: IResourceItem) => {
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
                    } else {
                        emitter.emit("openEditResource", data);
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
                    if (props.name === "attendClass") {
                        if (data.ResourceShowType === 2) {
                            // 断点视频
                            store.commit(
                                MutationTypes.SET_FULLSCREEN_RESOURCE,
                                {
                                    component: "LookVideo",
                                    resource: { id: data.OldResourceId, openMore: true },
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
                                        openMore: true
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
                                        openMore: true
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
                                        openMore: true
                                    },
                                }
                            );
                        }
                    } else {
                        openResource(data);
                    }

                    logView({ id: data.ResourceId });
                    data.BrowseNum++;
                    break;
            }
        };

        const openResource = (data: IResourceItem) => {
            if (data.ResourceShowType === 2) {
                resourceData.value = { id: data.OldResourceId };
            } else if (data.ResourceShowType === 3) {
                resourceData.value = {
                    id: data.OldResourceId,
                    courseBagId: "",
                    deleteQuestionIds: [],
                    type: 1,
                };
            }
            resource.value = data;
            target.value = data.OldResourceId;
            resourceVisible.value = true;
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
            update("");
        });

        const update = (id: string) => {
            resourceList.value = [];
            pageNumber.value = 1;
            resourceId.value = id;
            getResources();
        };

        const getResources = async () => {
            if (course.value.chapterId && course.value.lessonId) {
                const res = await fetchResourceList({
                    chapterId: course.value.chapterId,
                    lessonId: course.value.lessonId,
                    resourceTypeId: type.value,
                    resourceType: source.value,
                    schoolId: schoolId.value,
                    bookId: bookId.value,
                    pager: {
                        pageNumber: pageNumber.value,
                        pageSize: pageSize.value,
                    },
                });

                resourceList.value = resourceList.value.concat(res.result.list);
                disabledScrollLoad.value = res.result.pager.IsLastPage;

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
                                behavior: "smooth",
                            });
                        }
                    }
                });
            }
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
            eventEmit,
            resourceVisible,
            load,
            disabledScrollLoad,
            onDeleteSuccess,
            update,
            openResource,
            name,
            resourceScroll,
            resourceId,
			resourceData
        };
    },
});
</script>

<style lang="scss" scoped>
.p-layout-list {
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
    padding: 0 20px;
    overflow-y: auto;
    .doing {
        border-left: 4px solid #4b71ee;
        box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.16);
    }
}

.tip {
    width: 200px;
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
</style>
