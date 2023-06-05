<template>
    <div class="container">
        <!--        <webview v-if="isElectron" class="iframe" :src="url"></webview>-->
        <iframe
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            class="iframe"
        />
        <!--        v-else-->
    </div>
</template>

<script lang="ts">
import { get, STORAGE_TYPES } from "@/utils/storage";
import { defineComponent, onMounted, ref } from "vue";
import { PBL_WEB } from "@/config";
import isElectron from "is-electron";

// ts
export default defineComponent({
    name: "pblStudyWincard",
    setup() {
        const url = ref("");
        onMounted(() => {
            // token 令牌
            const token = get(STORAGE_TYPES.SET_TOKEN);
            const cardInfo = window.electron.store.get("openPreviewFile") as any;
            // webview地址
            url.value = cardInfo.url;
            console.log("urlurlurlurlurl", url.value);
            console.log("token", token);
        });
        return {
            url,
            isElectron: isElectron(),
        };
    },
});
</script>

<style lang="scss" scoped>
.container {
    flex: 1;
    height: 100%;

    .iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
