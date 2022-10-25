import { reactive, toRefs, markRaw } from "vue";
import wordGame from "../wordGame.vue";
import dollGame from "../dollGame.vue";

export default () => {
    const state = reactive({
        gameTypeList: [
            { type: 0, com: markRaw(dollGame) },
            { type: 1, com: markRaw(wordGame) }
        ]
    });
    return {
        ...toRefs(state)
    };
};
