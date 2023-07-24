<template>
    <el-dialog
        class="custom-dialog download-dialog"
        v-model="showDialog"
        center
        title="下载"
        width="700px"
        :destroy-on-close="true"
        :before-close="handleClose"
    >
        <div class="download-log-container">
            <div class="download-log-header">
                <el-input
                    class="download-search-input"
                    v-model="keywards"
                    placeholder="搜索下载内容"
                    :prefix-icon="Search"
                    @change="searchHistory"
                    clearable
                />

                <el-dropdown
                    class="download-log-clear"
                    placement="bottom-end"
                    trigger="click"
                >
                    <el-icon><MoreFilled /></el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="clearHisory"
                                >清除下载历史</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class="download-log-content">
                <div
                    class="download-no-content"
                    v-show="downloadList.length === 0 && keywards.length === 0"
                >
                    <img src="@/assets/images/other/pic_none.png" alt="" />
                    <div>暂无下载内容</div>
                </div>

                <div
                    class="download-no-content"
                    v-show="downloadList.length === 0 && keywards.length > 0"
                >
                    <img src="@/assets/images/other/pic_noresult.png" alt="" />
                    <div>暂无搜索结果</div>
                </div>

                <div
                    class="download-log-date"
                    v-for="item in downloadList"
                    :key="item.time"
                >
                    <div class="date-title">
                        {{ item.time === today ? "今天" : item.time }}
                    </div>

                    <div
                        class="file-item"
                        v-for="file in item.list"
                        :key="file.id + file.timestamp"
                    >
                        <el-icon class="download-log-close" @click="closeDownload(file)"><Close /></el-icon>

                        <div class="file-icon">
                            <img
                                src="@/assets/images/other/pic_download.png"
                                alt=""
                            />
                        </div>
                        <div class="file-content">
                            <div
                                class="file-name"
                                :class="
                                    (file.status === 3 || file.status === 4) &&
                                    'file-cancel'
                                "
                                @click="openFile(file)"
                            >
                                {{ file.name }}
                            </div>

                            <div
                                class="download-log-progress"
                                v-if="downloadingList.findIndex(v => v.id === file.id && v.timestamp === file.timestamp) > -1"
                            >
                                <el-progress
                                    :percentage="getProgress(file.id)"
                                    :stroke-width="4"
                                    striped
                                    striped-flow
                                    :duration="10"
                                    :show-text="false"
                                />
                            </div>

                            <div
                                v-if="downloadingList.findIndex(v => v.id === file.id && v.timestamp === file.timestamp) === -1 && file.status === 0"
                                class="download-log-wait"
                            >
                                等待中
                            </div>

                            <div
                                class="download-log-btns"
                                v-if="file.status === 0 || file.status === 1"
                            >
                                <el-button size="small" @click="cancelDownload(file)">取消</el-button>
                            </div>

                            <div
                                class="download-log-finish"
                                v-if="file.status === 2"
                                @click="showInFolder(file)"
                            >
                                在文件夹中显示
                            </div>

                            <div
                                class="download-log-cancel"
                                v-if="file.status === 3 || file.status === 4"
                            >
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="resetDownload(file)"
                                >
                                    重试
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { MutationTypes, store } from "@/store";
import { IDownloading } from "@/types/store";
import emitter, { EmitterEvents } from "@/utils/emitter";
import LocalCache from "@/utils/localcache";
import { getOssUrl } from "@/utils/oss";
import { STORAGE_TYPES, get, remove, set } from "@/utils/storage";
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import { ref, watch } from "vue";
import { CancelTokenSource } from "axios";

const emit = defineEmits(["update:visible"]);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});

const showDialog = ref(false);
watch(
    () => props.visible,
    () => {
        showDialog.value = props.visible;
    }
);

const handleClose = () => {
    emit("update:visible", false);
};

const keywards = ref("");

interface IDownload {
    time: string;
    list: IDownloading[];
}

interface IProgress {
    id: string;
    progress: number;
    instance?: LocalCache;
    source?: CancelTokenSource;
}

const getProgress = (id: string) => {
    const index = downLoadingProgress.value.findIndex((v) => v.id === id);
    return downLoadingProgress.value[index].progress;
};

const today = moment().format("YYYY年M月D日");
const downloadList = ref<IDownload[]>([]);
const downloadingList = ref<IDownloading[]>([]);
const downLoadingProgress = ref<IProgress[]>([]);

