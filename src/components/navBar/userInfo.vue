<script lang="ts" setup>
import { store } from "@/store";
import Feedback from "../feedback/index.vue";
import { computed, defineAsyncComponent, ref } from "vue";
import isElectron from "is-electron";
import useOutLogin from "@/hooks/useOutLogin";

const ClearCacheDialog = defineAsyncComponent(() => import("./clearCacheDialog.vue"));
const AutoClearCache = defineAsyncComponent(() => import("./autoClearCache.vue"));

const feedbackRef = ref<InstanceType<typeof Feedback>>();
const account = computed(() => store.state.userInfo.account);
const name = computed(() => store.state.userInfo.name);
const showCacheDialog = ref(false);

const showFeedBack = () => {
    feedbackRef!.value!.show();
};

const useLogout = () => {
    useOutLogin();
    isElectron() && window.electron.ipcRenderer.send("stopSingalR");
};
</script>

<template>
    <div class="userInfo">
        <el-dropdown
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
        >
            <div class="avatar-wrapper">
                <img src="./img/avator_small.svg"/>
                <span class="name">{{ name }}</span>
                <i class="el-icon-caret-bottom icon" />
            </div>
            <template #dropdown>
                <el-dropdown-menu style="text-align: center">
                    <el-dropdown-item>
                        <div
                            style="
                                display: flex;
                                height: 43px;
                                width: 120px;
                                justify-content: space-around;
                            "
                        >
                            <div style="display: flex">
                                <img
                                    style="width: 43px"
                                    src="@/assets/indexImages/touxiang.png"
                                    class="user-avatar"
                                />
                            </div>
                            <div style="margin-left: 10px">
                                <p
                                    style="
                                        height: 20px;
                                        line-height: 20px;
                                        text-align: left;
                                    "
                                >
                                    {{ name }}
                                </p>
                                <p style="height: 20px; line-height: 20px">
                                    {{ account }}
                                </p>
                            </div>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <span @click="showFeedBack" style="display: block"
                            >问题反馈</span
                        >
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isElectron()">
                        <span
                            @click="showCacheDialog = true"
                            style="display: block"
                            >清理缓存</span
                        >
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="useLogout" style="display: block"
                            >退出登录</span
                        >
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    <Feedback ref="feedbackRef"/>
    <Suspense v-if="isElectron()">
            <ClearCacheDialog v-if="showCacheDialog" v-model:showCacheDialog="showCacheDialog" />
        </Suspense>
        <Suspense v-if="isElectron()">
            <AutoClearCache/>
        </Suspense>
</template>

<style lang="scss" scoped>
.userInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;
}
.avatar-wrapper {
    display: flex;
    align-items: center;
    .name {
        margin: 0 8px;
        font-size: 14px;
        color: #fff;
        text-align: center
    }
    .icon {
        color: #fff;
    }
}
</style>
