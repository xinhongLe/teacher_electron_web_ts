<template>
    <div class="container">
        <webview v-if="isElectron" class="iframe" :src="url"></webview>
        <iframe :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            class="iframe" v-else />
    </div>
</template>

<script lang="ts">
import { get, STORAGE_TYPES } from "@/utils/storage";
import isElectron from "is-electron";
import { defineComponent } from "vue";
import usePageEvent from '@/hooks/usePageEvent'
// ts
export default defineComponent({
    name: "assessmentCenter",
    setup() {
        //埋点需求
        usePageEvent('page', '评测中心')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.onmessage = (e: any, d: any) => {
            if (isElectron()) return;
            if (e.data.url && e.data.download) {
                location.href = e.data.url;
            }
        };
        const token = get(STORAGE_TYPES.SET_TOKEN);
        const url = `http://tiku.leyixue.net/?time=${new Date().getTime()}&s=Homepc&m=SyncUser&a=index&token=${token}`;
        return {
            url,
            isElectron: isElectron()
        };
    }
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
