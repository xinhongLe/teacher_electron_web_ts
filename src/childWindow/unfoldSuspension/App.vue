<template>
    <div class="main">
        <Helper />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Helper from "@/components/suspension/helper.vue";
export default defineComponent({
    setup() {
        return {};
    },
    components: { Helper }
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
