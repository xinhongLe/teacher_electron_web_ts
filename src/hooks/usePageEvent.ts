import { ref, onActivated, onDeactivated, reactive } from "vue";
import { createBuryingPointData } from "@/types/pointData"; //埋点数据接口
import { createBuryingPoint } from "@/api/pageevent";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { IYunInfo } from "@/types/login";
import moment from "moment";
import { systemId } from "@/config";
import { screen } from "@electron/remote";
// import { machineId, machineIdSync } from "node-machine-id";
import { EVENT_TYPE } from "@/config/event";

//获取唯一设备id
// const deviceId = machineIdSync(true);

//获取设备信息
const deviceInfo = require("os");
//获取分辨率
const displayScreen = screen.getPrimaryDisplay().workAreaSize;
const display = displayScreen.width + "*" + displayScreen.height;

//获取 设备信息
const getPcMsg: Function = () => {
    let interfaces = deviceInfo.networkInterfaces();
    let pcObj = reactive([]);
    let pcMessage = reactive([]);
    for (let key in interfaces) {
        if (
            key.indexOf("WLAN") !== -1 ||
            key.indexOf("无线网络连接") !== -1
        ) {
            pcObj = interfaces[key];
            break;
        } else if (
            key.indexOf("以太网") !== -1 ||
            key.indexOf("本地连接") !== -1
        ) {
            pcObj = interfaces[key];
        } else if (Object.keys(pcObj).length < 1) {
            pcObj = interfaces[key];
        }
    }
    pcMessage = pcObj.filter((item: any) => {
        if (item.family === "IPv4") {
            return item;
        }
    });
    return pcMessage[0];
};

const MacId = getPcMsg().mac;

