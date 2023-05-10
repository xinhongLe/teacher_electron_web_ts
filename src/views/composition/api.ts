import request from "@/utils/request";
import { AI_XUE_SHI_API, YUN_API_COMPOSITION } from "@/config";
import { RequestFun } from "@/types/response";
import { FetchAllPassage, getClassStuCount, IAddArticle, IcompositionBatchImport, IcorrectWithOneKey, IdeleteArticle, IdeleteStudentEntry, IdownLoadBatchImportModel, IdownloadPDF, IeditReportDetail, IgetAssessDetail, IgetStatusCountByTeacherComId, IgetStudentByClass, IgetStudentByHasEntry, IgetStudentByUserInfo, IgetStudentComByTeacherComId, IlookContent, IoneStudentEntry, IresubmitCorrectComposition, IsaveAssessment, IsaveContent, IsearchReportDetail, IsearchStudentListForCorrect, IsearchStudentListForReport, IsendReportWithOneKey, IshareReportUrl } from "@/types/composition";

// 图像识别文字（针对于识别姓名
export const picToWordByName: RequestFun<
any,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/PicToWordByName",
        method: "post",
        data
    });
};

// 获取所有文章
export const fetchAllPassage: RequestFun<
    FetchAllPassage,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/index/GetAllPassage",
        headers: {
            ContentType: "application/json;charset=UTF-8"
        },
        method: "post",
        data
    });
};

// 获取所有文章(分页)
export const fetchAllPassageByPage: RequestFun<
    FetchAllPassage,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/index/GetAllPassageform",
        headers: {
            ContentType: "application/json;charset=UTF-8"
        },
        method: "post",
        data
    });
};

// 查询老师在该组织下教授的班级信息及学生数量
export const getClassStuCountByTeacher: RequestFun<
getClassStuCount,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/Management/UserManage/GetClassStudent",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        method: "post",
        data
    });
};

// 获取年级单元树
export const getGradeChapterTree: RequestFun<
any,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/Common/Basic/GetGradeChapterTree",
        method: "post",
        data
    });
};

// 新建批改
export const addArticle: RequestFun<
IAddArticle,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/index/Addpassage",
        method: "post",
        data
    });
};

// 删除文章
export const deleteArticle: RequestFun<
IdeleteArticle,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/index/Delpassage",
        method: "post",
        data
    });
};

// // 下载批量导入模板
// export const downLoadBatchImportModel: RequestFun<
// IdownLoadBatchImportModel,
//     any
// > = (data) => {
//     return request({
//         baseURL: YUN_API_COMPOSITION,
//         url: "/Api/TeacherPlat/CompositionHandle/DownLoadBatchImportModel",
//         method: "post",
//         responseType:'blob',
//         data
//     });
// };

// 下载批量导入模板
export const downLoadBatchImportModel: RequestFun<
IdownLoadBatchImportModel,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetClassTemplate",
        method: "post",
        data
    });
};

// 重新提交
export const resubmitCorrectComposition: RequestFun<
IresubmitCorrectComposition,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/TeaResubmitCorrectComposition",
        method: "post",
        data
    });
};

// 批量文件录入
export const compositionBatchImport: RequestFun<
any,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/CompositionBatchImport",
        method: "post",
        data
    });
};

// 查询一键批改学生列表
export const searchStudentListForCorrect: RequestFun<
IsearchStudentListForCorrect,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/SeachStudentListForCorrect",
        method: "post",
        data
    });
};

// 查询一键发送报告学生列表
export const searchStudentListForReport: RequestFun<
IsearchStudentListForReport,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/SeachStudentListForReport",
        method: "post",
        data
    });
};

// 一键批改
export const correctWithOneKey: RequestFun<
IcorrectWithOneKey,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/CorrectWithOneKey",
        method: "post",
        data
    });
};

// 一键发送报告
export const sendReportWithOneKey: RequestFun<
IsendReportWithOneKey,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/SendReportWithOneKey",
        method: "post",
        data
    });
};

