import { MyStudentState, RootState } from "@/types/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { fetchClassStudents, fetchSchoolClassPage } from "@/views/classManage/api";
import { Module, MutationTree, ActionTree } from "vuex";
import { MutationTypes, ActionTypes } from "..";

const initState = ():MyStudentState => ({
    selectClassInfo: {
        GradeAlbum: "",
        ID: "",
        Name: "",
        SchoolId: "",
        SchoolName: "",
        StudentCount: 0,
        TeacherCount: 0
    },
    classList: [],
    allStudentList: [],
    isShowClassDialog: false,
    isEditClassDialog: false,
    searchStudent: ""
});

const mutations:MutationTree<MyStudentState> = {
    [MutationTypes.UPDATE_SELECT_CLASS_INFO](state, classInfo) {
        state.selectClassInfo = classInfo;
    },
    [MutationTypes.UPDATE_SEARCH_STUDENT](state, content: string) {
        state.searchStudent = content;
    },
    [MutationTypes.RESET_STATE](state) {
        Object.assign(state, initState);
    },
    [MutationTypes.UPDATE_GRADE_LIST](state, gradeList) {
        state.classList = gradeList;
    },
    [MutationTypes.UPDATE_STUDENT_LIST](state, list) {
        state.allStudentList = list;
    },
    [MutationTypes.SHOW_CLASS_DIALOG](state, { info, isEdit }) {
        state.isShowClassDialog = true;
        state.isEditClassDialog = isEdit;
        state.classDialogInfo = info;
    },
    [MutationTypes.CLOSE_CLASS_DIALOG](state) {
        state.isShowClassDialog = false;
        state.classDialogInfo = undefined;
    }
};

const actions: ActionTree<MyStudentState, RootState> = {
    async [ActionTypes.FETCH_CLASS_LIST]({ commit }, isActiveFirst) {
        const res = await fetchSchoolClassPage({
            teacherId: get(STORAGE_TYPES.USER_INFO).ID
        });
        if (res.resultCode === 200) {
            const gradeList = res.result.list;
            commit(MutationTypes.UPDATE_GRADE_LIST, gradeList);
            if (isActiveFirst && gradeList.length !== 0) {
                commit(MutationTypes.UPDATE_SELECT_CLASS_INFO, gradeList[0]);
            }
        }
    },
    async [ActionTypes.FETCH_STUDENT_LIST]({ commit, state }, classId) {
        const newClassId = classId || state.selectClassInfo.ID;
        const res = await fetchClassStudents({
            classId: newClassId
        });
        if (res.resultCode === 200) {
            const allStudentList = res.result.list;
            commit(MutationTypes.UPDATE_STUDENT_LIST, allStudentList);
        }
    }
};

const myStudent: Module<MyStudentState, RootState> = {
    state: initState,
    mutations,
    actions
};

export default myStudent;
