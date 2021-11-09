import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";
import { MutationTypes, ActionTypes } from "./constants";
import myStudent from "./modules/myStudent";
import userInfo from "./modules/userInfo";
import { RootState } from "@/types/store";

export { MutationTypes, ActionTypes };

export const key: InjectionKey<Store<RootState>> = Symbol("");

export const store = createStore<RootState>({
    modules: {
        myStudent,
        userInfo
    }
});

export const useStore = () => baseUseStore(key);
