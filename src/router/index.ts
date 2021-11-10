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
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
