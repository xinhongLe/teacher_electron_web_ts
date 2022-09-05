<template>
    <div>
        <component
            v-for="(item, index) in resourceList"
            :index="index"
            :key="item.resource.id"
            :is="viewComponents[item.component]"
            :resource="item.resource"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import ScreenViewFile from "./screenViewFile.vue";
import Wincard from "./wincard.vue";
import { useStore } from "@/store";

const viewComponents = {
    LookQuestion: LookQuestion,
    LookVideo: LookVideo,
    ScreenViewFile: ScreenViewFile,
    Wincard: Wincard,
};

const store = useStore();
const resourceList = computed(() => store.state.common.showResourceFullScreen);
watch(resourceList, () => {
    console.log(resourceList);
});
</script>
