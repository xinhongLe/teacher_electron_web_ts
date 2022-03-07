import router from "@/router";
import { initAllState } from "@/store";
import emitter from "@/utils/mitt";
import { remove } from "@/utils/storage";

export default () => {
    remove("SET_TOKEN");
    remove("USER_INFO");
    remove("GetBasicTagList");
    remove("GradeClassList");
    sessionStorage.removeItem("breadList");
    router.push("login");
    initAllState();
    emitter.emit("logout", null);
    emitter.off("logout");
};
