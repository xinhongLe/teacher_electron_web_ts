<template>
    <div class="classBox">
        <ClassContent/>
        <QuestionBank/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ClassContent from "./ClassContent.vue";
import QuestionBank from "./questionBank/index.vue";
export default defineComponent({
    name: "packageManagement",
    components: { ClassContent, QuestionBank }
});
</script>

<style lang="scss" scoped>
.classBox {
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: space-between;
}
</style>
