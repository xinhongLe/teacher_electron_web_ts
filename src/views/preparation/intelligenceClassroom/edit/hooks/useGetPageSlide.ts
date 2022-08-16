import { IPageValue } from "@/types/home";
import { onUnmounted, Ref, ref, watch } from "vue";
import useHome from "@/hooks/useHome";
import { Slide } from "wincard/src/types/slides";
import { store } from "@/store";

export default (pageValue: Ref<IPageValue>) => {
    const { getPageDetail, transformType } = useHome();
    const allPageSlideListMap = ref<Map<string, Slide>>(new Map());
    const oldAllPageSlideListMap = ref<Map<string, Slide>>(new Map());
    const currentReqId = ref("");
    const requestedIds = ref<string[]>([]);
    const isLoadEnd = ref(false); // 页的数据是否全部加载完成
    const isUnmounted = ref(false);

    const fetchPageSlide = (page: IPageValue) => {
        if (requestedIds.value.includes(page.ID) || transformType(page.Type) === -1) {
            return;
        }
        currentReqId.value = page.ID;
        const originType = store.state.preparation.editWindowInfo.originType;
        return new Promise((resolve) => {
            let dbEnd = false;
            let requestEnd = false;
            getPageDetail(page, originType, (res: any) => {
                if (res.from === "DB") {
                    // 被点击的页时正在请求时
                    allPageSlideListMap.value.set(page.ID, res.result);
                    oldAllPageSlideListMap.value.set(page.ID, res.result);
                    dbEnd = true;
                } else {
                    if (res.id) {
                        allPageSlideListMap.value.set(page.ID, res);
                        oldAllPageSlideListMap.value.set(page.ID, res);
                    }
                    requestEnd = true;
                    requestedIds.value.push(page.ID);
                }
                // DB数据可能不存在，这边会不会卡掉。。。。。 移除dbEnd判断
                if (requestEnd) {
                    resolve("");
                }
            });
        });
    };

    const fetchAllPageSlide = async (allPageList: IPageValue[]) => {
        isLoadEnd.value = false;
        for (const page of allPageList) {
            if (isUnmounted.value) {
                return;
            }
            if (requestedIds.value.includes(page.ID) || transformType(page.Type) === -1) {
                continue;
            }
            currentReqId.value = page.ID;
            await fetchPageSlide(page);
        }
        isLoadEnd.value = true;
    };

    watch(pageValue, (v) => {
        if (v.ID === currentReqId.value || requestedIds.value.includes(v.ID) || v.isAdd) {
            return;
        }
        fetchPageSlide(v);
    });

    onUnmounted(() => {
        isUnmounted.value = true;
        isLoadEnd.value = true;
    });

    return {
        allPageSlideListMap,
        oldAllPageSlideListMap,
        isLoadEnd,
        fetchAllPageSlide
    };
};
