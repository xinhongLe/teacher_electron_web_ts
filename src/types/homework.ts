import { FileInfo } from "./lookQuestion";

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
    NeedSubmit: number;
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
    WrongCount: number;
}
