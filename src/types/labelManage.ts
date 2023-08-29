import { HeadPortrait } from "./myStudent";

export interface TagStudent {
    Account: string,
    HeadPortrait: HeadPortrait
    Name: string
    Phone: string
    ID: string
    SubjectsInfo?:{
        SubjectID: string,
        TagName: string
    }[],
    StudentSubjects?: string
    TagName: string
}

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
    SubjectsInfo?:{
        SubjectID: string,
        TagName: string
    }[],
    StudentSubjects?: string
    TagName: string
    cloneName: string
    ifSelectTeam?: boolean
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
    list: TagStudent[]
}

export interface IFetchAllStudents {
    TeacherId: string,
    OrgId: string,
}
