import request from "@/utils/request";
import { YUN_API_ONECARD, YUN_API_PORTRAIT } from "@/config";
import { RequestFun } from "@/types/response";
import {IAddRewardrecodeRes, IClassDisabledRes, IPraiseStudentRes} from "@/types/quickAnswer";

// 获取班级锁屏状态
export const getClassEquipmentStatus: RequestFun<IClassDisabledRes, any> = (data) => {
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

// 开始抢答
export const sendRushToAnswer: RequestFun<IClassDisabledRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/SendRushToAnswer",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// // 点赞表扬
// export const praiseStudent: RequestFun<IPraiseStudentRes, any> = (data) => {
//     return request({
//         baseURL: YUN_API_ONECARD,
//         url: "/Api/AnswerMachine/PraiseStudent",
//         headers: {
//             "Content-Type": "application/json-patch+json"
//         },
//         method: "post",
//         data
//     });
// };

// 点赞表扬 (关联移动端奖惩)
export const addRewardrecode: RequestFun<IAddRewardrecodeRes, any> = (data) => {
    return request({
        baseURL: YUN_API_PORTRAIT,
        url: "/Api/Portrait/Reward/AddRewardrecode",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 点赞表扬
export const praiseStudent: RequestFun<IPraiseStudentRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/PraiseStudent",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
