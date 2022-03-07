import { SchoolWindowInfo, SchoolWindowCardInfo, SchoolWindowPageInfo } from "@/types/preparation";
import { fetchSchoolWindowList } from "@/views/preparation/api";
import { find, isEmpty, filter } from "lodash";
import { computed, InjectionKey, reactive, Ref, ref, watch } from "vue";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useHome from "@/hooks/useHome";
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

    const updateCurrentWindow = (win: SchoolWindowInfo) => {
        currentWindowInfo.LessonID = win?.LessonID;
        currentWindowInfo.LessonWindowID = win?.LessonWindowID;
        currentWindowInfo.OriginType = win?.OriginType;
        currentWindowInfo.Sort = win?.Sort;
        currentWindowInfo.WindowID = win?.WindowID;
        currentWindowInfo.WindowName = win?.WindowName;
        currentWindowInfo.WindowNickName = win?.WindowNickName;
        cardList.value = getCardList();
        currentCardIndex.value = 0;
        currentCard.value = cardList.value[0];
    };

    const getSchoolWindowList = async (id: string) => {
        const res = await fetchSchoolWindowList({
            lessonID: id
        });
        if (res.resultCode === 200) {
            winList.value = res.result;
        }
    };

    const handleSelectCard = (card: SchoolWindowCardInfo) => {
        const newCard = dealCardData(card);
        currentCard.value = newCard;
        TrackService.setTrack(EnumTrackEventType.SelectCard, currentWindowInfo.WindowID, currentWindowInfo.WindowName, card.ID, card.Name, card.Pages.length > 0 ? card.Pages[0].ID : "", card.Pages.length > 0 ? card.Pages[0].Name : "", "选择卡", "", "");
    };

    const refreshWindow = (id: string) => {
        getSchoolWindowList(id).then(() => {
            cardList.value = getCardList();
            const cardInfo = find(cardList.value, { ID: currentCard.value?.ID });
            if (cardInfo) {
                currentCard.value = { ...cardInfo };
            } else {
                currentCard.value = cardList.value[0];
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
