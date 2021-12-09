import { getSchoolLessonWindow, getWindowCards } from "../api/index";
import { reactive, ref } from "vue-demi";
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
                allData.winList = res.result;
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
                    allData.cardList = allData.winList[0].TeachPageList[0].CardList;
                } else {
                    allData.cardList = [];
                    activeIndex.winActiveValue = "";
                    activeIndex.winActiveId = "";
                    activeIndex.previewOptions = {};
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
    const _getWindowCards = (ID: string) => {
        getWindowCards({ WindowID: ID, OriginType: activeIndex.originType }).then((res) => {
            if (res.resultCode === 200) {
                allData.cardList = detailData(res.result);
                if (allData.cardList.length > 0) {
                    cardListComponents.value.handleClick(0, allData.cardList[0]);
                }
            }
        });
    };
    const updatePageList = (card: cardList) => {
        activeIndex.previewOptions = card;
    };
    interface winListItem {
        ContentType: number,
        Height: number,
        ID: string,
        Name: string,
        NickName: string,
        OriginType: number,
        Sort: number,
        State: boolean,
        TeachPageRelationID: string,
        Type: number,
        Width: number,
        originType?: number
    }
    const detailData = (data: any) => {
        if (data.length === 0) return [];
        const winList = data.map((item:winListItem) => {
            return {
                ...item,
                originType: activeIndex.originType
            };
        });
        return winList;
    };
    return {
        _getSchoolLessonWindow,
        allData,
        activeIndex,
        cardListComponents,
        handleClickWin,
        _getWindowCards,
        updatePageList
    };
};
