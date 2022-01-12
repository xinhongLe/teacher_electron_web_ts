import {
    ILoginData,
    ILoginResponse
} from "@/types/login";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import {
    Login
} from "@/views/login/api";
import useUserInfo from "@/hooks/useUserInfo";
import { NavigationGuardNext } from "vue-router";
import md5 from "js-md5";
import isElectron from "is-electron";

export default () => {
    const userLogin = async ({ account, password, next, code, isPassWordLogin = true } : {account: string, password: string, next?: NavigationGuardNext, code?: string, isPassWordLogin?: boolean}) => {
        const loginRes: ILoginResponse = await Login({ account, password, code }, isPassWordLogin);
        if (loginRes.resultCode === 200) {
            recordAccount({ account, password });
            set(STORAGE_TYPES.SET_TOKEN, loginRes.result.token);
            set(STORAGE_TYPES.SESSION_ID, md5(loginRes.result.token + new Date().valueOf()));
            next && next({ path: "/" });
            isElectron() && window.electron.ipcRenderer.invoke("loginSuccess", loginRes.result.token);
        }
    };

    const userLoginByToken = async (token: string, next?: NavigationGuardNext) => {
        set(STORAGE_TYPES.SET_TOKEN, token);
        const { queryUserInfo } = useUserInfo();
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
