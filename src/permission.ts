import router from "./router";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import useLogin from "@/hooks/useLogin";
import isElectron from "is-electron";
import { store } from "@/store";
import useUserInfo from "@/hooks/useUserInfo";

const { queryUserInfo } = useUserInfo();

// 免校验token白名单
const whiteList = ["Login", "wpf班级管理", "wpf管理标签", "wpf学习记录"];

router.beforeEach(async(to, from, next) => {
    window.electron.log.info(`router to fullPath: ${to.fullPath}, router from fullPath: ${from.fullPath}`);
    // 判断有没有登录,登录的话跳到系统，未登录的话不让跳到系统
    if (to.query.account && to.query.password) {
        const { userLogin } = useLogin();
        userLogin({
            account: to.query.account.toString(),
            password: to.query.password.toString(),
            next
        });
    } else if (window.location.href.indexOf("yueyangyun") > -1 && to.query.token && !isElectron()) {
        const { userLoginByToken } = useLogin();
        userLoginByToken(
            to.query.token.toString(),
            next
        );
    } else {
        const token = (to.query.token || from.query.token)?.toString();
        if (token) {
            set(STORAGE_TYPES.SET_TOKEN, token);
        }
        const hasToken = get(STORAGE_TYPES.SET_TOKEN);
        if (hasToken) {
            if (to.path === "/") {
                next({ path: "/login" });
            } else {
                if ((!get(STORAGE_TYPES.USER_INFO) || !store.state.userInfo.id) && to.path !== "/login") {
                    await queryUserInfo().then(success => {
                        // 获取到用户信息, 开始配置全局监听器
                        if (success) {
                            isElectron() && window.electron.ipcRenderer.send("startSingalR", store.state.userInfo.id);
                        }
                    });
                }
                next();
            }
        } else {
            if (whiteList.indexOf(to.name?.toString() || "") !== -1) {
                next();
            } else {
                next({ path: "/login" });
            }
        }
    }
});
