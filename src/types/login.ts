import { IResponse } from "./response";

export interface ILoginData {
    account: string;
    password: string;
}

interface ILoginResult {
    token: string;
}

export interface ILessonManagerResult {
    Name: string;
    Account: string;
    Schools: {
        ID: string,
        Name: string
    }[],
    ID: string
}

export type ILoginResponse = IResponse<ILoginResult>;

export type IGradeClassTreeResponse = IResponse<[]>;

export type IBasicTagResponse = IResponse<[]>;

export type ILessonManagerResponse = IResponse<ILessonManagerResult>;
