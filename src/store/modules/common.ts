import { CommonState, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): CommonState => ({
    isDragging: false
});

const mutations:MutationTree<CommonState> = {
    [MutationTypes.SET_IS_DRAGGING](state, flag) {
        state.isDragging = flag;
    }
};

const common: Module<CommonState, RootState> = {
    state: initState,
    mutations
};

export default common;
