import { CommonState, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): CommonState => ({
    isDragging: false,
    isShowVideo: false,
    viewQuestionInfo: {
        type: 1,
        id: ""
    },
    viewVideoInfo: {
        id: ""
    },
    isShowQuestion: false,
    isIframe: false
});

const mutations:MutationTree<CommonState> = {
    [MutationTypes.SET_IS_DRAGGING](state, flag) {
        state.isDragging = flag;
    },
    [MutationTypes.SET_IS_SHOW_QUESTION](state, { flag, info }) {
        state.isShowQuestion = flag;
        state.viewQuestionInfo = info;
    },
    [MutationTypes.SET_IS_SHOW_VIDEO](state, { flag, info }) {
        state.isShowVideo = flag;
        state.viewVideoInfo = info;
    },
    [MutationTypes.COMMON_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.SET_IS_IFRAME](state, { flag }) {
        state.isIframe = flag;
    }
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
