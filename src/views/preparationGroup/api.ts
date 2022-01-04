import request from "@/utils/request";
import { AI_XUE_SHI_API, WINDOW_CRAD_API } from "@/config";
import { IResponse, RequestFun } from "@/types/response";
import {
    FetchPreparateListPageData, FetchPreparateListPageRes, DeletePreLessonData,
    AddChapterData, AddCourseWareTeacherElementFileData, AddCustomBookLessonData, AddMaterialData, SavePreparateDetailData, BagChapter, FetchPreparateDetailRes, FetchGroupLessonTeachersRes,
    BookList, CloneCourseBagToTeacherData, CloneCourseBagToTeacherRes, Course,
    DeleteMaterialData,
    EditMaterialData,
    FetchBagChapterData,
    DiscussioncontentList,
    FetchLessonsData,
    AddContentData,
    EditContentData,
    FetchPreparateDetailData, FetchTeacherLessonAndBagByChapterData, GetLastSelectBookData, FetchReflectFilesData, FetchReflectFilesRes, GetLastSelectBookRes, Lesson, Material, QueryMaterialListData, SaveTeacherClassScheduleData, SetLastSelectBookData, UpdateCourseBagTeacherData, UpdateCourseWareListOfTeacherData, UploadSummaryData, UpdateCustomBookLessonData,
    ShareResourceData, GetTeacherClassData, GetSchoolClassData, GetTeacherDataRes, GetSchoolDataRes, addCourseData,
    InviteeLinkData, InviteeLinkRes, AddInviteeLinkData, AddInviteeLinkRes, MakeInviteeLinkData, MakeInviteeLinkRes
} from "@/types/preparationGroup";

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
export function deletePreLesson(data: DeletePreLessonData): Promise<IResponse<null>> {
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

// 获取集体备课明细数据
export function fetchPreparateDetail(data: FetchPreparateDetailData):Promise<IResponse<FetchPreparateDetailRes>> {
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
export function fetchGroupLessonTeachers(data: FetchPreparateDetailData): Promise<IResponse<FetchGroupLessonTeachersRes[]>> {
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
export function fetchGroupLessonDiscussionContents(data: AddChapterData): Promise<IResponse<DiscussioncontentList[]>> {
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

// 上传总结和反思
export function uploadSummary(data: UploadSummaryData): Promise<IResponse<null>> {
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

// 查询集体备课 总结与反思 文件列表
export function fetchReflectFiles(data: FetchReflectFilesData): Promise<IResponse<FetchReflectFilesRes>> {
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
export function editPreparateDetail(data:SavePreparateDetailData): Promise<IResponse<null>> {
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

// 新增备课
export function addPreLesson(data: addCourseData): Promise<IResponse<null>> {
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

// 编辑 集体备课参与人员
export function editPreparateTeachers(data:addCourseData): Promise<IResponse<null>> {
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

// 添加研讨内容
export function AddDiscussionContent(data: AddContentData): Promise<IResponse<null>> {
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
export function EditDiscussionContent(data: EditContentData): Promise<IResponse<null>> {
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

// 获取教师
export function getTeacherList(data: GetTeacherClassData): Promise<IResponse<GetTeacherDataRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/BaseData/GetTeachersList",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 获取校区
export function getSchoolList(data: GetSchoolClassData): Promise<IResponse<GetSchoolDataRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/Web/BaseData/GetSchoolsByFranchiseeID",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 生成邀请链接
export function makeInviteeLink(data: InviteeLinkData): Promise<IResponse<InviteeLinkRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddInviteeLink",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 第一步：根据链接ID添加集体备课小组成员
export function tryAddTeacherByInviteeLink(data: AddInviteeLinkData): Promise<IResponse<AddInviteeLinkRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/TryAddTeacherByInviteeLink",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}

// 第二步：根据链接ID添加集体备课小组成员
export function addTeacherByInviteeLink(data: MakeInviteeLinkData): Promise<IResponse<MakeInviteeLinkRes>> {
    return request({
        baseURL: AI_XUE_SHI_API,
        url: "/Api/V2/GroupLesson/AddTeacherByInviteeLink",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
}
