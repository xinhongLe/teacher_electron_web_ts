<template>
    <div class="container">
        <Header :homeworkDetail="homeworkDetail"  @changeHomeworkDetail="changeHomeworkDetail"/>
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
import { defineComponent, ref } from "vue";
import Header from "./Header.vue";
import CommonHomework from "./commonHomework/index.vue";
import SystemHomework from "./systemHomework/index.vue";
import VideoHomework from "./videoHomework/index.vue";
export default defineComponent({
    name: "CheckHomework",
    setup() {
        const homeworkDetail = ref(get(STORAGE_TYPES.HOMEWORK_DETAIL) as HomeworkDetail);

        const changeHomeworkDetail = (data:{showPublish:boolean | undefined, answerShowTime:string| undefined}) => {
            homeworkDetail.value.showPublish = data.showPublish;
            homeworkDetail.value.answerShowTime = data.answerShowTime;
        };

        return {
            homeworkDetail,
            changeHomeworkDetail
        };
    },
    components: { Header, CommonHomework, SystemHomework, VideoHomework }
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
