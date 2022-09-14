import request from "@/utils/request";
import { AI_XUE_SHI_API, YUN_API_ONECARD } from "@/config";
import { RequestFun } from "@/types/response";

export interface MQTTInfoData {
    TeacherID: string;
    OrgID: string;
    ClassID: string;
    Type:number,
    SaveType:number,
    QuestionId: string;
    // QuestionType?: number;
    // QuestionOption?: string;
    // QuestionNum?: number;
    IsEnd: boolean;
    TimeStamp: null;
    Topic: string;
    // TopicList?: {
    //     QuestionType: number;
    //     QuestionOption: string;
    //     QuestionNum: number;
    // }[],
    QuestionDetail: {
        ID?: string,
        Sort: number,
        QuestionType: number, // 类型（1-单选题；2-多选题；3-判断题；）
        QuestionOption: string // 题目选项
    }[]
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

/**
 资源ID 放入课包的填写
 */
export interface IAnswerMachineQuestionRes{
    TeacherID: string,
    OrgID: string,
    ClassID: string,
    ResourceMainID?: string,
}

/**
 ID 本次任务ID 无草稿无需填写
 SaveType 是否保存为草稿 0 保存为草稿 1 发放题目
 SubjectId 科目Id- 放入课包的填写 无课包无需填写
 SubjectName 科目名称- 放入课包的填写 无课包无需填写
 Type 0 答题器
 */
export interface ISaveAnswerMachineQuestionRes {
    ID?: string,
    TeacherID: string,
    OrgID: string,
    ClassID: string,
    Type: number,
    SaveType: number,
    SubjectId?: string,
    SubjectName?: string,
    QuestionDetail: {
        ID?: string,
        Sort: number,
        QuestionType: number, // 类型（1-单选题；2-多选题；3-判断题；）
        QuestionOption: string // 题目选项
    }[]
}

// 获取答题器草稿
export const getAnswerMachineQuestionList: RequestFun<IAnswerMachineQuestionRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/GetAnswerMachineQuestionList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 保存题目或草稿
export const saveAnswerMachineQuestion: RequestFun<ISaveAnswerMachineQuestionRes, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/SaveAnswerMachineQuestion",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 老师收题
export const finishAnswerMachineQuestion: RequestFun<{TeacherID: string, AnswerMachineID: string }, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/FinishAnswerMachineQuestion",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取学生答题结果
export const getStudentQuestionResult: RequestFun<{AnswerMachineID: string }, any> = (data) => {
    return request({
        baseURL: YUN_API_ONECARD,
        url: "/Api/AnswerMachine/GetStudentQuestionResult",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

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
