import { Pager } from "./response";

export interface FetchSchoolClassPage {
    teacherId: string
}

export interface Class {
    GradeAlbum: string,
    ID: string,
    Name: string,
    SchoolId: string,
    SchoolName: string,
    StudentCount: number,
    TeacherCount: number,
}

export interface FetchSchoolClassRes {
    list: Class[]
}

export interface FetchClassStudentsData {
    classId: string
}

export interface Student {
    Account: string,
    ClassCount: number,
    GradeName: string,
    ID: string,
    Name: string,
    Phone: string,
    StudentSubjects: string,
    TeacherCount: number
}

export interface FetchClassStudentsRes {
    list: Student[]
}

export interface Grade {
    ResultKey: string,
    ResultValue: string
}

export interface FetchClassTeachersData {
    classID: string
}

export interface ClassTeacher {
    Account: string,
    ClassCount: number,
    ID: string,
    Name: string,
    StudentCount: number,
    SubjectList: Grade[]
}

export interface FetchClassTeachersRes {
    list: ClassTeacher[]
}

export interface UpdateClassNameTeachersData {
    classID: string,
    className: string,
    teacherID: string,
    teacherIDs: string[]
}

export interface AddSingleClassData {
    schoolID: string,
    gradeID: string,
    className: string,
    teacherID: string,
    teacherIDs: string[]
}

export interface FetchTeacherListData {
    accountOrName: string,
    teacherId: string,
    pager: {
        pageNumber: number, // 当前页
        pageSize: number, // 每页显示数据
        pageChoose: number[], // 分页配置
        total: number // 总数据
     }
}

export interface Teacher {
    UserName: string,
    UserId: string,
    SubjectList: Grade[]
}

export interface FetchTeacherListRes {
    list: Teacher[],
    pager: Pager
}

export interface AddStudentData {
    studentName: string,
    parentMobile: string,
    birthday: string,
    sex: string,
    account: string,
    password: string,
    classIds: string[],
    schoolId: string,
    errorQuestionPushCount: number,
    teacherId: string
}

export interface GetAccountPasswordData {
    parentMobile: string,
    studentName: string
}

export interface GetAccountPasswordRes {
    account: string,
    password: string
}
