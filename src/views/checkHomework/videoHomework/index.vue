<template>
    <div class="view-video">
        <div class="view-video-select">
            <div class="video-select">
                <el-select v-model="selectClassId" placeholder="请选择">
                    <el-option
                        v-for="item in homeworkDetail.classInfo"
                        :key="item.name"
                        :label="item.name"
                        :value="item.classHomeworkPaperID"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="video-detail">
                {{ doneNum }}人已看完,共{{ missionList.length }}人
            </div>
        </div>
        <div class="video-student-detail">
            <div class="student-list">
                <div v-for="item in missionList" :key="item.MissionID">
                    <Student
                        :name="item.StudentName"
                        :StudentAccount="item.StudentAccount"
                        :HeadPortrait="item.StudentHeadPortrait"
                        :videoWatchTimeTick="item.VideoWatchTimeTick"
                        :videoDurationTick="homeworkDetail.videoDurationTick"
                    ></Student>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { HomeworkDetail, Mission } from "@/types/checkHomework";
import { defineComponent, PropType, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchMissionList } from "../api";
import Student from "./Student.vue";
export default defineComponent({
    props: {
        homeworkDetail: {
            type: Object as PropType<HomeworkDetail>,
            default: () => ({})
        }
    },
    setup() {
        const route = useRoute();
        const missionList = ref<Mission[]>([]);
        const selectClassId = ref(route.params.classHomeworkPaperID as string);
        const doneNum = ref(0);
        const getMissionList = async () => {
            const res = await fetchMissionList({
                classHomeworkPaperID: selectClassId.value
            });
            if (res.resultCode === 200) {
                missionList.value = res.result;
                doneNum.value = missionList.value.filter((e) => e.State !== 2).length;
            }
        };
        getMissionList();
        watch(selectClassId, getMissionList);
        return {
            selectClassId,
            missionList,
            doneNum
        };
    },
    components: { Student }
});
</script>

<style lang="scss" scoped>
.view-video {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}
.view-video-select {
    display: flex;
    align-items: center;
    height: 88px;
    justify-content: space-between;
    padding: 16px 24px;
    flex-shrink: 0;
    .video-detail {
        font-size: 16px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #5f626f;
    }
}
.video-student-detail {
    width: 100%;
    height: 100%;
    background: #f5f6fa;
    padding: 24px 26px;
    overflow-y: overlay;
    .student-list {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
