export interface IResponse<T> {
    resultCode: number;
    result: T;
    success: boolean;
    resultDesc: string;
}

export type RequestFun<T, U> = (data: T) => Promise<IResponse<U>>
