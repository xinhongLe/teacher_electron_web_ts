// 埋点事件的触发事件类型
export enum EVENT_TYPE {
    //登录
    Login = 0,
    //页面点击
    PageClick = 1,
    //页面曝光
    PageView = 2,
    //页面停留
    PageStay = 3,
    //进入页面
    PageIn = 4,
    //离开页面
    PageOut = 5,

    //备教端
    //-排课
    ScheduleStart = 10,
    //-取消排课
    ScheduleOff = 20,
    //-退出排课
    ScheduleOut = 30,
}
