<template>
    <div class="main-container">
        <NavBar v-if="isShowNarBar"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import NavBar from "./navBar/index.vue";
import isElectron from "is-electron";
import { useRoute } from "vue-router";

export default defineComponent({
    components: {
        NavBar
    },
    setup() {
        const route = useRoute();
        const isShowNarBar = ref(true);
        const wpfNames = ["wpf班级管理", "wpf管理标签", "wpf学习记录"];
        watch(() => ({ query: route.query, name: route.name }), ({ query, name }) => {
            isShowNarBar.value = !query.head && !wpfNames.includes(name as string);
        });

        return {
            isElectron: isElectron(),
            isShowNarBar
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
