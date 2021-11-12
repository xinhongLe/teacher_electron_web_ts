import { Pager } from "./pager";

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

export interface ClassStudent {
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
    list: ClassStudent[]
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
    sex: number,
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

export interface FetchStudentData {
    classId: string,
    pager?: Pager
}

export interface FetchStudentRes {
    AllStudents: ClassStudent[],
    InClassStudents: ClassStudent[]
}

export interface AssignClassStudentData {
    classID: string,
    teacherId: string,
    studentIDs: string[]
}

export interface FetchStudentInfoData {
    id: string,
    teacherId: string
}

export interface HeadPortrait {
    Bucket: string,
    Extention: string,
    FileMD5: string,
    FileName: string,
    FilePath: string,
    ID: string,
    SN: number,
    Type: number,
}

export interface FetchStudentInfoRes {
    Account: string,
    Address: string,
    Birthday: string,
    ClassIDs: string[],
    CreateTime: string,
    HeadPortrait: HeadPortrait,
    ErrorQuestionPushCount: number,
    Name: string,
    NickName: string,
    Phone: string,
    PublicSchoolClass: string,
    Resources: {
        Count: number,
        ID: string,
        Name: string
    }[],
    School: string,
    Sexual: 1|2
}

export interface FetchStudentClassesBeforeDistributeData {
    studentID: string
}

export type StudentClass = Pick<Class, "ID" | "Name" | "StudentCount" | "TeacherCount">

export interface FetchStudentClassesBeforeDistributeRes {
    AllClasss: StudentClass[],
    InClasss: StudentClass[],
    TeacherNames: string,
    TeacherNum: number
}

export interface UpdateStudentInfoData {
    id: string,
    studentName: string,
    birthday: string,
    sex: number,
    classIds: string[],
    errorQuestionPushCount: number,
    teacherId: string
}
