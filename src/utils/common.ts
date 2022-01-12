import { padStart } from "lodash";
import request from "./request";
import isElectron from "is-electron";
import { get, STORAGE_TYPES } from "./storage";

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
        /// 备教登录
        /// </summary>
        TeachLogin = 5,

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
        /// 删除页
        /// </summary>
        DeletePage = 15,
        /// <summary>
        /// 修改页名称
        /// </summary>
        ChangePageName = 16,
        /// <summary>
        /// 修改页状态
        /// </summary>
        ChangePageState = 17,
        /// <summary>
        /// 保存教学建议
        /// </summary>
        ChangePageRemark = 18,
        /// <summary>
        /// 保存页
        /// </summary>
        SavePage = 19,
        /// <summary>
        /// 新建页
        /// </summary>
        AddPage = 20,

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
        PastePage = 24,

        /// <summary>
        /// 打开课包中内容
        /// </summary>
        OpenBagFile = 100,

        /// <summary>
        /// 查看题目
        /// </summary>
        CheckQuestion = 101,

        /// <summary>
        /// 查看视频
        /// </summary>
        CheckVideo = 102,

        /// <summary>
        /// 选中科目
        /// </summary>
        SelectSubject = 103,
        /// <summary>
        /// 选中出版社
        /// </summary>
        SelectPublisher = 104,
        /// <summary>
        /// 选中书本
        /// </summary>
        SelectBook = 105,
        /// <summary>
        /// 选中单元
        /// </summary>
        SelectCharpt = 106,
        /// <summary>
        /// 选中课包
        /// </summary>
        SelectBag = 107,
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
    OperatorID = "";
    /// <summary>
    /// 操作老师名字
    /// </summary>
    OperatorName = "";
    /// <summary>
    /// 登录SessionID
    /// </summary>
    SessionID = "";
    /// <summary>
    /// 程序版本
    /// </summary>
    Version = "";
    /// <summary>
    /// 加盟商ID
    /// </summary>
    FranchiseeID = "";
}

/// <summary>
/// 埋点数据
/// </summary>
export class TrackDataModel {
    /// <summary>
    /// 操作老师Id
    /// </summary>
    OperatorID = "";
    /// <summary>
    /// 操作老师名字
    /// </summary>
    OperatorName = "";
    /// <summary>
    /// 加盟商ID
    /// </summary>
    FranchiseeID = "";
    /// <summary>
    /// 当前操作对象ID
    /// </summary>
    CurrentID = "";
    /// <summary>
    /// 窗ID
    /// </summary>
    WindowID = "";
    /// <summary>
    /// 卡ID
    /// </summary>
    CardID = "";
    /// <summary>
    /// 页ID
    /// </summary>
    PageID = "";
    /// <summary>
    /// 窗名
    /// </summary>
    WindowName = "";
    /// <summary>
    /// 卡名
    /// </summary>
    CardName = "";
    /// <summary>
    /// 页名
    /// </summary>
    PageName = "";
    /// <summary>
    /// 日志详细内容
    /// </summary>
    Content = "";
    /// <summary>
    /// 数据上下文
    /// </summary>
    DataContext = "";
    EventID = "";
    EventType = ""
}

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

export default class TrackService {
    private static TRACKAPIPATH = "Api/Track/create";
    public static IsEnableTrack = true;
    public static TrackBaseUrl = "https://api.aixueshi.top:5019/";

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

    static setTrack(trackEventType: number, windowId = "", windowName = "", cardId = "", cardName = "", pageId = "", pageName = "", content = "", dataContext = "", currentId = "") {
        const trackModel = new TrackModel();
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        trackModel.TrackEventType = trackEventType;
        trackModel.FranchiseeID = userInfo.FranchiseeID;
        trackModel.OperatorID = userInfo.ID;
        trackModel.OperatorName = userInfo.Name;
        trackModel.SessionID = get(STORAGE_TYPES.SESSION_ID);
        if (isElectron()) trackModel.Version = window.electron.getVersion();
        const trackDataModel = new TrackDataModel();
        trackDataModel.OperatorName = userInfo.Name;
        trackDataModel.OperatorID = userInfo.ID;
        trackDataModel.FranchiseeID = userInfo.FranchiseeID;
        trackDataModel.WindowID = windowId;
        trackDataModel.WindowName = windowName;
        trackDataModel.CardID = cardId;
        trackDataModel.CardName = cardName;
        trackDataModel.PageID = pageId;
        trackDataModel.PageName = pageName;
        trackDataModel.Content = content;
        trackDataModel.DataContext = dataContext;
        trackDataModel.CurrentID = currentId;
        trackModel.trackData = trackDataModel;
        this.trackPoint(trackModel);
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
                        "Content-Type": "application/json-patch+json",
                        noLoading: "true"
                    },
                    method: "post",
                    data: model
                });
            }
            await sleep(100);
        }
    }
}
