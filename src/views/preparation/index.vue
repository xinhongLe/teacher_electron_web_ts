<template>
    <div class="preparation">
        <LeftMenu v-model:showClassArrangement="showClassArrangement" v-model:course="course" />
        <div class="content-wrapper" v-show="!showClassArrangement">

            <Head :course="course" v-model:source="source" v-model:type="type" />
            <Resources :course="course" :source="source" :type="type" />
        </div>
        <div class="content-wrapper" v-if="showClassArrangement">
            <ClassArrangement />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref, onActivated, onDeactivated } from "vue";
import LeftMenu from "./layout/leftMenu.vue";
import Head from "./layout/head.vue";
import Resources from "./layout/resources.vue";
import ClassArrangement from "./classArrangement/index.vue";
import usePageEvent from '@/hooks/usePageEvent';
export default defineComponent({
    name: "Preparation",
    setup() {
        //埋点需求
        usePageEvent('page','备课')
        const showClassArrangement = ref(false);
        const course = ref({
            chapterId: "",
            lessonId: "",
            lessonName: ""
        });
        const source = ref("");
        const type = ref("");
        return {
            course,
            showClassArrangement,
            source,
            type
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
