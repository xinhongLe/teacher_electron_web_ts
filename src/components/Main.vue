<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar && !isIframe"/>
        <Suspension v-if="!isElectron && !isIframe"/>
        <LookQuestion v-if="isShowQuestion"/>
        <LookVideo v-if="isShowVideo"/>
        <Projection/>
        <Suspense v-if="isElectron">
            <VideoProjection/>
        </Suspense>
        <div class="main-body">
            <router-view v-slot="{Component}">
                <keep-alive :exclude="keepExcludeArr">
                    <component :is="Component"/>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineAsyncComponent, ref, watch, onUnmounted, onMounted } from "vue";
import NavBar from "./navBar/index.vue";
import isElectron from "is-electron";
import { useRoute } from "vue-router";
import { GetGradeClassTree } from "@/views/login/api";
import { IGradeClassTreeResponse } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useUserInfo from "@/hooks/useUserInfo";
import useTagList from "@/hooks/useTagList";
import LookQuestion from "./lookQuestion/index.vue";
import { MutationTypes, store } from "@/store";
import LookVideo from "./lookVideo/index.vue";
import Projection from "./projection/index.vue";
import { ElMessage } from "element-plus";

export default defineComponent({
    components: {
        NavBar,
        Suspension: defineAsyncComponent(() => import("./suspension/index.vue")),
        LookQuestion,
        LookVideo,
        Projection,
        VideoProjection: defineAsyncComponent(() => import("./videoProjection/index.vue"))
    },
    setup() {
        const route = useRoute();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];
        const { queryUserInfo } = useUserInfo();
        const { getTagList } = useTagList();
        const keepExcludeArr = ["Home", "LabelManage", "Record", "Edit", "AssignHomework", "CheckHomework", "preparationGroup", "preparationEdit", "AttendClass"];

        watch(() => ({ query: route.query, name: route.name }), ({ query, name }) => {
            isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
            // 岳阳云平台内嵌备教端
            if (name === "集体备课") {
                if (window?.top && (window.top[0]?.location?.origin?.indexOf("yueyangyun") > -1 || (window.top[0]?.location?.ancestorOrigins[0]?.indexOf("yueyangyun") > -1) || window.top[0]?.location?.origin?.indexOf("20.199") > -1)) {
                    isShowNarBar.value = false;
                    localStorage.setItem(MutationTypes.LOCAL_IS_IFRAME, "1");
                    store.commit(MutationTypes.SET_IS_IFRAME, { flag: true });
                } else {
                    store.commit(MutationTypes.SET_IS_IFRAME, { flag: false });
                    localStorage.setItem(MutationTypes.LOCAL_IS_IFRAME, "0");
                }
            }
        });

        GetGradeClassTree().then((res: IGradeClassTreeResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.GRADE_CLASS_TREE_LIST, res.result);
            }
        });

        getTagList();

        queryUserInfo().then(success => {
            // 获取到用户信息, 开始配置全局监听器
            if (success) {
                isElectron() && window.electron.ipcRenderer.send("startSingalR", store.state.userInfo.id);
            }
        });

        const answerjection = (e: any, data: any) => {
            window.electron.ipcRenderer.invoke("answer-jection", data);
        };

        if (isElectron()) {
            window.electron.ipcRenderer.on("answer-jection", answerjection);
            window.electron.ipcRenderer.invoke("openSuspension");
            window.electron.maximizeWindow();
        }

        onMounted(() => {
            if (isElectron()) {
                import("../utils/checkDiskSpace/index").then((data) => {
                    data.default(window.electron.getPath("userData")).then((diskInfo) => {
                        const { free, size } = diskInfo;
                        if (free < size * 0.1) {
                            ElMessage.error({
                                message: "磁盘空间不足，请及时清理，以免影响使用",
                                duration: 5000
                            });
                        }
                    });
                });
            }
        });

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.off("answer-jection", answerjection);
            }
        });

        return {
            isElectron: isElectron(),
            isShowQuestion: computed(() => store.state.common.isShowQuestion),
            isIframe: computed(() => localStorage.getItem(MutationTypes.LOCAL_IS_IFRAME) === "1" || store.state.common.isIframe),
            isShowVideo: computed(() => store.state.common.isShowVideo),
            isShowNarBar,
            keepExcludeArr
        };
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;
}

.main-body {
    display: flex;
    flex: 1;
    overflow-y: auto;
    -webkit-app-region: no-drag;
}
</style>
