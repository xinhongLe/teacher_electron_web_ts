<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar"/>
        <Suspension />
        <div class="main-body">
            <keep-alive v-if="$route.meta.keepAlive">
                <router-view></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import NavBar from "./navBar/index.vue";
import Suspension from "./suspension/index.vue";
import isElectron from "is-electron";
import { useRoute } from "vue-router";
import { GetGradeClassTree } from "@/views/login/api";
import { IGradeClassTreeResponse } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";
import useUserInfo from "@/hooks/useUserInfo";
import useTagList from "@/hooks/useTagList";

export default defineComponent({
    components: {
        NavBar,
        Suspension
    },
    setup() {
        const route = useRoute();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];
        const { queryUserInfo } = useUserInfo();
        const { getTagList } = useTagList();

        watch(() => ({ query: route.query, name: route.name }), ({ query, name }) => {
            isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
        });

        GetGradeClassTree().then((res: IGradeClassTreeResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.GRADE_CLASS_TREE_LIST, res.result);
            }
        });

        getTagList();

        queryUserInfo();

        return {
            isElectron: isElectron(),
            isShowNarBar
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
    flex: 1;
    overflow-y: auto;
}
</style>
