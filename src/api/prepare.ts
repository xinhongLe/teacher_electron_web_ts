import { VUE_APP_PREPARE_API } from "@/config";
import { IYunInfo } from "@/types/login";
import { RequestFun } from "@/types/response";
import request from "@/utils/request";
import { get, STORAGE_TYPES } from "@/utils/storage";

/**
 * IAddLessonBag，新增备课包入参
 */
export interface IAddLessonBag {
    /**
     * 学段
     */
    acaSectionId?: null | string;
    acaSectionName?: null | string;
    /**
     * 书册
     */
    albumId?: null | string;
    albumName?: null | string;
    /**
     * 章节
     */
    chapterId?: null | string;
    chapterName?: null | string;
    /**
     * ID
     */
    id?: null | string;
    /**
     * 课时id
     */
    lessonId: string;
    lessonName?: null | string;
    /**
     * 名称
     */
    name?: null | string;
    /**
     * 出版社
     */
    publisherId?: null | string;
    publisherName?: null | string;
    /**
     * 资源id
     */
    resourceId?: null | string;
    /**
     * 学校ID
     */
    schoolId?: null | string;
    /**
     * 顺序
     */
    sort?: number;
    /**
     * 学科
     */
    subjectId?: null | string;
    subjectName?: null | string;
}
/**
 * IAddLessonBagOutDto，新增备课包出参
 */
export interface IAddLessonBagOutDto {
    /**
     * ID
     */
    Id?: null | string;
    /**
     * 名称
     */
    Name?: null | string;
}
/**
 * GetLessonBagOutDto，获取备课包出参
 */
export interface IGetLessonBagOutDto {
    /**
     * ID
     */
    Id?: null | string;
    /**
     * 是否已排课
     */
    IsSchedule?: boolean;
    /**
     * 名称
     */
    Name?: null | string;
}

/**
 * GetPrepareBagCountInDto，获取我的备课包数量 入参
 */
export interface IGetPrepareBagCount {
    /**
     * 章节 ID
     */
    chapterId: string;
    /**
     * 课时 ID
     */
    lessonId?: null | string;
    /**
     * 校区Id
     */
    schoolId?: null | string;
}

/**
 * AddResourceLessonBagDto，新增备课包资源
 */
export interface IAddResourceLessonBag {
    /**
     * 课包ID
     */
    lessonBagId?: null | string;
    /**
     * 资源id
     */
    resourceId?: null | string;
}

/**
 * GetCurrentUserNewScheduleInDto，获取当前用户排课信息 入参
 */
export interface IGetCurrentUserNewSchedule {
    /**
     * 排课结束时间
     */
    endTime: Date;
    /**
     * 学校Id
     */
    schoolId: string;
    /**
     * 排课开始时间
     */
    startTime: Date;
    /**
     * 学期Code
     */
    termCode: string;
}

/**
 * GetCurrentUserNewScheduleOutDto，获取当前用户排课信息 出参
 */
export interface IGetCurrentUserNewScheduleOutDto {
    /**
     * 上\下午
     * 1：上午
     * 2：下午
     */
    apmp?: number;
    /**
     * 是否可修改(时间小于当前的不可修改)
     */
    canEdit?: boolean;
    /**
     * 班级ID
     */
    classId?: null | string;
    /**
     * 班级名称
     */
    className?: null | string;
    /**
     * 日期
     */
    date?: Date;
    /**
     * 周次
     * 枚举：DayOfWeek
     * 星期天：0
     * 星期一：1
     * 星期二：2
     * 星期三：3
     * 星期四：4
     * 星期五：5
     * 星期六：6
     */
    dateOfWeek?: number;
    /**
     * 课节结束时间
     */
    endTime?: string;
    /**
     * 课包数据
     */
    packageList?: IPackageExtDto[] | null;
    /**
     * 排课详情表Id
     */
    schedulingNewDetailId?: null | string;
    /**
     * 作息节次Id
     */
    sectionId?: null | string;
    /**
     * 节次
     */
    sectionIndex?: number;
    /**
     * 课节开始时间
     */
    startTime?: string;
    /**
     * 科目Id
     */
    subjectId?: null | string;
    /**
     * 科目Name
     */
    subjectName?: null | string;
    /**
     * 全部课包资源数量汇总
     */
    totalCount?: number | null;
    /**
     * 周属性（1 单周，2 双周）
     */
    weekType?: number;
}

