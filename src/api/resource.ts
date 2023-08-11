import {RESOURCE_API, systemId} from "@/config";
import {IYunInfo} from "@/types/login";
import {RequestFun} from "@/types/response";
import request from "@/utils/request";
import {get, STORAGE_TYPES} from "@/utils/storage";

export interface IBookItem {
    Id: string;
    Name: string;
    BookId?: string;
    Children?: IBookItem[];
}

export interface ICustomBookItem {
    SubjectId: string;
    SubjectName: string;
    PublisherId: string;
    PublisherName: string;
    AlbumId: string;
    AlbumName: string;
    Id: string;
    BookId: string;
    AcaSectionId: string;
    AcaSectionName: string;
}

export interface ICourseItem {
    Id: string;
    Name: string;
    Children?: ICourseItem[];
}

interface IResourceRequest {
    chapterId: string;
    lessonId: string;
    resourceTypeId: string;
    schoolId?: string;
    resourceType: string;
    isResearch?: number;
    type?: number;
    bookId: string;
    pager: {
        pageNumber: number;
        pageSize: number;
    };
}

/**
 * GetLessonBagResourceDto，获取备课包下的资源
 */
export interface IResourceBag {
    /**
     * IDs
     */
    ids?: string[] | null;
    pager?: {
        pageNumber: number;
        pageSize: number;
    };
    /**
     * 资源类型
     */
    typeId?: null | string;
    resourceType?: string
}

export interface ILesson {
    AcaSectionId: string;
    AcaSectionName: string;
    AlbumID: string;
    AlbumName: string;
    BookId: string;
    ChapterID: string;
    ChapterName: string;
    LessonID: string;
    LessonName: string;
    PublisherID: string;
    PublisherName: string;
    ResourceId: string;
    SubjectID: string;
    SubjectName: string;
}

/**
 * LessonBagResourceDto，资源已加入课时包
 */
export interface ILessonBagResourceDto {
    /**
     * 备课包ID
     */
    BagId?: null | string;
    /**
     * 备课包名称
     */
    BagName?: null | string;
    /**
     * ID
     */
    Id?: null | string;
}

export interface IResourceItem {
    BrowseNum: number;
    CreateTime: string;
    DateTime: string;
    Degree: number;
    HotNum: number;
    IsBag: boolean;
    IsCollect: boolean;
    IsLaud: boolean;
    IsSchool: number;
    IsShelf: number;
    LableType: number;
    Name: string;
    TextBooks: ILesson[];
    DownloadNum: number;
    LaudNum: number;
    CollectNum: number;
    OldResourceId: string;
    ResourceId: string;
    ResourceShowType: number;
    ResourceType: string;
    ResourceTypeName: string;
    SchoolId: string;
    SchoolName: string;
    ShareNum: number;
    Source: string;
    BagId: string;
    ResourceToolUrl: string;
    IsSysFile: number;
    IsMine: number;
    File: {
        Id: string;
        Name: string;
        FileName: string;
        Size: number;
        FileBucket: string;
        FilePath: string;
        FileExtention: string;
        FileMD5: string;
    };
    UserId: string;
    JoinBags: ILessonBagResourceDto[];
    LearningGuidSource: number;
    Template: number
}

export interface IResourceResponse {
    list: IResourceItem[];
    pager: {
        IsFirstPage: boolean;
        IsLastPage: boolean;
        PageNumber: number;
        PageSize: number;
        Pages: number;
        Total: number;
    };
}

interface IRequestClassArrangement {
    startTime: string;
    endTime: string;
    schoolId: string;
    // acaSectionCode: string;
}

interface IResponseClassArrangement {
    BagCount: number;
    Id: string;
    BookId: string;
    LessonId: string;
    LessonName: string;
    LessonTime: string;
    ChapterId: string;
}

interface IRequestAddPreparationPackage {
    resourceId: string;
    acaSectionId: string;
    acaSectionName: string;
    subjectId: string;
    subjectName: string;
    publisherId: string;
    publisherName: string;
    albumId: string;
    albumName: string;
    chapterId: string;
    chapterName: string;
    lessonId: string;
    lessonName: string;
}

