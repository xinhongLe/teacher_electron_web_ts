import { IBookItem, ICustomBookItem } from "@/api/resource";
import { PreparationState, RootState } from "@/types/store";
import { Module, MutationTree } from "vuex";
import { MutationTypes } from "..";

const initState = (): PreparationState => ({
    isViewCourseDetailIng: false,
    selectChapterID: "",
    isDraggingElement: false,
    isClickDetail: false,
    selectNextType: "",
    subjectPublisherBookValue: undefined,
    subjectPublisherBookList: [],
    editWindowInfo: {
        id: "",
        name: "",
        lessonId: "",
        originType: 0,
        allWindowNames: []
    },
    selectLessonId: "",
    term: {
        id: "",
        code: ""
    }

});

const mutations:MutationTree<PreparationState> = {
    [MutationTypes.SET_SELECT_CHAPTER_ID](state, id: string) {
        state.selectChapterID = id;
    },
    [MutationTypes.SET_VIEW_COURSE_DETAIL_ING](state, flag: boolean) {
        state.isViewCourseDetailIng = flag;
    },
    [MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE](state, value: ICustomBookItem) {
        state.subjectPublisherBookValue = value;
    },
    [MutationTypes.SET_IS_DRAGGING_ELEMENT](state, flag) {
        state.isDraggingElement = flag;
    },
    [MutationTypes.SET_IS_CLICK_DETAIL](state, flag) {
        state.isClickDetail = flag;
    },
    [MutationTypes.SET_SELECT_NEXT_TYPE](state, flag) {
        state.selectNextType = flag;
    },
    [MutationTypes.SET_SELECT_LESSON_ID](state, flag) {
        state.selectLessonId = flag;
    },
    [MutationTypes.SET_EDIT_WINDOW_INFO](state, flag: PreparationState["editWindowInfo"]) {
        state.editWindowInfo = flag;
    },
    [MutationTypes.PREPARATION_STUDENT_RESET_STATE](state) {
        Object.assign(state, initState());
    },
    [MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_LIST](state, bookList: IBookItem[]) {
        state.subjectPublisherBookList = bookList;
    },
    [MutationTypes.SET_TERM](state, term: { id: string; code: string; }) {
        state.term = term;
    }
};

const preparation: Module<PreparationState, RootState> = {
    state: initState,
    mutations
};

export default preparation;
