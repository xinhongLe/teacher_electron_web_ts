import { SchoolWindowInfo, SchoolWindowCardInfo, SchoolWindowPageInfo } from "@/types/preparation";
import { find, isEmpty, filter, findIndex } from "lodash";
import { computed, InjectionKey, onDeactivated, onMounted, onUnmounted, reactive, Ref, ref, watch } from "vue";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import useHome from "@/hooks/useHome";
import emitter from "@/utils/mitt";
import isElectron from "is-electron";
import { getWindowCards } from "@/views/preparation/intelligenceClassroom/api";
import { Slide } from "wincard";
import { useStore } from "@/store";
import { IResourceItem } from "@/api/resource";
import { IViewResourceData } from "@/types/store";
const dealCardData = (card:SchoolWindowCardInfo) => {
    const pages = card.PageList.map(page => {
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

const useWindowInfo = (isUseNetwork = true) => {
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
    const currentSlide = ref<Slide | {id?: string}>({});
    const cardList = ref<SchoolWindowCardInfo[]>([]);
    const allPageList = computed(() => {
        return cardList.value.flatMap((item) => [...item.PageList]);
    });
    const pageList = computed(() => currentCard.value?.PageList || []);
    const currentPageInfo = computed(() => pageList.value[currentPageIndex.value]);

    const store = useStore();

    const getCardList = (WindowID: string, OriginType: number) => {
        getWindowCards({
            WindowID,
            OriginType
        }).then(res => {
            if (res.success) {
                // 返回页的数据originType全是0 这里先手动全部处理成 对应的originType
                cardList.value = res.result.map(item => {
                    const PageList = item.PageList.map(page => {
                        return {
                            ...page,
                            OriginType: OriginType
                        };
                    });
                    return {
                        ...item,
                        PageList: PageList.filter(page => page.State) // 预览过滤掉未上架页
                    };
                });
                currentCardIndex.value = 0;
                currentCard.value = cardList.value[0];
            }
        });
    };

    const getSchoolWindowList = async (id: string) => {
        // const res = await fetchSchoolWindowList({
        //     lessonID: id
        // });
        // if (res.resultCode === 200) {
        //     winList.value = res.result;
        // }
    };

    const handleSelectCard = (card: SchoolWindowCardInfo, index: number) => {
        const newCard = dealCardData(card);
        currentCardIndex.value = index;
        currentCard.value = newCard;
        if (isUseNetwork) TrackService.setTrack(EnumTrackEventType.SelectCard, currentWindowInfo.WindowID, currentWindowInfo.WindowName, card.ID, card.Name, card.PageList.length > 0 ? card.PageList[0].ID : "", card.PageList.length > 0 ? card.PageList[0].Name : "", "选择卡", "", "", store.state.userInfo.schoolId);
    };

    let isExecuting = false;
    let executePageList:SchoolWindowPageInfo[] = [];

    watch(allPageList, () => {
        if (!isUseNetwork) return;
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

    onDeactivated(() => {
        window.electron.ipcRenderer.invoke("getWindowList", []);
    });
    return {
        winList,
        currentWindowInfo,
        cardList,
        allPageList,
        currentCard,
        handleSelectCard,
        currentPageIndex,
        currentCardIndex,
        currentSlide,
        pageList,
        currentPageInfo,
        getSchoolWindowList,
        getCardList
    };
};

export default useWindowInfo;

export const windowInfoKey = Symbol("windowInfoKey") as InjectionKey<ReturnType<typeof useWindowInfo>>;
