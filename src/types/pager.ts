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

export interface PagerData {
    pageNumber: number, // 当前页
    pageSize: number, // 每页显示数据
    pageChoose: number[], // 分页配置
    total: number // 总数据
}
