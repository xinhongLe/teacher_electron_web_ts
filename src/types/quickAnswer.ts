
export interface IClassDisabledRes {
    TeacherID: string,
    OrgID: string,
    ClassID?: string,
    Type?: number, // 0 上课启用 1 上课禁用
}

/**
  AnswerMachineID 任务ID
*/
export interface IPraiseStudentRes {
    StudentIdList: string[],
    AnswerMachineID:string,
    TeacherID:string,
}

export interface IClassItem {
    GradeId?: string,
    ClassName: string,
    ClassId: string,
    check?: boolean
}

export interface IGradeItem {
    GradeId: string,
    GradeName: string,
    check: boolean,
    ClassList: IClassItem[]
}
