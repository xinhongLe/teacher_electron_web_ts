import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";

interface GetClassTimeData {
    schoolID: string
}

interface GetTeachClassScheduleData {
    classID: string,
    subjectID: string
}

interface GetWeekScheduleData {
    firstDayOfWeek: string
}

interface GetCourseWareByCourseBagData {
    courseBagID: string
}

interface GetCourseWareTeacherByCourseBagData {
    courseBagTeacherID: string
}

interface UpdateClassWithDefaultBagData {
    courseBagID: string,
    className: string,
    classPlanStartTime: string,
    classPlanEndTime: string,
    subjectID: string,
    classIDs: string[],
    courseBagTeacherLogID: string
}

interface UpdateClassData {
    courseBagTeacherID: string,
    className: string,
    classPlanStartTime: string,
    classPlanEndTime: string,
    subjectID: string,
    classIDs: string[],
    courseBagTeacherLogID: string
}

interface HaveClassWithDefaultBagData {
    courseBagID: string,
    className: string,
    classPlanStartTime: string,
    classPlanEndTime: string,
    subjectID: string,
    classIDs: string[],
}

interface HaveClassData {
    courseBagTeacherID: string,
    className: string,
    classPlanStartTime: string,
    classPlanEndTime: string,
    subjectID: string,
    classIDs: string[],
}

interface CancelClassData {
    courseBagTeacherLogID: string,
    windowScheduleLogID?: string
}

export interface GetTeachClassScheduleRes {
    BeginTime: string,
    ClassID: string,
    ClassName: string,
    DayOfWeek: number,
    EndTime: string,
    GradeID: string,
    GradeName: string,
    SubjectID: string,
    SubjectName: string
}

type GetTeachClassScheduleResponse = IResponse<GetTeachClassScheduleRes[]>

export interface CourseBag {
    AfterAssigned: boolean,
    AfterAssignedTime: string,
    AlbumName: string,
    BeforeAssigned: boolean,
    BeforeAssignedTime: string,
    Changed: number,
    ChapterName: string,
    ClassName: string,
    ClassPlanEndTime: string,
    ClassPlanStartTime: string,
    Classes: {
        ClassName: string,
        ClassID: string
    }[],
    CourseBagTeacherID: string,
    HaveAfterCourseWare: true,
    HaveBeforeCourseWare: true,
    ID: string,
    LessonID: string,
    LessonName: string,
    Name: string,
    OnSale: number,
    PublisherName: string,
    ClassActualEndTime: string,
    SubjectID: string,
    SubjectName: string,
    TeacherID: string,
    TotalAfterComplate: number,
    TotalAfterStudent: number,
    TotalBeforeComplate: number,
    TotalBeforeStudent: number,
    Type: 1 | 2,
    Version: string
}

export interface GetWeekScheduleRes {
    Classes: CourseBag[],
    windowClasses: []
}

type GetWeekScheduleResponse = IResponse<GetWeekScheduleRes>

export interface GetClassTimeRes {
    ClassIndex: number,
    EndTime: string,
    ShowType: number,
    StartTime: string,
    Type: number
}

// 获取学校时间课表安排
export function fetchClassTime(data: GetClassTimeData): Promise<IResponse<GetClassTimeRes[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetClassTime",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 获取老师的排版模板
export function fetchTeachClassSchedule(data: GetTeachClassScheduleData): Promise<GetTeachClassScheduleResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetTeachClassSchedule",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 获取老师当前周的排课
export function fetchWeekSchedule(data: GetWeekScheduleData): Promise<GetWeekScheduleResponse> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetWeekSchedule",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 获取课包详情 系统1 / 自定义2
export function getCourseByCourseBag(type: number, data: GetCourseWareByCourseBagData | GetCourseWareTeacherByCourseBagData) {
    const url =
        type === 1
            ? "API/W4/Teach/GetCourseWareByCourseBag"
            : "API/W4/Teach/GetCourseWareTeacherByCourseBag";
    return request({
        baseURL: AI_XUE_SHI_API,
        url,
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 更新排课
export function updateClass(type: number, data: UpdateClassWithDefaultBagData| UpdateClassData) {
    const url =
        type === 1
            ? "Api/W4/Teach/UpdateClassWithDefaultBag"
            : "Api/W4/Teach/UpdateClass";
    return request({
        baseURL: AI_XUE_SHI_API,
        url,
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 保存课包
export function haveClass(type: number, data: HaveClassWithDefaultBagData|HaveClassData) {
    const url =
        type === 1
            ? "Api/W4/Teach/HaveClassWithDefaultBag"
            : "Api/W4/Teach/HaveClass";
    return request({
        baseURL: AI_XUE_SHI_API,
        url,
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 删除排课
export function delHaveClass(data: CancelClassData): Promise<IResponse<number>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/CancelClass",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
