import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse } from "@/types/response";
import {
    AddChapterData, AddCustomBookLessonData, AddOrUpdateCourseBagTeacherData, BookChapter, BookList, Course,
    FetchTeacherBookChaptersData, FetchTeacherLessonAndBagByChapterData, SaveTeacherClassScheduleData, UpdateCustomBookLessonData
} from "@/types/preparation";

// 获取科目出版社集合
export function fetchSubjectPublisherBookList():Promise<IResponse<BookList[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/W4/Teach/GetSubjectPublisherBookList",
        headers: {
            "Content-Type": "application/json-patch+json"
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
export function updateCourseBagTeacher(data:AddOrUpdateCourseBagTeacherData): Promise<IResponse<null>> {
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
