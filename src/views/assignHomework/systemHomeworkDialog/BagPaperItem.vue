<template>
    <div :class="['right-row', 'flex-between-center']">
        <div class="first-col flex-between-center">
            <el-checkbox @change="choicePaper" :model-value="isSelect"/>
            <img
                v-if="type === 0"
                src="@/assets/images/homeworkNew/homework1.png"
                alt=""
            />
            <img
                v-else
                src="@/assets/images/homeworkNew/icon_shipin.png"
                alt=""
            />
            <p class="text-class" v-if="type === 0">{{ info.QuestionCount }}题</p>
            <p class="text-class" v-else>时长:{{ formatDuration(info.VideoDuration) }}</p>
            <span class="before-class">{{
                getCourseBagType(info.ClassifyType)
            }}</span>
            <p>{{ info.Name }}</p>
        </div>
        <div>
            <el-button
                v-show="info.HasVideo && type === 1"
                size="medium"
                type="primary"
                plain
                icon="el-icon-video-play"
                @click="lookVideo(info.FileID)"
                >查看视频</el-button
            >
            <el-button
                v-show="type === 0"
                size="medium"
                type="primary"
                plain
                icon="el-icon-search"
                @click="lookQuestions({ id: info.PaperID, type: 1 })"
                >查看题目</el-button
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getCourseBagType, lookQuestions, lookVideo, formatDuration } from "@/utils";
import { BagPapers } from "@/types/preparation";
export default defineComponent({
    props: {
        info: {
            type: Object as PropType<BagPapers>,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 0
        },
        isSelect: {
            type: Boolean,
            default: false
        },
        type: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const choicePaper = (flag: boolean) => {
            emit("choicePaper", flag, props.info, props.index, props.type);
        };

        return {
            lookVideo,
            getCourseBagType,
            choicePaper,
            formatDuration,
            lookQuestions
        };
    }
});
</script>

<style lang="scss" scoped>
.right-row {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f5f6fa;
    background-color: #fff;
    .first-col {
        img {
            width: 20px;
            height: 20px;
            vertical-align: bottom;
            margin-left: 30px;
        }
        p {
            font-size: 16px;
            font-weight: 600;
            color: #19203d;
            margin: 0 30px;
        }
        .text-class {
            font-size: 14px;
            color: #5f626f;
            text-align: center;
        }
        .before-class {
            font-size: 14px;
            color: #4b71ee;
            position: relative;
            &::before {
                position: absolute;
                left: -8px;
                top: 4px;
                content: "";
                display: block;
                width: 4px;
                height: 5px;
                background-color: #4b71ee;
            }
        }
    }
}
</style>
