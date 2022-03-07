import { IAddPage } from "@/api/home";
import { ICardList } from "@/types/home";
import { Ref, ref } from "vue";

export default (shrinkRef: Ref, addPage: (data: IAddPage) => void) => {
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
        addPage(value);
        dialogVisible.value = false;
    };

    return {
        handleAdd,
        dialogVisible,
        addPageCallback
    };
};
