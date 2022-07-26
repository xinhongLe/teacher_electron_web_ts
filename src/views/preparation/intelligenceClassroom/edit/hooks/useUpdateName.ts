import { ICardList } from "@/types/home";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import { Ref, ref } from "vue";

export default (shrinkRef: Ref) => {
    const currentValue = ref();
    const dialogVisibleName = ref(false);
    const handleUpdateName = (node:Node, data:ICardList) => {
        shrinkRef.value.click();
        dialogVisibleName.value = true;
        currentValue.value = data;
    };

    const updateName = (name: string) => {
        currentValue.value.Name = name;
        TrackService.setTrack(EnumTrackEventType.ChangeCardName, "", "", "", "", "", "", "修改卡名");
        dialogVisibleName.value = false;
    };

    return {
        currentValue,
        handleUpdateName,
        dialogVisibleName,
        updateName
    };
};