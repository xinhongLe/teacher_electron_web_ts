<template>
    <div class="resource-view">
        <IntelligenceClassroom
            v-if="type === 1"
            :resourceId="target"
        />
        <LookVideo v-if="type === 2" :dialog="true" />
        <LookQuestion v-if="type === 3" :dialog="true" />
    </div>
</template>

<script lang="ts">
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import { defineComponent, provide, ref, watch } from "vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import LookQuestion from "@/components/lookQuestion/index.vue";

export default defineComponent({
    components: { IntelligenceClassroom, LookVideo, LookQuestion },
    props: {
        target: {
            type: String,
            default: ""
        },
        type: {
            type: Number
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        provide(windowInfoKey, useWindowInfo());
        return {
        };
    }
});
</script>

<style lang="scss" scoped>
.resource-view {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>
