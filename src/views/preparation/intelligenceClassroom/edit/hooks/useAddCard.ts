import { ICardList } from "@/types/home";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import { v4 as uuidv4 } from "uuid";
import { Ref, ref } from "vue";

export default (windowCards:Ref<ICardList[]>) => {
    const dialogVisibleCard = ref(false);

    const handleAddCard = (name:string) => {
        const sort = windowCards.value ? windowCards.value.length : 0;
        const card: ICardList = {
            Name: name,
            ID: uuidv4(),
            Sort: sort,
            isAdd: true,
            PageList: []
        };
        windowCards.value.push(card);
        TrackService.setTrack(EnumTrackEventType.AddCard, "", "", "", "", "", "", "新增卡");
        dialogVisibleCard.value = false;
    };

    return {
        handleAddCard,
        dialogVisibleCard
    };
};
