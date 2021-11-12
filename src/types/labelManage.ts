import { HeadPortrait } from "./myStudent";

export interface Student {
    Account: string,
    ClassGradeID: string,
    ClassID: string,
    ClassName: string,
    HeadPortrait: HeadPortrait
    Name: string
    Phone: string
    StudentID: string
    SubjectID: string
    TagName: string
}

export interface TagStudentsData {
    studentIDs: string[],
    subjectID: string,
    tagID: string,
    classIDs: string[],
    teacherId: string
}

export interface Tag {
    ID: string,
    Level: number,
    TagName: string
}

export interface StudentTag {
    tagName: string,
    list: Student[]
}
