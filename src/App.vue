<template xmlns="">
    <router-view/>
    <UpdateDialog v-model:updateVisible="updateVisible" v-model:newVersionView="newVersionView"
                  :showUpdateInfo="showUpdateInfo"
                  :downloadPercent="downloadPercent" :ifShowCancelButton="ifShowCancelButton"
                  @downloadUpdate="downloadUpdate"></UpdateDialog>
</template>

<script lang="ts">
import isElectron from "is-electron";
import {defineComponent, ref} from "vue";
import {get, set, STORAGE_TYPES} from "./utils/storage";
import UpdateDialog from './components/updateDialog/index.vue';
import useUpdate from "./hooks/useUpdate";
import {ENV} from "@/config";

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

        // && ENV !== "development"
        if (isElectron() && !window.electron.isMac()) {
            getUpdateJson();
        }
        return {
            isShowUpdate,
            newVersionView,
            updateVisible,
            ifShowCancelButton,
            showUpdateInfo,
            getUpdateJson,
            downloadUpdate,
            // handleUpdate,
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
