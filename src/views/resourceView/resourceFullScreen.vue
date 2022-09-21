<template>
    <div>
        <component
            v-for="(item, index) in resourceList"
            :index="index"
            :key="item.resource.id"
            :is="viewComponents[item.component]"
            :lessonId="item.resource.lessonId"
            :fixed="true"
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
import AnswerMachine from "@/components/answerMachine/index.vue";
import { useStore } from "@/store";

const viewComponents = {
    LookQuestion: LookQuestion,
    LookVideo: LookVideo,
    ScreenViewFile: ScreenViewFile,
    Wincard: Wincard,
    AnswerMachine: AnswerMachine
};

const store = useStore();
const resourceList = computed(() => store.state.common.showResourceFullScreen);
watch(resourceList, () => {
    console.log(resourceList, "0000000---------------");
});
</script>
