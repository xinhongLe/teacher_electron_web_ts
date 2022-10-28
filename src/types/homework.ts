import { int } from "@zxing/library/esm/customTypings";
import { FileInfo } from "./lookQuestion";
import {sendWrongTopicDetail} from "@/views/homework/api";

export interface FetchHomeworkDateByYearData {
    subjectID: string;
    year: string;
}

export interface FetchClassHomeworkPaperListData {
    subjectID: string;
    date: string;
}

export interface RebackHomeworkPaperData {
    classHomeworkPaperIDs: string[];
}

export interface RebackShowAnswer {
    classHomeworkPaperID: string,
    answerShowTime?: string
}

export interface RebackHideAnswer{
    id: string
}
export interface HomeworkPaperFile {
    Type: 0,
    File: FileInfo
}

export interface Homework {
    AlbumID: string;
    AlbumName: string;
    AllQuestionCount: number;
    AllStudentCount: number;
    ChapterName: string;
    ClassHomeworkID: string;
    ClassHomeworkPaperID: string;
    classHomeworkPaperID?: string;
    ClassID: string;
    ClassName: string;
    ClassifyType: number;
    CreateTime: string;
    FinishStudentCount: number;
    GradeName: string;
    HomeworkID: string;
    HomeworkName: string;
    WorkbookName?: string;
    WorkbookPaperPageNum?: string;
    HomeworkPaperFiles: HomeworkPaperFile[];
    HomeworkPaperID: string;
    HomeworkPaperType: number;
    LessonID: string;
    LessonName: string;
    NoSureCount: number;
    PaperID: string;
    PaperName: string;
    PaperType: number;
    ReviewQuestionCount: number;
    ReviewStudentCount: number;
    RightCount: number;
    State: number;
    SubjectID: string;
    SubjectName: string;
    VideoCount: number;
    VideoDurationTick: number;
    VideoID: string;
    WrongCount: number;
    AnswerShowTime?: string;
    showPublish?: boolean | undefined;
}

export interface MissionDetail {
    MissionDetailID: string;
    MissionID: string;
    QuestionID: string;
    Result: int;
}

export interface StudentMission {
    StudentID: string;
    StudentName: string;
    MissionID: string;
    State: int;
    MissionDetails: MissionDetail[];
}

export interface QuestionBlank {
    Type: int;
    Answer: string;
    CombineSN: string;
}

export interface WorkbookPageQuestionBlank {
    WorkbookPageQuestionID: string;
    MarginLeft: number;
    MarginTop: number;
    SizeWidth: number;
    SizeHeight: number;
    Answer: string;
    Type: int;
    QuestionBlank: QuestionBlank;
}

export interface WorkbookPageQuestion {
    QuestionID: string;
    QuestionType: int;
    PaperID: string;
    Blanks: WorkbookPageQuestionBlank[];
    QuestionSN: string;
    WorkbookPaperID: string;
    Number: int;
    PageNum: int;
    QuestionTrueNumber: string;
}

export interface FileModel {
    SN: int;
    FileName: string;
    Bucket: string;
    FilePath: string;
    Extention: string;
    FileMD5: string;
    Type: int;
    StaffID: string;
    Duration: Date;
}

export interface WorkBookPageDetailAndImgSize {
    File: FileModel;
    ImageWidth: number;
    ImageHeight: number;
    Questions: WorkbookPageQuestion[];
}

export interface StudentDetAndPageInfo {
    PaperID: string;
    PageNum?: string;
    MissionID: string;
    ClassHomeworkPaperID: string;
}

export interface PageInfo{
    PaperID: string;
    PageNum?: string;
}

export interface PointsPackage{
    // eslint-disable-next-line camelcase
    category_id: int;
    category: string;
    bbox: number[];
    Score: number;
}

export interface CheckQuestionResult{
    QuestionID: string;
    Category: string;
    MarginLeft: number;
    MarginTop: number;
    SizeWidth: number;
    SizeHeight: number;
    Number:int;
}

export interface CheckUpdateIn{
    Result: int;
    Duration: string;
    ExplainFinish: int;
    NotUnderstand: int;
    ID?: string
}

export interface BatchCheckUpdateIn{
    CheckUpdateIn: CheckUpdateIn[];
    StudentID?: string;
    MissionID?: string;
}

export interface SvImgIn{
    MissionID: string;
    Base64Img: string;
}

export interface Id {
    Id: string
}

export interface ISendWrongTopicRes{
    ClassHomeworkPaperID:string,
    SubjectId:string,
    SubjectName:string,
    ClassId:string,
    ClassName:string,
    TotalCount:number,
    StudentIds:string[],
}
