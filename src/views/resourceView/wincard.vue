<template>
    <div class="wincard-fixed">
        <div class="wincard-box">
            <IntelligenceClassroom :resourceId="wincardId" :resource="resource" :isSystem="isSystem" />
        </div>
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
const wincardId = computed(() => store.state.common.showResourceFullScreen[props.index].resource.id);
const isSystem = computed(() => store.state.common.showResourceFullScreen[props.index].resource.isSystem);
</script>

<style lang="scss" scoped>
.wincard-fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    .wincard-box {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
}
</style>
