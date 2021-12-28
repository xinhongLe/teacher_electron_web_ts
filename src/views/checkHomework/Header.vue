<template>
    <div class="header">
        <div class="left">
            <img
                class="goback"
                @click="$router.push('/homework')"
                src="@/assets/images/homeworkNew/icon_back.png"
                alt=""
            />
            <img
                v-if="type === 0"
                class="docx"
                src="@/assets/images/homeworkNew/icon_timu.png"
                alt=""
            />
            <img
                v-else-if="type === 2"
                class="docx"
                src="@/assets/images/homeworkNew/homework2.png"
                alt=""
            />
            <img
                v-else-if="type === 99"
                class="docx"
                src="@/assets/images/homeworkNew/homework0.png"
                alt=""
            />
            <img
                v-else-if="type === 1"
                class="docx"
                src="@/assets/images/homeworkNew/icon_shipin.png"
                alt=""
            />
            <span class="name">{{ name }}</span>
            <template v-if="type === 2">
                <span class="name" :style="{marginLeft: '10px'}">第{{ workbookPaperPageNum }}页</span>
                <span class="name" :style="{marginLeft: '40px'}">{{ albumName }}</span>
            </template>
            <template v-if="type === 0 || type === 2">
                <span class="tips">共{{ count }}题</span>
            </template>
            <template v-else-if="type === 1">
                <span class="tips"
                    >时长{{ formatDuration(videoDurationTick) }}</span
                >
                <span class="class-detail">
                    {{ albumName }} {{ chapterName }}
                </span>
            </template>
        </div>
        <div class="right">
            <template v-if="type === 99">
                <div
                    v-for="(item, index) in homeworkPaperFiles"
                    :key="index"
                    class="file"
                    @click="viewInfo(item.File)"
                >
                    <img
                        :src="
                            require('@/assets/images/homeworkNew/' +
                                showFileIcon(item.File.Extention) +
                                '.png')
                        "
                    />
                </div>
                <Enlarge
                    v-model:visible="visible"
                    v-if="visible"
                    :src="src"
                    :extention="extention"
                />
            </template>
            <template v-else-if="type === 1">
                <div class="view-video-button">
                    <img
                        src="@/assets/images/homeworkNew/icon_timuxiangqing.png"
                        alt=""
                    />
                    <span @click="lookVideo(videoID)">视频详情</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import useViewHomeworkFile from "@/hooks/useViewHomeworkFile";
import { HomeworkDetail } from "@/types/checkHomework";
import { FileInfo } from "@/types/lookQuestion";
import { defineComponent, PropType, ref, toRefs } from "vue";
import { formatDuration, showFileIcon, lookVideo } from "@/utils";
import Enlarge from "@/components/enlarge/index.vue";
export default defineComponent({
    props: {
        homeworkDetail: {
            type: Object as PropType<HomeworkDetail>,
            required: true
        }
    },
    setup(props) {
        const extention = ref("");
        const { visible, viewInfo, src } = useViewHomeworkFile();
        const _viewInfo = (file: FileInfo) => {
            extention.value = file.Extention;
            viewInfo(file);
        };
        return {
            extention,
            visible,
            viewInfo: _viewInfo,
            formatDuration,
            lookVideo,
            showFileIcon,
            src,
            ...toRefs(props.homeworkDetail)
        };
    },
    components: { Enlarge }
});
</script>

<style lang="scss" scoped>
.header {
    padding: 28px 23px;
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    min-height: 0px;
    border-bottom: 8px solid #f3f7ff;
    .left {
        display: flex;
        align-items: center;
        .goback {
            margin-right: 20px;
            width: 9px;
            cursor: pointer;
            height: 16px;
        }
        .docx {
            width: 24px;
            height: 24px;
            margin-right: 12px;
        }
        .name {
            font-size: 24px;
            font-weight: 600;
            color: #19203d;
        }
        .tips {
            font-size: 16px;
            font-weight: 500;
            color: #5f626f;
            margin-left: 20px;
        }
        .class-detail{
            margin-left: 20px;
        }
    }
    .right {
        display: flex;
        align-items: center;
        .file {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: #f3f7ff;
            margin-left: 8px;
            img {
                width: 16px;
                height: 19px;
            }
        }
        .view-video-button {
            width: 140px;
            height: 40px;
            background: #4b71ee;
            border-radius: 4px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 22px;
                padding-left: 8px;
            }
            img {
                width: 20px;
            }
        }
    }
}
</style>
