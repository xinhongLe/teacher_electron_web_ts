import { IUserInfo } from "@/types/user";
import { MutationTree } from "vuex";
import { MutationTypes } from "./constants";
import { State } from "./state";

export const mutations: MutationTree<State> = {
    [MutationTypes.UPDATE_USERINFO](state, userInfo: IUserInfo) {
        state.userInfo = userInfo;
    }
};
