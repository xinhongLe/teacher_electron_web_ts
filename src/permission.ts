import router from "./router";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import useLogin from "@/hooks/useLogin";
import isElectron from "is-electron";
import { store } from "@/store";
import useUserInfo from "@/hooks/useUserInfo";
import { LoginForCloud } from "./api/login";

const { queryUserInfo } = useUserInfo();

router.beforeEach(async(to, from, next) => {
    const hasToken = get(STORAGE_TYPES.SET_TOKEN);
    if (hasToken) {
        if ((!get(STORAGE_TYPES.USER_INFO) || !store.state.userInfo.id)) {
            const cloudRes = await LoginForCloud(hasToken);
            set(STORAGE_TYPES.YUN_INFO, cloudRes.result);

            const success = await queryUserInfo();
            // 获取到用户信息, 开始配置全局监听器
            if (success) {
                isElectron() && window.electron.ipcRenderer.send("startSingalR", store.state.userInfo.id);
            }
        }
        next();
    } else {
        window.electron.ipcRenderer.invoke("closeSuspension");
        window.electron.ipcRenderer.invoke("logout");
        next();
    }
});
