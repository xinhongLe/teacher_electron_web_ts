import { CommonState, IshowResourceFullScreen, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): CommonState => ({
    isDragging: false,
    isIframe: false,
    resource: null,
    showResourceFullScreen: []
});

const mutations:MutationTree<CommonState> = {
    [MutationTypes.SET_IS_DRAGGING](state, flag) {
        state.isDragging = flag;
    },
    [MutationTypes.COMMON_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.SET_IS_IFRAME](state, { flag }) {
        state.isIframe = flag;
    },
    [MutationTypes.SET_FULLSCREEN_RESOURCE](state, data: IshowResourceFullScreen) {
        const index = state.showResourceFullScreen.findIndex(item => item.resource.id === data.resource.id);
        if (index === -1) {
            state.showResourceFullScreen.push(data);
        } else {
            const resource = state.showResourceFullScreen.splice(index, 1);
            state.showResourceFullScreen.push(resource[0]);
        }
    },
    [MutationTypes.REMOVE_FULLSCREEN_RESOURCE](state, id: string) {
        const index = state.showResourceFullScreen.findIndex(item => item.resource.id === id);
        console.log(id, index, state.showResourceFullScreen);
        if (index > -1) state.showResourceFullScreen.splice(index, 1);
    }
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
