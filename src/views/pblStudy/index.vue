<template>
    <div class="container">
        <!--        <webview v-if="isElectron" class="iframe" :src="url"></webview>-->
        <iframe
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation allow-downloads"
            class="iframe"
            id="pblStudy"
        />
        <!--        v-else-->
    </div>
</template>

<script lang="ts">
import { get, STORAGE_TYPES } from "@/utils/storage";
import { defineComponent, onActivated, ref, onDeactivated } from "vue";
import { PBL_WEB, systemId } from "@/config";
import isElectron from "is-electron";

// ts
export default defineComponent({
    name: "pblStudy",
    setup() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const url = ref("");
        const messageType: {[key: string] : string} = {
            openWinCard: "openWinCard",
            openPblWincardLesson: "openPblWincardLesson",
            openPreviewFile: "openPreviewFile"
        };

        const openPblWinCard = (name: any, type: string) => {
            if (isElectron()) {
                return window.electron.ipcRenderer.invoke(type, name);
            }
        };

        const openWinCard = (e: any) => {
            const iframe = document.getElementById("pblStudy") as HTMLIFrameElement;
            // 通过origin对消息进行过滤，避免遭到XSS攻击
            if (e.source === iframe.contentWindow) {
                const type = messageType[e.data.type as string];
                if (!type) return;

                window.electron.store.set(type as string, {
                    ...e.data.data
                });
                openPblWinCard("pbl窗卡页", type);
            }
        };
        const closePblWincard = (_: any, data: string) => {
            console.log("监听closePblWincardLesson");
            const iframe = document.getElementById("pblStudy") as HTMLIFrameElement;
            iframe?.contentWindow?.postMessage({
                type: data
            }, PBL_WEB as string);
        };

        onActivated(() => {
            // token 令牌
            const token = get(STORAGE_TYPES.SET_TOKEN);
            // webview地址
            url.value = `${PBL_WEB}/home?token=${token}&platformID=${systemId}`;
            // url.value = `http://localhost:8081/home?token=${token}&platformID=${systemId}`;

            window.addEventListener("message", openWinCard, false);

            window.electron.ipcRenderer.on("closePblWincard", closePblWincard);
        });

        onDeactivated(() => {
            window.removeEventListener("message", openWinCard);
            window.electron.ipcRenderer.off("closePblWincard", closePblWincard);
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
