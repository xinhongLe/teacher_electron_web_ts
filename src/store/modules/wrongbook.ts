import { RootState, WrongBookState } from "@/types/store";
import { Module, MutationTree, ActionTree } from "vuex";
import { MutationTypes, ActionTypes } from "..";
import {
    AddIntoPaperBasket,
    PaperBasketInfo,
    DelQuestionForPaperBasket,
    delBasketParams,
} from "@/api/errorbook";
const initState = (): WrongBookState => ({
    questionBasket: [], //试题篮试题数
    baskTotal: 0, //试题篮总数
    currentClassId: "", //当前选择的班级id
    currentBookId: "", //当前书册id
    currentPaperName: "", //生成练习的名称
    currentGeneratePaperId: "", //生成的练习卷的id
    currentSelectedBookName: "", //当前选择的书册名称
    currentSubjectId: "", //当前科目id
});
const mutations: MutationTree<WrongBookState> = {
    [MutationTypes.SET_QUESTION_BASKET](state, data) {
        // console.log(state, data);
        state.questionBasket = data;
    },
    [MutationTypes.SET_QUESTION_BASKET_TOTAL](state, total) {
        // console.log(state, total);
        state.baskTotal = total;
    },
};
const operateBasket = (commit: any, data: any) => {
    commit(MutationTypes.SET_QUESTION_BASKET_TOTAL, data.result.Count);
    commit(MutationTypes.SET_QUESTION_BASKET, data.result.QuestionTypeInfos);
};

const actions: ActionTree<WrongBookState, RootState> = {
    async [ActionTypes.FETCH_BASKET_LIST]({ commit }, data) {
        console.log("wrongbook-action", commit);

        const res: any = await PaperBasketInfo(data);
        if (res.resultCode === 200) {
            operateBasket(commit, res);
        }
    },
    async [ActionTypes.ADD_QUESTION_BASKET]({ commit }, question) {
        console.log("ADD_QUESTION_BASKET", commit, question);
        const params = {
            questionId: question.QuestionId,
            classId: question.classId,
            bookId: question.bookId,
            questionType: question.QuestionType,
        };
        const res: any = await AddIntoPaperBasket(params);
        console.log("添加试题篮--", res);
        if (res.resultCode === 200) {
            const res2: any = await PaperBasketInfo({
                classId: question.classId,
                bookId: question.bookId,
            });
            if (res2.resultCode === 200) {
                operateBasket(commit, res2);
            }
        }
    },
    async [ActionTypes.DEL_QUESTION_BASKET]({ commit }, question) {
        const params: delBasketParams = question;
        const res: any = await DelQuestionForPaperBasket(params);
        console.log(res);
        if (res.resultCode === 200) {
            // operateBasket(commit, res);
            const res2: any = await PaperBasketInfo({
                classId: question.classId,
                bookId: question.bookId,
            });
            if (res2.resultCode === 200) {
                operateBasket(commit, res2);
            }
        }
    },
};
const wrongBookModule: Module<WrongBookState, RootState> = {
    state: initState,
    mutations,
    actions,
};

export default wrongBookModule;
