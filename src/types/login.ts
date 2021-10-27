import { IResponse } from "./response";

export interface ILoginData {
    account: string;
    password: string;
}

export interface ILoginResult {
    token: string;
}

export interface ILoginResponse extends IResponse {
    result: ILoginResult;
}

export interface IGradeClassTreeResponse extends IResponse {
    result: [];
}
