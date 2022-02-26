import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";

export interface MQTTInfoData {
    TeacherId: string;
    ClassId: string;
    QuestionId: string;
    QuestionType: number;
    QuestionOption: string;
    QuestionNum: number;
    IsEnd: boolean;
    TimeStamp: null;
    Topic: string;
}

export interface StudentAnswerInfo {
    ClassId: string;
    QuestionDetail: string;
    QuestionId: string;
    QuestionType: number;
    StudentId: string;
    StudentName: string;
    TeacherId: string;
}

export const sendMQTTInfo: RequestFun<MQTTInfoData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/MQTTInfo",
        headers: {
            noLoading: "true"
        },
        method: "post",
        data
    });
};

export const getStudentAnswerEndInfo: RequestFun<MQTTInfoData, StudentAnswerInfo[]> = (
    data
) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetStudentAnswerEndInfo",
        headers: {
            noLoading: "true"
        },
        method: "post",
        data
    });
};
