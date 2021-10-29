import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/Main.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login/index.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
