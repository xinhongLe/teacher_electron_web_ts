<template>
    <router-view />
    <el-dialog
        v-model="isShowUpdate"
        title="更新下载"
        :show-close="false"
        :close-on-click-modal="false"
    >
        <div style="padding: 0 20px 20px">
            <el-progress
                :text-inside="true"
                :show-text="false"
                :stroke-width="20"
                :percentage="downloadPercent"
            ></el-progress>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { ElMessageBox } from "element-plus";
import isElectron from "is-electron";
import { defineComponent, ref } from "vue";
import { getOssPaths } from "./api";
import { set, STORAGE_TYPES } from "./utils/storage";
import type { Action } from "element-plus";
export default defineComponent({
    setup() {
        const isShowUpdate = ref(false);
        const downloadPercent = ref(0);

        getOssPaths().then((res) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.OSS_PATHS, res.result);
            }
        });

        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);

        if (isElectron() && !window.electron.isMac()) {
            window.electron.ipcRenderer.invoke("checkForUpdate");
            window.electron.ipcRenderer.on("updateMessage", (_, text) => {
                console.log(text);
            });

            window.electron.ipcRenderer.on(
                "downloadProgress",
                (_, progressObj) => {
                    downloadPercent.value = progressObj.percent || 0;
                }
            );

            window.electron.ipcRenderer.on("isUpdateNow", () => {
                ElMessageBox.alert("检测到有新的版本需要更新，是否需要更新？", "更新", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确认",
                    type: "warning",
                    showClose: false,
                    showCancelButton: true,
                    callback: (action: Action) => {
                        if (action === "confirm") {
                            isShowUpdate.value = true;
                            window.electron.ipcRenderer.invoke("isUpdateNow");
                        }
                    }
                });
            });
        }

        return {
            isShowUpdate,
            downloadPercent
        };
    }
});
</script>

<style lang="scss">
html,
body {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}

* {
    box-sizing: border-box;
    outline: none;
}

img {
    -webkit-user-drag: none;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
}
.el-message--warning{
    z-index: 9999999 !important;
}
</style>
