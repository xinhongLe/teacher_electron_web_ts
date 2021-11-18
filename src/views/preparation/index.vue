<template>
    <div class="preparation">
        <Head
            v-model:tabIndex="tabIndex"
        />
        <div class="content-wrapper">
            <ScheduleManagement v-if="tabIndex === 0"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Head from "./head/index.vue";
import ScheduleManagement from "./scheduleManagement/index.vue";
export default defineComponent({
    setup() {
        const tabIndex = ref(0);

        return {
            tabIndex
        };
    },
    components: { Head, ScheduleManagement }
});
</script>

<style lang="scss" scoped>
.preparation {
    width: 100%;
    height: 100%;
    background-color: #f5f6fa;
    .content-wrapper {
        display: flex;
        height: calc(100% - 68px);
    }
}
</style>
