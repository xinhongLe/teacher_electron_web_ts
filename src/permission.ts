import router from "./router";
import {
    Login,
    LessonManager,
    GetGradeClassTree,
    GetBasicTag,
} from "@/views/login/api";
import { get, set } from "@/utils/storage";

// 免校验token白名单
const whiteList = ["login", "wpf班级管理", "wpf管理标签", "wpf学习记录"];

router.beforeEach((to, from, next) => {
    // 判断有没有登录,登录的话跳到系统，未登录的话不让跳到系统
    if (to.query.account && to.query.password) {
        Login({
            account: to.query.account.toString(),
            password: to.query.password.toString(),
        }).then((res) => {
            if (res.data.resultCode === 200) {
                set("SET_TOKEN", res.result.token);
                GetGradeClassTree().then((res) => {
                    if (res.resultCode === 200) {
                        set("GradeClassList", res.result);
                    }
                });
                GetBasicTag().then((res) => {
                    if (res.resultCode === 200) {
                        set("GetBasicTagList", res.result);
                    }
                });
                LessonManager().then((res) => {
                    if (res.resultCode === 200) {
                        set("USER_INFO", res.result);
                        next({ path: "/" });
                    }
                });
            }
        });
    } else {
        const token = (to.query.token || from.query.token)?.toString();
        if (token) {
            set("SET_TOKEN", token);
        }
        const hasToken = get("SET_TOKEN");
        if (hasToken) {
            if (to.path === "/login") {
                next({
                    path: "/",
                });
            } else {
                next();
            }
        } else {
            if (whiteList.indexOf(to.name) !== -1) {
                next();
            } else {
                if (to.query.account && to.query.password) {
                    Login({
                        account: to.query.account,
                        password: to.query.password,
                    }).then((res) => {
                        if (res.resultCode === 200) {
                            set("SET_TOKEN", res.result.token);
                            GetGradeClassTree({}).then((res) => {
                                if (res.resultCode === 200) {
                                    set("GradeClassList", res.result);
                                }
                            });

                            GetBasicTag({}).then((res) => {
                                if (res.resultCode === 200) {
                                    set("GetBasicTagList", res.result);
                                }
                            });

                            LessonManager({}).then((res) => {
                                if (res.resultCode === 200) {
                                    set("USER_INFO", res.result);
                                    de;
                                    next();
                                }
                            });
                        }
                    });
                } else {
                    next({
                        path: "/login",
                    });
                }
            }
        }
    }
});
