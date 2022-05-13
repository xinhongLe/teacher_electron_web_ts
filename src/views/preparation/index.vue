<template>
    <div class="preparation">
        <LeftMenu v-model:showClassArrangement="showClassArrangement" />
        <div class="content-wrapper" v-if="!showClassArrangement">
            <Head />
            <Resources />
        </div>
        <div class="content-wrapper" v-else>
            <ClassArrangement />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import LeftMenu from "./layout/leftMenu.vue";
import Head from "./layout/head.vue";
import Resources from "./layout/resources.vue";
import ClassArrangement from "./classArrangement/index.vue";
export default defineComponent({
    name: "Preparation",
    setup() {
        const showClassArrangement = ref(false);
        return {
            showClassArrangement
        };
    },
    components: {
        LeftMenu,
        Head,
        Resources,
        ClassArrangement
    }
});
</script>

<style lang="scss" scoped>
.preparation {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 0;
    min-height: 0;
    background-color: #F5F6FA;
    .content-wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        min-width: 0;
        background-color: #F5F6FA;
    }
}
</style>
