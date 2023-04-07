/**
 * originType 请求来源 0窗卡页   1备教端
 * pageType 11素材页   12 听写页   13跟读页  16教具页
 */

interface IPageTypeValue {
    name: string;
    value: number;
    type: string;
}

export interface State {
    readonly originType: number;
    pageType: {
        readonly element: number;
        readonly listen: number;
        readonly follow: number;
        readonly teach: number;
    };
    pageTypeList: IPageTypeValue[];
}
export const state: State = {
    originType: 0,
    pageType: {
        element: 11,
        listen: 12,
        follow: 13,
        teach: 16
    },
    pageTypeList: [
        { name: "素材页", value: 11, type: "element" },
        { name: "听写页", value: 12, type: "listen" },
        { name: "跟读页", value: 13, type: "follow" },
        { name: "教具页", value: 16, type: "teach" }
    ]
};
