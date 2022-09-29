import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";
import { MutationTypes, ActionTypes } from "./constants";
import myStudent from "./modules/myStudent";
import userInfo from "./modules/userInfo";
import common from "./modules/common";
import preparation from "./modules/preparation";
import { RootState } from "@/types/store";
export { MutationTypes, ActionTypes };
export const key: InjectionKey<Store<RootState>> = Symbol("");
export const store = createStore<RootState>({
    modules: {
        myStudent,
        userInfo,
        common,
        preparation,
    },
});

export const initAllState = () => {
    store.commit(MutationTypes.PREPARATION_STUDENT_RESET_STATE);
    store.commit(MutationTypes.MY_STUDENT_RESET_STATE);
    store.commit(MutationTypes.USER_INFO_RESET_STATE);
    store.commit(MutationTypes.COMMON_RESET_STATE);
};

export const useStore = () => baseUseStore(key);
