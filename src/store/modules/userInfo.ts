import { RootState, UserInfoState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): UserInfoState => ({
    Schools: [],
    schoolId: "",
    schoolName: "",
    name: "",
    account: "",
    userCenterUserID: "",
    id: ""
});

const mutations: MutationTree<UserInfoState> = {
    [MutationTypes.UPDATE_USERINFO](state, userInfo: UserInfoState) {
        Object.assign(state, userInfo);
    },
    [MutationTypes.USER_INFO_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.UPDATE_SELECTED_SCHOOL](state, { schoolId, schoolName }) {
        state.schoolId = schoolId;
        state.schoolName = schoolName;
    }
};

const userInfoModule: Module<UserInfoState, RootState> = {
    state: initState,
    mutations
};

export default userInfoModule;
