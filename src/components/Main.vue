<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar"/>
        <div class="main-body">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import NavBar from "./navBar/index.vue";
import isElectron from "is-electron";
import { useRoute } from "vue-router";
import { MutationTypes, useStore } from "@/store";
import { GetBasicTag, GetGradeClassTree, LessonManager } from "@/views/login/api";
import { IBasicTagResponse, IGradeClassTreeResponse, ILessonManagerResponse } from "@/types/login";
import { set, STORAGE_TYPES } from "@/utils/storage";

export default defineComponent({
    components: {
        NavBar
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];
        watch(() => ({ query: route.query, name: route.name }), ({ query, name }) => {
            isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
        });

        GetGradeClassTree().then((res: IGradeClassTreeResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.GRADE_CLASS_TREE_LIST, res.result);
            }
        });

        GetBasicTag().then((res: IBasicTagResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.STUDENT_TAGS, res.result);
            }
        });

        LessonManager().then((res: ILessonManagerResponse) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.USER_INFO, res.result);
                store.commit(MutationTypes.UPDATE_USERINFO, { name: res.result.Name, account: res.result.Account, Schools: res.result.Schools });
            }
        });

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
