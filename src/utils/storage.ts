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

    // 学年学期
    SCHOOL_TERM = "SCHOOL_TERM",

    // 当前用户信息存储
    CURRENT_USER_INFO = "CURRENT_USER_INFO",

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
    TEACHER_LIST = "TEACHER_LIST",
    /**
     * 是否开启缓存
     */
    SET_ISCACHE = "SET_ISCACHE",
    /**
     * 学生绑定答题器列表
     */
    STUDENT_MACHINE_LIST = "STUDENT_MACHINE_LIST_",
    /**
     * 系统自动清理设置
     */
    AUTO_CLEAR_SETTING = "AUTO_CLEAR_SETTING_",
    /**
     * 下一次自动清理提示时间
     */
    NEXT_AUTO_CLEAR_TIME = "NEXT_AUTO_CLEAR_TIME_",
    /**
     * 课时下选择的课包
     */
    SELECT_BAG_ID = "SELECT_BAG_ID_",
    /**
     * 选中的书册。
     */
    SELECT_BOOK_ID = "SELECT_BOOK_ID",
    /**
     * 选中单元课时
     */
    SELECT_CHAPTER_LESSON = "SELECT_CHAPTER_LESSON",
    /**
     * 拖拽课时到课表提示
     */
    DRAGE_COURSE_TO_SCHEDULE = "DRAGE_COURSE_TO_SCHEDULE",
    /**
     * 云平台信息
     */
    YUN_INFO = "YUN_INFO",
    /**
     * 存储学生列表
     */
    STUDENT_LIST = "STUDENT_LIST",
    /**
     * 存储窗体信息
     */
    WINDOW_INFO = "WINDOW_INFO",
    /**
     * 存储科目书册信息
     */
    SUBJECT_BOOK_INFO = "SUBJECT_BOOK_INFO",

    /**
     * 多个窗体下 赋值的窗卡页信息
     */
    WIN_COPY_VALUE = "WIN_COPY_VALUE",

    /**
     * 统一选择的班级
     */
    CURRENT_SELECT_CLASS = "CURRENT_SELECT_CLASS",

    /**
     * 统一班级列表
     */
    CLASS_LIST = "CLASS_LIST",

    /**
     * 记录用户选择是否更新
     */
    USER_UPDATE_CHOICE = "USER_UPDATE_CHOICE",

    /**
     * 下载历史
     */
    DOWNLOAD_HISTORY = "DOWNLOAD_HISTORY",

    /**
     * 默认下载路径
     */
    DOWNLOAD_PATH = "DOWNLOAD_PATH",

    /**
     * 应用权限
     */
    SET_APP_PERMISSION = "SET_APP_PERMISSION"
}

export const set = (
    name: STORAGE_TYPES | string,
    value: unknown,
    isEncrypt = false
) => {
    let newValue = typeof value === "string" ? value : JSON.stringify(value);
    newValue = isEncrypt ? encrypt(newValue) : newValue;
    if (isElectron()) {
        window.electron.store.set(`${PREFIX}_${name}`, newValue);
    } else {
        localStorage.setItem(`${PREFIX}_${name}`, newValue);
    }
};

export const get = (name: STORAGE_TYPES | string, isDecrypt = false) => {
    let item;
    if (isElectron()) {
        item = window.electron.store.get(`${PREFIX}_${name}`);
    } else {
        item = localStorage.getItem(`${PREFIX}_${name}`);
    }
    let result;
    try {
        item = isDecrypt ? decrypt((item as string) || "") : item;
        result = !item ? null : JSON.parse(item as string);
    } catch (err) {
        result = item;
    }
    return result;
};

export const storeChange = (
    name: STORAGE_TYPES | string,
    callback: (newValue: unknown, oldValue: unknown) => void
) => {
    return window.electron.store.onDidChange(`${PREFIX}_${name}`, callback);
};

export const remove = (name: string) => {
    if (isElectron()) {
        window.electron.store.delete(`${PREFIX}_${name}`);
    } else {
        localStorage.removeItem(`${PREFIX}_${name}`);
    }
};

export const clear = () => {
    if (isElectron()) {
        const record = get(STORAGE_TYPES.RECORD_LOGIN_LIST);
        const paths = get(STORAGE_TYPES.OSS_PATHS);
        const selectBookData = get(STORAGE_TYPES.SELECT_BOOK_ID);
        const userUpdateChoice = get(STORAGE_TYPES.USER_UPDATE_CHOICE);// 用户的更新选择
        const history = get(STORAGE_TYPES.DOWNLOAD_HISTORY);
        window.electron.store.clear();
        record && set(STORAGE_TYPES.RECORD_LOGIN_LIST, record);
        paths && set(STORAGE_TYPES.OSS_PATHS, paths);
        history && set(STORAGE_TYPES.DOWNLOAD_HISTORY, history);
        selectBookData && set(STORAGE_TYPES.SELECT_BOOK_ID, selectBookData);
        userUpdateChoice && set(STORAGE_TYPES.USER_UPDATE_CHOICE, userUpdateChoice);

    } else {
        Object.keys(localStorage).forEach((name) => {
            const REGEXP = /^VUE_(.+)/;

            // 记录账号历史记录的不删除
            // OSS_PATHS不能删 （被人顶掉以后不执行App组件的getoss，导致上传报错）
            if (
                !REGEXP.test(name) ||
                name.includes(STORAGE_TYPES.RECORD_LOGIN_LIST) ||
                name.includes(STORAGE_TYPES.OSS_PATHS) ||
                name.includes(STORAGE_TYPES.SELECT_BOOK_ID) ||
                name.includes(STORAGE_TYPES.USER_UPDATE_CHOICE)
            ) {
                return;
            }
            remove(name.substring(4));
        });
    }
    sessionStorage.removeItem("breadList");
};
