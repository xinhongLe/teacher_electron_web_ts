import { reactive, ref, toRefs } from "vue";
import { searchByKnowledgeLabList, KnowledgeLabParams } from "@/api/errorbook";
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

    return {
        queryKnowledgeLabList,
        formatRecentWrongRatio,
        formatErrorCom,
        formatRecentRatio,
        formatQuestionType,
        ...toRefs(state),
    };
};
