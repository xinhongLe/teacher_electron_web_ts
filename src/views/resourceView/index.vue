<template>
    <ResourceViewList />
</template>

<script lang="ts">
import { defineComponent, onActivated, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResourceViewList from "./resourceViewList.vue";

export default defineComponent({
    components: { ResourceViewList },
    setup() {
        const route = useRoute();
    }
});
</script>

<style lang="scss" scoped>


</style>
