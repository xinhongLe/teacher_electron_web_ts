import { CourseBagClasses } from "@/api";
import moment from "moment";
import isElectron from "is-electron";

export function formatClass(v: CourseBagClasses[]) {
    return v ? v.map((e) => e.ClassName).join(",") : "";
}

export function formatDuration(time: number) {
    let newTime = "";
    if (time > -1) {
        const hour = Math.floor(time / 3600000);
        const min = Math.floor(time / 60000) % 60;
        const sec = time % 60;
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
    if (
        moment(v).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
    ) { str = str + " (今日)"; }
    return moment(v).format("YYYY年MM月DD日 星期" + str);
}

export function formatTime(v:string) {
    return moment(v).format("hh:mm");
}

export const lookVideo = (id: string | undefined) => {
    if (isElectron()) {
        // return ipcRenderer.send("openVideo", id);
    }
    window.open(`${location.origin}/look-video/${id}`);
};

export const lookQuestions = ({ id = "", type = 1, courseBagId = "" }) => {
    if (isElectron()) {
        // return ipcRenderer.send("openQuestion", id, type, courseBagId);
    }
    window.open(`${location.origin}/look-question/${id}/${type}?courseBagId=${courseBagId}`);
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
