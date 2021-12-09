import router from "@/router";
import { initAllState } from "@/store";
import { remove } from "@/utils/storage";

export default () => {
    remove("SET_TOKEN");
    remove("USER_INFO");
    remove("GetBasicTagList");
    remove("GradeClassList");
    sessionStorage.removeItem("breadList");
    router.push("login");
    initAllState();
};
