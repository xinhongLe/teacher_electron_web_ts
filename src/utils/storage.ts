import { decrypt, encrypt } from "./crypto";

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
     * 窗卡页下一步位置设置
     */
    NEXT_SETTING = "NEXT_SETTING_",
    /**
     * TEACHER_LIST 集体备课邀请老师的列表
     */
     TEACHER_LIST = "TEACHER_LIST"
}

export const set = (name: STORAGE_TYPES | string, value: unknown, isEncrypt = false) => {
    let newValue = typeof value === "string" ? value : JSON.stringify(value);
    newValue = isEncrypt ? encrypt(newValue) : newValue;
    localStorage.setItem(`${PREFIX}_${name}`, newValue);
};

export const get = (name: STORAGE_TYPES | string, isDecrypt = false) => {
    let item = localStorage.getItem(`${PREFIX}_${name}`);
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
    localStorage.removeItem(`${PREFIX}_${name}`);
};

export const clear = () => {
    Object.keys(localStorage).forEach((name) => {
        const REGEXP = /^VUE_(.+)/;

        // 记录账号历史记录的不删除
        if (!REGEXP.test(name) || name.includes("RECORD_LOGIN_LIST")) {
            return;
        }
        // OSS_PATHS不能删 （被人顶掉以后不执行App组件的getoss，导致上传报错）
        if (!REGEXP.test(name) || name.includes("OSS_PATHS")) {
            return;
        }
        remove(name.substring(4));
    });
    sessionStorage.removeItem("breadList");
};
