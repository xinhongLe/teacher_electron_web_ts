import request from "@/utils/request";
import { AI_XUE_SHI_API } from "@/config";
import { IResponse, RequestFun } from "@/types/response";
import {
    FetchPreparateListPageData, FetchPreparateListPageRes,
    AddChapterData, AddCourseWareTeacherElementFileData, AddCustomBookLessonData, AddMaterialData, AddOrUpdateCourseBagTeacherData, BagChapter, BookChapter, BookList, CloneCourseBagToTeacherData, CloneCourseBagToTeacherRes, Course,
    DelCourseBagTeacherData,
    DeleteMaterialData,
    EditMaterialData,
    FetchBagChapterData,
    FetchLessonsData,
    FetchTeacherBookChaptersData, FetchTeacherLessonAndBagByChapterData, GetLastSelectBookData, GetLastSelectBookRes, Lesson, Material, QueryMaterialListData, SaveTeacherClassScheduleData, SetLastSelectBookData, UpdateCourseBagTeacherData, UpdateCourseWareListOfTeacherData, UpdateCourseWareTeacherSortData, UpdateCustomBookLessonData
} from "@/types/preparationGroup";

// 获取集体备课明细数据
export function fetchPreparateDetail(data: FetchTeacherBookChaptersData):Promise<IResponse<BookChapter[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetPreparateDetail",
        headers: {
            "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        method: "post",
        data
    });
}

// 查询集体备课 小组成员列表
export function fetchGroupLessonTeachers(data: FetchTeacherBookChaptersData): Promise<IResponse<BookChapter[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetGroupLessonTeachers",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 查询集体备课 研讨内容
export function fetchGroupLessonDiscussionContents(data: AddChapterData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetGroupLessonDiscussionContents",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 查询集体备课 总结与反思 文件列表
export function fetchReflectFiles(data: FetchTeacherLessonAndBagByChapterData): Promise<IResponse<Course[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetReflectFiles",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 编辑集体备课明细数据（只有创建者才能编辑）
export function editPreparateDetail(data:AddOrUpdateCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/EditPreparateDetail",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 编辑 集体备课参与人员
export function editPreparateTeachers(data:UpdateCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/EditPreparateTeachers",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 添加研讨内容
export function addDiscussionContent(data: AddCustomBookLessonData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddDiscussionContent",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 编辑研讨内容
export function editDiscussionContent(data: UpdateCustomBookLessonData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/EditDiscussionContent",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 添加研讨的终稿文件
export function addResourceResult(data: SaveTeacherClassScheduleData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddResourceResult",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 查询我的备课列表(分页)
export function fetchPreparateListPage(data: FetchPreparateListPageData): Promise<IResponse<FetchPreparateListPageRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetPreparateListPage",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 根据id删除选中的备课
export function deletePreLesson(data: DelCourseBagTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/DeletePreLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 新增备课
export function addPreLesson(data: UpdateCourseWareListOfTeacherData): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddPreLesson",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 上传总结和反思
export function uploadSummary(data: UpdateCourseWareTeacherSortData[]): Promise<IResponse<null>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/UploadSummary",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 查询当前老师加盟商下面的所有老师
export function fetchThisFraineseTeachers(data: FetchLessonsData): Promise<IResponse<Lesson[]>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/GetThisFraineseTeachers",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
