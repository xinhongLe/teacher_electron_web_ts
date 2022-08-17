import { ref, onActivated, onDeactivated, reactive } from "vue";
import { createBuryingPointData } from "@/types/pointData";//埋点数据接口
import { createBuryingPoint } from '@/api/pageevent';
import { get, STORAGE_TYPES } from "@/utils/storage";
import { IYunInfo } from "@/types/login";
import moment from "moment";
import { screen } from "@electron/remote";
//定义页面事件 (event：事件类型【page-in,page-out,page-stay,click...】，pageName：页面名称，enentId：事件ID，tabName：所点击的区域或者按钮名称)
const usePageEvent = (event: string, pageName: string, eventId?: string, tabName?: string) => {
    //记录页面进入 page-in 时间
    const pageintime = ref('');
    //记录页面进入 page-out 时间
    const pageouttime = ref('');
    //记录页面停留时间 stay
    const pagestay = ref(0);

    //获取设备信息
    const deviceInfo = require('os');
    //获取分辨率
    const displayScreen = screen.getPrimaryDisplay().workAreaSize
    const display = displayScreen.width + '*' + displayScreen.height
    //用户信息
    const userInfo = get(STORAGE_TYPES.USER_INFO);
    //云平台信息
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
    //token 令牌
    const token = get(STORAGE_TYPES.SET_TOKEN);

    //获取 设备信息
    const getPcMsg: Function = () => {
        let interfaces = require('os').networkInterfaces()
        let pcObj = reactive([])
        let pcMessage = reactive([])
        for (let key in interfaces) {
            if (key.indexOf('WLAN') !== -1 || key.indexOf('无线网络连接') !== -1) {
                pcObj = interfaces[key]
                break
            } else if (key.indexOf('以太网') !== -1 || key.indexOf('本地连接') !== -1) {
                pcObj = interfaces[key]
            } else if (Object.keys(pcObj).length < 1) {
                pcObj = interfaces[key]
            }
        }
        pcMessage = pcObj.filter((item: any) => {
            if (item.family === 'IPv4') {
                return item
            }
        })
        return pcMessage[0];
    };

    //获取网络连接
    const navigatorNew: any = window.navigator
    // console.log(navigatorNew.connection.effectiveType);

    //创建埋点
    const createBuryingPointFn = async (eventDta: any) => {
        //埋点信息
        const pointData: createBuryingPointData = {
            device_type: '',//设备类型
            mac: getPcMsg().mac,//mac地址
            platform: 'pc',
            device_id: '',//设备id
            display: display,//分辨率
            ip: getPcMsg().address,//ip地址
            token: token,//token
            user_id: userInfo.UserCenterUserID,//用户id
            nettype: navigatorNew.connection.effectiveType,//4g 5g wifi
            EnumUserType: 2,//用户类型 1员工 2老师 3学生 4家长
            plantid: '',//平台id
            plantName: '',//平台名称
            trackData: {//跟踪数据
                event: eventDta,//事件行为
                pageName: pageName,//事件源：评测中心，课后延时，班级管理等
                stayTime: pagestay.value,//当前页停留时间
                tabName: tabName,//区域名称 按钮名称
                lesson: {//课程
                    subjectid: '',
                    subjectName: '',
                    publishId: '',
                    publishName: '',
                    alubmId: '',
                    alubmName: '',
                    lessonId: '',
                    lessonName: '',
                    chapterId: '',
                    chapterName: '',
                },
                class: {//班级
                    classid: '',//班级id
                    orgid: '',//组织id
                },
                searchKey: ''
            }
        };
        //调用埋点接口
        return;
        const res = await createBuryingPoint(pointData);
        console.log(res);
    };
    if (event === 'page') {//如果是页面的进入/出去事件
        //页面激活
        onActivated(() => {
            if (pagestay.value) {//进入页面先重置停留时间
                pagestay.value = 0
            }
            pageintime.value = moment().format('YYYY-MM-DD HH:mm:ss');//获取进入的当前时间
            createBuryingPointFn('page-in');//创建page-in埋点
        })
        //页面失活
        onDeactivated(() => {
            pageouttime.value = moment().format('YYYY-MM-DD HH:mm:ss');//获取离开页面的当前时间
            pagestay.value = moment(pageouttime.value).diff(moment(pageintime.value), 'seconds');//停留时间（多少秒）
            console.log(pagestay.value);
            createBuryingPointFn('page-out');//创建page-out埋点
        })
    };

    if (event === 'click') {//如果是页面区域或者按钮的点击事件
        createBuryingPointFn(eventId);//创建click埋点
    };

    return {
        pageintime,
        pageouttime,
        pagestay,
        userInfo,
        deviceInfo,
        yunInfo,
        createBuryingPointFn,
    }
}
export default usePageEvent;