import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse, RequestFun } from "@/types/response";
import {
    AddChapterData, AddCourseWareTeacherElementFileData, AddCustomBookLessonData, AddMaterialData, AddOrUpdateCourseBagTeacherData, BagChapter, BookChapter, BookList, CloneCourseBagToTeacherData, CloneCourseBagToTeacherRes, Course,
    DelCourseBagTeacherData,
    DeleteMaterialData,
    EditMaterialData,
    FetchBagChapterData,
    FetchSchoolLessonListData,
    FetchLessonsData,
    FetchTeacherBookChaptersData, FetchTeacherLessonAndBagByChapterData, GetLastSelectBookData, GetLastSelectBookRes, Lesson, Material, QueryMaterialListData, SaveTeacherClassScheduleData, SetLastSelectBookData, UpdateCourseBagTeacherData, UpdateCourseWareListOfTeacherData, UpdateCourseWareTeacherSortData, UpdateCustomBookLessonData, SchoolLesson, FetchSchoolWindowListData, SchoolWindowInfo, FetchBagBySchoolLessonData, SchoolBagInfo
} from "@/types/preparation";

// 获取科目出版社集合
export function fetchSubjectPublisherBookList():Promise<IResponse<BookList[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetSubjectPublisherBookList",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post"
    });
}

// 获取单元列表
export function fetchTeacherBookChapters(data: FetchTeacherBookChaptersData): Promise<IResponse<BookChapter[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetTeacherBookChapters",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 添加自定义单元
export function addChapter(data: AddChapterData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/AddCustomBookChapter",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 获取课包和课时
export function fetchTeacherLessonAndBagByChapter(data: FetchTeacherLessonAndBagByChapterData): Promise<IResponse<Course[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetTeacherLessonAndBagByChapter",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 添加自定义课包
export function addCourseBagTeacher(data:AddOrUpdateCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/AddCourseBagTeacher",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 编辑自定义课包
export function updateCourseBagTeacher(data:UpdateCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/UpdateCourseBagTeacher",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 添加自定义课时
export function addCustomBookLesson(data: AddCustomBookLessonData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/AddCustomBookLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 编辑自定义课时
export function updateCustomBookLesson(data: UpdateCustomBookLessonData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/UpdateCustomBookLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 保存老师排课列表
export function saveTeacherClassSchedule(data: SaveTeacherClassScheduleData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/SaveTeacherClassSchedule",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 克隆系统课包
export function cloneCourseBagToTeacher(data: CloneCourseBagToTeacherData): Promise<IResponse<CloneCourseBagToTeacherRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/Teach/CloneCourseBagToTeacher",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 删除自定义课包
export function delCourseBagTeacher(data: DelCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/DeleteCourseBagTeacher",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 批量老师课包内的课件资源
export function updateCourseWareListOfTeacher(data: UpdateCourseWareListOfTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/UpdateCourseWareListOfTeacher",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 修改老师课包课件排序
export function updateCourseWareTeacherSort(data: UpdateCourseWareTeacherSortData[]): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/API/W4/Teach/UpdateCourseWareTeacherSort",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

/**
 * 请求课时
 * @param {*} data
 * @returns
 */
export const fetchLessons = (data: FetchLessonsData): Promise<IResponse<Lesson[]>> => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/GetLessons",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取练习卷列表
export function fetchBagChapter(data: FetchBagChapterData): Promise<IResponse<BagChapter[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "api/w4/ChapterChoice/GetBagChapter",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

export const queryMaterialList = (data: QueryMaterialListData): Promise<IResponse<Material[]>> => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/Element/GetElements",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const deleteMaterial = (data: DeleteMaterialData): Promise<IResponse<null>> => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/Element/DeleteElement",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const addMaterial = (data: AddMaterialData): Promise<IResponse<null>> => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/Element/AddElement",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const editMaterial = (data: EditMaterialData): Promise<IResponse<null>> => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "API/W4/Element/EditElement",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const addCourseWareTeacherElementFile: RequestFun<AddCourseWareTeacherElementFileData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/AddCourseWareTeacherElementFile",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const getLastSelectBook: RequestFun<GetLastSelectBookData, GetLastSelectBookRes> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/GetLastSelectBook",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
};

export const setLastSelectBook: RequestFun<SetLastSelectBookData, null> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/SetLastSelectBook",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
};

export const fetchSchoolLessonList: RequestFun<FetchSchoolLessonListData, SchoolLesson[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Card/GetSchoolLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const fetchSchoolWindowList: RequestFun<FetchSchoolWindowListData, SchoolWindowInfo[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Card/GetWindowBySchoolLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

export const fetchBagBySchoolLesson:RequestFun<FetchBagBySchoolLessonData, SchoolBagInfo[]> = (data) => {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "Api/W4/Teach/GetBagBySchoolLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};
