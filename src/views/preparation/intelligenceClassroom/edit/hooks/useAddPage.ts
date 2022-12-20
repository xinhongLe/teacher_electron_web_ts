import { ICardList, IPageValue } from "@/types/home";
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { findIndex } from "lodash";
import { Slide } from "wincard";
import { initSlideData } from "@/utils/dataParsePage";
import { addPage } from "@/api/home";

export default (
    shrinkRef: Ref,
    windowCards: Ref<ICardList[]>,
    allPageSlideListMap: Ref<Map<string, Slide>>
) => {
    const dialogVisible = ref(false);
    const currentValue = ref();
    const handleAdd = (node: Node, data: ICardList) => {
        shrinkRef.value.click();
        console.log("data------", data);

        dialogVisible.value = true;
        currentValue.value = data;
    };

    const addPageCallback = async (
        data: { name: string; value: number },
        pageValue?: any
    ) => {
        if (pageValue?.ID) {
            currentValue.value = pageValue;
        }
        const value = {
            CardID: currentValue.value.ID,
            Name: data.name,
            Type: data.value,
            Sort: currentValue.value.PageList
                ? currentValue.value.PageList.length
                : 0,
        };
        const res = await addPage(value);
        if (res.resultCode === 200) {
            const cardIndex = findIndex(windowCards.value, {
                ID: currentValue.value.ID,
            });
            const page: IPageValue = {
                ID: res.result.ID,
                Name: data.name,
                Type: data.value,
                // isAdd: true,
                isAdd: false,
                State: true,
            };
            windowCards.value[cardIndex].PageList.push(page);
            // 只有解构赋值，tree组件才刷新
            const slide = initSlideData(page.ID, page.Type);
            allPageSlideListMap.value.set(page.ID, slide);
            windowCards.value = [...windowCards.value];
            dialogVisible.value = false;
            return page;
        } else {
            return false;
        }
    };

    return {
        handleAdd,
        dialogVisible,
        addPageCallback,
    };
};
