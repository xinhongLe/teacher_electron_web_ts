<template>
    <div class="resource-view">
        <IntelligenceClassroom
            v-if="type === 1"
            :resourceId="target"
            :dialog="true"
            :isSystem="isSystem"
        />
        <LookVideo v-if="type === 2" :dialog="true" :close="close" />
        <LookQuestion v-if="type === 3" :dialog="true" :close="close" />
        <div class="iframe-teach-box" v-if="type === 4 || type === 0">
            <iframe v-if="type === 4" :src="url"></iframe>
            <iframe class="office-iframe" sandbox="allow-same-origin allow-scripts" v-if="isOffice" :src="url"></iframe>
            <div class="iframe-image" v-if="isImage">
                <img :src="url" />
            </div>
            <div class="iframe-audio" v-if="isAudio">
                <audio :src="url" controls controlsList="nodownload" />
            </div>
            <div class="iframe-video" v-if="isVideo">
                <video :src="url" controls />
            </div>

            <div class="not-preview" v-if="!isVideo && !isAudio && !isImage && !isOffice && type !== 4">
                该资源不支持预览
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, ref, watchEffect } from "vue";
import IntelligenceClassroom from "../preparation/intelligenceClassroom/index.vue";
import LookVideo from "@/components/lookVideo/index.vue";
import LookQuestion from "@/components/lookQuestion/index.vue";
import { IResourceItem } from "@/api/resource";
import { getOssUrl } from "@/utils/oss";
import { useStore } from "@/store";

export default defineComponent({
    components: { IntelligenceClassroom, LookVideo, LookQuestion },
    props: {
        target: {
            type: String,
            default: ""
        },
        resource: {
			type: Object as PropType<IResourceItem | undefined>,
			required: true
		},
        type: {
            type: Number
        },
        visible: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: () => {}
        }
    },
    setup(props, { emit }) {
        const store = useStore();
        const url = ref("");
        const initIframeSrc = async () => {
            if (!props.resource) return;
            if (props.type === 0 && props.resource.File) {
                const { FilePath, FileMD5, FileExtention, FileBucket } = props.resource.File;
                const key = `${FilePath}/${FileMD5}.${FileExtention}`;
                const fileUrl = await getOssUrl(key, FileBucket);
                url.value = isOffice.value ? "https://owa.lyx-edu.com/op/view.aspx?src=" + encodeURIComponent(fileUrl) : fileUrl;
            }

            if (props.type === 4) {
                url.value = props.resource.ResourceToolUrl;
            }
        };

        const isSystem = computed(() => props.resource!.IsSysFile === 1)
        const isOffice = computed(() => ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "pdf"].indexOf(props.resource!.File?.FileExtention) > -1);
        const isImage = computed(() => ["gif", "png", "jpg", "jpeg"].indexOf(props.resource!.File?.FileExtention) > -1);
        const isAudio = computed(() => ["mp3", "wav"].indexOf(props.resource!.File?.FileExtention) > -1);
        const isVideo = computed(() => ["mp4"].indexOf(props.resource!.File?.FileExtention) > -1);

        watchEffect(initIframeSrc);
        return {
            url,
            isSystem,
            isOffice,
            isImage,
            isAudio,
            isVideo
        };
    }
});
</script>

<style lang="scss" scoped>
.resource-view {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    .iframe-teach-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
        .not-preview {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #fff;
            font-size: 30px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        iframe {
            width: 100%;
            height: 100%;
        }
        .office-iframe {
            height: calc(100% + 55px);
            margin-top: -55px;
        }
        .iframe-image, .iframe-video, .iframe-audio {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            video {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
}
</style>
