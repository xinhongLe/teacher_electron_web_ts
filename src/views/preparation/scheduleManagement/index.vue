<template>
    <CourseList/>
    <div class="right">
        <Schedule/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CourseList from "./CourseList.vue";
import Schedule from "./Schedule.vue";
export default defineComponent({
    name: "scheduleManagement",
    // setup() {
    // },
    components: { CourseList, Schedule }
});
</script>

<style lang="scss" scoped>
.right {
    flex: 1;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;

}
</style>
