import { decrypt, encrypt } from "./crypto";
import isElectron from "is-electron";

const PREFIX = "VUE";

export enum STORAGE_TYPES {
    // 储存token
    SET_TOKEN = "SET_TOKEN",

    // 年级班级列表
    GRADE_CLASS_TREE_LIST = "GRADE_CLASS_TREE_LIST",

    // 学生标签配置
    STUDENT_TAGS = "STUDENT_TAGS",

    // 用户信息存储
    USER_INFO = "USER_INFO",

    /**
     * 是否有正在请求的页
     */

     SET_PAGEIDING = "SET_PAGEIDING",
    // 登录历史
    RECORD_LOGIN_LIST = "RECORD_LOGIN_LIST",
    /**
     * 自动播放题音开关
     */
    AUTO_PALY_QUESTION_SWITCH = "AUTO_PALY_QUESTION_SWITCH",
    /**
     * 自动播放解析
     */
    AUTO_PALY_RESOLUTION_SWITCH = "AUTO_PALY_RESOLUTION_SWITCH",
    /**
     * oss存储路径
    */
    OSS_PATHS = "OSS_PATHS",
    /**
     * 查阅作业的详情
     */
    HOMEWORK_DETAIL = "HOMEWORK_DETAIL",
    /**
     * SessionId 本次登录默认标识ID
     */
    SESSION_ID = "SESSION_ID",
    /**
     * TEACHER_LIST 集体备课邀请老师的列表
     */
     TEACHER_LIST = "TEACHER_LIST",
    /**
     * 是否开启缓存
     */
    SET_ISCACHE = "SET_ISCACHE"
}

export const set = (name: STORAGE_TYPES, value: unknown, isEncrypt = false) => {
    let newValue = typeof value === "string" ? value : JSON.stringify(value);
    newValue = isEncrypt ? encrypt(newValue) : newValue;
    if (isElectron()) {
        (window as any).electron.store.set(`${PREFIX}_${name}`, newValue);
    } else {
        localStorage.setItem(`${PREFIX}_${name}`, newValue);
    }
};

export const get = (name: STORAGE_TYPES, isDecrypt = false) => {
    let item;
    if (isElectron()) {
        item = (window as any).electron.store.get(`${PREFIX}_${name}`);
    } else {
        item = localStorage.getItem(`${PREFIX}_${name}`);
    }
    let result;
    try {
        item = isDecrypt ? decrypt(item || "") : item;
        result = item === null ? null : JSON.parse(item);
    } catch {
        result = item;
    }
    return result;
};

export const remove = (name: string) => {
    if (isElectron()) {
        (window as any).electron.store.delete(`${PREFIX}_${name}`);
    } else {
        localStorage.removeItem(`${PREFIX}_${name}`);
    }
};

export const clear = () => {
    if (isElectron()) {
        const record = get(STORAGE_TYPES.RECORD_LOGIN_LIST);
        const paths = get(STORAGE_TYPES.OSS_PATHS);
        (window as any).electron.store.clear();
        set(STORAGE_TYPES.RECORD_LOGIN_LIST, record);
        set(STORAGE_TYPES.OSS_PATHS, paths);
    } else {
        Object.keys(localStorage).forEach((name) => {
            const REGEXP = /^VUE_(.+)/;

            // 记录账号历史记录的不删除
            // OSS_PATHS不能删 （被人顶掉以后不执行App组件的getoss，导致上传报错）
            if (!REGEXP.test(name) || name.includes("RECORD_LOGIN_LIST") || name.includes("OSS_PATHS")) {
                return;
            }
            remove(name.substring(4));
        });
    }
    sessionStorage.removeItem("breadList");
};
