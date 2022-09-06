import { CommonState, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): CommonState => ({
    isDragging: false,
    isShowVideo: false,
    isShowWincard: false,
    wincard: {
        id: "",
        isSystem: false
    },
    viewQuestionInfo: {
        type: 1,
        id: "",
        courseBagId: ""
    },
    viewVideoInfo: {
        id: ""
    },
    isShowQuestion: false,
    isIframe: false,
    showScreenViewFile: false,
    resource: null
});

const mutations:MutationTree<CommonState> = {
    [MutationTypes.SET_IS_DRAGGING](state, flag) {
        state.isDragging = flag;
    },
    [MutationTypes.SET_IS_SHOW_QUESTION](state, { flag, info }) {
        state.showScreenViewFile = false;
        state.isShowVideo = false;
        state.isShowWincard = false;
        state.isShowQuestion = flag;
        state.viewQuestionInfo = info;
    },
    [MutationTypes.SET_IS_SHOW_VIDEO](state, { flag, info }) {
        state.isShowQuestion = false;
        state.showScreenViewFile = false;
        state.isShowWincard = false;
        state.isShowVideo = flag;
        state.viewVideoInfo = info;
    },
    [MutationTypes.COMMON_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.SET_IS_IFRAME](state, { flag }) {
        state.isIframe = flag;
    },
    [MutationTypes.SET_IS_WINCARD](state, { flag, id, isSystem }) {
        state.isShowQuestion = false;
        state.isShowVideo = false;
        state.showScreenViewFile = false;
        state.isShowWincard = flag;
        state.wincard = {
            id,
            isSystem
        };
    },
    [MutationTypes.SET_SHOW_VIEW_FILE](state, { flag, id, data }) {
        state.isShowQuestion = false;
        state.isShowVideo = false;
        state.isShowWincard = false;
        state.showScreenViewFile = flag;
        state.resource = data;
    }
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
