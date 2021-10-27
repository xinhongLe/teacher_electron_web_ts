import { MutationTypes, useStore } from "@/store";
import {
    IBasicTagResponse,
    IGradeClassTreeResponse,
    ILessonManagerResponse,
    ILoginData,
    ILoginResponse
} from "@/types/login";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import {
    GetBasicTag,
    GetGradeClassTree,
    LessonManager,
    Login
} from "@/views/login/api";
import { NavigationGuardNext } from "vue-router";

export default () => {
    const store = useStore();

    const userLogin = async (account: string, password: string, next?: NavigationGuardNext) => {
        const loginRes: ILoginResponse = await Login({ account, password });
        if (loginRes.resultCode === 200) {
            set(STORAGE_TYPES.SET_TOKEN, loginRes.result.token);

            next && next({ path: "/" });

            GetGradeClassTree().then((res: IGradeClassTreeResponse) => {
                if (res.resultCode === 200) {
                    set(STORAGE_TYPES.GRADE_CLASS_TREE_LIST, res.result);
                }
            });

            GetBasicTag().then((res: IBasicTagResponse) => {
                if (res.resultCode === 200) {
                    set(STORAGE_TYPES.STUDENT_TAGS, res.result);
                }
            });

            LessonManager().then((res: ILessonManagerResponse) => {
                if (res.resultCode === 200) {
                    set(STORAGE_TYPES.USER_INFO, res.result);
                    store.commit(MutationTypes.UPDATE_USERINFO, { name: res.result.Name });
                }
            });
        }
    };

    const recordAccount = (form: ILoginData) => {
        const recordList = get(STORAGE_TYPES.RECORD_LOGIN_LIST) || [];
        const index = recordList.findIndex((item: ILoginData) => item.account === form.account);
        index > -1 ? (recordList[index] = form) : recordList.unshift(form);
        set(STORAGE_TYPES.RECORD_LOGIN_LIST, recordList);
    };

    return {
        userLogin,
        recordAccount
    };
};
