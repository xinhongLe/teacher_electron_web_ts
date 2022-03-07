import { IAddCard } from "@/api/home";
import router from "@/router";
import { ICardList } from "@/types/home";
import { Ref, ref } from "vue";

export default (addCard:(data: IAddCard) => void, windowCards:Ref<ICardList[]>) => {
    const dialogVisibleCard = ref(false);

    const handleAddCard = (name:string) => {
        console.log(windowCards);
        // _addCard({ WindowID: route.params.winValue as string, Sort: 0, Name: name });
        const sort = windowCards.value ? windowCards.value.length : 0;
        addCard({ WindowID: router.currentRoute.value.params.winValue as string, Sort: sort, Name: name });
        dialogVisibleCard.value = false;
    };

    return {
        handleAddCard,
        dialogVisibleCard
    };
};
