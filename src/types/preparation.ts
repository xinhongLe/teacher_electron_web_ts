export interface BookList {
    Lable: string;
    Value: string;
    Children?: BookList[];
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
    Detail: string;
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
