export interface BookList {
    Lable: string;
    Value: string;
    Children?: BookList[];
}

// 选中科目数据
export interface IBook {
    name: string;
    id: string;
    subject: string;
}

export interface FetchTeacherBookChaptersData {
    bookID: string;
}

export interface BookChapter {
    Detial: string;
    ID: string;
    Name: string;
    Remark: string;
    Sort: number;
}

export interface AddChapterData {
    bookID: string;
    name: string;
}

export interface FetchTeacherLessonAndBagByChapterData {
    chapterID: string;
}

export interface CourseBag {
    Changed?: number;
    CourseBagType?: number;
    ID?: string;
    LastUpdateTime?: string;
    LessonID?: string;
    Name?: string;
    OnSale?: number;
    Sort?: number;
    Type?: number;
    TeacherID?: string;
    CourseBagID?: string;
    Version?: string;
}

export interface Course {
    ChapterID: string;
    CourseBags: CourseBag[];
    Detail: string;
    ID: string;
    LessonTypeID: string;
    Name: string;
    Recommend: number;
    Sort: number;
    State: number;
    Type: number;
}

export interface AddOrUpdateCourseBagTeacherData {
    name: string;
    lessonID: string;
}
export interface UpdateCourseBagTeacherData {
    name: string;
    id: string;
}

export interface AddCustomBookLessonData {
    chapterID: string;
    name: string;
    detail: string;
}

export interface UpdateCustomBookLessonData {
    ID: string;
    name: string;
}

export type SaveTeacherClassScheduleData = {
    beginTime: string;
    classID: string;
    dayOfWeek: number;
    endTime: string;
    subjectID: string;
}[];

export interface CloneCourseBagToTeacherData {
    courseBagID: string;
    lessonID: string;
    courseBagTeacherName?: string;
}

export interface DelCourseBagTeacherData {
    id: string;
}

export interface Questions {
    DeleteFlag: number;
    Sort: number;
    State: number;
    QuestionID: string;
}

export interface UpdateCourseWareListOfTeacherData {
    deletedCourseWareTeacherIDs?: string[];
    deletedQuestionIDs?: string[];
    addedCourseWareTeacher?: {
        lessonID: string;
        CourseBagTeacherID: string;
        type: number;
        process: number;
        CourseWareTeacherQuestions: Questions[];
        HasVideo: boolean;
        VideoDuration: number;
        QuestionCount: number;
        isSelectedAll: boolean;
        PaperID: string;
        Sort: number;
        FileID?: string;
    }[];
    CourseBagTeacherID?: string;
}

export interface UpdateCourseWareTeacherSortData {
    courseWareID: string;
    sort: number;
    copyType: number;
    process: number;
    type: number;
}

export interface Lesson {
    ChapterID: string;
    Count: number;
    Detail: string;
    ID: string;
    Name: string;
    Sort: number;
    State: number;
    Type: number;
}

export interface FetchLessonsData {
    chapterID: string;
    type: number;
}

export interface FetchBagChapterData {
    bookID: string;
}

export interface BagPapers {
    ClassifyType: number;
    HasVideo: boolean;
    HomeworkedClassIDs: string[];
    IsPublishedRecently: boolean;
    Name: string;
    PaperID: string;
    QuestionCount: number;
    Questions: Questions[];
    FileID?: string;
    Sort: number;
    VideoDuration: number;
}

export interface BagLessons {
    ID: string;
    Name: string;
    Sort: number;
    BagPapers: BagPapers[];
}

export interface BagChapter {
    Detial: string;
    ID: string;
    Name: string;
    Sort: number;
    State: number;
    Type: number;
    BookID: string;
    BookHidden: boolean;
    IsLock: boolean;
    BagLessons: BagLessons[];
}

export interface QueryMaterialListData {
    ChapterID: string;
    LessonID: string | null;
}

export interface DeleteMaterialData {
    id: string;
}

export interface MaterialFileInfo {
    name: string;
    ossExtention: string;
    ossName: string;
    md5: string;
}

export interface AddMaterialData {
    ChapterID: string;
    LessonID: string | null;
    Type: number;
    FileType: number;
    ElementType: number;
    ElementFile: MaterialFileInfo;
}

export interface EditMaterialData {
    ID: string;
    FileType: number;
    ElementFile: MaterialFileInfo;
    LessonID: string | null;
}

export interface ElementFile {
    Bucket: string;
    Extention: string;
    FileMD5: string;
    FileName: string;
    FilePath: string;
    ID: string;
    Name: string;
    SN: number;
    Type: number;
}

export interface Material {
    ChapterID: string;
    ElementFile: ElementFile;
    ElementID: string;
    ElementName: string;
    ElementState: number;
    ElementType: number;
    FilePauses: [];
    FileType: number;
    ID: string;
    LessonID: string;
    LessonName: string;
    Sort: number;
    Type: number;
}

export type AddCourseWareTeacherElementFileData = {
    courseBagTeacherID: string;
    name: string;
    fileName: string;
    sort: number;
    process: number;
    courseBagID: null;
    videoDuration: null;
}[];

export interface GetLastSelectBookData {
    subjectID: string;
}

export interface GetLastSelectBookRes {
    SubjectID: string;
    BookID: string;
    AlbumID: string;
    PublisherID: string;
    ChapterID: string;
    LessonID: string;
    LastSelectTime: string;
}

export interface SetLastSelectBookData {
    subjectID: string;
    bookID: string;
    chapterID: string;
    lessonID: string;
}

export interface CloneCourseBagToTeacherRes {
    CourseBagTeacher: {
        ID: string;
    };
}

export enum NextSettingType {
    Right = "right",
    Left = "left",
    All = "all",
}

export enum ClassroomType {
    WindowClasses,
    Classes,
}

export interface FetchSchoolLessonListData {
    chapterID: string;
}

export interface FetchSchoolWindowListData {
    lessonID: string;
}

export interface SchoolLesson {
    ID: string;
    IsHide: boolean;
    LessonDetail?: string;
    Name: string;
}

export interface SchoolWindowPageInfo {
    ID: string;
    Name: string;
    NickName: string;
    OriginType: number;
    TeachPageRelationID: string;
    Width: number;
    Type: number;
    Sort: number;
    Height: number;
    State: boolean;
    Remark?: string;
}

export interface SchoolWindowCardInfo {
    ID: string;
    Name: string;
    NickName?: string;
    OriginType?: number;
    PageList: SchoolWindowPageInfo[];
}
export interface SchoolWindowInfo {
    LessonID: string;
    LessonWindowID: string;
    OriginType: number;
    Sort: number;
    WindowID: string;
    WindowName: string;
    WindowNickName: string;
    CardList?: SchoolWindowCardInfo[];
}

export interface FetchBagBySchoolLessonData {
    lessonID: string;
}

export interface SchoolBagInfo {
    Changed: number;
    CourseBagType: number;
    ID: string;
    LastUpdateTime: string;
    LessonID: string;
    Name: string;
    OnSale: number;
    Sort: number;
    TeacherID: string;
    Type: number;
    Version: string;
}
