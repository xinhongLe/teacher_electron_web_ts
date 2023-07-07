import {CommonState, IShowResourceFullScreen, RootState} from "@/types/store";
import {Module, MutationTree} from "vuex";
import {MutationTypes} from "..";

const initState = (): CommonState => ({
    isDragging: false,
    isIframe: false,
    resource: null,
    showResourceFullScreen: [],
    singleResourceFullScreen: {},
    activeWindow: "LookVideo",
    currentPackageData: null,
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
    [MutationTypes.SET_IS_IFRAME](state, {flag}) {
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
            console.log('state.showResourceFullScreen', state.showResourceFullScreen)

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
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