// 查询报告详情
export const searchReportDetail: RequestFun<
IsearchReportDetail,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/SeachReportDetail",
        method: "post",
        data
    });
};

// 编辑报告详情
export const editReportDetail: RequestFun<
IeditReportDetail,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/EditReportDetail",
        method: "post",
        data
    });
};

// 分享指定教师作文的报告链接
export const shareReportUrl: RequestFun<
IshareReportUrl,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/ShareReportUrl",
        method: "post",
        data
    });
};

// 导出PDF
export const downloadPDF: RequestFun<
IdownloadPDF,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/TeacherPlat/CompositionHandle/DownloadPDF",
        method: "post",
        responseType: "blob",
        data
    });
};

// 获取班级学生
export const getStudentByClass: RequestFun<
IgetStudentByClass,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetStudentByClass",
        method: "post",
        data
    });
};

// 获取教师指定作文未录入学生列表
export const getStudentByHasEntry: RequestFun<
IgetStudentByHasEntry,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetStudentByHasEntry",
        method: "post",
        data
    });
};

// 获取班级中重名或模糊搜索的学生列表
export const getStudentByUserInfo: RequestFun<
IgetStudentByUserInfo,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetStudentByUserInfo",
        method: "post",
        data
    });
};

// 指定教师作文的单一学生作文信息录入（单一学生补录
export const oneStudentEntry: RequestFun<
IoneStudentEntry,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        headers: {
            // "Content-Type": "application/json-patch+json",
            noLoading: "true"
        },
        url: "/Api/App/CompositionEntry/OneStudentEntry",
        method: "post",
        data
    });
};

// 删除指定教师作文的指定学生录入信息
export const deleteStudentEntry: RequestFun<
IdeleteStudentEntry,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/DeleteStudentEntry",
        method: "post",
        data
    });
};

// 查询指定教师作文的全部、录入批改等状态下列表信息
export const getStudentComByTeacherComId: RequestFun<
IgetStudentComByTeacherComId,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetStudentComByTeacherComId",
        method: "post",
        data
    });
};

// 查询指定教师作文的录入批改等状态数量
export const getStatusCountByTeacherComId: RequestFun<
IgetStatusCountByTeacherComId,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetStatusCountByTeacherComId",
        method: "post",
        data
    });
};

// 查看原文
export const lookContent: RequestFun<
IlookContent,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/LookContent",
        method: "post",
        data
    });
};

// 检查原文
export const checkContent: RequestFun<
IlookContent,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/CheckContent",
        method: "post",
        data
    });
};

// 检查原文后保存修改
export const saveContent: RequestFun<
IsaveContent,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/SaveContent",
        method: "post",
        data
    });
};

// 查看下一篇
export const lookNextContent: RequestFun<
IlookContent,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/LookNextContent",
        method: "post",
        data
    });
};



// 获取评价量规
export const getAssessDetail: RequestFun<
IgetAssessDetail,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/EvaluateGauges/GetEvaluateGauges",
        method: "post",
        data
    });
};

// 保存老师使用的量规
export const saveAssessment: RequestFun<
IsaveAssessment,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/EvaluateGauges/SaveGaugesAndCorrect",
        method: "post",
        data
    });
};

// 评价下一篇
export const assessNextGauges: RequestFun<
IgetAssessDetail,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/EvaluateGauges/EvaluateNextGauges",
        method: "post",
        data
    });
};

// 获取切页栏
export const getColumnPages: RequestFun<
IsearchReportDetail,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetPageCuttingColumn",
        method: "post",
        data
    });
};

// 获取作文识别结果（全部识别完返回，否则阻塞）
export const getFinishResult: RequestFun<
any,
    any
> = (data) => {
    return request({
        baseURL: YUN_API_COMPOSITION,
        url: "/Api/App/CompositionEntry/GetRecogiteStatus",
        method: "post",
        data
    });
};
