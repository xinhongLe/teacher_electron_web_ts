import { IResponse } from "./response";

export interface ILoginData {
    account: string;
    password: string;
}

export interface ILoginResult {
    token: string;
}

export type ILoginResponse = IResponse<ILoginResult>

// export interface IGradeClassTreeResponse extends IResponse<IGradeClassTreeResponse>
