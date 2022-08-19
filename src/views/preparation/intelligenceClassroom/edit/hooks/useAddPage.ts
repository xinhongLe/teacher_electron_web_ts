import { ICardList, IPageValue } from "@/types/home";
import { Ref, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { findIndex } from "lodash";
import { Slide } from "wincard/src/types/slides";
import { initSlideData } from "@/utils/dataParsePage";
import { addPage } from "@/api/home";

export default (shrinkRef: Ref, windowCards:Ref<ICardList[]>, allPageSlideListMap: Ref<Map<string, Slide>>) => {
    const dialogVisible = ref(false);
    const currentValue = ref();
    const handleAdd = (node:Node, data:ICardList) => {
        shrinkRef.value.click();
        dialogVisible.value = true;
        currentValue.value = data;
    };

    const addPageCallback = (data: { name: string, value: number}) => {
        const value = {
            CardID: currentValue.value.ID,
            Name: data.name,
            Type: data.value,
            Sort: currentValue.value.PageList ? currentValue.value.PageList.length : 0
        };
        addPage(value).then(res => {
            if (res.resultCode === 200) {
                const cardIndex = findIndex(windowCards.value, { ID: currentValue.value.ID });
                const page: IPageValue = {
                    ID: res.result.ID,
                    Name: data.name,
                    Type: data.value,
                    // isAdd: true,
                    isAdd: false,
                    State: true
                };
                windowCards.value[cardIndex].PageList.push(page);
                // 只有解构赋值，tree组件才刷新
                windowCards.value = [...windowCards.value];
                const slide = initSlideData(page.ID, page.Type);
                allPageSlideListMap.value.set(page.ID, slide);
                dialogVisible.value = false;
            }
        });
    };

    return {
        handleAdd,
        dialogVisible,
        addPageCallback
    };
};
