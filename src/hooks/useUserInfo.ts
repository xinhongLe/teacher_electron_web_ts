import { MutationTypes, store } from "@/store";
import { ILessonManagerResult } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { LessonManager } from "@/views/login/api";
import { lessonManagerByTeacherId } from "@/views/classManage/api";
import isElectron from "is-electron";
import { getSaveFilePath } from "@/utils";

const dealUserInfo = async (useInfo:ILessonManagerResult) => {
    if (isElectron()) {
        const path = getSaveFilePath(useInfo.ID);
        await window.electron.setPath("downloads", path);
    }
    set(STORAGE_TYPES.USER_INFO, useInfo);
    store.commit(MutationTypes.UPDATE_USERINFO,
        {
            name: useInfo.Name,
            account: useInfo.Account,
            id: useInfo.ID,
            userCenterUserID: useInfo.UserCenterUserID,
            Schools: useInfo.Schools
        });
};

export default () => {
    const queryUserInfo = async () => {
        const res = await LessonManager();
        if (res.resultCode === 200) {
            await dealUserInfo(res.result);
            return true;
        }
        return false;
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
