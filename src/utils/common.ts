import { padStart } from "lodash";
import request from "./request";

/**
 * 生成随机码
 * @param len 随机码长度
 */
export const createRandomCode = (len = 6) => {
    const charset = "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const maxLen = charset.length;
    let ret = "";
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * maxLen);
        ret += charset[randomIndex];
    }
    return ret;
};

/**
 * 补足数字位数
 * @param digit 数字
 * @param len 位数
 */
export const fillDigit = (digit: number, len: number) => {
    return padStart("" + digit, len, "0");
};

/**
 * 等待
 */
export const sleep = (time: number) => {
    return new Promise<number>(resolve => {
        setTimeout(() => {
            resolve(1);
        }, time);
    });
};

export class TrackService {
    private static TRACKAPIPATH: string = "Api/Track/create";
    public static IsEnableTrack: boolean = true;
    public static TrackBaseUrl: string = "https://api.aixueshi.top:5019/";

    private static trackModels: Array<TrackModel> = [];

    /**
     * 采集数据进入队列
     * @param model 
     */
    static trackPoint(model: TrackModel) {
        if (this.IsEnableTrack) {
            this.trackModels.push(model);
        }
    }

    /**
     * 启动埋点收集
     */
    static async useTrackPoint() {
        while (true) {
            const model = this.trackModels.shift();
            if (model) {
                request({
                    baseURL: this.TrackBaseUrl,
                    url: this.TRACKAPIPATH,
                    headers: {
                        "Content-Type": "application/json-patch+json"
                    },
                    method: "post",
                    data: model
                });
            }
            await sleep(100);
        }
    }
}

export class TrackModel {
    /// <summary>
    /// 跟踪来源
    /// </summary>
    Source: EnumTrackSource = EnumTrackSource.WCP;
    /// <summary>
    /// 埋点事件类型
    /// </summary>
    TrackEventType: EnumTrackEventType = EnumTrackEventType.Other;
    /// <summary>
    /// 埋点数据
    /// </summary>
    trackData: any;
    /// <summary>
    /// 操作老师Id
    /// </summary>
    OperatorID: string = "";
    /// <summary>
    /// 操作老师名字
    /// </summary>
    OperatorName: string = "";
    /// <summary>
    /// 登录SessionID
    /// </summary>
    SessionID: string = "";
    /// <summary>
    /// 程序版本
    /// </summary>
    Version: string = "";
    /// <summary>
    /// 加盟商ID
    /// </summary>
    FranchiseeID: string = "";
}

/// <summary>
/// 埋点数据
/// </summary>
export class TrackDataModel {
    /// <summary>
    /// 操作老师Id
    /// </summary>
    OperatorID: string = "";
    /// <summary>
    /// 操作老师名字
    /// </summary>
    OperatorName: string = "";
    /// <summary>
    /// 加盟商ID
    /// </summary>
    FranchiseeID: string = "";
    /// <summary>
    /// 当前操作对象ID
    /// </summary>
    CurrentID: string = "";
    /// <summary>
    /// 窗ID
    /// </summary>
    WindowID: string = "";
    /// <summary>
    /// 卡ID
    /// </summary>
    CardID: string = "";
    /// <summary>
    /// 页ID
    /// </summary>
    PageID: string = "";
    /// <summary>
    /// 窗名
    /// </summary>
    WindowName: string = "";
    /// <summary>
    /// 卡名
    /// </summary>
    CardName: string = "";
    /// <summary>
    /// 页名
    /// </summary>
    PageName: string = "";
    /// <summary>
    /// 日志详细内容
    /// </summary>
    Content: string = "";
    /// <summary>
    /// 数据上下文
    /// </summary>
    DataContext: string = "";
}


export enum EnumTrackSource {
    /// <summary>
    /// Web
    /// </summary>
    Web = 10,
    /// <summary>
    /// 微信/小程序
    /// </summary>
    WeChat = 20,
    /// <summary>
    /// WPS
    /// </summary>
    WPF = 30,
    /// <summary>
    /// 教师
    /// </summary>
    Teacher = 31,
    /// <summary>
    /// 窗卡页
    /// </summary>
    WCP = 32,
    /// <summary>
    /// APP
    /// </summary>
    APP = 40
}

export enum EnumTrackEventType {
    /// <summary>
    /// 其他
    /// </summary>
    Other = 0,
    /// <summary>
    /// 进入页面
    /// </summary>
    PageEntry = 1,
    /// <summary>
    /// 离开页面
    /// </summary>
    PageLeave = 2,
    /// <summary>
    /// 热区点击
    /// </summary>
    HotClick = 3,
    /// <summary>
    /// 窗卡页登录
    /// </summary>
    WCPLogin = 4,
    /// <summary>
    /// 选择窗
    /// </summary>
    SelectWindow = 10,
    /// <summary>
    /// 选择卡
    /// </summary>
    SelectCard = 11,
    /// <summary>
    /// 选择页
    /// </summary>
    SelectPage = 12,
    /// <summary>
    /// 进入目录导航
    /// </summary>
    EntryMenuNav = 13,
    /// <summary>
    /// 点击目录导航中的页
    /// </summary>
    ClickPageByMenuNav = 14,
    /// <summary>
    /// 删除卡
    /// </summary>
    DeleteCard = 21,
    /// <summary>
    /// 修改卡名
    /// </summary>
    ChangeCardName = 22,
    /// <summary>
    /// 新建卡
    /// </summary>
    AddCard = 23,
    /// <summary>
    /// 粘贴页
    /// </summary>
    PastePage = 24
}
