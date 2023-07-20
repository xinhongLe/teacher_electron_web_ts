<template xmlns="">
    <router-view/>
    <UpdateDialog v-model:updateVisible="updateVisible" v-model:newVersionView="newVersionView"
                  :showUpdateInfo="showUpdateInfo"
                  :downloadPercent="downloadPercent" :ifShowCancelButton="ifShowCancelButton"
                  @downloadUpdate="downloadUpdate"></UpdateDialog>
</template>

<script lang="ts">
import isElectron from "is-electron";
import {defineComponent, ref, onMounted, onUnmounted} from "vue";
import {get, set, STORAGE_TYPES} from "./utils/storage";
import UpdateDialog from './components/updateDialog/index.vue';
import useUpdate from "./hooks/useUpdate";
import {ENV} from "./config";

const fs = require('fs');
const path = require('path');
const app = require('electron').remote.app;
export default defineComponent({
    setup() {
        const isShowUpdate = ref(false);
        const {
            updateVisible,
            downloadPercent,
            newVersionView,
            ifShowCancelButton,
            showUpdateInfo,
            getUpdateJson,
            downloadUpdate
        } = useUpdate();
        // 默认开启缓存
        set(STORAGE_TYPES.SET_ISCACHE, true);
        // 获取用户的选择是否选择的了取消更新
        const getUserChoice = () => {
            const filePath = path.join(app.getPath('userData'), 'userUpdateChoice.json');
            if (fs.existsSync(filePath)) { // 判断文件是否存在
                const data = fs.readFileSync(filePath, 'utf-8'); // 读取文件
                console.log('data', data)
                return data
            }
            return 'update';
        }

        if (isElectron() && !window.electron.isMac() && ENV !== "development") {
            // 检查选择
            const data = getUserChoice();
            // 取消更新则终止
            if (data === 'cancel') return;
            // 否则检查更新
            getUpdateJson();
        }
        ;

        return {
            isShowUpdate,
            newVersionView,
            updateVisible,
            ifShowCancelButton,
            showUpdateInfo,
            getUpdateJson,
            downloadUpdate,
            // handleUpdate,
            getUserChoice,
            downloadPercent
        };
    },
    components: {UpdateDialog},
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

.el-message--warning {
    z-index: 9999999 !important;
}


</style>
