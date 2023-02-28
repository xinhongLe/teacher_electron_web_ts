import { reactive, toRefs, markRaw } from "vue";
import WrdGame from "../wordGame.vue";
import DollGame from "../dollGame.vue";
import CarGame from "../carGame.vue";
import TugOfWarGame from "../tugOfWarGame.vue";
import ClassGame from "../classGame/index.vue";
import RunningGame from "../RunningGame.vue";
export default () => {
    const state = reactive({
        gameTypeList: [
            { type: 0, com: markRaw(DollGame) },
            { type: 1, com: markRaw(WrdGame) },
            { type: 2, com: markRaw(TugOfWarGame) },
            { type: 3, com: markRaw(ClassGame) },
            { type: 4, com: markRaw(CarGame) },
            { type: 5, com: markRaw(RunningGame) }
        ]
    });
    return {
        ...toRefs(state)
    };
};
