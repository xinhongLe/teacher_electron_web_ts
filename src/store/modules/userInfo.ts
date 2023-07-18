import {RootState, UserInfoState} from "@/types/store";
import {Module, MutationTree} from "vuex";
import {MutationTypes} from "..";
import {set, STORAGE_TYPES} from "@/utils/storage";

const initState = (): UserInfoState => ({
    Schools: [],
    schoolId: "",
    schoolName: "",
    name: "",
    account: "",
    userCenterUserID: "",
    id: "",
    currentSelectClass: {
        ClassAixueshiId: "",
        ClassUserCenterId: "",
        ClassName: ""
    },
    classList: []
});

const mutations: MutationTree<UserInfoState> = {
    [MutationTypes.UPDATE_USERINFO](state, userInfo: UserInfoState) {
        Object.assign(state, userInfo);
        set(STORAGE_TYPES.CURRENT_USER_INFO, userInfo); // 子窗口使用
    },
    [MutationTypes.USER_INFO_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.UPDATE_SELECTED_SCHOOL](state, {schoolId, schoolName}) {
        state.schoolId = schoolId;
        state.schoolName = schoolName;
        set(STORAGE_TYPES.CURRENT_USER_INFO, Object.assign(state, {schoolId, schoolName})); // 子窗口使用
    },

};

const userInfoModule: Module<UserInfoState, RootState> = {
    state: initState,
    mutations
};

export default userInfoModule;
