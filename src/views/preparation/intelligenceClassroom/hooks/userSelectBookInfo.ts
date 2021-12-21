import { getSchoolLessonWindow, getWindowCards } from "../api/index";
import { IPageValue } from "@/types/home";
import { reactive, ref, watch } from "vue-demi";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useHome from "@/hooks/useHome";
import { originType } from "@/config";
interface IGetLessonWindows {
    chapterID: string
}
interface CardList {
    ID: string,
    Name: string,
    NickName?: string,
    OriginType?: number,
    originType?: number
}
interface LessonList {
    ID: string,
    Name: string
}
interface TeachPageList {
    LessonID: string,
    LessonWindowID: string
    OriginType: number,
    Sort: number,
    WindowID: string,
    WindowName: string,
    WindowNickName: string,
    CardList: CardList[]
}
interface LessonWindow {
    IsHide: boolean,
    Type: number,
    Sort?: number,
    LessonDetail?: string,
    LessonTeachPageTeachers?: [],
    TeachPageList?: TeachPageList[],
    Lesson?: LessonList
}

interface clickWinList {
    LessonID:string,
    LessonWindowID:string,
    OriginType: number,
    Sort: number,
    WindowID: string,
    WindowName: string,
    WindowNickName: string,
    CardList: CardList[]
}
interface AllData {
    winList: LessonWindow[],
    cardList: CardList[]
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
    PageList: CardListItem[]
}
export default () => {
    const { getPageDetail, transformType } = useHome();
    const allData = reactive<AllData>({
        winList: [],
        cardList: []
    });
    const activeIndex = reactive({
        hideTools: true,
        isPreview: false,
        previewOptions: {},
        cardUuid: "",
        leftActiveIndex: 0,
        winIndex: 0,
        winActiveId: "",
        winActiveValue: {},
        originType: 0
    });
    const cardListComponents = ref();
    const _getSchoolLessonWindow = (data: IGetLessonWindows) => {
        getSchoolLessonWindow(data).then((res) => {
            if (res.resultCode === 200) {
                allData.winList = res.result.filter((item:any) => {
                    return item.TeachPageList.length > 0;
                });
                if (
                    allData.winList.length > 0 &&
                    allData.winList[0].TeachPageList &&
                    allData.winList[0].TeachPageList.length > 0
                ) {
                    activeIndex.winActiveId = allData.winList[0].TeachPageList[0].WindowID;
                    activeIndex.winActiveValue = allData.winList[0].TeachPageList[0];
                    activeIndex.originType = allData.winList[0].TeachPageList[0].OriginType;
                    activeIndex.leftActiveIndex = 0;
                    activeIndex.winIndex = 0;
                    allData.cardList = allData.winList[0].TeachPageList[0].CardList.filter((item:any) => { return item.Pages.length > 0; });
                } else {
                    allData.cardList = [];
                    activeIndex.winActiveValue = "";
                    activeIndex.winActiveId = "";
                    activeIndex.previewOptions = {};
                    activeIndex.leftActiveIndex = 0;
                    activeIndex.winIndex = 0;
                }
            }
        });
    };
    const handleClickWin = (j:clickWinList, i: number, index: number) => {
        activeIndex.leftActiveIndex = index;
        activeIndex.winIndex = i;
        activeIndex.winActiveId = j.WindowID;
        activeIndex.winActiveValue = j;
        activeIndex.originType = j.OriginType;
    };
    const isSetCache = ref(false); // 是否需要更新窗下的数据
    const allPageList:any = ref([]);
    // let timer: any = null;
    let noResPages: IPageValue[] = []; // 未请求的页面集合
    let resPagesIds: string[] = []; // 已经请求过的页面ids
    const _getWindowCards = (ID:string, isCache = false) => {
        getWindowCards({ WindowID: ID, OriginType: activeIndex.originType }).then((res) => {
            if (res.resultCode === 200) {
                noResPages = [];
                resPagesIds = [];
                getAllPageList([]);
                const removeNoPageList = res.result.filter((item:any) => { return item.PageList.length > 0; });
                allData.cardList = detailData(removeNoPageList);
                isSetCache.value = isCache;
                allPageList.value = detailPageList(allData.cardList);
                if (allData.cardList.length > 0) {
                    cardListComponents.value.handleClick(0, allData.cardList[0]);
                } else {
                    activeIndex.previewOptions = {};
                }
            }
        });
    };
    const detailPageList = (arr:any) => {
        let list: IPageValue[] = [];
        arr.map((card:any) => {
            list = list.concat(card.PageList);
        });
        return list;
    };
    watch(allPageList, () => {
        if (allPageList.length > 0) {
            return false;
        }
        const interval = setInterval(() => {
            clearInterval(interval);
            getAllPageList(JSON.parse(JSON.stringify(allPageList.value)));
        }, 300);
    });
    const getAllPageList = async (arr: IPageValue[]) => {
        for (const elem of arr) {
            if (transformType(elem.Type) === -1) {
                return;
            } else {
                // getPageDetail(elem, elem.originType);
            }
        }
        // if (timer) clearTimeout(timer);
        // if (arr.length > 0) {
        //     if (resPagesIds.includes(arr[0].ID) || transformType(arr[0].Type) === -1) {
        //         arr.shift();
        //         noResPages = arr;
        //         timer = setTimeout(() => {
        //             getAllPageList(noResPages);
        //         }, 300);
        //     } else {
        //         await getPageDetail(arr[0], arr[0].originType, (res: any) => {
        //             if (arr.length > 0) {
        //                 if (res.id) { // 成功请求
        //                     resPagesIds.push(arr[0].ID);
        //                 }
        //                 arr.shift();
        //                 noResPages = arr;
        //                 timer = setTimeout(() => {
        //                     getAllPageList(noResPages);
        //                 }, 300);
        //             }
        //         });
        //     }
        // }
    };
    const updatePageList = (card: cardList) => {
        activeIndex.previewOptions = card;
    };
    const detailData = (data: any) => {
        if (data.length === 0) return [];
        const winList = data.map((item: any) => {
            return {
                ...item,
                PageList: item.PageList.filter((items: any) => { return items.State === true; }),
                originType: activeIndex.originType
            };
        });
        const changeOriginList = winList.map((item :any) => {
            return {
                ...item,
                PageList: item.PageList.map((items: any) => {
                    return {
                        ...items,
                        originType: item.originType
                    };
                })
            };
        });
        return changeOriginList;
    };
    return {
        _getSchoolLessonWindow,
        allData,
        allPageList,
        activeIndex,
        cardListComponents,
        handleClickWin,
        _getWindowCards,
        updatePageList
    };
};