const startDownload = async (item: IDownloading) => {
    downloadingList.value.push(item);
    const path = window.electron.getPath("downloads");
    if (item.type === "wincard") {
        const localCache = new LocalCache({
            cachingStatus: (status) => {
                // console.log(`status: ${status}`);
                const index = downLoadingProgress.value.findIndex(
                    (v) => v.id === item.id
                );
                if (index > -1) downLoadingProgress.value[index].progress = status;
                if (status === 100) {
                    ElMessage.success(`打包下载 ${item.name} 完成！`);
                    downloadNext(item.id, 2);
                }
            },
        });
        downLoadingProgress.value.push({
            id: item.id,
            progress: 0,
            instance: localCache
        });
        localCache.doCache(
            {
                WindowID: item.data.OldResourceId,
                OriginType: item.data.IsSysFile === 1 ? 0 : 1,
            },
            item.data.Name,
            path,
            () => {
                ElMessage.error(`网络异常，打包 ${item.name} 下载失败！`);
                downloadNext(item.id, 4);
            }
        );
    } else {
        const url = await getOssUrl(
            `${item.data.File.FilePath}/${item.data.File.FileMD5}.${item.data.File.FileExtention}`,
            item.data.File.FileBucket
        );

        window.electron
            .downloadFile(
                url,
                `${path}/${item.data.File.FileName}.${item.data.File.FileExtention}`,
                (progress: number) => {
                    // console.log(`progress: ${progress}`);
                    const index = downLoadingProgress.value.findIndex(
                        (v) => v.id === item.id
                    );
                    downLoadingProgress.value[index].progress = progress;
                },
                (source) => {
                    downLoadingProgress.value.push({
                        id: item.id,
                        progress: 0,
                        source: source
                    });
                }
            )
            .then((isOk) => {
                if (isOk) {
                    ElMessage.success(`打包下载 ${item.name} 完成！`);
                    downloadNext(item.id, 2);
                } else {
                    ElMessage.error(`网络异常，打包 ${item.name} 下载失败！`);
                    downloadNext(item.id, 4);
                }
            });
    }
};

const cancelDownload = (file: IDownloading) => {
    ElMessageBox.confirm("是否取消下载？", "提示").then(
        (res) => {
            if (res === "confirm") {
                const index = downLoadingProgress.value.findIndex(item => item.id === file.id);
                if (index !== -1) {
                    downLoadingProgress.value[index].instance?.destory();
                    downLoadingProgress.value[index].source?.cancel();
                    downloadingList.value.splice(index, 1);
                    downLoadingProgress.value.splice(index, 1);
                } 
                
                store.commit(MutationTypes.MOVE_DOWNLOADING, { id: file.id, status: 3, timestamp: file.timestamp });
            }
        }
    ).catch(() => {});
};

const downloadNext = (id: string, status: number) => {
    const index = downloadingList.value.findIndex((item) => item.id === id);
    const timestamp = downloadingList.value[index].timestamp;
    downloadingList.value.splice(index, 1);
    downLoadingProgress.value.splice(index, 1);
    store.commit(MutationTypes.MOVE_DOWNLOADING, { id, status, timestamp });
};

const initHistory = async () => {
    const history = (get(STORAGE_TYPES.DOWNLOAD_HISTORY) ||
        []) as IDownloading[];
    const list: IDownload[] = [];
    const downloading: IDownloading[] = [];
    for (const item of history) {
        const time = moment(item.timestamp).format("YYYY年M月D日");
        if (item.status === 0) {
            downloading.push(item);
            if (downloadingList.value.length < 2) {
                item.status = 1;
                await startDownload(item);
            }
        }

        if (list.length > 0 && list[list.length - 1].time === time) {
            list[list.length - 1].list.push(item);
        } else {
            list.push({
                time,
                list: [item],
            });
        }
    }

    store.commit(MutationTypes.INIT_DOWNLOADING, downloading);

    downloadList.value = list;
};

initHistory();

emitter.on(EmitterEvents.DOWNLOAD_CHANGE, (downList: IDownloading[]) => {
    const list: IDownload[] = [];
    for (const item of downList) {
        const time = moment(item.timestamp).format("YYYY年M月D日");
        if (list.length > 0 && list[list.length - 1].time === time) {
            list[list.length - 1].list.push(item);
        } else {
            list.push({
                time,
                list: [item],
            });
        }
    }
    downloadList.value = list;

    const storeDownloading = store.state.common.downloading;
    if (
        storeDownloading.length > downloadingList.value.length &&
        downloadingList.value.length < 2
    ) {
        for (const item of storeDownloading) {
            if (item.status === 0) {
                item.status = 1;
                startDownload(item);
                store.commit(MutationTypes.INIT_DOWNLOADING, storeDownloading);
                break;
            }
        }
    }
});

const showInFolder = async (file: IDownloading) => {
    const path = window.electron.getPath("downloads");

    const fileUrl =
        file.type === "wincard"
            ? `${path}/${file.name}.lyxpkg`
            : `${path}/${file.data.File.FileName}.${file.data.File.FileExtention}`;
    const isExist = await window.electron.isExistFile(fileUrl);
    if (isExist) {
        window.electron.shell.showItemInFolder(fileUrl);
    } else {
        ElMessage.error("文件不存在！");
    }
};

const openFile = async (file: IDownloading) => {
    const path = window.electron.getPath("downloads");
    const fileUrl =
        file.type === "wincard"
            ? `${path}/${file.name}.lyxpkg`
            : `${path}/${file.data.File.FileName}.${file.data.File.FileExtention}`;
    const isExist = await window.electron.isExistFile(fileUrl);
    if (isExist) {
        window.electron.shell.openPath(fileUrl);
    } else {
        ElMessage.error("文件不存在！");
    }
};

