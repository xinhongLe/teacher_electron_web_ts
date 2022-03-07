import { IRenameCardOrPage } from "@/api/home";
import { ICardList } from "@/types/home";
import { Ref, ref } from "vue";

export default (shrinkRef: Ref, renameCardOrPage:(data: IRenameCardOrPage) => void) => {
    const currentValue = ref();
    const dialogVisibleName = ref(false);
    const handleUpdateName = (node:Node, data:ICardList) => {
        shrinkRef.value.click();
        dialogVisibleName.value = true;
        currentValue.value = data;
    };

    const updateName = (name: string) => {
        const data = {
            Name: name,
            ID: currentValue.value.ID
        };
        renameCardOrPage(data);
        dialogVisibleName.value = false;
    };

    return {
        currentValue,
        handleUpdateName,
        dialogVisibleName,
        updateName
    };
};
