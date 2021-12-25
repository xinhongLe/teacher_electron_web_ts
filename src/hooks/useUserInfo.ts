import { MutationTypes, store } from "@/store";
import { ILessonManagerResult } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { LessonManager } from "@/views/login/api";
import { lessonManagerByTeacherId } from "@/views/classManage/api";

const dealUserInfo = (useInfo:ILessonManagerResult) => {
    set(STORAGE_TYPES.USER_INFO, useInfo);
    store.commit(MutationTypes.UPDATE_USERINFO,
        {
            name: useInfo.Name,
            account: useInfo.Account,
            id: useInfo.ID,
            Schools: useInfo.Schools
        });
};

export default () => {
    const queryUserInfo = () => {
        return LessonManager().then((res) => {
            if (res.resultCode === 200) {
                dealUserInfo(res.result);
                return true;
            }
            return false;
        });
    };

    const queryUserInfoByTeacherId = async (teacherId: string) => {
        const res = await lessonManagerByTeacherId(teacherId);
        if (res.resultCode === 200) {
            dealUserInfo(res.result);
        }
    };

    return {
        queryUserInfo,
        queryUserInfoByTeacherId
    };
};