//定义页面事件 (event：事件类型【page-in,page-out,page-stay,click...】，pageName：页面名称，enentId：事件ID，tabName：所点击的区域或者按钮名称)
const usePageEvent = (pageName: string, isPage?: boolean) => {
    //记录页面进入 page-in 时间
    const pageintime = ref("");
    //记录页面进入 page-out 时间
    const pageouttime = ref("");
    //记录页面停留时间 stay
    const pagestay = ref(0);
    //用户信息
    const userInfo = get(STORAGE_TYPES.USER_INFO);
    // console.log("userInfo", userInfo);
    //处理班级信息
    const classInfo = userInfo.Classes.map((item: any) => {
        return {
            ClassId: item.ID,
            ClassName: item.Name,
        };
    });
    //处理年级信息
    const gradeInfo = userInfo.GradeIDs.map((item: any) => {
        return {
            GradeID: item,
            GradeName: "",
        };
    });
    //处理科目信息
    const subjectInfo = userInfo.Subjects.map((item: any) => {
        return {
            SubjectID: item.ID,
            SubjectName: item.Name,
        };
    });

    //云平台信息
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    // console.log("yunInfo", yunInfo);

    //token 令牌
    const token = get(STORAGE_TYPES.SET_TOKEN);

    //获取网络连接
    const navigatorNew: any = window.navigator;
    // console.log(navigatorNew.connection.effectiveType);
    //创建埋点
    const createBuryingPointFn = (
        event: number, //事件行为
        eventId?: string | undefined, //事件id
        tabName?: string, //按钮或者区域名称
        otherData?: any //可能会携带的一些其他参数
    ) => {
        //埋点信息
        const pointData: createBuryingPointData = {
            TrackPlatform: "1",
            DeviceType: "windows", //设备类型
            Mac: MacId, //mac地址
            Platform: process.platform,
            DeviceId: MacId, //设备id
            Display: display, //分辨率
            // Ip: getPcMsg().address, //ip地址
            Token: token, //token
            UserId: userInfo.UserCenterUserID, //用户id
            UserType: 2, //用户类型 1员工 2老师 3学生 4家长
            UserName: userInfo.Name, //用户名称
            UserGender: "", //用户性别
            UserRole: yunInfo.RolesList as [], //用户角色
            SubjectId: "", //科目ID
            SubjectName: "", //科目名称
            UserSubject: subjectInfo, //科目
            TeachAge: "", //教龄
            UserGrade: gradeInfo, //用户年级
            GradeId: "", //年级id
            GradeName: "", //年级名称
            ClassId: "", //班级id
            ClassName: "", //班级名称
            UserClass: classInfo, //班级信息
            NetType: navigatorNew.connection.effectiveType, //网络类型 4g 5g wifi
            PlantId: systemId, //平台id
            PlantName: "爱学仕校园教师", //平台名称
            TrackData: {
                //跟踪数据
                Event: event, //事件行为
                EventId: eventId, //事件id
                PageName: pageName, //页面名称 -事件源：评测中心，课后延时，班级管理等
                // StayTime: 0, //当前页停留时间
                TabName: tabName, //区域名称 按钮名称
                Class: {
                    //班级信息
                    ClassId: "", //班级id
                    OrgId: "", //组织id
                },
                Lesson: {
                    //课程信息
                    SubjectId: otherData?.CourseID, //科目id
                    SubjectName: otherData?.CourseName, //科目名称
                    PublishId: "", //版本id
                    PublishName: "", //版本名称
                    AlbumId: "", //书册id
                    AlbumName: "", //书册名称
                    GradeId: "", //年级id
                    GradeName: otherData?.GradeName, //年级名称
                    LessonId: otherData?.LessonID, //课程id
                    LessonNam: otherData?.LessonName, //课程名称
                    ChapterId: otherData?.chapterId, //章节id
                    ChapterName: "", //章节名称
                },
                SearchKey: "", //搜索关键词
                ToolsFromSubject: "", //教具所属学科
                ResourceCenter: {
                    //资源中心数据
                    ResourceId: otherData?.ResourceId, //资源id
                    ResourceName: otherData?.Name, //资源名称
                    ResourceType: otherData?.ResourceType, //资源类型
                    ResourceFormat: "", //资源格式
                    KnowledgePoints: otherData?.KnowLedgrPoints, //知识点
                    Catalog: "", //所属目录
                    ParentKnowledge: "", //所属知识点
                    StageId: "", //切换的学段id
                    StageName: "", //切换的学段名称
                    SubjectId:
                        otherData?.TextBooks?.SubjectID || otherData?.SubjectId, //切换的科目ID
                    SubjectName:
                        otherData?.TextBooks?.SubjectName ||
                        otherData?.SubjectName, //切换的科目名称
                    BookId: otherData?.BookId, //切换的书册ID
                    BookName: "", //切换的书册名称
                    ChapterId:
                        otherData?.TextBooks?.ChapterID || otherData?.ChapterId, //切换的章节ID
                    ChapterName:
                        otherData?.TextBooks?.ChapterName ||
                        otherData?.ChapterName, //切换的章节名称
                    Sharer: "", //分享人
                    Sender: "", //发送人
                },
            },
        };
        //调用埋点接口
        // return;
        createBuryingPoint(pointData);
        // console.log(res);
    };
    if (isPage) {
        //如果是页面的进入/出去事件
        //页面激活
        onActivated(() => {
            if (pagestay.value) {
                //进入页面先重置停留时间
                pagestay.value = 0;
            }
            pageintime.value = moment().format("YYYY-MM-DD HH:mm:ss"); //获取进入的当前时间
            createBuryingPointFn(EVENT_TYPE.PageIn); //创建page-in埋点
        });
        //页面失活
        onDeactivated(() => {
            pageouttime.value = moment().format("YYYY-MM-DD HH:mm:ss"); //获取离开页面的当前时间
            pagestay.value = moment(pageouttime.value).diff(
                moment(pageintime.value),
                "seconds"
            ); //停留时间（多少秒）
            createBuryingPointFn(EVENT_TYPE.PageOut); //创建page-out埋点
        });
    }

    return {
        createBuryingPointFn,
    };
};
export default usePageEvent;
