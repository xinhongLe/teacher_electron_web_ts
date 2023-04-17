<template>
    <div class="win-card-fixed">
        <intelligence-classroom :resourceId="winCardId" :resource="resource" :isSystem="isSystem"/>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "@/store";
import IntelligenceClassroom from "@/views/preparation/intelligenceClassroom/index.vue";

const store = useStore();
const props = defineProps({
    index: {
        type: Number,
        default: 0
    }
});
const resource = computed(() => store.state.common.showResourceFullScreen[props.index].resource);
const winCardId = computed(() => resource.value.id);
const isSystem = computed(() => resource.value.isSystem);
</script>

<style lang="scss" scoped>
.win-card-fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    display: flex;
    flex-direction: column;
}
</style>
