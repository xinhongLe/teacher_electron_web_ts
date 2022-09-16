import { CourseBagClasses } from "@/api";
import moment from "moment";
import isElectron from "is-electron";
import { MutationTypes, store } from "@/store";
import { BookList } from "@/types/preparation";
import "./dealMainEvent";

export function formatClass(v: CourseBagClasses[]) {
    return v ? v.map((e) => e.ClassName).join(",") : "";
}

export function formatDuration(time: number) {
    let newTime = "";
    if (time > -1) {
        const hour = Math.floor(time / 3600000);
        const min = Math.floor(time / 60000) % 60;
        const sec = Math.floor((time - min * 60000 - hour * 3600000) / 1000);
        if (hour > 0) {
            if (hour < 10) {
                newTime = "0" + hour + ":";
            } else {
                newTime = hour + ":";
            }
        } else {
            newTime = "";
        }
        if (min < 10) {
            newTime += "0";
        }
        newTime += min + ":";

        if (sec < 10) {
            newTime += "0";
        }
        newTime += sec;
    }
    return newTime;
}

export function formatDate(v: string) {
    const val = moment(v).day();
    let str = "";
    if (val === 1) {
        str = "一";
    } else if (val === 2) {
        str = "二";
    } else if (val === 3) {
        str = "三";
    } else if (val === 4) {
        str = "四";
    } else if (val === 5) {
        str = "五";
    } else if (val === 6) {
        str = "六";
    } else if (val === 7) {
        str = "日";
    }
    if (moment(v).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
        str = str + " (今日)";
    }
    return moment(v).format("YYYY年MM月DD日 星期" + str);
}

export function formatTime(v: string | number) {
    return moment(v).format("hh:mm");
}

export const lookVideo = (id: string | undefined) => {
    store.commit(MutationTypes.SET_IS_SHOW_VIDEO, { flag: true, info: { id } });
};

export const lookQuestions = ({
    id = "",
    type = 1,
    courseBagId = "",
    deleteQuestionIds = [],
}: {
    deleteQuestionIds?: string[];
    id: string;
    type: number;
    courseBagId?: string;
}) => {
    const info = {
        id,
        courseBagId,
        deleteQuestionIds,
        type,
    };
    store.commit(MutationTypes.SET_IS_SHOW_QUESTION, { flag: true, info });
};

export const getCourseBagType = (type: number) => {
    let typeNme = "课前";
    switch (type) {
        case 1:
            typeNme = "拓展延伸";
            break;
        case 2:
            typeNme = "课前预习";
            break;
        case 3:
            typeNme = "课中小练";
            break;
        case 4:
            typeNme = "课后作业";
            break;
        case 5:
            typeNme = "名师专题";
            break;
        case 6:
            typeNme = "单元考试";
            break;
        case 7:
            typeNme = "重点巩固";
            break;
        case 8:
            typeNme = "难点突破";
            break;
    }
    return typeNme;
};

export const showFileIcon = (extention: string) => {
    switch (extention) {
        case "doc":
        case "docx":
            return "icon_word@2x";
        case "png":
        case "jpg":
        case "jpge":
        case "pdf":
            return "icon_pic@2x";
        case "mp3":
        case "mkv":
        case "flv":
            return "icon_music@2x";
        case "mp4":
            return "icon_video@2x";
        default:
            return "icon_other@2x";
    }
};

export const openFile = (url: string, fileName = "") => {
    if (isElectron()) {
        return window.electron.ipcRenderer
            .invoke("downloadFile", url, fileName)
            .then((filePath) => {
                filePath && window.electron.shell.openPath(filePath);
            });
    }
    window.open(url);
};

export const findFirstId = (tree: BookList[], ids: string[]) => {
    tree.forEach((item) => {
        ids.push(item.Value);
        if (item.Children && item.Children.length > 0) {
            findFirstId([item.Children[0]], ids);
        }
    });
};

export const downLoad = (downUrl: string, fileName: string) => {
    const a = document.createElement("a"); // 创建a标签
    if ("download" in a) {
        a.download = fileName; // 设置下载文件的文件名
    }
    (document.body || document.documentElement).appendChild(a);
    a.href = downUrl; // downUrl为后台返回的下载地址
    a.target = "_parent";
    a.click(); // 设置点击事件
    a.remove(); // 移除a标签
};

export const getSaveFilePath = (id: string) => {
    const { join } = require("path");
    const path = join(window.electron.getPath("userData"), "files", id, "/");
    return path;
};

//用moment获取昨日今日本周日期
export const getFormatDate = (type: number) => {
    switch (type) {
        // 获取今天0时0分0秒
        case 1: {
            return [
                moment().startOf("day").format("YYYY-MM-DD"),
                moment().endOf("day").format("YYYY-MM-DD"),
            ];
        }
        //获取昨天的
        case 2: {
            return [
                moment().subtract(1, "day").startOf("day").format("YYYY-MM-DD"),
                moment().subtract(1, "day").endOf("day").format("YYYY-MM-DD"),
            ];
        }
        //获取本周的
        case 3: {
            return [
                moment().startOf("week").format("YYYY-MM-DD"),
                moment().endOf("week").format("YYYY-MM-DD"),
            ];
        }
    }
};
//格式化时间为标椎格式
export const formateNormDate = (date: string) => {
    const arr = date.split("T");
    const d = arr[0];
    const darr = d.split("-");

    const t = arr[1];
    const tarr = t.split(".000");
    const marr = tarr[0].split(":");

    const dd =
        parseInt(darr[0]) +
        "-" +
        parseInt(darr[1]) +
        "-" +
        parseInt(darr[2]) +
        " " +
        parseInt(marr[0]) +
        ":" +
        parseInt(marr[1]) +
        ":" +
        parseInt(marr[2]);
    // console.log(dd);
    const dDate = dd.split(" ");
    return dDate[0];
};
//判断当前的日期是周几
export const formatWeekDay = function (time: string) {
    const datelist = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return datelist[new Date(time).getDay()];
};
//格式化日期为 月-日
export const formatMonthDay = function (time: string) {
    return moment(time).format("MM-DD");
};
