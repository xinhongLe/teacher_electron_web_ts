<template>
    <div class="student-detail">
        <div class="student-icon">
            <img src="@/assets/images/homeworkNew/tag_yellow.png" alt="" v-if="percentage !== 100"/>
        </div>
        <Avatar :file="HeadPortrait"></Avatar>
        <div class="student-otherinfo">
            <p class="student-name">{{ name }}</p>
            <p class="student-unknow">{{ StudentAccount }}</p>
            <div class="student-progress">
                <div>
                    <el-progress
                        :percentage="percentage"
                        :color="customColors"
                    ></el-progress>
                </div>
                <div><span>已看</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import Avatar from "@/components/avatar/index.vue";
import { HeadPortrait } from "@/types/myStudent";
export default defineComponent({
    props: {
        name: {
            type: String,
            default: ""
        },
        StudentAccount: {
            type: String,
            default: ""
        },
        HeadPortrait: {
            type: Object as PropType<HeadPortrait>,
            default: () => ({})
        },
        videoWatchTimeTick: {
            type: Number,
            default: 0
        },
        videoDurationTick: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const percentage = computed(() => Math.round(props.videoWatchTimeTick / props.videoDurationTick * 100));
        const customColors = [
            { color: "#ff6b6b", percentage: 20 },
            { color: "#fbc54d", percentage: 90 },
            { color: "#a0b3f3", percentage: 100 }
        ];
        return {
            customColors,
            percentage
        };
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.student-detail {
    position: relative;
    width: 298px;
    height: 124px;
    background: #ffffff;
    margin-bottom: 24px;
    margin-right: 24px;
    padding: 21px 22px;
    display: flex;
    justify-content: space-between;
    .student-icon {
        position: absolute;
        right: 0;
        top: 0;
        img {
            width: 24px;
        }
    }
    .student-avator {
        img {
            width: 38px;
            border-radius: 38px;
        }
    }
    .student-otherinfo {
        width: 100%;
        padding-left: 22px;
        .student-name {
            font-size: 16px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #19203d;
            line-height: 22px;
        }
        .student-phone {
            font-size: 12px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #5f626f;
            line-height: 17px;
        }
        .student-unknow {
            font-size: 12px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #5f626f;
            line-height: 17px;
            margin-bottom: 16px;
        }
        .student-progress {
            display: flex;
            div:nth-of-type(1) {
                width: 100%;
            }
            div:nth-of-type(2) {
                width: 30px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #a7aab4;
                line-height: 17px;
            }
        }
    }
}
</style>