const resetDownload = (file: IDownloading) => {
    const storeDownloading = store.state.common.downloading;
    if (storeDownloading.findIndex((item) => item.id === file.id) > -1) {
        return ElMessage.warning("已在下载列表中");
    }

    file.status = 0;
    const history = (get(STORAGE_TYPES.DOWNLOAD_HISTORY) ||
        []) as IDownloading[];
    const index = history.findIndex(
        (item) => item.id === file.id && item.timestamp === file.timestamp
    );
    history[index].status = 0;
    set(STORAGE_TYPES.DOWNLOAD_HISTORY, history);

    for (const item of downloadList.value) {
        if (item.time === moment(file.timestamp).format("YYYY年M月D日")) {
            for (const v of item.list) {
                if (v.timestamp === file.timestamp && v.id === file.id) {
                    v.status = 0;
                    break;
                }
            }
            break;
        }
    }

    storeDownloading.unshift(JSON.parse(JSON.stringify(file)));

    store.commit(MutationTypes.INIT_DOWNLOADING, storeDownloading);

    if (downloadingList.value.length < 2) {
        file.status = 1;
        startDownload(file);
    }
};

const clearHisory = () => {
    const storeDownloading = store.state.common.downloading;
    if (storeDownloading.length > 0) return ElMessage.warning("存在正在下载的文件，请先取消");
    ElMessageBox.confirm("是否确认清空下载历史记录？", "提示").then(
        (res) => {
            if (res === "confirm") {
                remove(STORAGE_TYPES.DOWNLOAD_HISTORY);
                downloadList.value = [];
            }
        }
    ).catch(() => {});
};

const searchHistory = () => {
    const history = (get(STORAGE_TYPES.DOWNLOAD_HISTORY) ||
        []) as IDownloading[];

    const list: IDownload[] = [];
    for (const item of history) {
        if (item.name.indexOf(keywards.value) > -1 || keywards.value.length === 0) {
            const time = moment(item.timestamp).format("YYYY年M月D日");

            if (list.length > 0 && list[list.length - 1].time === time) {
                list[list.length - 1].list.push(item);
            } else {
                list.push({
                    time,
                    list: [item],
                });
            }
        }
    }

    downloadList.value = list;
};

const closeDownload = (file: IDownloading) => {
    const index = downloadingList.value.findIndex(item => item.id === file.id && item.timestamp === file.timestamp);
    if (index > -1) {
        return ElMessage.warning("请先取消下载");
    }

    ElMessageBox.confirm("是否确认删除该历史记录？", "提示").then(
        (res) => {
            if (res === "confirm") {
                const history = (get(STORAGE_TYPES.DOWNLOAD_HISTORY) || []) as IDownloading[];
                const index = history.findIndex(item => item.id === file.id && item.timestamp === file.timestamp);
                history.splice(index, 1);
                set(STORAGE_TYPES.DOWNLOAD_HISTORY, history);

                const list: IDownload[] = [];
                for (const item of history) {
                    if (item.name.indexOf(keywards.value) > -1 || keywards.value.length === 0) {
                        const time = moment(item.timestamp).format("YYYY年M月D日");

                        if (list.length > 0 && list[list.length - 1].time === time) {
                            list[list.length - 1].list.push(item);
                        } else {
                            list.push({
                                time,
                                list: [item],
                            });
                        }
                    }
                }

                downloadList.value = list;
            }
        }
    ).catch(() => {});
};
</script>

<style lang="scss">
.download-dialog {
    height: 70vh;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
        flex: 1;
        min-height: 0;
    }

    --el-color-primary: #4b71ee;
}

.download-log-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .download-log-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .download-log-clear {
            .el-icon {
                transform: rotate(90deg);
                cursor: pointer;
            }
        }
    }

    .download-log-content {
        flex: 1;
        min-height: 0;
        position: relative;
        overflow-y: auto;
        .download-no-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -70%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                margin-bottom: -20px;
            }
        }
    }
}

.download-search-input {
    flex: 1;
    margin-right: 20px;
    .el-input__wrapper {
        background-color: #f0f2f6;
        border-radius: 16px;
        box-shadow: none;
    }
}

.download-log-date {
    margin-top: 20px;
    &:first-child {
        margin-top: 0;
    }
    .date-title {
        font-weight: 600;
        font-size: 12px;
        margin-bottom: 15px;
    }

    .download-log-close {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }

    .file-item {
        margin-bottom: 10px;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        border: 1px solid #e0e2e7;
        padding: 20px;
        display: flex;
        align-items: center;
        position: relative;
        .file-icon {
            margin-right: 25px;
            img {
                display: block;
            }
        }
        .file-content {
            flex: 1;
            min-width: 0;
        }
        .file-name {
            font-size: 12px;
            color: #4b71ee;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.file-cancel {
                color: #888;
                text-decoration: line-through;
            }
        }
    }

    .download-log-progress {
        margin: 10px 0;
    }

    .download-log-finish {
        margin-top: 15px;
        font-size: 12px;
        color: #4b71ee;
        cursor: pointer;
    }

    .download-log-cancel {
        margin-top: 15px;
    }

    .download-log-wait {
        font-size: 12px;
        margin: 10px 0;
    }
}
</style>
