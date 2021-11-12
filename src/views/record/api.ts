import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";

export interface FetchStudyHistoryGroupBySubjectData {
    id: string,
    teacherId: string
}

export interface StudyHistory {
    SubjectID: string,
    SubjectName: string,
    Days: {
        Day: string,
        NoSure: number,
        Right: number,
        Wrong: number,
    }[]
}

// 获取学生不同科目的学习记录统计
export function fetchStudyHistoryGroupBySubject(data: FetchStudyHistoryGroupBySubjectData): Promise<IResponse<StudyHistory[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Universal/Statistics/GetStudyHistoryGroupBySubject/V211019",
        method: "post",
        data
    });
}
