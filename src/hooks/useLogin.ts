import {
    ILoginData,
    ILoginResponse
} from "@/types/login";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import {
    Login, LoginForCloud
} from "@/views/login/api";
import useUserInfo from "@/hooks/useUserInfo";
import { NavigationGuardNext } from "vue-router";
import md5 from "js-md5";
import isElectron from "is-electron";
import { store } from "@/store";

export default () => {
    const { queryUserInfo } = useUserInfo();

    const userLogin = async ({ account, password, next, code, isPassWordLogin = true } : {account: string, password: string, next?: NavigationGuardNext, code?: string, isPassWordLogin?: boolean}) => {
        const loginRes: ILoginResponse = await Login({ account, password, code }, isPassWordLogin);
        if (loginRes.resultCode === 200) {
            LoginForCloud(loginRes.result.token).then(cloudRes => {
                set(STORAGE_TYPES.YUN_INFO, cloudRes.result);
            });
            recordAccount({ account, password });
            set(STORAGE_TYPES.SET_TOKEN, loginRes.result.token);
            set(STORAGE_TYPES.SESSION_ID, md5(loginRes.result.token + new Date().valueOf()));
            const success = await queryUserInfo();
            if (success) {
                // 获取到用户信息, 开始配置全局监听器
                if (success) {
                    isElectron() && window.electron.ipcRenderer.send("startSingalR", store.state.userInfo.id);
                }
            }
            next && next({ path: "/" });
            return true;
        }
        return false;
    };

    const userLoginByToken = async (token: string, next?: NavigationGuardNext) => {
        set(STORAGE_TYPES.SET_TOKEN, token);
        queryUserInfo();
        next && next();
    };

    const recordAccount = (form: ILoginData) => {
        const recordList = get(STORAGE_TYPES.RECORD_LOGIN_LIST, true) || [];
        const index = recordList.findIndex((item: ILoginData) => item.account === form.account);
        index > -1 ? (recordList[index] = form) : recordList.unshift(form);
        set(STORAGE_TYPES.RECORD_LOGIN_LIST, recordList, true);
    };

    return {
        userLogin,
        userLoginByToken,
        recordAccount
    };
};
