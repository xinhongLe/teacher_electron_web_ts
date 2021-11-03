<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getOssPaths } from "./api";
import { set, STORAGE_TYPES } from "./utils/storage";

export default defineComponent({
    setup() {
        getOssPaths().then(res => {
            if (res.resultCode === 200) {
                set(STORAGE_TYPES.OSS_PATHS, res.result);
            }
        });
    }
});
</script>

<style lang="scss">
html,
body {
    margin: 0;
}

* {
    box-sizing: border-box;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
}
</style>
