<template>
    <div>
        <component
            :index="index"
            :fixed="true"
            :key="item.resource.id"
            :resource="item.resource"
            :lessonId="item.resource.lessonId"
            :is="viewComponents[item.component]"
            v-for="(item, index) in resourceList"
        />

        <component
            v-if="questionResource"
            :resource="questionResource.resource"
            :is="viewComponents[questionResource.component]"
            :activeWindow="questionResource && activeWindow === questionResource.component"
        />

        <component
            v-if="videoResource"
            :resource="videoResource.resource"
            :is="viewComponents[videoResource.component]"
            :activeWindow="videoResource && activeWindow === videoResource.component"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import WinCard from "./wincard.vue";
import ScreenViewFile from "./screenViewFile.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import AnswerMachine from "@/components/answerMachine/index.vue";

const viewComponents = {
    WinCard,
    LookVideo,
    LookQuestion,
    AnswerMachine,
    ScreenViewFile
};

const store = useStore();
const activeWindow = computed(() => store.state.common.activeWindow);
const resourceList = computed(() => store.state.common.showResourceFullScreen);
const videoResource = computed(() => store.state.common.singleResourceFullScreen.video);
const questionResource = computed(() => store.state.common.singleResourceFullScreen.question);
</script>
