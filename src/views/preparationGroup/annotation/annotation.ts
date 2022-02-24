import { ref } from "vue";
import { GetDiscussionContentCards } from "./api";
interface GetWindowCards {
    WindowID: string
}
interface CardListItem {
    ID: string,
    Name: string,
    NickName: string,
    OriginType :number,
    TeachPageRelationID: string,
    Width: number,
    Type: number,
    Sort: number,
    Height: number,
    State: boolean,
    Remark?: string
}
interface cardList {
    ID: string,
    Name: string,
    NickName: string,
    Sort: number,
    TeachPageRelationID: string,
    Type: number,
    PageList: CardListItem[],
    id: string
}
export default () => {
    const allCardList:any = ref([]);
    const previewOptions:any = ref({});
    const cardListRef = ref();
    const expandFlag = ref(false);
    const annotationFlag = ref(true);
    const pageListRef = ref();
    const cardID = ref("");
    const _getWindowCards = async (date:GetWindowCards) => {
        const obj = {
            id: date.WindowID
        };
        const res = await GetDiscussionContentCards(obj);
        if (res.resultCode === 200) {
            // 去除列表里面状态为下架的页
            const removeStatePage = res.result.map((item:any) => {
                if (item && item.PageList) {
                    return {
                        ...item,
                        PageList: item.PageList.filter((items:any) => {
                            return items.State;
                        })
                    };
                }
            });
            // 去除列表没有页的卡
            allCardList.value = removeStatePage.filter((item:any) => { return item && item.PageList && item.PageList.length > 0; });
            if (allCardList.value.length > 0) cardListRef.value.handleClick(0, allCardList.value[0]);
        }
    };
    const updatePageList = (card: cardList) => {
        previewOptions.value = card;
        cardID.value = card.id;
    };
    const expand = () => {
        expandFlag.value = !expandFlag.value;
    };
    const closeAnotation = () => {
        annotationFlag.value = false;
    };
    const openAnotation = () => {
        annotationFlag.value = true;
    };
    const lastPage = () => {
        cardListRef.value.lastPage();
    };
    const firstPage = () => {
        cardListRef.value.firstPage();
    };
    return {
        allCardList,
        cardListRef,
        cardID,
        previewOptions,
        expandFlag,
        annotationFlag,
        pageListRef,
        _getWindowCards,
        updatePageList,
        expand,
        closeAnotation,
        openAnotation,
        lastPage,
        firstPage
    };
};
