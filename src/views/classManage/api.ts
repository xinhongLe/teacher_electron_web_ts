import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";

import {
    FetchSchoolClassPage, FetchClassStudentsData,
    FetchClassStudentsRes, FetchSchoolClassRes, Grade, FetchClassTeachersData, FetchClassTeachersRes, UpdateClassNameTeachersData, AddSingleClassData, FetchTeacherListData, FetchTeacherListRes, AddStudentData, GetAccountPasswordData, GetAccountPasswordRes, FetchStudentData, FetchStudentRes, AssignClassStudentData, FetchStudentInfoData, FetchStudentInfoRes, FetchStudentClassesBeforeDistributeData, FetchStudentClassesBeforeDistributeRes, UpdateStudentInfoData, ResetStudentPasswordData
} from "@/types/myStudent";
import { ILessonManagerResponse } from "@/types/login";

// 班级列表
export function fetchSchoolClassPage(data: FetchSchoolClassPage): Promise<IResponse<FetchSchoolClassRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/GetSchoolClassPage/V210918",
        method: "post",
        data
    });
}

// 根据classid获取学生列表
export function fetchClassStudents(data: FetchClassStudentsData): Promise<IResponse<FetchClassStudentsRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/GetClassStudents/V210918",
        method: "post",
        data
    });
}

export function fetchGradeList(): Promise<IResponse<Grade[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/BaseData/GetGradeList",
        method: "post"
    });
}

// 获取班级中的老师
export function fetchClassTeachers(data: FetchClassTeachersData): Promise<IResponse<FetchClassTeachersRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/GetClassTeachers/V210918",
        method: "post",
        data
    });
}

// 更新班级名称
export function updateClassNameTeachers(data: UpdateClassNameTeachersData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/UpdateClassNameTeachers/V211019",
        method: "post",
        data
    });
}

// 新建班级
export function addSingleClass(data: AddSingleClassData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/AddSingleClass/V210918",
        method: "post",
        data
    });
}

export function fetchTeacherList(data: FetchTeacherListData): Promise<IResponse<FetchTeacherListRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Teacher/GetTeacherList/V210923",
        method: "post",
        data
    });
}

// 老师信息
export function lessonManagerByTeacherId(teacherId: string): Promise<ILessonManagerResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetInfo/LessonManager/V211019?teacherId=" + teacherId,
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "get"
    });
}

// 注册学生
export function addStudent(data: AddStudentData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Student/AddStudent/V210923",
        method: "post",
        data
    });
}

// 根据学生姓名获取默认的账号密码
export function getAccountPassword(data: GetAccountPasswordData): Promise<IResponse<GetAccountPasswordRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Student/GetAccountPassword",
        headers: { noLoading: "true" },
        method: "post",
        data
    });
}

// 批量注册学生
export function batchAddStudent(data: FormData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Student/BatchAddStudent/V210918",
        method: "post",
        data
    });
}

// 获取校区学生列表
export function fetchStudent(data: FetchStudentData): Promise<IResponse<FetchStudentRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/GetClassStudentsBeforeDistribute",
        method: "post",
        data
    });
}

// 学生进班
export function assignClassStudent(data: AssignClassStudentData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/AssignClassStudent/V211019",
        method: "post",
        data
    });
}

// 获取学生详情
export function fetchStudentInfo(data: FetchStudentInfoData): Promise<IResponse<FetchStudentInfoRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/Student/GetInfo/V210918",
        method: "post",
        data
    });
}

// 获取学生所在班级和全部班级
export function fetchStudentClassesBeforeDistribute(data: FetchStudentClassesBeforeDistributeData): Promise<IResponse<FetchStudentClassesBeforeDistributeRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Class/GetStudentClassesBeforeDistribute",
        method: "post",
        data
    });
}

// 编辑学生信息
export function updateStudentInfo(data: UpdateStudentInfoData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/Teacher/Student/UpdateNew/V210925",
        method: "post",
        data
    });
}

// 修改学生密码
export function resetStudentPassword(data: ResetStudentPasswordData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/Student/ResetStudentPassword/V210918",
        method: "post",
        data
    });
}
