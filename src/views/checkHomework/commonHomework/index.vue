<template>
    <div class="content-warp">
        <div class="classlist">
            <div
                :class="activeID == item.classHomeworkPaperID ? 'active' : ''"
                @click="activeID = item.classHomeworkPaperID"
                v-for="(item, index) in homeworkDetail.classInfo"
                :key="index"
            >
                {{ item.name }}
            </div>
        </div>
        <div class="content">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                    <template v-slot:title>
                        <p>
                            已完成学生<span style="font-size: 12px"
                                >({{ doneStudentList.length }})人</span
                            >
                        </p>
                    </template>
                    <div
                        class="general-reference-student"
                        v-if="homeworkDetail.needSubmit != 1"
                    >
                        <div
                            class="student-once"
                            v-for="(item, index) in doneStudentList"
                            :key="index"
                        >
                            <div class="student-useravator">
                                <img
                                    src="@/assets/images/attend-class/touxiang_student.png"
                                    alt=""
                                />
                            </div>
                            <div class="student-userinfo">
                                <p class="student-name">
                                    {{ item.StudentName }}
                                </p>
                                <p class="student-classname">
                                    {{ classInfo?.name }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="has-submit-student" v-else>
                        <div
                            class="list"
                            v-for="(item, index) in doneStudentList"
                            :key="index"
                        >
                            <Avatar :file="item.StudentHeadPortrait"></Avatar>
                            <div>
                                <p>
                                    {{ item.StudentName
                                    }}<span>{{ item.FinishMessage }}</span>
                                </p>
                                <p>
                                    {{
                                        moment(
                                            item.MissionFiles[0]?.SubmitTime
                                        ).format("YYYY-MM-DD hh:mm")
                                    }}
                                </p>
                                <div>
                                    <DoHomeworkStudent
                                        v-for="(
                                            value, index1
                                        ) in item.MissionFiles"
                                        :key="index1"
                                        :file="value.File"
                                    ></DoHomeworkStudent>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template v-slot:title>
                        <p>
                            未完成学生<span style="font-size: 12px"
                                >({{ undoneStudentList.length }})人</span
                            >
                        </p>
                    </template>
                    <div class="general-reference-student">
                        <NulliparousStudents
                            v-for="(item, index) in undoneStudentList"
                            :key="index"
                            :HeadPortrait="item.StudentHeadPortrait"
                            :name="item.StudentName"
                            :className="item.StudentClassName"
                        ></NulliparousStudents>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script lang="ts">
import { HomeworkDetail, Mission } from "@/types/checkHomework";
import moment from "moment";
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { fetchMissionList } from "../api";
import NulliparousStudents from "../NulliparousStudents.vue";
import DoHomeworkStudent from "./DoHomeworkStudent.vue";
import Avatar from "@/components/avatar/index.vue";
import { useRoute } from "vue-router";
export default defineComponent({
    name: "commonHomework",
    props: {
        homeworkDetail: {
            type: Object as PropType<HomeworkDetail>,
            default: () => ({})
        }
    },
    setup(props) {
        const route = useRoute();
        const activeID = ref(
            route.params.classHomeworkPaperID as string
        );
        const undoneStudentList = ref<Mission[]>([]);
        const doneStudentList = ref<Mission[]>([]);
        const activeNames = ["1", "2"];
        const getMissionList = async () => {
            const res = await fetchMissionList({
                classHomeworkPaperID: activeID.value
            });
            if (res.resultCode === 200) {
                undoneStudentList.value = res.result.filter(
                    ({ State }) => State === 2
                );
                doneStudentList.value = res.result.filter(
                    ({ State }) => State !== 2
                );
            }
        };
        getMissionList();

        watch(activeID, getMissionList);

        const classInfo = computed(() =>
            props.homeworkDetail.classInfo.find(
                ({ classHomeworkPaperID }) =>
                    classHomeworkPaperID === activeID.value
            )!
        );

        return {
            activeID,
            activeNames,
            moment,
            classInfo,
            doneStudentList,
            undoneStudentList
        };
    },
    components: { NulliparousStudents, DoHomeworkStudent, Avatar }
});
</script>

<style lang="scss" scoped>
.content-warp {
    .classlist {
        padding: 23px 15px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        div {
            padding: 12px 40px;
            background: #eff0f4;
            border-radius: 4px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5f626f;
            margin: 0 8px;
            cursor: pointer;
        }
        .active {
            padding: 12px 40px;
            background: #4b71ee;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin: 0 8px;
        }
    }
    .content {
        padding: 24px;
        :deep(.el-collapse) {
            background: #f3f7ff;
        }
        :deep(.el-collapse-item) {
            background: #f3f7ff;
        }
        :deep(.el-collapse-item__header) {
            padding: 18px 24px;
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203d;
        }
        :deep(.is-active) {
            background: #f3f7ff;
        }
        :deep(.el-collapse-item__wrap) {
            background: #f3f7ff;
            border-bottom: 10px solid #fff;
        }
        :deep(.el-collapse-item__content) {
            padding-bottom: 16px;
        }
        .general-reference-student {
            padding: 0 16px 16px 16px;
            display: flex;
            // justify-content: flex-start;
            flex-wrap: wrap;
            .student-once {
                margin: 8px 8px 8px 8px;
                width: 250px;
                height: 72px;
                background: #fff;
                display: flex;
                padding: 17px 22px;
                border-radius: 4px;
                .student-useravator {
                    display: flex;
                    align-items: center;
                    img {
                        width: 38px;
                        height: 38px;
                        border-radius: 38px;
                    }
                }
                .student-userinfo {
                    margin: 0;
                    padding: 0 0 0 18px;
                    .student-classname {
                        font-size: 12px;
                        line-height: 18px;
                        font-family: PingFang-SC-Medium, PingFang-SC;
                        font-weight: 500;
                        color: #5f626f;
                    }
                    .student-name {
                        font-size: 16px;
                        line-height: 22px;
                        font-family: PingFang-SC-Medium, PingFang-SC;
                        font-weight: 500;
                        color: #19203d;
                    }
                }
            }
        }
        .has-submit-student {
            border-top: 1px solid #e4ebf9;
            margin: 0 24px;
            .list {
                margin-top: 20px;
                display: flex;
                > div {
                    flex: 1;
                    margin-left: 16px;
                    > p:nth-of-type(1) {
                        font-size: 18px;
                        font-weight: 600;
                        color: #19203d;
                        line-height: 25px;
                        span {
                            margin-left: 12px;
                            font-size: 14px;
                            color: #19203d;
                            line-height: 25px;
                        }
                    }
                    p:nth-pf-type(1) {
                        margin-top: 2px;
                        font-size: 12px;
                        color: #5f626f;
                        line-height: 18px;
                    }
                    > div {
                        margin-top: 8px;
                        overflow: hidden;
                        width: 100%;
                        border-bottom: 1px solid #e4ebf9;
                    }
                    > div:last-of-type {
                        border: none;
                        margin-bottom: -16px;
                    }
                }
            }
        }
    }
}
</style>
