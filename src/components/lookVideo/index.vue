<template>
    <div
        class="look-video"
        :class="{ 'dialog-type': dialog, 'active-window': activeWindow }"
        v-show="!isMinimized"
        v-loading="videoLoading"
    >
        <div class="warp">
            <div class="frames-box">
                <span class="file-sn" v-if="!dialog">{{ fileSn }}</span>
                <p v-if="!dialog">查看视频</p>
                <div class="content">
                    <div class="material-box">
                        <video
                            ref="videoRef"
                            :src="videoUrl"
                            autoplay
                            @loadedmetadata="getAudioLength"
                            @timeupdate="videoTimeUpdate"
                            @ended="videoEnded"
                            @canplaythrough="canplaythrough"
                        >
                            您的浏览器不支持 video 标签。
                        </video>
                    </div>
                </div>

                <div class="progress">
                    <div class="time">
                        <span>{{ formateSeconds(initVideo.currentTime) }}</span>
                        <span>{{ formateSeconds(initVideo.videoLength) }}</span>
                    </div>
                    <el-slider
                        class="commonSlider"
                        :show-tooltip="false"
                        v-model="initVideo.currentTime"
                        :max="initVideo.videoLength"
                        @change="changeVideoTime"
                        :marks="marks"
                    />
                </div>
            </div>

            <div class="dialog-footer">
                <div class="pen" @click="drawingShow = true">
                    <p>画笔</p>
                </div>
                <!--                <div-->
                <!--                    :class="btnType == 2 ? 'active' : ''"-->
                <!--                    @click="eraserHandle"-->
                <!--                >-->
                <!--                    <p>橡皮</p>-->
                <!--                </div>-->
                <!--                <div :class="btnType == 3 ? 'active' : ''" @click="clearBoard">-->
                <!--                    <p>清空</p>-->
                <!--                </div>-->
                <div class="close" @click="closeVideo">
                    <p>关闭</p>
                </div>
                <div
                    class="mini"
                    @click="smallVideo"
                    v-show="isElectron && !dialog && !noMinix"
                >
                    <p>最小化</p>
                </div>
                <template v-if="isVideoEnded">
                    <div class="replay" @click="replay">
                        <p>重播</p>
                    </div>
                    <div class="next" @click="closeVideo">
                        <p>下一步</p>
                    </div>
                </template>
                <template v-else>
                    <div
                        v-if="btnName === '暂停'"
                        class="play"
                        @click="playPause"
                    >
                        <p>{{ btnName }}</p>
                    </div>
                    <div v-else class="stop" @click="playPause">
                        <p>{{ btnName }}</p>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <drawing-board :show="drawingShow" @closeWriteBoard="drawingShow = false" />
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    watchEffect,
    watch,
    onMounted,
    nextTick,
    onUnmounted,
    PropType,
    computed,
} from "vue";
import isElectronFun from "is-electron";
import { getFileAndPauseByFile } from "./api";
import useVideo, { formateSeconds } from "./hooks/useVideo";
import { getOssUrl } from "@/utils/oss";
import { MutationTypes, store } from "@/store";
import emitter from "@/utils/mitt";
import { IViewResourceData } from "@/types/store";
import DrawingBoard from "@/components/drawingBoard/index.vue";
export default defineComponent({
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },

        close: {
            type: Function,
            default: () => {},
        },

        resource: {
            type: Object as PropType<IViewResourceData>,
            required: true,
        },
        activeWindow: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const isElectron = isElectronFun();
        const videoUrl = ref("");
        const btnType = ref(-1);

        const fileSn = ref();
        const isMinimized = ref(false);
        const lastId = ref("");
        const videoLoading = ref(false);
        const noMinix = computed(() => !!props.resource.openMore);
        const {
            changeData,
            marks,
            filePauses,
            btnName,
            initVideo,
            getAudioLength,
            videoRef,
            videoTimeUpdate,
            changeVideoTime,
            videoEnded,
            isVideoEnded,
            playPause,
            childRef,
            replay,
        } = useVideo();

        const brushHandle = () => {
            btnType.value = 1;
            childRef.value!.brushOn();
        };

        const clearBoard = () => {
            btnType.value = 3;
            childRef.value!.clearBrush();
        };

        const eraserHandle = () => {
            btnType.value = 2;
            childRef.value!.eraserOn();
        };

        const closeVideo = () => {
            if (props.dialog) props.close();
            store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
                id: props.resource.id,
                openMore: props.resource.openMore,
                type: "LookVideo",
            });
        };

        const smallVideo = () => {
            videoRef.value!.pause();
            isMinimized.value = true;
        };

        watch(isMinimized, (v) => {
            if (v) {
                window.electron.ipcRenderer.invoke("videoMinimized");
            } else {
                window.electron.ipcRenderer.invoke("hideSuspensionVideo");
            }
        });

        watchEffect(() => {
            const { id } = props.resource;
            if (!id) return;
            isMinimized.value = false;
            if (id === lastId.value) {
                if (btnName.value === "暂停") {
                    videoRef.value!.play();
                }
                return;
            }
            lastId.value = id;
            childRef.value && childRef.value!.clearBrush();
            getFileAndPauseByFile({
                fileID: id,
            }).then(async (res) => {
                if (res.resultCode === 200) {
                    const { FilePauses, VideoFile } = res.result;
                    const { Extention, FilePath, FileName, Bucket, SN } =
                        VideoFile;
                    filePauses.value = changeData(FilePauses);
                    fileSn.value = SN;
                    const key = Extention
                        ? `${FilePath}/${FileName}.${Extention}`
                        : `${FilePath}/${FileName}`;
                    const url = await getOssUrl(key, Bucket);
                    if (url !== videoUrl.value) {
                        videoUrl.value = url;
                        videoLoading.value = true;
                    }
                }
            });
        });

        const openVideoWin = () => {
            isMinimized.value = false;
            store.commit(
                MutationTypes.SET_FULLSCREEN_RESOURCE_ACTIVE,
                "LookVideo"
            );
            nextTick(() => {
                if (btnName.value === "暂停") {
                    videoRef.value && videoRef.value.play();
                }
            });
        };

        const closeVideoWin = () => {
            window.electron.ipcRenderer.invoke("hideSuspensionVideo");
            closeVideo();
        };

        const canplaythrough = () => {
            videoLoading.value = false;
        };

        const drawingShow = ref(false);
        onMounted(() => {
            emitter.on("smallVideo", smallVideo);
            if (isElectron) {
                window.electron.ipcRenderer.on("openVideoWin", openVideoWin);
                window.electron.ipcRenderer.on("closeVideoWin", closeVideoWin);
            }
        });

        onUnmounted(() => {
            emitter.off("smallVideo");
            if (isElectron) {
                window.electron.ipcRenderer.removeListener(
                    "openVideoWin",
                    openVideoWin
                );
                window.electron.ipcRenderer.removeListener(
                    "closeVideoWin",
                    closeVideoWin
                );
            }
        });

        return {
            noMinix,
            marks,
            videoUrl,
            clearBoard,
            initVideo,
            btnName,
            btnType,
            videoRef,
            closeVideo,
            canplaythrough,
            smallVideo,
            isMinimized,
            videoTimeUpdate,
            getAudioLength,
            eraserHandle,
            videoEnded,
            isVideoEnded,
            replay,
            playPause,
            changeVideoTime,
            brushHandle,
            isElectron,
            fileSn,
            childRef,
            videoLoading,
            formateSeconds,
            drawingShow,
        };
    },
    components: { DrawingBoard },
});
</script>

