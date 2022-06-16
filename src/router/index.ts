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
        children: [
            {
                path: "home",
                name: "首页",
                component: () => import("@/views/home/index.vue")
            },
            {
                path: "preparation",
                name: "备课",
                component: () => import("@/views/preparation/index.vue"),
                meta: {
                    keepAlive: true
                }
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
                path: "windowcard-edit",
                name: "编辑",
                component: () => import("@/views/preparation/intelligenceClassroom/edit/index.vue"),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: "attend-class/:chapterId/:lessonId",
                name: "上课",
                component: () => import("@/views/attendClass/index.vue")
            },
            {
                path: "homework",
                name: "作业",
                meta: {
                    isBack: false
                },
                component: () => import("@/views/homework/index.vue"),
                beforeEnter: (to, from, next) => {
                    if (from.name === "查阅作业") {
                        to.meta.isBack = true;
                    }
                    next();
                }
            },
            {
                path: "assignHomework/:subjectId/:subjectName",
                name: "布置作业",
                component: () => import("@/views/assignHomework/index.vue"),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: "check-homework/:classHomeworkPaperID",
                name: "查阅作业",
                component: () => import("@/views/checkHomework/index.vue")
            },
            {
                path: "report-center",
                name: "报表中心",
                component: () => import("@/views/reportCenter/index.vue")
            },
            {
                path: "course-time",
                name: "课时延后",
                component: () => import("@/views/courseTime/index.vue")
            },
            {
                path: "preparation-group",
                name: "集体备课",
                component: () => import("@/views/preparationGroup/index.vue")
            },
            {
                path: "preparation-edit/:preId",
                name: "集体备课详情",
                component: () => import("@/views/preparationGroup/editPanel/index.vue")
            },
            {
                path: "assessment-center",
                name: "测评中心",
                component: () => import("@/views/assessmentCenter/index.vue")
            },
            {
                path: "annotation/:id/:preId/:teacherCount",
                name: "批注",
                component: () => import("@/views/preparationGroup/annotation/index.vue")
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
