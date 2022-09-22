<template>
    <router-view />
    <el-dialog
        v-model="updateVisible"
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
    <el-dialog v-model="newVersionView"  width="400px" center custom-class="versionView" :show-close="false" :close-on-click-modal="false">
       <div class="content">
           <img class="update-img" src="/img/pic_update@2x.png" alt="">
           <div class="title">检测到有新的版本</div>
           <div class="info-list">
               <div v-for="(item, index) in showUpdateInfo" :key="index">
                   <div class="info">
                       <span> {{item}}</span>
                   </div>
               </div>
           </div>
       </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button style="width: 40%" v-if="ifShowCancelButton" @click="newVersionView = false">取消</el-button>
            <el-button style="width: 40%" type="primary" @click="handleUpdate">更新</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import isElectron from "is-electron";
import { defineComponent, ref } from "vue";
import { getOssPaths } from "./api";
import { get, set, STORAGE_TYPES } from "./utils/storage";
import useUpdate from "./hooks/useUpdate";
import { ENV } from "@/config";
export default defineComponent({
    setup() {
        const isShowUpdate = ref(false);
        const { updateVisible, downloadPercent, newVersionView, ifShowCancelButton, showUpdateInfo, getUpdateJson } = useUpdate();

        const handleUpdate = () => {
            newVersionView.value = false;
            updateVisible.value = true;
            window.electron.ipcRenderer.invoke("isUpdateNow");
        };

        getOssPaths().then((res) => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.OSS_PATHS, res.result);
            }
        });

        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);

        if (isElectron() && !window.electron.isMac() && ENV !== "development") {
            getUpdateJson();
            window.electron.ipcRenderer.invoke("checkForUpdate");
            window.electron.ipcRenderer.on("updateMessage", (_, text) => {
            });

            window.electron.ipcRenderer.on("downloadProgress", (_, progressObj) => {
                downloadPercent.value = progressObj.percent || 0;
            }
            );

            window.electron.ipcRenderer.on("isUpdateNow", () => {
                newVersionView.value = true;
            });
        }

        if (isElectron()) {
            (window as any).electron.registerEscKeyUp(() => {
                if (!(window as any).electron.isFullScreen()) return;
                (window as any).electron.minimizeWindow();
            });
        }

        return {
            isShowUpdate,
            newVersionView,
            updateVisible,
            ifShowCancelButton,
            showUpdateInfo,
            getUpdateJson,
            handleUpdate,
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
.versionView{
    .content{
        max-height: 600px;
        overflow-y: auto;
        .update-img{
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            top: -60px;
            width: 180px;
            height: 130px;
        }
        .info-list {
            height: 195px;
            overflow: overlay;
        }
        .title{
            font-size: 22px;
            font-weight: 600;
            color: #1C2340;
            text-align: center;
            letter-spacing: 2px;
            margin: 30px 0;
        }
        .info{
            font-size: 20px;
            color: #99A2AD;
            margin-bottom: 14px;
            line-height: 24px;
        }
    }
    .dialog-footer{
        .el-button{
            height: 40px;
        }
        .el-button--primary {
            background: #4b71ee;
            border: #4b71ee;
        }
    }
}
</style>
