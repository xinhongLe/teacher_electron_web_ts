import { IResponse } from "./response";

export interface ILoginData {
    account: string;
    password: string;
}

interface ILoginResult {
    token: string;
}

interface ILessonManagerResult {
    Name: string;
}

export type ILoginResponse = IResponse<ILoginResult>;

export type IGradeClassTreeResponse = IResponse<[]>;

export type IBasicTagResponse = IResponse<[]>;

export type ILessonManagerResponse = IResponse<ILessonManagerResult>;
