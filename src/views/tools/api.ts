import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { RequestFun } from "@/types/response";
import { FetchGradeClassStudentsData, GradeClassStudent } from "@/types/assignHomework";

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
