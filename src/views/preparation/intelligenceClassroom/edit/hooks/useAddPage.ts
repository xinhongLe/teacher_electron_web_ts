import { ICardList, IPageValue } from "@/types/home";
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { findIndex } from "lodash";
import { Slide } from "wincard/src/types/slides";
import { initSlideData } from "@/utils/dataParsePage";

export default (shrinkRef: Ref, windowCards:Ref<ICardList[]>, allPageSlideListMap: Ref<Map<string, Slide>>) => {
    const dialogVisible = ref(false);
    const currentValue = ref();
    const handleAdd = (node:Node, data:ICardList) => {
        shrinkRef.value.click();
        dialogVisible.value = true;
        currentValue.value = data;
    };

    const addPageCallback = (data: { name: string, value: number}) => {
        const cardIndex = findIndex(windowCards.value, { ID: currentValue.value.ID });
        const page: IPageValue = {
            ID: uuidv4(),
            Name: data.name,
            Type: data.value,
            isAdd: true,
            State: true
        };
        windowCards.value[cardIndex].PageList.push(page);
        // 只有解构赋值，tree组件才刷新
        windowCards.value = [...windowCards.value];
        const slide = initSlideData(page.ID, page.Type);
        allPageSlideListMap.value.set(page.ID, slide);
        dialogVisible.value = false;
    };

    return {
        handleAdd,
        dialogVisible,
        addPageCallback
    };
};
