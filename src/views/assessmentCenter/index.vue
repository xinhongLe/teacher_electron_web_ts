<template>
    <div class="container">
        <iframe src="http://1.15.4.131/" class="iframe"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent(({
    name: "assessmentCenter"
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
