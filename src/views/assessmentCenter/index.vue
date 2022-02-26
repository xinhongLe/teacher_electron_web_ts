<template>
    <div class="container">
        <webview
            v-if="isElectron"
            class="iframe"
            :src="url"
        ></webview>
        <iframe
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            class="iframe"
            v-else
        />
    </div>
</template>

<script lang="ts">
import isElectron from "is-electron";
import { defineComponent } from "vue";
// ts
export default defineComponent({
    name: "assessmentCenter",
    setup() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.onmessage = (e: any, d: any) => {
            if (isElectron()) return;
            if (e.data.url && e.data.download) {
                location.href = e.data.url;
            }
        };
        const url = `http://tiku.leyixue.net/?time=${new Date().getTime()}`;
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
