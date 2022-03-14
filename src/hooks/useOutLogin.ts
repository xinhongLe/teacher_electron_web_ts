import router from "@/router";
import { initAllState } from "@/store";
import emitter from "@/utils/mitt";
import { remove } from "@/utils/storage";
let cancelAfterEach: () => void;
export default () => {
    router.push("/login");
    cancelAfterEach = router.afterEach(() => {
        remove("SET_TOKEN");
        remove("USER_INFO");
        remove("GetBasicTagList");
        remove("GradeClassList");
        sessionStorage.removeItem("breadList");
        initAllState();
        emitter.emit("logout", null);
        emitter.off("logout");
        cancelAfterEach();
    });
};
