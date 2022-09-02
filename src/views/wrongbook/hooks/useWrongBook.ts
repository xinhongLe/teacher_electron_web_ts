import { reactive, ref, toRefs } from "vue";
import { searchByKnowledgeLabList, KnowledgeLabParams } from "@/api/errorbook";
export default () => {
    const state = reactive({
        knowledgeLabList: [],
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
