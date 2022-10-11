<template>
    <div class="record">
        <div class="student-info">
            <el-icon v-if="$route.name == 'wpf学习记录'" @click="$router.go(-1)"  style="font-size: 24px; margin: 20px 20px 20px 0; cursor: pointer"><ArrowLeft /></el-icon>
            <img
                class="goback"
                @click="$router.push('/class-manage')"
                src="@/assets/images/homeworkNew/icon_back.png"
                alt=""
            />
            <Avatar :file="studentInfo?.HeadPortrait" :size="66"></Avatar>
            <div>
                <p>{{ studentInfo?.Name }}</p>
                <p>{{ $route.params.className }}</p>
            </div>
        </div>
        <div class="echart-box">
            <div>
                <div>
                    <div
                        :class="activeIndex == index ? 'active' : ''"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="activeIndex = index"
                    >
                        <img
                            v-if="
                                item.SubjectName == '全部' &&
                                activeIndex != index
                            "
                            src="@/assets/my-student/icon_all_gray@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '全部' &&
                                activeIndex == index
                            "
                            src="@/assets/my-student/icon_all_white@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '数学' &&
                                activeIndex != index
                            "
                            src="@/assets/my-student/icon_shuxue_gray@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '数学' &&
                                activeIndex == index
                            "
                            src="@/assets/my-student/icon_shuxue_white@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '拼音' &&
                                activeIndex != index
                            "
                            src="@/assets/my-student/icon_pinyin_gray@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '拼音' &&
                                activeIndex == index
                            "
                            src="@/assets/my-student/icon_pinyin_white@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '英语' &&
                                activeIndex != index
                            "
                            src="@/assets/my-student/icon_yingyu_gray@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '英语' &&
                                activeIndex == index
                            "
                            src="@/assets/my-student/icon_yingyu_white@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '语文' &&
                                activeIndex != index
                            "
                            src="@/assets/my-student/icon_yuwen_gray@2x.png"
                        />
                        <img
                            v-if="
                                item.SubjectName == '语文' &&
                                activeIndex == index
                            "
                            src="@/assets/my-student/icon_yuwen_white@2x.png"
                        />
                        <span>{{ item.SubjectName }}</span>
                    </div>
                </div>
                <div class="echart" ref="echartRef">
                    <div class="no-xdata">暂无数据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FetchStudentInfoData, FetchStudentInfoRes } from "@/types/myStudent";
import { defineComponent, ref } from "vue";
import useEchart from "./useEchart";
import Avatar from "@/components/avatar/index.vue";
import { useRoute } from "vue-router";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { fetchStudentInfo } from "../classManage/api";
export default defineComponent({
    name: "Record",
    setup() {
        const route = useRoute();
        const { list, activeIndex, echartRef } = useEchart();
        const studentInfo = ref<FetchStudentInfoRes>();
        const data: FetchStudentInfoData = {
            id: route.params.studentId as string,
            teacherId: get(STORAGE_TYPES.USER_INFO).ID
        };

        fetchStudentInfo(data).then(res => {
            if (res.resultCode === 200) {
                studentInfo.value = res.result;
            }
        });

        return {
            activeIndex,
            list,
            echartRef,
            studentInfo
        };
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.record {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    .student-info {
        background: #fff;
        height: 104px;
        padding: 19px 27px;
        box-sizing: border-box;
        display: flex;
        .goback {
            width: 9px;
            height: 16px;
            cursor: pointer;
            align-self: center;
            margin-right: 24px;
        }
        img {
            width: 66px;
            height: 66px;
        }
        div {
            margin-left: 23px;
            margin-top: 5px;
            p:nth-of-type(1) {
                font-size: 24px;
                font-weight: 600;
                color: #19203d;
                line-height: 33px;
            }
            p:nth-of-type(2) {
                margin-top: 2px;
                font-size: 14px;
                font-weight: 500;
                color: #5f626f;
                line-height: 20px;
            }
        }
    }
    .echart-box {
        flex: 1;
        border-top: 1px solid #e9ecf0;
        background: #f5f6fa;
        padding: 24px;
        display: flex;
        flex-shrink: 1;
        flex-direction: column;
        > div {
            padding: 24px;
            background: #fff;
            display: flex;
            flex: 1;
            flex-direction: column;
            > div:nth-of-type(1) {
                display: flex;
                div {
                    width: 140px;
                    height: 48px;
                    background: #eff0f4;
                    border-radius: 4px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 8px;
                    cursor: pointer;
                    img {
                        width: 20px;
                        height: 20px;
                    }
                    span {
                        margin-left: 8px;
                        font-size: 16px;
                        color: #5f626f;
                        line-height: 22px;
                    }
                }
                .active {
                    background: #4b71ee;
                    span {
                        color: #fff;
                    }
                }
            }
            .echart {
                flex: 1;
                margin: 24px 0;
                background: #f6f9ff;
            }
        }
    }
    .no-xdata {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
}
</style>
