import request from "@/utils/request";
import { TIMETABLE_API, AI_XUE_SHI_API, SCHEDULE_API } from "@/config";
import { RequestFun } from "@/types/response";

interface FetchActiveTimetableIDData {
    schoolID: string;
    semesterDataID: string;
}

interface FetchGetUserSchedulesData {
    timetableID: string;
    userID: string;
    courseMainIDs?: string[];
}

interface ISchedulesInfo {
    SchedulesID: string;
    GradeID: string;
    GradeName: string;
    ClassID: string;
    ClassName: string;
    IsDiffeWeek: boolean;
    MajorUserID: string;
    MajorUserName: string;
    MajorCourseName: string;
    MajorCourseID: string;
    MajorCourseCode: string;
    MajorScheduleType: number;
    MajorIsConflict: boolean;
    MinorUserID: string;
    MinorUserName: string;
    MinorCourseName: string;
    MinorCourseCode: string;
    MinorCourseID: string;
    MinorScheduleType: number;
    MinorIsConflict: boolean;
}

export interface UserSchedules {
    SectionName: string;
    BeginTime: string;
    EndTime: string;
    DayOfWeek: number;
    Apmp: number;
    Schedules: ISchedulesInfo[];
}

export interface TimetableClassTime {
    SectionName: string;
    ClassIndex: number;
    Apmp: number;
    ShowType: number;
    BeginTime: string;
    EndTime: string;
    IsShow: boolean;
    CourseTypeID: string;
    CourseTypeName: string;
}

export interface IScheduleContent {
    ScheduleID: string;
    LessonID: string;
    LessonName: string;
    SubjectID: string;
    ScheduleTime: string;
}

interface UpdateScheduleRes {
    lessonID: string;
    scheduleTime: string;
    timetableMainID: string;
    scheduleIDs: string[];
}

// 根据学年学期获取正在生效状态的课表ID
export const fetchActiveTimetableID: RequestFun<
    FetchActiveTimetableIDData,
    { ID: string }
> = (data) => {
    return request({
        baseURL: TIMETABLE_API,
        url: "Api/Web/Timetable/GetActiveTimetableID",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 通过课表ID获取该课表的 用户课表
export const fetchUserSchedules: RequestFun<
    FetchGetUserSchedulesData,
    UserSchedules[]
> = (data) => {
    return request({
        baseURL: SCHEDULE_API,
        url: "Api/Web/Schedule/GetUserSchedules",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 根据课表获取该课表的作息
export const fetchTimetableClassTime: RequestFun<
    {
        timetableID: string;
    },
    TimetableClassTime[]
> = (data) => {
    return request({
        baseURL: TIMETABLE_API,
        url: "Api/Web/Timetable/GetTimetableClassTime",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 查询教师的排课内容
export const fetchScheduleContent: RequestFun<
    {
        timetableMainID: string,
        beginTime: string,
        endTime: string
    },
    IScheduleContent[]
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V5/Teach/GetScheduleContent",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 更新排课内容
export const updateSchedule: RequestFun<
    UpdateScheduleRes,
    IScheduleContent[]
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/V5/Teach/UpdataSchedule",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 根据学校ID 获取该学校的学期学年Code
export const fetchTermCodeBySchoolId: RequestFun<
    {
        id: string
    },
    {
        TermCode: string,
        TermId: string
    }
> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/GetTermCodeBySchoolId",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
