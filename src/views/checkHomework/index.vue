<template>
    <div class="container">
        <Header :homeworkDetail="homeworkDetail" />
        <CommonHomework
            v-if="homeworkDetail.type === 99"
            :homeworkDetail="homeworkDetail"
        />
        <SystemHomework
            v-if="homeworkDetail.type === 0 || homeworkDetail.type === 2"
            :homeworkDetail="homeworkDetail"
        />
        <VideoHomework
            v-if="homeworkDetail.type === 1"
            :homeworkDetail="homeworkDetail"
        />
    </div>
</template>

<script lang="ts">
import { HomeworkDetail } from "@/types/checkHomework";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { defineComponent } from "vue";
import Header from "./Header.vue";
import CommonHomework from "./commonHomework/index.vue";
import SystemHomework from "./systemHomework/index.vue";
import VideoHomework from "./videoHomework/index.vue";
export default defineComponent({
    setup() {
        const homeworkDetail = get(
            STORAGE_TYPES.HOMEWORK_DETAIL
        ) as HomeworkDetail;

        return {
            homeworkDetail
        };
    },
    components: { Header, CommonHomework, SystemHomework, VideoHomework }
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
