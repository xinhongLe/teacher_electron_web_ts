import { PreparationState, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): PreparationState => ({
    isShowCourseBtn: false,
    selectChapterID: "",
    subjectPublisherBookValue: []
});

const mutations:MutationTree<PreparationState> = {
    [MutationTypes.SET_SELECT_CHAPTER_ID](state, id: string) {
        state.selectChapterID = id;
    },
    [MutationTypes.SET_SHOW_COURSE_BTN](state, flag: boolean) {
        state.isShowCourseBtn = flag;
    },
    [MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE](state, value: string[]) {
        state.subjectPublisherBookValue = value;
    }
};

const preparation: Module<PreparationState, RootState> = {
    state: initState,
    mutations
};

export default preparation;
