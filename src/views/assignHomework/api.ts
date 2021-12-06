import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import { FetchGradeClassStudentsData, FetchWorkbookListData, FetchWorkbookPaperData, Grade, GradeClassStudent, Publisher, PublishHomeworkData, Workbook, WorkbookPaper } from "@/types/assignHomework";

// 获取年级班级学生
export const fetchGradeClassStudents: RequestFun<FetchGradeClassStudentsData, GradeClassStudent[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetGradeClassStudents",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 布置作业
export const publishHomework: RequestFun<PublishHomeworkData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/HomeworkIntegration/PublishHomework",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取超级教辅出版社
export const fetchPublisherList: RequestFun<null, Publisher[]> = () => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Universal/BaseData/GetPublisherList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post"
    });
};

// 获取教辅助列表
export const fetchWorkbookList: RequestFun<FetchWorkbookListData, Workbook[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/CustomHomework/GetWorkbookList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取所有年级
export const fetchGrade: RequestFun<null, Grade[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W1/Grade/GetGrade",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取教辅助中练习卷
export const fetchWorkbookPaper: RequestFun<FetchWorkbookPaperData, WorkbookPaper[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/CustomHomework/GetWorkbookPaper",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
