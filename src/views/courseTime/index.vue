<template>
    <div class="container">
        <iframe :src="src" class="iframe"/>
    </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent } from "vue";
export default defineComponent({
    setup() {
        const url = process.env.VUE_APP_IFRAME;
        return	{
            src: computed(() => `${url}/#/timeService/course-manage?TeacherID=${store.state.userInfo.id}&hideHeader=1`)
        };
    }
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    .iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
