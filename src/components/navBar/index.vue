<template>
    <div class="c-header">
        <div class="tab-list">
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
                    v-if="item.name !== '首页' && item.name !== '备课'"
                    @click.stop="closeTab(item)"
                ></i>
            </div>
        </div>
        <div class="header-right">
            <div class="help-warp" @click="openHelp">
                <img src="./img/icon_help.svg" class="help-icon"/>
                <span>帮助中心</span>
            </div>
            <UserInfo />
            <span class="line"></span>
            <div class="header-window-control">
                <div class="hwc-minimize" @click="useMinimizeWindow()"></div>
                <div class="hwc-maximize" @click="useMaximizeWindow()"></div>
                <div class="hwc-close" v-if="isElectron()" @click="close">
                    <i class="el-icon-close"></i>
                </div>
            </div>
        </div>
        <ExitDialog v-model:visible="visible" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import useMaximizeWindow from "../../hooks/useMaximizeWindow";
import useMinimizeWindow from "../../hooks/useMinimizeWindow";
import isElectron from "is-electron";
import { useRoute, useRouter } from "vue-router";
import useBreadList from "./hooks/useBreadList";
import { Bread } from "./interface";
import ExitDialog from "./ExitDialog.vue";
import UserInfo from "./userInfo.vue";

export default defineComponent({
    name: "NavBar",
    components: {
        ExitDialog,
        UserInfo
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { breadList, closeTab } = useBreadList();
        const visible = ref(false);

        const go = (item: Bread) => {
            if (route.name !== item.name) {
                router.push(item.path);
            }
        };

        const openHelp = () => {
            const helpUrl = "https://doc.lyx-edu.com/project-4/";
            if (isElectron()) {
                window.electron.shell.openExternal(helpUrl);
            } else {
                window.open(helpUrl);
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

        return {
            isElectron,
            breadList,
            go,
            closeTab,
            close,
            visible,
            useMinimizeWindow,
            openHelp,
            useMaximizeWindow
        };
    }
});
</script>

<style lang="scss" scoped>
.c-header {
    height: 48px;
    background-color: var(--app-color-dark);
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    -webkit-app-region: drag;
    overflow: hidden;
    .tab-list {
        display: flex;
        align-items: flex-end;
        overflow-x: overlay;
        -webkit-app-region: no-drag;
    }
    .header-right {
        display: flex;
        flex-shrink: 0;
        .help-warp {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #ffffff;
            margin-right: 40px;
            cursor: pointer;
            -webkit-app-region: no-drag;
            .help-icon {
                margin-right: 6px;
            }
        }
        .line {
            align-self: center;
            width: 1px;
            background-color: rgba(216, 216, 216, 0.2);
            height: 24px;
            margin: 0 32px;
        }
    }
}

.tab-item {
    display: flex;
    margin-right: 10px;
    padding: 0 20px;
    background-color: #313451;
    color: #aeb1bb;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    height: 40px;
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
    color: #202124;
}

.header-window-control {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
}

.hwc-minimize,
.hwc-maximize,
.hwc-close {
    height: 24px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.hwc-close {
    margin-right: 0;
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
    text-align: center;
}
</style>
