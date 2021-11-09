export interface IResponse<T> {
    resultCode: number;
    result: T;
    success: boolean;
    resultDesc: string;
}

export interface Pager {
    IsFirstPage: boolean,
    IsLastPage: boolean,
    PageNumber: number,
    PageSize: number,
    Pages: number,
    SortField: string,
    SortType: string,
    Total: number
}
