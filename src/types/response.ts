export interface IResponse<T> {
    resultCode: number;
    result: T;
    success: boolean;
    resultDesc: string;
}