<style lang="scss" scoped>
.active {
    border: 3px solid #4b71ee;
    border-radius: 10px;
}
.file-sn {
    position: absolute;
    left: 20px;
    top: 20px;
    color: #999;
    font-size: 16px;
}
.look-video {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 10000;
    overflow: hidden;
    background: #fff;
    -webkit-app-region: no-drag;
    top: 0;
    &.dialog-type {
        width: 100%;
        height: 100%;
        position: relative;
    }
}
.warp {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.frames-box {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    > p {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        line-height: 28px;
        text-align: center;
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .count {
        position: absolute;
        top: -50px;
        right: 0;
    }
    .content {
        flex: 1;
        height: 100%;
        position: relative;
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .material-box {
        width: 90%;
        flex: 1;
        position: relative;
        video {
            width: 100%;
            height: 100%;
            position: absolute;
        }
    }
    .progress {
        width: 94%;
        height: 40px;
        margin: 10px 0;
        z-index: 3;
        align-self: center;
        .time {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
.dialog-footer {
    width: 100%;
    height: 80px;
    padding: 12px;
    background: rgb(125, 164, 236);
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
        width: 64px;
        height: 64px;
        cursor: pointer;
        margin-right: 20px;
        p {
            text-align: center;
            font-size: 12px;
            color: #4b71ee;
            line-height: 24px;
            margin-top: 40px;
            font-weight: 550;
        }
    }
    > div.pen {
        background: url("./../../assets/look/btn_huabi@2x.png");
        background-size: 100% 100%;
    }
    > div.close {
        background: url("./../../assets/look/btn_guanbi@2x.png");
        background-size: 100% 100%;
        p {
            color: #fff;
        }
    }
    > div.mini {
        background: url("./../../assets/look/btn_zuixiaohua@2x.png");
        background-size: 100% 100%;
    }
    .replay {
        background: url("./../../assets/look/btn_chongbo@2x.png");
        background-size: 100% 100%;
    }
    .play,
    .stop,
    .next {
        width: 120px;
        p {
            color: #fff;
        }
        background-image: url("./../../assets/look/btn_zanting@2x.png");
        background-size: 100% 100%;
    }
    .stop {
        background-image: url("./../../assets/look/btn_bofang@2x.png");
    }
    .next {
        background-image: url("./../../assets/look/btn_xiayibu@2x.png");
    }
}

.active-window {
    z-index: 10001 !important;
}
</style>
