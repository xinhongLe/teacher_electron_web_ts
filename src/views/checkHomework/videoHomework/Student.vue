<template>
    <div class="student-detail">
        <div class="student-icon">
            <img src="@/assets/images/homeworkNew/tag_yellow.png" alt="" />
        </div>
        <Avatar :file="HeadPortrait"></Avatar>
        <div class="student-otherinfo">
            <p class="student-name">{{ name }}</p>
            <!-- <p class="student-phone">13327624630</p> -->
            <p class="student-unknow">{{ StudentAccount }}</p>
            <div class="student-progress">
                <div>
                    <el-progress
                        :percentage="videoWatchTimeTick"
                        :color="customColors"
                    ></el-progress>
                </div>
                <div><span>已看</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
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
        }
    },
    setup() {
        const customColors = [
            { color: "#f56c6c", percentage: 20 },
            { color: "#e6a23c", percentage: 40 },
            { color: "#5cb87a", percentage: 60 },
            { color: "#1989fa", percentage: 80 },
            { color: "#6f7ad3", percentage: 100 }
        ];
        return {
            customColors
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
