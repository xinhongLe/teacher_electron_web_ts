<template>
    <div class="preparation">
        <Head
            v-model:tabIndex="tabIndex"
        />
        <div class="content-wrapper">
            <keep-alive>
                <ScheduleManagement v-if="tabIndex === 0"/>
                <IntelligenceClassroom v-else-if="tabIndex ===1"/>
            </keep-alive>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Head from "./head/index.vue";
import ScheduleManagement from "./scheduleManagement/index.vue";
import IntelligenceClassroom from "./intelligenceClassroom/index.vue";
export default defineComponent({
    name: "Preparation",
    setup() {
        const tabIndex = ref(0);

        return {
            tabIndex
        };
    },
    components: { Head, ScheduleManagement, IntelligenceClassroom }
});
</script>

<style lang="scss" scoped>
.preparation {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    background-color: #f5f6fa;
    .content-wrapper {
        display: flex;
        flex:1;
        min-height: 0;
        min-width: 0;
    }
}
</style>
