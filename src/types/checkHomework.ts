import { HomeworkPaperFile } from "./homework";
import { FileInfo } from "./lookQuestion";
import { HeadPortrait } from "./myStudent";

export interface HomeworkDetail {
    classHomeworkPaperID: string;
    name: string;
    count: number;
    videoDurationTick: number;
    videoID: string;
    homeworkPaperFiles: HomeworkPaperFile[];
    classInfo: {
        name: string;
        classHomeworkPaperID: string;
    }[];
    type: number;
    workbookPaperPageNum: string;
    albumName: string;
    lessonName: string;
    chapterName: string
}

export interface FetchMissionListData {
    classHomeworkPaperID: string;
}

export interface MissionFile {
    PageNum: number;
    Sort: number;
    SubmitTime: string;
    File: FileInfo;
    Type: number;
}

export interface Mission {
    HomeworkPaperType: number;
    MissionDetails: [];
    MissionFiles: MissionFile[];
    MissionID: string;
    NoSureCount: number;
    RightCount: number;
    State: number;
    StudentAccount: string;
    StudentClassName: string;
    StudentID: string;
    StudentName: string;
    FinishMessage: string;
    VideoWatchTimeTick: number;
    WrongCount: number;
    StudentHeadPortrait: HeadPortrait;
}

export interface MissionDetail {
    MissionDetailID: string;
    MissionFiles: MissionFile[];
    StudentHeadPortrait: HeadPortrait;
    MissionID: string;
    Result: number;
    State: number;
    StudentAccount: string;
    StudentClassName: string;
    StudentID: string;
    MisssionStudyID: string;
    StudentName: string;
}

export interface ClassHomeworkPaperQuestion {
    ClassHomeworkPaperQuestionID: string;
    HomeworkPaperQuestionID: string;
    MissionDetails: MissionDetail[];
    QuestionChoiceCount: number;
    QuestionChoiceValue: string;
    QuestionID: string;
    QuestionSort: number;
    QuestionType: number;
    State: number;
    TotalNoSure: number;
    TotalRight: number;
    TotalWrong: number;
}

export interface FetchQuestinInfoByQuestionIDData {
    questionID: string;
}

export interface QuestionFile {
    Type: number;
    File: FileInfo;
}

export interface Answer {
    ID: string;
    Priority: number;
    AnswerFiles: QuestionFile[];
}

export interface QuestinInfo {
    Question: {
        Answers: Answer[];
        ChoiceCount: 0;
        ChoiceValue: string;
        ID: string;
        Knowledges: [];
        PureName: string;
        PureQuestionIDs: string[];
        QuestionFiles: QuestionFile[];
        SN: string;
        FlowText?: {
            QuestionContent: string;
            AnswerContent: string;
        },
        Type: number;
    };
}

export interface FetchDetailByMissionStudyIDData {
    MissionStudyID: string;
}

export interface ChangeResultData {
    missionDetailID: string;
    result: number;
}

export interface SpeechAssessResult {
    JsonData: string;
    Overall: number;
    Wavetime: number;
    File: FileInfo
}

export interface QuestionDetailMissionFile extends QuestionFile {
    PageNum: number;
}

export interface WorkbookPageQuestionBlank {
    Answer?: string;
    ID: string;
    IsKeyboardInput: number;
    MarginLeft: number;
    MarginTop: number;
    SizeHeight: number;
    SizeWidth: number;
    Type: 0;
}

export interface QuestionDetail {
    Student?: {
        Name: string;
        HeadPortrait: HeadPortrait;
    };
    Question?: {
        Type: number;
        ChoiceValue: string;
        ChoiceCount: number;
        QuestionBlanks: [];
        Answers: Answer[];
    };
    Detail?: {
        SpeechAssessResults: SpeechAssessResult[];
        ID: string;
        Result: number;
        HomeworkPaperType: number;
        PronunciationText: string;
    };
    Study?: {
        StudyFiles?: QuestionFile[];
        ChoiceValue: string;
        MissionFiles?: QuestionDetailMissionFile[];
    };
    WorkbookPageQuestion?: {
        PageNum: number;
        WorkbookPageQuestionBlanks: WorkbookPageQuestionBlank[];
    };
}
