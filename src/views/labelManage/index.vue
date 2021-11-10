<template>
    <div class="my-student">
        <Head v-model:canEdit="canEdit"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Head from "./head/index.vue";
export default defineComponent({
    setup() {
        const canEdit = ref(false);

        return {
            canEdit
        };
    },
    components: { Head }
});
</script>

<style lang="scss" scoped>
.my-student {
    display: flex;
    height: 100%;
    flex-direction: column;
}
</style>
