<template>
    <div class="iframe-box">
        <div class="iframe-content" v-if="type === 4 || type === 0">
            <iframe
                class="office-iframe"
                v-if="isOffice"
                :src="url"
                sandbox="allow-same-origin allow-scripts"
            ></iframe>
            <iframe v-if="type === 4" :src="url"></iframe>
            <div class="iframe-image" v-if="isImage">
                <img :src="url" />
            </div>
            <div class="iframe-audio" v-if="isAudio">
                <audio :src="url" controls controlsList="nodownload" />
            </div>
            <div class="iframe-video" v-if="isVideo">
                <video :src="url" controls />
            </div>
            <div
                class="not-preview"
                v-if="
                    !isVideo && !isAudio && !isImage && !isOffice && type !== 4
                "
            >
                暂不支持预览，请下载查看
            </div>
        </div>
        <div class="iframe-footer">
            <div class="iframe-footer-btn pen" @click="drawingShow = true">
                <p>画笔</p>
            </div>
            <div class="iframe-footer-btn" @click="close">
                <p>关闭</p>
            </div>
        </div>
    </div>
    <drawing-board :show="drawingShow" @closeWriteBoard="drawingShow = false" />
</template>

<script lang="ts">
import { IResourceItem } from "@/api/resource";
import { MutationTypes, useStore } from "@/store";
import { getOssUrl } from "@/utils/oss";
import {
    computed,
    defineComponent,
    onUnmounted,
    PropType,
    ref,
    watchEffect,
} from "vue";
import DrawingBoard from "@/components/drawingBoard/index.vue";

export default defineComponent({
    components: { DrawingBoard },

    props: {
        index: {
            type: Number,
            default: 0,
        },
    },
    setup(props, { emit }) {
        //显示隐藏画笔
        const drawingShow = ref(false);

        const store = useStore();
        const url = ref("");
        const resource = computed(() =>
            store.state.common.showResourceFullScreen.length > 0
                ? store.state.common.showResourceFullScreen[props.index]
                      .resource
                : null
        );
        const type = computed(() => resource.value?.ResourceShowType);
        const extention = computed(() =>
            resource.value && resource.value.File
                ? resource.value.File.FileExtention
                : ""
        );
        const isOffice = computed(
            () =>
                ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "pdf"].indexOf(
                    extention.value
                ) > -1
        );
        const isImage = computed(
            () => ["gif", "png", "jpg", "jpeg"].indexOf(extention.value) > -1
        );
        const isAudio = computed(
            () => ["mp3", "wav"].indexOf(extention.value) > -1
        );
        const isVideo = computed(() => ["mp4"].indexOf(extention.value) > -1);

        const initIframeSrc = async () => {
            if (!resource.value) return;

            if (resource.value.ResourceShowType === 0 && resource.value.File) {
                const { FilePath, FileMD5, FileExtention, FileBucket } =
                    resource.value.File;
                const key = `${FilePath}/${FileMD5}.${FileExtention}`;
                const fileUrl = await getOssUrl(key, FileBucket);
                url.value = isOffice.value
                    ? "https://owa.lyx-edu.com/op/view.aspx?src=" +
                      encodeURIComponent(fileUrl)
                    : fileUrl;
            }

            if (
                resource.value.ResourceShowType === 4 &&
                resource.value.ResourceToolUrl
            ) {
                url.value = resource.value.ResourceToolUrl;
            }
        };

        initIframeSrc();
        // watchEffect(initIframeSrc);

        const close = () => {
            store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
                id: resource.value?.id,
                openMore: resource.value?.openMore,
            });
        };
        return {
            close,
            type,
            url,
            isOffice,
            isImage,
            isAudio,
            isVideo,
            resource,
            drawingShow,
        };
    },
});
</script>

<style lang="scss" scoped>
.iframe-box {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    background: #fff;
    overflow: hidden;
    .iframe-content {
        overflow: hidden;
        flex: 1;
        min-height: 0;
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
            height: 100%;
            width: 100%;
        }
        .office-iframe {
            height: calc(100% + 55px);
            margin-top: -55px;
        }
        .iframe-image,
        .iframe-video,
        .iframe-audio {
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
    .iframe-footer {
        width: 100%;
        height: 80px;
        padding: 12px;
        background: rgb(125, 164, 236);
        display: flex;
        align-items: center;
        justify-content: center;
        .iframe-footer-btn {
            width: 64px;
            height: 64px;
            cursor: pointer;
            margin-right: 20px;
            background: url("~@/assets/look/btn_guanbi@2x.png");
            background-size: 100% 100%;
            p {
                color: #fff;
                text-align: center;
                font-size: 12px;
                line-height: 24px;
                margin-top: 40px;
                font-weight: 550;
            }
        }
        .pen {
            background: url("./../../assets/look/btn_huabi@2x.png");
            background-size: 100% 100%;
            margin-right: 20px;
            p {
                color: #4b71ee;
            }
        }
    }
}
</style>
