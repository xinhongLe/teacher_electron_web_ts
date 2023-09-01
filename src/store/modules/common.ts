import { CommonState, IDownloading, IShowResourceFullScreen, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";
import { IResourceItem } from "@/api/resource";
import { STORAGE_TYPES, get, set } from "@/utils/storage";
import emitter, { EmitterEvents } from "@/utils/emitter";
import { ElMessage } from "element-plus";
// 文件不支持的特殊符号进行去除
import sanitize from "sanitize-filename";

const initState = (): CommonState => ({
    isDragging: false,
    isIframe: false,
    resource: null,
    showResourceFullScreen: [],
    singleResourceFullScreen: {},
    activeWindow: "LookVideo",
    currentPackageData: null,
    currentKebiaoResource: false,
    currentBeikeResource: true,
    resourceIntoType: 0,
    downloading: []
});

const mutations: MutationTree<CommonState> = {
    [MutationTypes.SET_IS_DRAGGING](state, flag) {
        state.isDragging = flag;
    },
    [MutationTypes.CURRENT_PACKAGE_DATA](state, flag) {
        state.currentPackageData = flag;
    },
    [MutationTypes.COMMON_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.SET_IS_IFRAME](state, { flag }) {
        state.isIframe = flag;
    },
    [MutationTypes.SET_FULLSCREEN_RESOURCE](state, data: IShowResourceFullScreen) {
        if (data.resource.openMore) {
            const index = state.showResourceFullScreen.findIndex(item => item.resource.id === data.resource.id);
            if (index === -1) {
                state.showResourceFullScreen.push(data);
            } else {
                const resource = state.showResourceFullScreen.splice(index, 1);
                state.showResourceFullScreen.push(resource[0]);
            }
        } else {
            state.activeWindow = data.component;
            if (data.component === "LookVideo") {
                state.singleResourceFullScreen.video = data;
            } else if (data.component === "LookQuestion") {
                state.singleResourceFullScreen.question = data;
            }
        }
    },
    [MutationTypes.REMOVE_FULLSCREEN_RESOURCE](state, {
        id,
        openMore,
        type
    }: { id: string; openMore: boolean, type?: string }) {
        if (openMore) {
            const index = state.showResourceFullScreen.findIndex(item => item.resource.id === id);
            if (index > -1) state.showResourceFullScreen.splice(index, 1);
        } else {
            if (type === state.activeWindow) state.activeWindow = "";
            if (type === "LookVideo") {
                state.singleResourceFullScreen.video = undefined;
            } else if (type === "LookQuestion") {
                state.singleResourceFullScreen.question = undefined;
            }
        }
    },
    [MutationTypes.SET_FULLSCREEN_RESOURCE_ACTIVE](state, type) {
        state.activeWindow = type;
    },
    [MutationTypes.SET_RESOURCE_INTO](state, type) {
        state.resourceIntoType = type;
    },
    [MutationTypes.SET_KEBIAO_RESOURCE_INTO](state, type) {
        state.currentKebiaoResource = type;
    },
    [MutationTypes.SET_BEIKE_RESOURCE_INTO](state, type) {
        state.currentBeikeResource = type;
    },
    [MutationTypes.SET_DOWNLOAD_LIST](state, { type, data }: { type: string, data: IResourceItem }) {
        const downloadObj = {
            id: data.ResourceId,
            name: type === "wincard" ? `${sanitize(data.Name)}.lyxpkg` : `${data.Name}.${data.File.FileExtention}`,
            type,
            data,
            timestamp: new Date().getTime(),
            status: 0
        };

        if (state.downloading.findIndex(item => item.id === downloadObj.id) > -1) {
            ElMessage.warning("已在下载列表中");
        } else {
            state.downloading.push(downloadObj);

            const downloadList = get(STORAGE_TYPES.DOWNLOAD_HISTORY) || [];

            downloadList.unshift(downloadObj);

            set(STORAGE_TYPES.DOWNLOAD_HISTORY, downloadList);

            emitter.emit(EmitterEvents.DOWNLOAD_CHANGE, downloadList);
        }
    },
    [MutationTypes.INIT_DOWNLOADING](state, downloading: IDownloading[]) {
        state.downloading = downloading;
    },
    [MutationTypes.MOVE_DOWNLOADING](state, {
        id,
        status,
        timestamp
    }: { id: string; status: number; timestamp: number; }) {
        const index = state.downloading.findIndex(item => item.id === id && item.timestamp === timestamp);
        state.downloading.splice(index, 1);

        const downloadList: IDownloading[] = get(STORAGE_TYPES.DOWNLOAD_HISTORY) || [];
        const i = downloadList.findIndex(item => item.id === id && item.timestamp === timestamp);
        downloadList[i].status = status;
        set(STORAGE_TYPES.DOWNLOAD_HISTORY, downloadList);

        emitter.emit(EmitterEvents.DOWNLOAD_CHANGE, downloadList);
    }
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
