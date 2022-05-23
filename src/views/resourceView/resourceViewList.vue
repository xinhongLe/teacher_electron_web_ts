<template>
    <div class="resource-view">
        <IntelligenceClassroom
            :selectLessonId="'39FDF8A4E10242B4349A9F81C5E69B92'"
        />
    </div>
</template>

<script lang="ts">
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import { defineComponent, provide, ref, watch } from "vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";

export default defineComponent({
    components: { IntelligenceClassroom },
    props: {
        target: {
            type: String,
            default: ""
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
