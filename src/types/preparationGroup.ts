import { IOssFileInfo } from "@/types/oss";
export interface FetchPreparateListPageData {
    preTitle: string;
    status: number;
    createTime?: string;
    createStartTime: string;
    createEndTime: string;
    pager: PagerReq;
}

export interface FetchPreparateListPageRes {
    list?: PreparateListBag[];
    pager?: PagerRes;
}

export interface PagerReq {
    pageNumber: number;
    pageSize: number;
    pageChoose: number[];
    sortField?: string;
    sortType?: string;
    total?: number;
}

export interface PagerRes {
    IsFirstPage: boolean;
    IsLastPage: boolean;
    PageNumber: number;
    PageSize: number;
    Pages: number;
    SortField: string;
    SortType: string;
    Total: number;
}

export interface PreparateListBag {
    Id: string;
    PreTitle: string;
    Status: number;
    CreaterName: string;
    CreaterID: string;
    CreateTime: string;
    CreateEndTime: string;
    TeacherCount: number;
    LessonRange?: string;
    FileModel?: FileModelBag;
}

export interface FileModelBag {
    id: string;
    name: string;
    sn: number;
    fileName: string;
    bucket: string;
    filePath: string;
    extention: string;
    fileMD5: string;
    type: number;
    staffID: string;
}

export interface DeletePreLessonData {
    ID: string;
}

export interface StatusType {
    label: string;
    value: number;
}

export interface FetchTextBookGradeData {
    token?: string;
}

export interface TextBookGradeChildList {
    label: string;
    value: string;
    children?: TextBookGradeChildList[];
}

export interface TextBookGradeRes {
    label: string;
    value: string;
    children?: TextBookGradeChildList[];
}

export interface lessonItemData {
    Attachments: IPreOssFileInfo[];
    CanEdit: boolean;
    CreateTime: string;
    EndTime: string;
    CreaterID: string;
    CreaterName: string;
    PreTitle: string;
    Status: number;
    TeacherCount: number;
    LessonRange: string;
    LessonRangeIDs: string[],
    LessonContent: string;
}

export interface BookList {
    Lable: string;
    Value: string;
    Children?: BookList[];
}

export interface FetchPreparateDetailData {
    id: string;
}
export interface IPreOssFileInfo {
    id?: string,
    sn?: string,
    bucket: string,
    objectKey: string,
    name: string,
    md5: string,
    fileName: string,
    fileExtension: string,
    path?: string,
    filePath: string,
    extention: string,
    fileMD5: string,
    type: string,
    staffID: string,
    size?: string,
    fileType?: string
}
export interface FetchPreparateDetailRes {
    Attachments: IPreOssFileInfo[];
    CanEdit: boolean;
    CreateTime: string;
    EndTime: string;
    CreaterID: string;
    CreaterName: string;
    PreTitle: string;
    Status: number;
    TeacherCount: number;
    LessonRange: string;
    LessonContent: string;
}

export interface SavePreparateDetailData {
    groupLessonPreparateID: string;
    preTitle: string;
    lessonRange: string;
    lessonContent: string;
    attachments: IPreOssFileInfo[];
}

export interface AddChapterData {
    bookID: string;
    name: string;
}

export interface FetchTeacherLessonAndBagByChapterData {
    chapterID: string;
}

export interface Course {
    ChapterID: string;
    Detail: string;
    ID: string;
    LessonTypeID: string;
    Name: string;
    Recommend: number;
    Sort: number;
    State: number;
    Type: number;
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

export interface Questions {
    DeleteFlag: number;
    Sort: number;
    State: number;
    QuestionID: string;
}

export interface FileData {
    id?: string;
    name: string;
    sn?: number;
    fileName: string;
    bucket: string;
    filePath?: string;
    extention: string;
    fileMD5: string;
    type?: number;
    staffID?: string
}

export interface discussionContent {
    title: string;
    resourceType: number;
    content: string;
    planFile: FileData;
    attachments: FileData[]
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

export interface AddContentData {
    groupLessonPreparateID: string;
    discussionContent: discussionContent;
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
    LastSelectTime: string;
}

export interface SetLastSelectBookData {
    subjectID: string;
    bookID: string;
    chapterID: string;
}

export interface CloneCourseBagToTeacherRes {
    CourseBagTeacher: {
        ID: string
    }
}
