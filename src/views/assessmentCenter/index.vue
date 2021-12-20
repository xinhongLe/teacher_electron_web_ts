<template>
    <div class="container">
        <webview v-if="isElectron" class="iframe" src="http://1.15.4.131/"></webview>
        <iframe src="http://1.15.4.131/" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" class="iframe" v-else/>
    </div>
</template>

<script lang="ts">
import isElectron from "is-electron";
import { defineComponent } from "vue";

export default defineComponent(({
    name: "assessmentCenter",
    setup() {
        return {
            isElectron: isElectron()
        };
    }
}));
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    .iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
