export const ENV = process.env.VUE_APP_ENV;

export const AI_XUE_SHI_API = process.env.VUE_APP_AI_XUE_SHI_API;
export const AI_XUE_SHI_API_WRONG_BOOK =
    process.env.VUE_APP_AI_XUE_SHI_API_WRONG_BOOK;

export const WINDOW_CRAD_API = process.env.VUE_APP_AI_XUE_SHI_API;
export const TIMETABLE_API = process.env.VUE_APP_TIMETABLE_API;
export const SCHEDULE_API = process.env.VUE_APP_SCHEDULE_API;
export const YUN_API = process.env.VUE_APP_YUN_API;
export const YUN_API_ONECARD = process.env.VUE_APP_YUN_API_ONECARD;
export const YUN_API_PORTRAIT = process.env.VUE_APP_YUN_API_PORTRAIT;
export const YUN_API_ONECARD_MQTT = process.env.VUE_APP_YUN_API_ONECARD_MQTT;
export const RESOURCE_API = process.env.VUE_APP_RESOURCE_API;
export const RESOURCE_WEB = process.env.VUE_APP_RESOURCE_WEB;

export const TRACK_API = process.env.VUE_APP_TRACK;

//素材中心api
export const MATERIAL_API = process.env.VUE_APP_MATERIAL_API;

// 埋点日志接环境变量
export const VUE_APP_TRACK_LOG = process.env.VUE_APP_TRACK_LOG;

// export const AI_XUE_SHI_API = "http://apitest.aixueshi.top:5002";
// export const WINDOW_CRAD_API = "http://apitest.aixueshi.top:5002";
export const UPLOAD_CRAD_API = "https://api.aixueshi.top:5015";

// 注册学生模板下载地址
export const ADD_STUDENT_TEMPLATE =
    "https://wechat.aixueshi.top/学生信息表2.2.xlsx";

// 注册老师模板下载地址
export const ADD_TEACHER_TEMPLATE =
    "https://wechat.aixueshi.top/批量注册教师模板.xlsx";

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
    }
];
export const pageTypeList = [
    { name: "素材页", value: 11, type: "element", note: "" },
    { name: "听写页", value: 12, type: "listen", note: "编辑要听写的词汇，系统自动播报；支持设置播报次数与播报速度等" },
    { name: "跟读页", value: 13, type: "follow", note: "选择跟读素材，轻松实现课堂标准跟读；支持设置播报模式" },
    { name: "教具页", value: 16, type: "teach", note: "选择课程相关的学科教具插入页面，快速进行模拟实验" },
    { name: "游戏页", value: 20, type: "game", note: "选择喜欢的游戏插入页面，可在课堂进行有趣的师生互动" }
];

export enum pageType {
    element = 11,
    listen = 12,
    follow = 13,
    teach = 16,
    game = 20,
}

export const originType = 1;

export const fileTypeMap: Record<string, number> = {
    rtf: 1,
    png: 2,
    jpeg: 2,
    gif: 2,
    jpg: 2,
    ppt: 3,
    pptx: 3,
    mp3: 4,
    wav: 4,
    mp4: 5,
    mkv: 5,
    flv: 5,
    ico: 6,
    json: 7,
    doc: 9,
    docx: 9,
    pdf: 10,
    zip: 11,
    excel: 12,
    xls: 12,
    xlsx: 12
};

// 乐易学云平台下备教systemId
export const systemId = "16529394468916581254231961296573";