interface resourceFile {
    fileName: string;
    mD5: string;
    size: number;
}

interface ILearningGuide {
    id: string;
    rowNumber: number;
    columnNumber: number;
    key: string;
    value: string;
    questionIds: string[];
    height: number;
}

interface IResponseLearningGuide {
    id: string;
    rowNumber: number;
    columnNumber: number;
    key: string;
    value: string;
    questionIds: string[];
}

interface IUploadResourceRequest {
    lessonTrees: {
        acaSectionId: string;
        acaSectionName: string;
        subjectID: string;
        subjectName: string;
        publisherID: string;
        publisherName: string;
        bookId: string;
        albumID: string;
        albumName: string;
        chapterID: string;
        chapterName: string;
        lessonID: string;
        lessonName: string;
    }[];
    rescourceTypeId: string;
    rescourceTypeName: string;
    name: string;
    schoolId: string;
    schoolName: string;
    degree: string;
    resourceCourseware?: string;
    resourceFiles?: resourceFile[];
    isSchool: number;
    isShelf: number;
    knowledgePonitId: string[];
    isLearningGuide?: number;
    learningGuideDetails?: ILearningGuide[];
    template?: number
}

interface IUpdateLearningGuide {
    template?: number;
    resourceMainId: string;
    learningGuideDetails?: ILearningGuide[];
}

interface IEditResourceRequest extends IUploadResourceRequest {
    resourceId: string;
    resourceFile: resourceFile;
    userId: string;
    toCourseware: boolean;
}

interface IHistoryListResponse {
    UserName: string;
    DateTime: string;
    File: {
        Id: string;
        Name: string;
        FileName: string;
        Size: number;
        FileBucket: string;
        FilePath: string;
        FileExtention: string;
        FileMD5: string;
        OldFileID: string;
    };
}

interface IPager {
    pageNumber: number;
    pageSize: number;
}

export interface ICourseCartOption {
    CreateTime: string;
    OprateName: string;
    ResourceTypeName: string;
    ResourceName: string;
    Lessons: ILesson[];
    BagCatalogue: string;
    BagName: string
}

interface ICourseCartOptionsResponse {
    list: ICourseCartOption[];
    pager: {
        PageNumber: number;
        PageSize: number;
        Pages: number;
        Total: number;
    };
}

// 获取书册列表
export const fetchAllBookList: RequestFun<{}, IBookItem[]> = () => {
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/GetPrepareAllBookTreeData",
        headers: {
            "Content-Type": "application/json-patch+json",
        },
        method: "post",
    });
};

// 获取常用书册列表
export const fetchCustomBookList: RequestFun<{}, ICustomBookItem[]> = () => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/PrepareGetTeacherBookData",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
    });
};

// 新增常用书册
export const fetchAddCustomBookList: RequestFun<{ bookId: string }, string> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/PrepareAddTeacherBook",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 删除常用书册
export const fetchDeleteCustomBookList: RequestFun<{ id: string }, string> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/PrepareDelTeacherBook",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 根据书册获取课时
export const fetchCourseDataByBookId: RequestFun<{ bookId: string },
    ICourseItem[]> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/GetPrepareLessonsByAlbumId",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取资源全部类型
export const fetchResourceType: RequestFun<{}, { Id: string; Name: string }[]> =
    () => {
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        return request({
            baseURL: RESOURCE_API,
            url: "Api/Resouce/TeacherResource/GetResTypes",
            headers: {
                "Content-Type": "application/json-patch+json",
                noLoading: "true",
                OrgId: yunInfo.OrgId,
                UserId: yunInfo.UserId,
                SystemId: systemId,
                SecretKey: yunInfo.SecretKey,
            },
            method: "post",
        });
    };

