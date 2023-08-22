import {createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/:catchAll(.*)",
        redirect: "/",
    },
    {
        path: "/",
        component: () => import("@/components/Main.vue"),
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "首页",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    keepAlive: true,
                },
            },
            {
                path: "preparation",
                name: "备课",
                component: () => import("@/views/preparation/index.vue"),
                meta: {
                    keepAlive: true,
                },
            },
            {
                path: "wrongbook",
                name: "班级错题本",
                component: () => import("@/views/wrongbook/index.vue"),
                meta: {
                    keepAlive: true,
                },
            },
            {
                path: "class-manage",
                name: "班级管理",
                component: () => import("@/views/classManage/index.vue"),
            },
            {
                path: "label/:classId",
                name: "管理标签",
                component: () => import("@/views/labelManage/index.vue"),
            },
            {
                path: "label-no-header/:classId",
                name: "wpf管理标签",
                component: () => import("@/views/labelManage/index.vue"),
            },
            {
                path: "record-no-header/:studentId/:className",
                name: "wpf学习记录",
                component: () => import("@/views/record/index.vue"),
            },
            {
                path: "record/:studentId/:className",
                name: "学习记录",
                component: () => import("@/views/record/index.vue"),
            },
            {
                path: "windowcard-edit",
                name: "编辑",
                component: () =>
                    import(
                        "@/views/preparation/intelligenceClassroom/edit/index.vue"
                        ),
                meta: {
                    keepAlive: true,
                },
            },
            {
                // path: "attend-class/:chapterId/:lessonId/:bookId",
                path: "attend-class/:bagIds",
                name: "上课",
                component: () => import("@/views/attendClass/index.vue"),
            },
            {
                path: "homework",
                name: "作业",
                meta: {
                    isBack: false,
                },
                component: () => import("@/views/homework/index.vue"),
                beforeEnter: (to, from, next) => {
                    if (from.name === "查阅作业") {
                        to.meta.isBack = true;
                    }
                    next();
                },
            },
            {
                path: "assignHomework/:subjectId/:subjectName",
                name: "布置作业",
                component: () => import("@/views/assignHomework/index.vue"),
                meta: {
                    keepAlive: true,
                },
            },
            {
                path: "check-homework/:classHomeworkPaperID",
                name: "查阅作业",
                component: () => import("@/views/checkHomework/index.vue"),
            },
            {
                path: "report-center",
                name: "报表中心",
                component: () => import("@/views/reportCenter/index.vue"),
            },
            {
                path: "course-time",
                name: "课时延后",
                component: () => import("@/views/courseTime/index.vue"),
            },
            {
                path: "preparation-group",
                name: "集体备课",
                component: () => import("@/views/preparationGroup/index.vue"),
            },
            {
                path: "preparation-edit/:preId",
                name: "集体备课详情",
                component: () =>
                    import("@/views/preparationGroup/editPanel/index.vue"),
            },
            {
                path: "assessment-center",
                name: "测评中心",
                component: () => import("@/views/assessmentCenter/index.vue"),
            },
            {
                path: "annotation/:id/:preId/:teacherCount",
                name: "批注",
                component: () =>
                    import("@/views/preparationGroup/annotation/index.vue"),
            },
            {
                path: "resource-center/:platformId",
                name: "资源中心",
                component: () => import("@/views/resourceCenter/index.vue"),
            },
            {
                path: "composition",
                name: "AI作文批改",
                component: () => import("@/views/composition/index.vue"),
            },
            {
                path: "pblstudy",
                name: "PBL项目式学习",
                component: () => import("@/views/pblStudy/index.vue"),
                meta: {
                    keepAlive: true
                }
            },
            {
                path: "wincard",
                name: "PBL项目式学习窗卡页",
                component: () => import("@/views/pblStudy/wincard.vue"),
                // meta: {
                //     keepAlive: true
                // }
            }

        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
