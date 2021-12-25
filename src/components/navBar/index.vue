<template>
    <div class="c-header">
        <div class="tab-box">
            <div
                class="tab-item"
                v-for="(item, index) in breadList"
                :key="index"
                :class="item.name === $route.name && 'active'"
                @click="go(item)"
            >
                <font style="margin-right: 10px">{{ item.name }}</font>
                <i
                    class="el-icon-close"
                    v-if="
                        item.name !== '首页' &&
                        item.name !== '备课'
                    "
                    @click.stop="closeTab(item)"
                ></i>
            </div>
            <div class="userInfo">
                <el-dropdown
                    class="avatar-container right-menu-item hover-effect"
                    trigger="click"
                >
                    <div class="avatar-wrapper">
                        <span>{{
                            name
                        }}</span>
                        <i
                            style="margin-left: 10px"
                            class="el-icon-caret-bottom"
                        />
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu
                            style="text-align: center"
                        >
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
                            <el-dropdown-item>
                                <span @click="outlogin" style="display: block"
                                    >退出登录</span
                                >
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="header-window-control">
            <div class="hwc-minimize" @click="useMinimizeWindow()"></div>
            <div class="hwc-maximize" @click="useMaximizeWindow()"></div>
            <div class="hwc-close"  v-if="isElectron()" @click="close">
                <i class="el-icon-close"></i>
            </div>
        </div>
        <Feedback ref="feedbackRef"/>
        <ExitDialog v-model:visible="visible"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import useMaximizeWindow from "../../hooks/useMaximizeWindow";
import useMinimizeWindow from "../../hooks/useMinimizeWindow";
import isElectron from "is-electron";
import { useRoute, useRouter } from "vue-router";
import useBreadList from "./useBreadList";
import { Bread } from "./interface";
import useOutLogin from "@/hooks/useOutLogin";
import { store } from "@/store";
import Feedback from "../feedback/index.vue";
import ExitDialog from "./ExitDialog.vue";

export default defineComponent({
    name: "NavBar",
    components: {
        Feedback,
        ExitDialog
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { breadList, closeTab } = useBreadList();
        const account = computed(() => store.state.userInfo.account);
        const name = computed(() => store.state.userInfo.name);
        const feedbackRef = ref<InstanceType<typeof Feedback>>();
        const visible = ref(false);

        const showFeedBack = () => {
            feedbackRef!.value!.show();
        };

        const go = (item: Bread) => {
            if (route.name !== item.name) {
                router.push(item.path);
            }
        };

        const close = () => {
            visible.value = true;
        };

        onMounted(() => {
            if (isElectron()) {
                window.electron.ipcRenderer.on("exitApp", () => {
                    visible.value = true;
                });
            }
        });

        const useLogout = () => {
            useOutLogin();
            isElectron() && window.electron.ipcRenderer.send("stopSingalR");
        }

        return {
            isElectron,
            breadList,
            account,
            name,
            go,
            feedbackRef,
            outlogin: useLogout,
            closeTab,
            showFeedBack,
            close,
            visible,
            useMinimizeWindow,
            useMaximizeWindow
        };
    }
});
</script>

<style lang="scss" scoped>
.c-header {
    height: 55px;
    background-color: #1a1d3e;
    padding: 0 10px;
    display: flex;
    -webkit-app-region: drag;
    overflow: hidden;
}
.userInfo {
    position: fixed;
    top: 14px;
    right: 150px;
    background: #ffffff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 124px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-app-region: no-drag;
}
.tab-box {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding-top: 10px;
    white-space: nowrap;
    display: flex;
}

.tab-item {
    display: flex;
    margin-right: 10px;
    padding: 11px 20px;
    background-color: #313451;
    color: #aeb1bb;
    font-size: 16px;
    align-items: center;
    justify-content: space-between;
    line-height: 25px;
    min-width: 140px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    position: relative;
    -webkit-app-region: no-drag;
}

.tab-item i {
    font-size: 18px;
}

.tab-item.active {
    background-color: #ffffff;
    color: #1d2040;
}

.header-window-control {
    display: flex;
    width: 100px;
    align-items: center;
    justify-content: space-around;
    /* padding-bottom: 10px; */
    -webkit-app-region: no-drag;
}

.hwc-minimize,
.hwc-maximize,
.hwc-close {
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.hwc-minimize:before {
    content: "";
    display: block;
    width: 14px;
    border-radius: 3px;
    border: 1px solid #8c8f9f;
}

.hwc-maximize:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 3px;
    border: 2px solid #8c8f9f;
}

.hwc-close i {
    font-size: 20px;
    color: #8c8f9f;
    font-weight: 600;
}

.avatar-wrapper span {
    font-size: 18px;
    text-align: center
}
</style>
