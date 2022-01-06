<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar"/>
        <Suspension v-if="!isElectron"/>
        <LookQuestion v-if="isShowQuestion"/>
        <LookVideo v-if="isShowVideo"/>
        <Projection/>
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
import { computed, defineComponent, ref, watch, onUnmounted } from "vue";
import NavBar from "./navBar/index.vue";
import Suspension from "./suspension/index.vue";
import isElectron from "is-electron";
import { useRoute } from "vue-router";
import { GetGradeClassTree } from "@/views/login/api";
import { IGradeClassTreeResponse } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useUserInfo from "@/hooks/useUserInfo";
import useTagList from "@/hooks/useTagList";
import LookQuestion from "./lookQuestion/index.vue";
import { store } from "@/store";
import LookVideo from "./lookVideo/index.vue";
import Projection from "./projection/index.vue";

export default defineComponent({
    components: {
        NavBar,
        Suspension,
        LookQuestion,
        LookVideo,
        Projection
    },
    setup() {
        const route = useRoute();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];
        const { queryUserInfo } = useUserInfo();
        const { getTagList } = useTagList();
        const keepExcludeArr = ["Home", "LabelManage", "Record", "Edit", "AssignHomework", "CheckHomework", "preparationGroup", "preparationEdit"];

        watch(() => ({ query: route.query, name: route.name }), ({ query, name }) => {
            isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
            // 岳阳云平台内嵌备教端，隐藏头部
            if (window.top && window.top[0] && window.top[0].location && window.top[0].location.origin && (window.top[0].location.origin.indexOf("yueyangyun") > -1 || window.top[0].location.origin.indexOf("20.199") > -1)) {
                isShowNarBar.value = false;
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

        const projection = (e: any, data: any) => {
            console.log(data);
        };

        if (isElectron()) {
            window.electron.ipcRenderer.on("singalRData-Projection", projection);
            window.electron.ipcRenderer.invoke("openSuspension");
            window.electron.maximizeWindow();
        }

        onUnmounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.off("singalRData-Projection", projection);
            }
        });

        return {
            isElectron: isElectron(),
            isShowQuestion: computed(() => store.state.common.isShowQuestion),
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
}

.main-body {
    display: flex;
    flex: 1;
    overflow-y: auto;
}
</style>
