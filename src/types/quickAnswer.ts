
export interface IClassDisabledRes {
    TeacherID: string,
    OrgID: string,
    ClassID?: string,
    Type?: number, // 0 上课启用 1 上课禁用
}

/**
 type 类型 1-表扬 2-批评
  AnswerMachineID 任务ID
*/
export interface IPraiseStudentRes {
    StudentIdList: string[],
    AnswerMachineID:string,
    TeacherID:string,
}

export interface IAddRewardrecodeRes {
    Type: number,
    SchoolID:string,
    TeacherID:string,
    TeacherName:string,
    StudentList: {
        StudentID:string,
        StudentName:string,
        ClassID:string,
        ClassName:string,
    }[],
    LabelList: {
        LabelID: string,
        LabelName: string,
        Score: number,
        ScoreType: number,
    }[]
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
