import request from "@/utils/request";
import { TIMETABLE_API, AI_XUE_SHI_API, SCHEDULE_API } from "@/config";
import { RequestFun } from "@/types/response";

interface FetchActiveTimetableIDData {
    schoolID: string;
    semesterDataID: string;
}

interface FetchGetUserSchedulesData {
    SchoolID: string;
    TeacherID: string;
    StartTime: string;
    EndTime: string;
    TermCode: string;
}

export interface IScheduleContent {
    ScheduleID: string;
    LessonID: string;
    LessonName: string;
    SubjectID: string;
    ScheduleTime: string;
}

interface UpdateScheduleRes {
    ID: string;
    ScheduleID: string;
}

export interface IScheduleDetail {
    APMP: number;
    AdjustTypeID: number;
    ClassName: string;
    CourseID: string;
    CourseName: string;
    CourseTypeID: string;
    CourseTypeName: string;
    EndTime: string;
    GradeName: string;
    ID: string;
    SectionName: string;
    StartTime: string;
    TeacherID: string;
    TeacherName: string;
}

export interface TeacherCourse {
    Date: string;
    DateOfWeek: number;
    ScheduleDetailData: IScheduleDetail[]
}

export interface TableTime {
    APMP: number;
    BeginTime: string;
    ClassIndex: number;
    DayOfWeek: number;
    EndTime: string;
    IsShow: boolean;
    SectionName: string;
    ShowType: number;
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
    {
        TeacherCourseList: TeacherCourse[],
        tableTimeList: TableTime[]
    }
> = (data) => {
    return request({
        baseURL: SCHEDULE_API,
        url: "Api/Web/WorkLoad/GetTeacherCourseData",
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
        baseURL: SCHEDULE_API,
        url: "Api/Web/WorkLoad/TeacherScheduleChange",
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
