import {
    getSubjectPublisherBookList, getChapters, getWindowStruct,
    IGetChapters, IGetWindowCards
} from "@/api/home";
import { ITreeList, ICardList, IPageValue } from "@/types/home";
import { reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { Slide } from "wincard";
import useHome from "@/hooks/useHome";
interface State {
    subjectPublisherBookList: ITreeList[],
    subjectPublisherBookValue: string[],
    chaptersList: ITreeList[],
    chaptersValue: string,
    winList: ITreeList[],
    winValue: string[],
    windowCards: ICardList[],
    oldWindowCards: ICardList[], // 拖拽使用
    allPageListMap: Map<string, Slide>
    oldAllPageListMap: Map<string, Slide>
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
    // const isSetCache = ref(false); // 是否需要更新窗下的数据
    const state = reactive<State>({
        subjectPublisherBookList: [],
        subjectPublisherBookValue: [],
        chaptersList: [],
        chaptersValue: "",
        winList: [],
        winValue: [],
        windowCards: [],
        oldWindowCards: [],
        allPageListMap: new Map(),
        oldAllPageListMap: new Map(),
        pastePage: null // 粘贴卡
    });

    const { transformPageDetail } = useHome();

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

    const _getWindowCards = (data: IGetWindowCards) => {
        // return getWindowCards(data).then(res => {
        //     if (res.resultCode === 200) {
        //         state.windowCards = res.result;
        //         isSetCache.value = isCache;
        //         state.oldWindowCards = JSON.parse(JSON.stringify(res.result));
        //     }
        // });
        state.allPageListMap.clear();
        state.oldAllPageListMap.clear();
        return getWindowStruct(data).then(res => {
            if (res.resultCode === 200) {
                state.windowCards = res.result.CardData || [];
                // isSetCache.value = isCache;
                state.oldWindowCards = JSON.parse(JSON.stringify(state.windowCards));
                savePageDB(JSON.parse(JSON.stringify(state.windowCards)));
            }
        });
    };

    // 缓存页到本地数据库DB、处理所有的页数据
    const savePageDB = (windowCards: ICardList[]) => {
        windowCards.forEach((card: ICardList) => {
            card.PageList.forEach(async (page: IPageValue) => {
                page.Json = page.Json && typeof page.Json === "string" ? JSON.parse(page.Json) : page.Json;
                const newSlide: Slide = await transformPageDetail(page, page.Json);
                state.allPageListMap.set(page.ID, newSlide);
                state.oldAllPageListMap.set(page.ID, newSlide);
            });
        });

        console.log(state.allPageListMap, "state.allPageListMap====");
    };

    return {
        // isSetCache,
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
