import { IResponse } from "./response";

export interface ILoginData {
    account: string;
    password: string;
    code?: string;
}

interface IYunRole {
    RoleName: string;
    RoleCode: string;
}

interface IYunUserOrg {
    OrgId: string;
    orgName: string;
    OrgTypeId: string;
    RolesList: IYunRole[]
}

export interface IYunInfo {
    OrgId: string;
    OrgName: string;
    OrgTypeId: string;
    RolesList: IYunRole[];
    SecretKey: string;
    SystemId: string;
    TermCode: number;
    TokenValue: string;
    UserAccount: string;
    UserId: string;
    UserName: string;
    UserOrgionList: IYunUserOrg[]
}

export interface ILoginTokenData {
    token: string;
}

interface ILoginResult {
    token: string;
}

export interface LessonClasses {
    GradeID: string,
    GradeName: string,
    GradeSort: number,
    ID: string,
    Name: string
}

export interface LessonSubject {
    ID: string
    Name: string
    OldID: number
}

export interface ILessonManagerResult {
    Name: string;
    Account: string;
    Schools: {
        ID: string,
        Name: string
    }[],
    Classes: LessonClasses[],
    Subjects: LessonSubject[],
    UserCenterUserID: string,
    ID: string
}

export interface ISendMsgData {
    phone: string
}

export type ILoginResponse = IResponse<ILoginResult>;

export type IGradeClassTreeResponse = IResponse<[]>;

export type IBasicTagResponse = IResponse<[]>;

export type ILessonManagerResponse = IResponse<ILessonManagerResult>;
