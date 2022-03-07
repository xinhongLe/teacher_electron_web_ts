import { IPageValue } from "@/types/home";
import { Ref, ref, watch } from "vue";
import useHome from "@/hooks/useHome";
import router from "@/router";

export default (pageValue: Ref<IPageValue>) => {
    const { getPageDetail, transformType } = useHome();
    const allPageSlideListMap = ref<Map<string, Record<string, unknown>>>(new Map());
    const currentReqId = ref("");
    const requestedIds = ref<string[]>([]);

    const fetchPageSlide = (page: IPageValue) => {
        const originType = Number(router.currentRoute.value.params.originType);
        return new Promise((resolve) => {
            let dbEnd = false;
            let requestEnd = false;
            getPageDetail(page, originType, (res: any) => {
                if (res.from === "DB") {
                    // 被点击的页时正在请求时
                    allPageSlideListMap.value.set(page.ID, res.result);
                    dbEnd = true;
                } else {
                    if (res.id) {
                        allPageSlideListMap.value.set(page.ID, res);
                    }
                    requestEnd = true;
                    requestedIds.value.push(page.ID);
                }
                if (dbEnd && requestEnd) {
                    resolve("");
                }
            });
        });
    };

    const fetchAllPageSlide = async (allPageList: IPageValue[]) => {
        for (const page of allPageList) {
            if (requestedIds.value.includes(page.ID) || transformType(page.Type) === -1) {
                continue;
            }
            currentReqId.value = page.ID;
            await fetchPageSlide(page);
        }
    };

    watch(pageValue, (v) => {
        if (v.ID === currentReqId.value || requestedIds.value.includes(v.ID)) {
            return;
        }
        fetchPageSlide(v);
    });

    return {
        allPageSlideListMap,
        fetchAllPageSlide
    };
};
