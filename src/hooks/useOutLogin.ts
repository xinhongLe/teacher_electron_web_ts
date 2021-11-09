import router from "@/router";
import { MutationTypes, store } from "@/store";
import { remove } from "@/utils/storage";
import isElectron from "is-electron";

export default () => {
    remove("SET_TOKEN");
    remove("USER_INFO");
    remove("GetBasicTagList");
    remove("GradeClassList");
    if (isElectron()) {
        // ipcRenderer.send("unmaximizeWindow");
    }
    router.push("login");
    store.commit(MutationTypes.RESET_STATE);
};
