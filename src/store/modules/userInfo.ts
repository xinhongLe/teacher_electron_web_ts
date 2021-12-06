import { RootState, UserInfoState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): UserInfoState => ({
    Schools: [],
    name: "",
    account: "",
    id: ""
});

const mutations: MutationTree<UserInfoState> = {
    [MutationTypes.UPDATE_USERINFO](state, userInfo: UserInfoState) {
        Object.assign(state, userInfo);
    },
    [MutationTypes.USER_INFO_RESET_STATE](state) {
        Object.assign(state, initState());
    }
};

const userInfoModule: Module<UserInfoState, RootState> = {
    state: initState,
    mutations
};

export default userInfoModule;