// 获取资源列表
export const fetchResourceList: RequestFun<IResourceRequest | IResourceBag,
    IResourceResponse> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url:
            data?.resourceType === "4"
                ? "Api/Resouce/TeacherResource/GetMyResList"
                : data?.resourceType === "me"
                    ? "/Api/Prepare/Prepare/GetLessonBagResource"
                    : "Api/Resouce/TeacherResource/GetResourceList",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        // data:  {
        //     ...data,
        //     ...(data?.resourceType === "me"
        //         ? { typeId: data.resourceTypeId }
        //         : {}),
        // },
        data
    });
};

// 获取课表备课包信息
export const fetchClassArrangement: RequestFun<IRequestClassArrangement,
    IResponseClassArrangement[]> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Schedule/CourseScheduling/GetCurrentUserSchedulingInfo",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取课时备课包数量
export const fetchMyPackageNum: RequestFun<{ chapterId: string; lessonId: string },
    { BagCount: number }> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Prepare/Prepare/PrepareGetMyBagCount",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 加入备课包
export const addPreparationPackage: RequestFun<IRequestAddPreparationPackage,
    string> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/AddBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 移出备课包
export const removePreparationPackage: RequestFun<{ id: string }, boolean> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/DelBag",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 新增排课计划，和备课包数量有关
export const addSchedulePackage: RequestFun<{
    scheduleId: string;
    schoolId: string;
    acaSectionCode: string;
    lessonId: string;
    lessonName: string;
    lessonTime: string;
},
    boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Schedule/CourseScheduling/AddCourseScheduling",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 删除排课计划，和备课包数量有关
export const removeSchedulePackage: RequestFun<{ id: string }, boolean> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Schedule/CourseScheduling/DelCourseScheduling",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 上传资源
export const uploadResource: RequestFun<IUploadResourceRequest, boolean> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/AddResourceByTea",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 编辑资源
export const editResource: RequestFun<IEditResourceRequest, boolean> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/UpdateResourceByTeea",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 删除资源
export const deleteResource: RequestFun<{ id: string; type: number }, boolean> =
    (data) => {
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        return request({
            baseURL: RESOURCE_API,
            url: "Api/Resouce/TeacherResource/DelResouceByTea",
            headers: {
                "Content-Type": "application/json-patch+json",
                OrgId: yunInfo.OrgId,
                UserId: yunInfo.UserId,
                SystemId: systemId,
                SecretKey: yunInfo.SecretKey,
            },
            method: "post",
            data,
        });
    };

// 保存为我的资源
export const saveToMyResource: RequestFun<{ resourceId: string; schoolId: string; schoolName: string },
    IResourceItem> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/SaveMyResource",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取知识点
export const getKnowledgeList: RequestFun<{ lessonId: string }[], boolean> = (
    data
) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/GetKnowledgelib",
        headers: {
            "Content-Type": "application/json-patch+json",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 记录下载次数
export const logDownload: RequestFun<{ id: string }, boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/DownloadNum",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 记录浏览次数
export const logView: RequestFun<{ id: string }, boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/BrowseNumber",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取资源历史版本记录
export const getResourceHistory: RequestFun<{ id: string },
    IHistoryListResponse[]> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/GetResourceHistory",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 同步窗数据
export const sysWincardResource: RequestFun<{
    id: string;
    userId: string;
    lessonID: string;
    schoolId: string;
    schoolName: string;
},
    { Id: string }> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "api/sync/aixueshi/window/SyncToMy",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取备课包操作记录
export const getCartOptionList: RequestFun<{ lessonId: string; startTime: string; endTime: string; paper: IPager },
    ICourseCartOptionsResponse> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "/Api/Prepare/Prepare/PrepareGetLessonBagRec",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取导学案详情
export const getLearningGuidDetail: RequestFun<{ id: string },
    ILearningGuide[]> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/GetLearningGuidDetail",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};

// 获取导学案详情
export const updateLearningGuid: RequestFun<IUpdateLearningGuide,
    boolean> = (data) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    return request({
        baseURL: RESOURCE_API,
        url: "Api/Resouce/TeacherResource/UpdateLearningGuid",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true",
            OrgId: yunInfo.OrgId,
            UserId: yunInfo.UserId,
            SystemId: systemId,
            SecretKey: yunInfo.SecretKey,
        },
        method: "post",
        data,
    });
};
