import request from "@/utils/request";
import { YUN_API_ONECARD } from "@/config";
import { RequestFun } from "@/types/response";
import { IClassDisabledRes } from "@/types/quickAnswer";

// 获取班级锁屏状态
export const getClassEquipmentStatus: RequestFun<{TeacherID:string, OrgID:string}, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/GetClassEquipmentStatus",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 锁屏管理
export const classDisabled: RequestFun<IClassDisabledRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/ClassDisabled",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
