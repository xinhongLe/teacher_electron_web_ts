export interface BookList {
    Lable: string,
    Value: string,
    Children?: BookList[]
}

export interface FetchTeacherBookChaptersData {
    bookID: string
}

export interface BookChapter {
    Detial: string,
    ID: string,
    Name: string,
    Remark: string,
    Sort: number
}

export interface AddChapterData {
    bookID: string,
    name: string
}

export interface FetchTeacherLessonAndBagByChapterData {
    chapterID: string
}

export interface CourseBag {
    Changed?: number,
    CourseBagType?: number,
    ID?: string,
    LastUpdateTime?: string,
    LessonID?: string,
    Name?: string,
    OnSale?: number,
    Sort?: number,
    Type?: number,
    TeacherID?: string,
    CourseBagID?: string,
    Version?: string
}

export interface Course {
    ChapterID: string,
    CourseBags: CourseBag[],
    Detail: string,
    ID: string,
    LessonTypeID: string,
    Name: string,
    Recommend: number,
    Sort: number,
    State: number,
    Type: number
}

export interface AddOrUpdateCourseBagTeacherData {
    name: string,
    lessonID: string
}

export interface AddCustomBookLessonData {
    chapterID: string,
    name: string,
    detail: string
}

export interface UpdateCustomBookLessonData {
    ID: string,
    name: string
}

export type SaveTeacherClassScheduleData = {
    beginTime: string,
    classID: string,
    dayOfWeek: number,
    endTime: string,
    subjectID: string
}[]
