<template>
    <div class="main">
        <Setting v-if="!isStart" v-model="teamNum" @start="onStart" />

        <Competition :teamNum="teamNum" @expand="openCompetitionExpand" v-else />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Setting from "./setting.vue";
import Competition from "./competition.vue";
export default defineComponent({
    components: { Setting, Competition },
    setup() {
        const isStart = ref(false);

        const teamNum = ref(4);

        const onStart = () => {
            isStart.value = true;
        };

        const openCompetitionExpand = () => {
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            // const width = size.width > 800 ? 800 : size.width;
            // const height = size.height > 600 ? 600 : size.height;
            window.electron.setContentSize(size.width - 100, size.height - 100);
            window.electron.setCenter();
        };

        return {
            teamNum,
            isStart,
            onStart,
            openCompetitionExpand
        };
    }
});
</script>

<style lang="scss">
html {
    font-size: 10px;
}
body {
    margin: 0;
    user-select: none;
    overflow: hidden;
}
.main {
    position: relative;
    height: 100vh;
    width: 100vw;
}
</style>
