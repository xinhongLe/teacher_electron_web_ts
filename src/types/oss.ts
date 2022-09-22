import { IResponse } from "./response";

export interface IOssPaths {
    Path: string,
    Explain: string,
    Bucket: string
}

export type OssName = "HeadPortrait"|"StudyAudio"|"StudyJson"|"LivePpt"|"GiftImage"|
"QuestionImage"|"EquipmentImage"|"QuestionAutio"|"Video"|"Ppt"|"Rtf"|"BrandImage"|
"BrandVideo"|"SpeechAssessment"|"Inspect"|"FranchiseePaperFile"|"LygWordFile"|
"ParentFile"|"TeacherFile"|"StoryFile"|"Teacherclass"|"GuideFile"|"VideoPauseProgramFile"|
"CustomHomework"|"Workbook"|"ParentClass"|"CareClass"|"TeachingMiniToolFile"|"PaperCoverFile"|
"QuestionExplainFile"|"TeachPageFile"|"ElementFile"|"TeacherElementFile"|"LiveLessonFile"|"FeedBackFile"|
"ProjectionFile"|"TeacherBlackboardFile"|"BookFile"|"SchoolFile"|"GroupLessonFile"|"RescourceFile"|"RescourceFile_lyx"

export type IOssPathsRes = IResponse<Record<OssName, IOssPaths>>

export interface IOssToken {
    AccessKeyId: string,
    AccessKeySecret: string,
    Expiration: string,
    SecurityToken: string
}

interface IOssTokenResult {
    ossToken: IOssToken
}

export type IOssTokenRes = IResponse<IOssTokenResult>

export interface IOssUploadRes {
    code: 200,
    objectKey: string,
    name: string,
    fileExtension: string,
    msg: "ok",
    md5: string
}

export interface IOssFileInfo {
    bucket: string,
    objectKey: string,
    name: string,
    md5: string,
    fileName: string,
    fileExtension: string,
    path?: string,
    size?: number,
    fileSize?: string,
    fileType?: string,
    Name?: string
}
