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

        const openPblWinCard = (name: any, type: string) => {
            if (isElectron()) {
                const typeObj: { [key: string]: string } = {
                    openWinCard: "openPblWinCardWin",
                    openPblWincardLesson: "openPblWinCardWinLesson",
                    openPreviewFile: "openPreviewFile"
                };
                return window.electron.ipcRenderer.invoke(typeObj[type], name);
            }
        };

        const openWinCard = (e: any) => {
            const iframe = document.getElementById(
                "pblStudy"
            ) as HTMLIFrameElement;
            // 通过origin对消息进行过滤，避免遭到XSS攻击
            console.log("e", e);
            if (
                e.source === iframe.contentWindow &&
                e.data.type === "openWinCard"
            ) {
                window.electron.store.set("windowPblInfo", {
                    ...e.data.data,
                });
                openPblWinCard("pbl窗卡页编辑", e.data.type);
            }
        };

        const openWinCardLesson = (e: any) => {
            const iframe = document.getElementById(
                "pblStudy"
            ) as HTMLIFrameElement;
            // 通过origin对消息进行过滤，避免遭到XSS攻击
            console.log("e", e);
            if (
                e.source === iframe.contentWindow &&
                e.data.type === "openPblWincardLesson"
            ) {
                window.electron.store.set("windowPblInfoLesson", {
                    ...e.data.data
                });
                openPblWinCard("窗卡页预览", e.data.type);
            }
        };

        const openPreviewFile = (e: any) => {
            const iframe = document.getElementById(
                "pblStudy"
            ) as HTMLIFrameElement;
            // 通过origin对消息进行过滤，避免遭到XSS攻击
            if (
                e.source === iframe.contentWindow &&
                e.data.type === "openPreviewFile"
            ) {
                window.electron.store.set("windowPblInfoPreview", {
                    ...e.data.data
                });
                openPblWinCard("文件预览", e.data.type);
            }
        };
        onActivated(() => {
            // token 令牌
            const token = get(STORAGE_TYPES.SET_TOKEN);
            // webview地址
            url.value = `${PBL_WEB}/home?token=${token}&platformID=${systemId}`;
            // url.value = `http://localhost:8081/home?token=${token}&platformID=${systemId}`;
            console.log("urlurlurlurlurl", url.value);
            console.log("token", token);

            window.addEventListener("message", openWinCard, false);
            window.addEventListener("message", openWinCardLesson, false);
            window.addEventListener("message", openPreviewFile, false);
        });

        onDeactivated(() => {
            window.removeEventListener("message", openWinCard);
            window.removeEventListener("message", openWinCardLesson);
            window.removeEventListener("message", openPreviewFile);
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
