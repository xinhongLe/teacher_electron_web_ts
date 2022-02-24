<template>
    <div class="class-box">
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
.class-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 20px;
}
</style>
