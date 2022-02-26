export interface GetQuestionsByIdsData {
    paperID: string | null;
    questionIDs: string[];
}

export interface GetCourseBagQuestionsByIdsData {
    courseWareTeacherID: string;
}

export interface FileInfo {
    Bucket: string;
    Extention: string;
    FileName: string;
    FilePath: string;
    FileType: number;
    ID: string;
    Name: string;
    StaffName: string;
    Type: number;
}

export interface AnswerFile {
    DeleteFlag: number;
    Files: FileInfo[];
    ID: string;
    Priority: number;
    Script: string;
    Sort: 0;
    Text: string;
}

export interface Question {
    ChoiceCount: number;
    CoursebagQuestionID?: string;
    ChoiceValue: string;
    Level: number;
    QuestionFiles: FileInfo[];
    AnswerFiles: AnswerFile[];
    MaterialID: string;
    QuestionID: string;
    QuestionType: number;
    SN: string;
    UpdateTime: string;
}

export interface CheckPureQuestionByQuestionIDData {
    questionID: string
}
