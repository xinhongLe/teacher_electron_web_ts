import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/index.vue")
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/"
    },
    {
        path: "/",
        component: () => import("@/components/Main.vue"),
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "首页",
                component: () => import("@/views/home/index.vue")
            },
            {
                path: "preparation",
                name: "备课",
                component: () => import("@/views/preparation/index.vue")
            },
            {
                path: "class-manage",
                name: "班级管理",
                component: () => import("@/views/classManage/index.vue")
            },
            {
                path: "label/:classId",
                name: "管理标签",
                component: () => import("@/views/labelManage/index.vue")
            },
            {
                path: "label-no-header/:classId",
                name: "wpf管理标签",
                component: () => import("@/views/labelManage/index.vue")
            },
            {
                path: "record-no-header/:studentId/:className",
                name: "wpf学习记录",
                component: () => import("@/views/record/index.vue")
            },
            {
                path: "record/:studentId/:className",
                name: "学习记录",
                component: () => import("@/views/record/index.vue")
            },
            {
                path: "attend-class",
                name: "上课",
                component: () => import("@/views/attendClass/index.vue")
            },
            {
                path: "homework",
                name: "作业",
                component: () => import("@/views/homework/index.vue")
            },
            {
                path: "assignHomework/:subjectId/:subjectName",
                name: "布置作业",
                component: () => import("@/views/assignHomework/index.vue")
            },
            {
                path: "check-homework/:classHomeworkPaperID",
                name: "查阅作业",
                component: () => import("@/views/checkHomework/index.vue")
            }
        ]
    },
    {
        path: "/look-question/:id/:type", // type 1查看题目  2查看同类题
        name: "查看题目",
        component: () => import("@/views/lookQuestion/index.vue")
    },
    {
        path: "/look-video/:id",
        name: "查看视频",
        component: () => import("@/views/lookVideo/index.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
