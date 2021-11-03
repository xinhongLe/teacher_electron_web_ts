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
                path: "my-student",
                name: "我的学生",
                component: () => import("@/views/myStudent/index.vue")
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
