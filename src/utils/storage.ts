const PREFIX = "VUE";

export const set = (name: string, value: any) => {
    localStorage.setItem(`${PREFIX}_${name}`, typeof value === "string" ? value : JSON.stringify(value));
};

export const get = (name: string) => {
    const item = localStorage.getItem(`${PREFIX}_${name}`);
    let result;
    try {
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
        remove(name.substring(4));
    });
};

export enum STORAGE_TYPES {
    // 储存token
    SET_TOKEN = "SET_TOKEN",

    // 年级班级列表
    GRADE_CLASS_TREE_LIST = "GRADE_CLASS_TREE_LIST",

    // 学生标签配置
    STUDENT_TAGS = "STUDENT_TAGS",

    // 用户信息存储
    USER_INFO = "USER_INFO",

    // 登录历史
    RECORD_LOGIN_LIST = "RECORD_LOGIN_LIST"
}
