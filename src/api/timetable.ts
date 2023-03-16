import request from "@/utils/request";
import { TIMETABLE_API, AI_XUE_SHI_API, SCHEDULE_API, systemId, YUN_API, VUE_APP_CLASS_TIME_API } from "@/config";
import { RequestFun } from "@/types/response";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { IYunInfo } from "@/types/login";

interface FetchActiveTimetableIDData {
    schoolID: string;
    semesterDataID: string;
}

interface FetchGetUserSchedulesData {
    SchoolID: string;
    TeacherID: string;
    StartTime: string;
    EndTime: string;
    TermCode: string | number;
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
    LessonID: string;
    LessonName: string;
    Type: 1 | 2;
}

export interface IScheduleDetail {
    ClassID: string;
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
    OriginScheduleID: string;
    TeacherID: string;
    TeacherName: string;
    LessonID: string;
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

/**
 * GetClassTimeDetailOutDto，获取作息表 出参
 */
export interface IGetClassTimeDetailOutDto {
    /**
     * 作息表明细明细
     */
    classTimes?: ClassTimeDto[] | null;
}

/**
 * ClassTimeDto，作息主表
 */
export interface ClassTimeDto {
    /**
     * 作息明细
     */
    classTimeDetailDtos?: ClassTimeDetailDto[] | null;
    /**
     * 作息表ID
     */
    classTimeID?: null | string;
    /**
     * 作息表名称
     */
    classTimeName: string;
    /**
     * 适用年级Id列表
     */
    gradeIds?: string[] | null;
}

/**
 * ClassTimeDetailDto，作息明细
 */
export interface ClassTimeDetailDto {
    /**
     * 上\下午
     * 1：上午
     * 2：下午
     */
    apmp?: number;
    /**
     * 开始时间
     */
    beginTime?: string;
    /**
     * 绑定的自定义数据(Json字符串)
     * {"courseTypeID":"xxxxxxxxxxxx","courseTypeName":"正课"}
     */
    bindData?: null | string;
    /**
     * 结束时间
     */
    endTime?: string;
    /**
     * 是否展示在课表
     */
    isShow?: boolean;
    /**
     * 节次ID（新建的节次可不用传）
     */
    sectionID?: null | string;
    /**
     * 节次
     * 1， 2， 3...
     */
    sectionIndex?: number;
    /**
     * 节次名
     */
    sectionName: string;
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

// 作息表
export const GetClassTimeDetail: RequestFun<
    FetchActiveTimetableIDData,
    IGetClassTimeDetailOutDto
> = (data) => {
    return request({
        baseURL: VUE_APP_CLASS_TIME_API,
        url: "API/Web/ClassTime/GetClassTimeDetail",
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
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    console.log("yunInfo", yunInfo);
    return request({
        baseURL: SCHEDULE_API,
        url: "Api/Web/WorkLoad/GetTeacherCourseData",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey
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
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: SCHEDULE_API,
        url: "Api/Web/WorkLoad/TeacherScheduleChange",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey
        },
        method: "post",
        data
    });
};

// 根据学校ID 获取该学校的学期学年Code
export const fetchTermCodeBySchoolId: RequestFun<
    {
        OrgIds: string[]
    },
    {
        SemesterDataCode: string,
        SemesterDataId: string
    }[]
> = (data) => {
    return request({
        baseURL: YUN_API,
        url: "Api/Web/Calendar/GetOrgCurrentDataList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
