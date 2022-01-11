import { fetchPreparateListPage } from "../api";
import { ref } from "vue";
import { PreparateListBag, PagerRes, FetchPreparateListPageData, FetchPreparateListPageRes } from "@/types/preparationGroup";

export default () => {
    const cardList = ref<PreparateListBag[]>([]);
    const pageParams = ref<PagerRes>();

    const dealResult = (res:FetchPreparateListPageRes) => {
        const { list = [], pager } = res;
        cardList.value = list;
        pageParams.value = pager;
    };

    const getCardList = async (params: FetchPreparateListPageData) => {
        sessionStorage.setItem("cardParams", JSON.stringify(params));
        const res = await fetchPreparateListPage(params);
        if (res.resultCode === 200) {
            dealResult(res.result);
        }
    };

    return {
        cardList,
        pageParams,
        getCardList
    };
};
