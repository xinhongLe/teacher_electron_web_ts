import { reactive, ref, toRefs } from "vue";
import { searchByKnowledgeLabList, KnowledgeLabParams } from "@/api/errorbook";
import { MutationTypes, store, ActionTypes } from "@/store";

export default () => {
    const state = reactive({
        knowledgeLabList: [],
        questionTypeList: [
            {
                ID: "",
                Name: "全部题型",
            },
            {
                ID: [1, 2],
                Name: "选择题",
            },
            {
                ID: [3, 4],
                Name: "判断题",
            },
            {
                ID: [5],
                Name: "填空题",
            },
            {
                ID: [6],
                Name: "应用题",
            },
            {
                ID: [7],
                Name: "语音题",
            },
            {
                ID: [8],
                Name: "解答题",
            },
        ],
        //频次
        frequencyList: [
            {
                name: "全部频次",
                value: 0,
            },
            {
                name: "1次",
                value: 1,
            },
            {
                name: "2次",
                value: 2,
            },
            {
                name: "3次及以上",
                value: 3,
            },
        ],
        currentHomeworkBookId: [],
    });
    //获取下拉数据
    const queryKnowledgeLabList = async (params: KnowledgeLabParams) => {
        const res: any = await searchByKnowledgeLabList(params);
        if (res.resultCode === 200) {
            state.knowledgeLabList = res.result;
        }
    };
    //过滤最近错误
    const formatRecentWrongRatio = (data: any) => {
        if (data && data.length) {
            return Number(data[0]?.AvgWrongRatio * 100).toFixed(1);
        }
    };
    //最近错误率比较
    const formatErrorCom = (data: any) => {
        if (data && data.length) {
            return data[0]?.AvgWrongRatio > data[1]?.AvgWrongRatio
                ? 1
                : data[0]?.AvgWrongRatio < data[1]?.AvgWrongRatio
                ? 2
                : 0;
        }
    };
    //过滤最近完成率
    const formatRecentRatio = (data: any) => {
        if (data && data.length) {
            return Number(data[0]?.FinishRatio * 100).toFixed(1);
        }
    };
    //过滤问题类型成文本
    const formatQuestionType = (type: number) => {
        // console.log("type", type, questionTypeList.value);
        return state.questionTypeList.find((item: any) =>
            item.ID.includes(type)
        )?.Name;
    };
    //过滤左边列表的平均错误率的颜色
    const formatProColor = (item: any, index?: string) => {
        if (index && item.QuestionId == index) {
            return "#fff";
        } else {
            const number = Number(
                (item.TotalWrong /
                    (item.TotalNoSure + item.TotalRight + item.TotalWrong)) *
                    100
            );
            if (number > 80 && number <= 100) {
                return "#FF6B6B";
            } else if (number >= 60 && number <= 80) {
                return "#FBC54D";
            } else if (number < 60) {
                return "#2EE18E";
            }
        }
    };
    const formatRecentColor = (item: any, index?: string) => {
        if (index && item.QuestionId == index) {
            return "#fff";
        } else {
            const number = Number(item[0]?.AvgWrongRatio * 100);
            if (number > 80 && number <= 100) {
                return "#FF6B6B";
            } else if (number >= 60 && number <= 80) {
                return "#FBC54D";
            } else if (number < 60) {
                return "#2EE18E";
            }
        }
    };

    //过滤当前的题目是否在错题栏
    const formatInBasket = (data: any) => {
        // return true;
        const questions: any = [];
        const questionBasket = store.state.wrongbook.questionBasket as any;
        // console.log("过滤当前的题目是否在错题栏", data, questionBasket);

        questionBasket.forEach((item: any) => {
            item.Questions.forEach((data: any) => {
                questions.push(data);
            });
        });
        const basketList =
            questions.map((item: any) => {
                return item.QuestionId;
            }) || [];
        if (basketList.includes(data.QuestionId)) {
            return false;
        } else {
            return true;
        }
    };
    //清空所有的试题篮中的数据
    const delAllBasketData = async () => {
        const params = {
            isAllDel: 1,
            classId: store.state.wrongbook.currentClassId,
            bookId: store.state.wrongbook.currentBookId,
            questionIds: [],
            questionType: 0,
        };
        store.dispatch(ActionTypes.DEL_QUESTION_BASKET, params);
    };

    return {
        queryKnowledgeLabList,
        formatRecentWrongRatio,
        formatErrorCom,
        formatRecentRatio,
        formatQuestionType,
        formatProColor,
        formatRecentColor,
        formatInBasket,
        delAllBasketData,
        ...toRefs(state),
    };
};
