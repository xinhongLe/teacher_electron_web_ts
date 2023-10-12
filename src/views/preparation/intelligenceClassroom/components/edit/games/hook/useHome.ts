import { reactive, toRefs, markRaw } from "vue";
import WrdGame from "../wordGame.vue";
import DollGame from "../dollGame.vue";
import CarGame from "../carGame.vue";
import TugOfWarGame from "../tugOfWarGame.vue";
import ClassGame from "../classGame/index.vue";
import RunningGame from "../RunningGame.vue";
import PicTextGame from "../PicTextGame/index.vue";
import FillBlank from "../FillBlank/index.vue";
import hitMouseGame from "../hitMouseGame.vue";
import ballGame from "../ballGame.vue";
import shootBasketGame from "../shootBasketGame.vue";
import linkGame from "../linkGame.vue";

export default () => {
    const state = reactive({
        gameTypeList: [
            { type: 0, com: markRaw(DollGame) },
            { type: 1, com: markRaw(WrdGame) },
            { type: 2, com: markRaw(TugOfWarGame) },
            { type: 3, com: markRaw(ClassGame) },
            { type: 4, com: markRaw(CarGame) },
            { type: 7, com: markRaw(PicTextGame) },
            { type: 9, com: markRaw(FillBlank) },
            { type: 11, com: markRaw(RunningGame) },
            { type: 12, com: markRaw(ballGame) },
            { type: 13, com: markRaw(hitMouseGame) },
            { type: 14, com: markRaw(linkGame) },
            { type: 16, com: markRaw(shootBasketGame) }
        ]
    });
    return {
        ...toRefs(state)
    };
};
