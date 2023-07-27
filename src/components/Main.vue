<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar && !isIframe"/>
        <Suspension v-if="!isElectron && !isIframe"/>
        <ResourceFullScreen/>
        <Projection/>
        <Suspense v-if="isElectron">
            <VideoProjection/>
        </Suspense>
        <div class="main-body">
            <router-view v-slot="{ Component }">
                <keep-alive :exclude="keepExcludeArr">
                    <component :is="Component"/>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts">
import isElectron from "is-electron";
import { useRoute } from "vue-router";
import NavBar from "./navBar/index.vue";
import { ElMessage } from "element-plus";
import useTagList from "@/hooks/useTagList";
import { MutationTypes, store } from "@/store";
import Projection from "./projection/index.vue";
import { set, STORAGE_TYPES } from "@/utils/storage";
import { GetGradeClassTree } from "@/api/login";
import { IGradeClassTreeResponse } from "@/types/login";
import ResourceFullScreen from "@/views/resourceView/resourceFullScreen.vue";
import { computed, defineComponent, defineAsyncComponent, ref, watch, onUnmounted, onMounted } from "vue";

export default defineComponent({
    components: {
        NavBar,
        Projection,
        ResourceFullScreen,
        Suspension: defineAsyncComponent(() => import("./suspension/index.vue")),
        VideoProjection: defineAsyncComponent(() => import("./videoProjection/index.vue"))
    },
    setup() {
        const route = useRoute();
        const { getTagList } = useTagList();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];

        const keepExcludeArr = [
            "LabelManage",
            "Record",
            "Edit",
            "AssignHomework",
            "CheckHomework",
            "preparationGroup",
            "preparationEdit",
            "AttendClass",
            "Composition"
        ];

        watch(
            () => ({ query: route.query, name: route.name }),
            ({ query, name }) => {
                isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
                // 岳阳云平台内嵌备教端
                if (name !== "集体备课") return;

                const location = window.top[0]?.location || {};
                if (window?.top && (location.origin?.includes("yueyangyun") || location.ancestorOrigins[0]?.includes("yueyangyun") || location.origin?.includes("localhost"))) {
                    isShowNarBar.value = false;
                    localStorage.setItem(MutationTypes.LOCAL_IS_IFRAME, "1");
                    store.commit(MutationTypes.SET_IS_IFRAME, { flag: true });
                } else {
                    store.commit(MutationTypes.SET_IS_IFRAME, { flag: false });
                    localStorage.setItem(MutationTypes.LOCAL_IS_IFRAME, "0");
                }
            }
        );

        GetGradeClassTree().then((res: IGradeClassTreeResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.GRADE_CLASS_TREE_LIST, res.result);
            }
        });

        getTagList();

        const answerjection = (e: any, data: any) => {
            window.electron.ipcRenderer.invoke("answer-jection", data);
        };

        if (isElectron()) {
            window.electron.ipcRenderer.on("answer-jection", answerjection);
            window.electron.ipcRenderer.invoke("openSuspension");
        }

        onMounted(() => {
            if (!isElectron()) return;

            import("../utils/checkDiskSpace/index").then((data) => {
                data.default(window.electron.getPath("userData")).then(
                    (diskInfo) => {
                        const { free, size } = diskInfo;
                        if (free < size * 0.1) {
                            ElMessage.error({
                                message: "磁盘空间不足，请及时清理，以免影响使用",
                                duration: 5000
                            });
                        }
                    }
                );
            });
        });

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.off("answer-jection", answerjection);
            }
        });

        return {
            isShowNarBar,
            keepExcludeArr,
            isElectron: isElectron(),
            isIframe: computed(() => localStorage.getItem(MutationTypes.LOCAL_IS_IFRAME) === "1")
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
