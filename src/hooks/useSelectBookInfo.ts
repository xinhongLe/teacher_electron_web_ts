import {
    getSubjectPublisherBookList, getChapters, getWindowCards, deleteCardOrPage, addPage,
    renameCardOrPage, setCardOrPageState, updateCardSort, movePage, addCard, copyPage,
    IGetChapters, IGetWindowCards, IDelCardOrPage, IAddPage, IRenameCardOrPage,
    ICardOrPageState, ICardSortRes, IAddCard, ICopyPage, IMovePage
} from "@/api/home";
import { ITreeList, ICardList, IPageValue } from "@/types/home";
import { reactive, ref, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import Node from "element-plus/es/components/tree/src/model/node";
import { useRoute } from "vue-router";
import TrackService, { EnumTrackEventType } from "@/utils/common";
interface State {
    subjectPublisherBookList: ITreeList[],
    subjectPublisherBookValue: string[],
    chaptersList: ITreeList[],
    chaptersValue: string,
    winList: ITreeList[],
    winValue: string[],
    windowCards: ICardList[],
    oldWindowCards: ICardList[], // 拖拽使用
    pastePage: IPageValue | null
}

export default () => {
    const route = useRoute();
    const defaultProps = ref({ children: "PageList", label: "Name", value: "ID" });
    const pageValue = ref<IPageValue>({
        ID: "",
        Type: 11,
        TeachPageRelationID: "",
        State: false
    });
    const cardsValue = ref({ ID: "" });
    const isSetCache = ref(false); // 是否需要更新窗下的数据
    const state = reactive<State>({
        subjectPublisherBookList: [],
        subjectPublisherBookValue: [],
        chaptersList: [],
        chaptersValue: "",
        winList: [],
        winValue: [],
        windowCards: [],
        oldWindowCards: [],
        pastePage: null // 粘贴卡
    });

    const findFirstId = (tree: ITreeList[], ids: string[]) => {
        tree.forEach((item) => {
            ids.push(item.ID);
            if (item.Children && item.Children.length > 0) {
                findFirstId([item.Children[0]], ids);
            }
        });
        return ids;
    };

    const _getSubjectPublisherBookList = () => {
        getSubjectPublisherBookList().then(res => {
            if (res.resultCode === 200) {
                state.subjectPublisherBookList = res.result;
                state.subjectPublisherBookValue = findFirstId([state.subjectPublisherBookList[0]], []);
            }
        });
    };

    const _getChapters = (data: IGetChapters) => {
        getChapters(data).then(res => {
            if (res.resultCode === 200) {
                state.chaptersList = res.result || [];
                if (state.chaptersList.length > 0) {
                    state.chaptersValue = state.chaptersList[0].ID;
                    state.winValue = [];
                } else {
                    state.chaptersValue = "";
                    state.winList = [];
                    state.winValue = [];
                    state.windowCards = [];
                }
            }
        });
    };

    const _getWinList = (curVal: string) => {
        const value: ITreeList | undefined = state.chaptersList.find(item => item.ID === curVal);
        if (value && Array.isArray(value.Children) && value.Children.length > 0) {
            state.winList = value.Children.filter((item: any) => item.Children && item.Children.length > 0);
        } else {
            state.winList = [];
        }
        state.winValue = [];
        state.windowCards = [];
    };

    const _getWindowCards = (data: IGetWindowCards, isCache = false) => {
        return getWindowCards(data).then(res => {
            if (res.resultCode === 200) {
                state.windowCards = res.result;
                isSetCache.value = isCache;
                state.oldWindowCards = JSON.parse(JSON.stringify(res.result));
            }
        });
    };

    return {
        isSetCache,
        defaultProps,
        pageValue,
        cardsValue,
        state,
        findFirstId,
        _getSubjectPublisherBookList,
        _getChapters,
        _getWindowCards,
        _getWinList
    };
};
