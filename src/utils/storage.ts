const PREFIX = "VUE";

export const set = (name: string, value: string) => {
    localStorage.setItem(`${PREFIX}_${name}`, JSON.stringify(value));
};

export const get = (name: string) => {
    const item = localStorage.getItem(`${PREFIX}_${name}`);
    return item === null ? null : JSON.parse(item);
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
