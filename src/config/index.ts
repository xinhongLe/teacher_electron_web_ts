export const AI_XUE_SHI_API = process.env.VUE_APP_AI_XUE_SHI_API;

// 注册学生模板下载地址
export const ADD_STUDENT_TEMPLATE = "https://wechat.aixueshi.top/学生信息表2.2.xlsx";

// 注册老师模板下载地址
export const ADD_TEACHER_TEMPLATE = "https://wechat.aixueshi.top/批量注册教师模板.xlsx";

// 所有的科目列表及id
export const ALL_SUBJECT_LIST = [
    {
        subjectName: "语文",
        subjectId: "39F766472E16384149030DFA4E9863B5"
    },
    {
        subjectName: "数学",
        subjectId: "39F766472E16F43AE0EAE334481AF7BA"
    },
    {
        subjectName: "英语",
        subjectId: "39F766472E161EEFD06F825352362179"
    },
    {
        subjectName: "拼音",
        subjectId: "39F766472E16DFF69031FA194C9A33B8"
    }
];
export const pageTypeList = [
    { name: "素材页", value: 11, type: "element" },
    { name: "听写页", value: 12, type: "listen" },
    { name: "跟读页", value: 13, type: "follow" },
    { name: "教具页", value: 16, type: "teach" }
];
export const pageType = {
    element: 11,
    listen: 12,
    follow: 13,
    teach: 16
};
export const originType = 1;
