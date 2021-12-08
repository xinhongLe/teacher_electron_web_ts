<template>
    <div class="main">
        <Suspension />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Suspension from "@/components/suspension/index.vue";
export default defineComponent({
    setup() {
        return {};
    },
    components: { Suspension }
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
    cursor: pointer;
}
</style>
