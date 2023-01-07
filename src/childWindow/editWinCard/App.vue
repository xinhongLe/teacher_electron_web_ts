<template>
    <div class="main-container">
        <div class="main-body">
            <editWinCard v-if="windowinfos.id" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import isElectron from "is-electron";
import editWinCard from "../../views/preparation/intelligenceClassroom/edit/index.vue";
// router.push("/windowcard-edit")
import { computed, ref, watch, onMounted } from "vue";
import { MutationTypes, store } from "@/store";
const windowinfos: any = ref({});
console.log("editWinCard", editWinCard);
onMounted(() => {
    window.electron.ipcRenderer.on("sendStoreWindowInfo", (_, windowinfo) => {
        windowinfos.value = windowinfo;
        console.log(windowinfos.value, store);
        store.commit(MutationTypes.SET_EDIT_WINDOW_INFO, windowinfo);
    });
});
</script>

<style lang="scss" scoped>
.main-container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;
    .main-body {
        display: flex;
        flex: 1;
        overflow-y: auto;
        -webkit-app-region: no-drag;
    }
}
</style>
