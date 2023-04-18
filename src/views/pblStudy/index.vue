<template>
    <div class="container">
        <webview v-if="isElectron" class="iframe" :src="url"></webview>
        <iframe
            :src="url"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            class="iframe"
            v-else
        />
    </div>
</template>

<script lang="ts">
import {get, STORAGE_TYPES} from "@/utils/storage";
import {defineComponent} from "vue";
import {PBL_WEB} from "@/config";
import isElectron from "is-electron";
// ts
export default defineComponent({
    name: "pblStudy",
    setup() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.onmessage = (e: any, d: any) => {
            // console.log(e);
            if (e.data.url && e.data.download) {
                location.href = e.data.url;
            }
        };
        //token 令牌
        const token = get(STORAGE_TYPES.SET_TOKEN);
        //webview地址
        const url = `${PBL_WEB}/home?token=${token}`;
        // console.log('url----', url);
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