/**
 * PackageExtDto，课包数据Dto
 */
export interface IPackageExtDto {
    /**
     * 册名
     */
    albumName?: null | string;
    /**
     * 章节 名
     */
    chapterName?: null | string;
    /**
     * 课时名称
     */
    lessonName?: null | string;
    /**
     * 课包资源数量
     */
    packageCount?: number | null;
    /**
     * 课包Id
     */
    packageId?: null | string;
    /**
     * 课包Name
     */
    packageName?: null | string;
    /**
     * 出版社 名
     */
    publisherName?: null | string;
}

/**
 * SetNewScheduleInDto，新增/编辑排课 入参
 */
export interface ISetNewScheduleInDto {
    /**
     * 课包Id
     */
    packageId: string;
    /**
     * 排课详情表Id
     */
    schedulingNewDetailId: string;
    /**
     * 操作类型(1-添加;2-替换)
     */
    type: number;
}

/**
 * NewScheduleInDto，空白处新增 入参
 */
export interface INewScheduleInDto {
    /**
     * 上午或下午( 1：上午;2：下午) (对云平台未排的空白单元格进行排课时使用)
     */
    apmp: number;
    /**
     * 班级Id(对云平台未排的空白单元格进行排课时使用)
     */
    classId: string;
    /**
     * 日期(对云平台未排的空白单元格进行排课时使用)
     */
    date: Date;
    /**
     * 课包Id
     */
    packageId: string;
    /**
     * 学校Id
     */
    schoolId: string;
    /**
     * 节次Id(对云平台未排的空白单元格进行排课时使用)
     */
    sectionId: string;
    /**
     * 节次Index(对云平台未排的空白单元格进行排课时使用)
     */
    sectionIndex: number;
    /**
     * 学期编码
     */
    termCode: string;
}

/**
 * DelNewSchedulingInDto，删除排课计划 入参
 */
 export interface IDelNewSchedulingInDto {
    /**
     * 课时包Id
     */
    packageIds: string[];
    /**
     * 排课详情表Id
     */
    schedulingNewDetailId: string;
}

// 新增备课包
export const AddLessonBag: RequestFun<IAddLessonBag, IAddLessonBagOutDto> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/AddLessonBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 获取当前登录人课时下的备课包
export const GetMyLessonBagNew: RequestFun<{ id: string }, IGetLessonBagOutDto[]> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/GetMyLessonBagNew",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 获取当前登陆人的备课包数量
export const PrepareGetMyBagCountNew: RequestFun<IGetPrepareBagCount, { BagCount: number }> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/PrepareGetMyBagCountNew",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 删除备课包
export const DelLessonBag: RequestFun<{ id: string }, boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/DelLessonBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 资源加入备课包
export const AddResourceLessonBag: RequestFun<IAddResourceLessonBag, boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/AddResourceLessonBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 资源移出备课包
export const DelResourceLessonBag: RequestFun<{ id: string }, boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Prepare/Prepare/DelResourceLessonBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 获取当前登陆人的排课信息
export const GetCurrentUserSchedulingInfo: RequestFun<IGetCurrentUserNewSchedule, IGetCurrentUserNewScheduleOutDto> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Schedule/NewCourseScheduling/GetCurrentUserSchedulingInfo",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 获取单个排课信息
export const GetSchedulingInfo: RequestFun<{ schedulingNewDetailId: string }, IGetCurrentUserNewScheduleOutDto> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Schedule/NewCourseScheduling/GetSchedulingInfo",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 新增/替换课包
export const SetCourseScheduling: RequestFun<ISetNewScheduleInDto, null> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Schedule/NewCourseScheduling/SetCourseScheduling",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 空白处新增
export const NewCourseScheduling: RequestFun<INewScheduleInDto, null> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Schedule/NewCourseScheduling/NewCourseScheduling",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};

// 删除排课计划
export const DelCourseScheduling: RequestFun<IDelNewSchedulingInDto, null> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: VUE_APP_PREPARE_API,
        url: "/Api/Schedule/NewCourseScheduling/DelCourseScheduling",
        headers: {
            "Content-Type": "application/json-patch+json",
            UserId: yunInfo.UserId,
        },
        method: "post",
        data,
    });
};