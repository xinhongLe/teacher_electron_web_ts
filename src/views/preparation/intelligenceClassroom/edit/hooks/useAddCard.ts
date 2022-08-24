import { ICardList } from "@/types/home";
import TrackService, { EnumTrackEventType } from "@/utils/common";
import { v4 as uuidv4 } from "uuid";
import { Ref, ref } from "vue";
import { addCard } from "@/api/home";

export default (windowCards:Ref<ICardList[]>, windowInfo:any) => {
    const dialogVisibleCard = ref(false);

    const handleAddCard = (name:string) => {
        const sort = windowCards.value ? windowCards.value.length : 0;
        const data = {
            WindowID: windowInfo.value.id,
            Sort: sort,
            Name: name
        };
        addCard(data).then(res => {
            if (res.resultCode === 200) {
                const card: ICardList = {
                    Name: name,
                    ID: res.result.ID,
                    Sort: sort,
                    isAdd: false,
                    PageList: []
                };
                windowCards.value.push(card);
                TrackService.setTrack(EnumTrackEventType.AddCard, "", "", "", "", "", "", "新增卡");
                dialogVisibleCard.value = false;
            }
        });
    };

    return {
        handleAddCard,
        dialogVisibleCard
    };
};
