import { SchoolWindowInfo, SchoolWindowCardInfo, SchoolWindowPageInfo } from "@/types/preparation";
import { fetchSchoolWindowList } from "@/views/preparation/api";
import { find, isEmpty, filter, findIndex } from "lodash";
import { computed, InjectionKey, onDeactivated, onMounted, onUnmounted, reactive, Ref, ref, watch } from "vue";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useHome from "@/hooks/useHome";
import emitter from "@/utils/mitt";
import isElectron from "is-electron";
const dealCardData = (card:SchoolWindowCardInfo) => {
    const pages = card.Pages.map(page => {
        return {
            ...page,
            Name: page.Name || ["普通页", "听写页", "跟读页"][page.Type]
        };
    });
    return {
        ...card,
        Pages: pages
    };
};

const useWindowInfo = () => {
    const { getPageDetail, transformType } = useHome();
    let isToFirst = false;
    const currentWindowInfo = reactive<SchoolWindowInfo>({
        LessonID: "",
        WindowID: "",
        WindowName: "",
        WindowNickName: "",
        LessonWindowID: "",
        Sort: 0,
        OriginType: 0
    });
    const winList = ref<SchoolWindowInfo[]>([]);
    const currentCard = ref<SchoolWindowCardInfo>();
    const currentPageIndex = ref(0);
    const currentCardIndex = ref(0);
    const currentSlide = ref({});
    const cardList = ref<SchoolWindowCardInfo[]>([]);
    const allPageList = computed(() => {
        return cardList.value.flatMap((item) => [...item.Pages]);
    });
    const pageList = computed(() => currentCard.value?.Pages || []);
    const currentPageInfo = computed(() => pageList.value[currentPageIndex.value]);

    const getCardList = () => {
        const list = find(winList.value, { WindowID: currentWindowInfo.WindowID })?.CardList || [];
        return list.filter(item => !isEmpty(item.Pages)).map(item => ({
            ...item,
            Pages: filter(item.Pages, { State: true })
        }));
    };

    const updateCurrentWindow = (win: SchoolWindowInfo, isToCardFirst = true) => {
        currentWindowInfo.LessonID = win?.LessonID;
        currentWindowInfo.LessonWindowID = win?.LessonWindowID;
        currentWindowInfo.OriginType = win?.OriginType;
        currentWindowInfo.Sort = win?.Sort;
        currentWindowInfo.WindowID = win?.WindowID;
        currentWindowInfo.WindowName = win?.WindowName;
        currentWindowInfo.WindowNickName = win?.WindowNickName;
        cardList.value = getCardList();
        if (isToCardFirst) {
            currentCardIndex.value = 0;
            currentCard.value = cardList.value[0];
        }

        TrackService.setTrack(EnumTrackEventType.SelectWindow, win?.WindowID, win?.WindowName, "", "", "", "", "选择窗");
    };

    const getSchoolWindowList = async (id: string) => {
        const res = await fetchSchoolWindowList({
            lessonID: id
        });
        if (res.resultCode === 200) {
            winList.value = res.result;
        }
    };

    const handleSelectCard = (card: SchoolWindowCardInfo, index: number) => {
        const newCard = dealCardData(card);
        currentCardIndex.value = index;
        currentCard.value = newCard;
        TrackService.setTrack(EnumTrackEventType.SelectCard, currentWindowInfo.WindowID, currentWindowInfo.WindowName, card.ID, card.Name, card.Pages.length > 0 ? card.Pages[0].ID : "", card.Pages.length > 0 ? card.Pages[0].Name : "", "选择卡", "", "");
    };

    const refreshWindow = (id: string) => {
        getSchoolWindowList(id).then(() => {
            if (winList.value.length > 0) {
                if (isToFirst) {
                    updateCurrentWindow(winList.value[0]);
                    isToFirst = false;
                } else {
                    const win = find(winList.value, { WindowID: currentWindowInfo.WindowID });
                    if (win) {
                        updateCurrentWindow(win, false);
                    } else {
                        updateCurrentWindow(winList.value[0], false);
                    }
                }

                const findCardInfo = find(cardList.value, { ID: currentCard.value?.ID });
                const cardIndex = findCardInfo ? findIndex(cardList.value, { ID: currentCard.value?.ID }) : 0;
                const cardInfo = findCardInfo ? { ...findCardInfo } : cardList.value[0];
                handleSelectCard(cardInfo, cardIndex);
            }
        });
    };

    let isExecuting = false;
    let executePageList:SchoolWindowPageInfo[] = [];

    watch(allPageList, () => {
        executePageList = JSON.parse(JSON.stringify(allPageList.value));
        if (!isExecuting) {
            _getPageDetail();
        }
    }, {
        deep: true
    });

    const _getPageDetail: any = async () => {
        if (executePageList.length !== 0) {
            isExecuting = true;
            const [elem] = executePageList.splice(0, 1);
            if (transformType(elem.Type) !== -1) {
                await getPageDetail(elem, elem.OriginType, (res:any) => {
                    if (res && res.id && elem.ID === currentPageInfo.value?.ID) {
                        currentSlide.value = res;
                    }
                });
            }
            return _getPageDetail();
        } else {
            return (isExecuting = false);
        }
    };

    watch(winList, (v) => {
        isElectron() && window.electron.ipcRenderer.invoke("getWindowList", JSON.parse(JSON.stringify(v)));
    }, {
        deep: true
    });

    onMounted(() => {
        emitter.on("windowSaveAsSuc", () => {
            isToFirst = true;
        });
    });

    onUnmounted(() => {
        emitter.off("windowSaveAsSuc");
    });

    onDeactivated(() => {
        window.electron.ipcRenderer.invoke("getWindowList", []);
    });
    return {
        winList,
        currentWindowInfo,
        cardList,
        allPageList,
        updateCurrentWindow,
        currentCard,
        handleSelectCard,
        currentPageIndex,
        currentCardIndex,
        refreshWindow,
        currentSlide,
        pageList,
        currentPageInfo,
        getSchoolWindowList
    };
};

export default useWindowInfo;

export const windowInfoKey = Symbol("windowInfoKey") as InjectionKey<ReturnType<typeof useWindowInfo>>;
