import { reactive, ref, toRefs } from "vue";
import { searchByKnowledgeLabList, KnowledgeLabParams } from "@/api/errorbook";
export default () => {
    const state = reactive({
        knowledgeLabList: [],
        questionTypeList: [
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
    });
    //获取下拉数据
    const queryKnowledgeLabList = async (params: KnowledgeLabParams) => {
        const res: any = await searchByKnowledgeLabList(params);
        if (res.resultCode === 200) {
            state.knowledgeLabList = res.result;
        }
    };

    return {
        queryKnowledgeLabList,
        ...toRefs(state),
    };
};
