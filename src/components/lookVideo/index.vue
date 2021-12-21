<template>
    <div class="look-video" v-show="!isMinimized">
        <div class="warp">
            <div class="frames-box">
                <span class="file-sn">{{fileSn}}</span>
                <p>查看视频</p>
                <div class="content">
                    <Brush ref="childRef"></Brush>
                    <div class="material-box">
                        <video
                            ref="videoRef"
                            :src="videoUrl"
                            autoplay
                            @loadedmetadata="getAudioLength"
                            @timeupdate="videoTimeUpdate"
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
                    >
                    </el-slider>
                </div>
            </div>

            <div class="dialog-footer">
                <div :class="btnType == 1 ? 'active' : ''" @click="brushHandle">
                    <p>画笔</p>
                </div>
                <div
                    :class="btnType == 2 ? 'active' : ''"
                    @click="eraserHandle"
                >
                    <p>橡皮</p>
                </div>
                <div :class="btnType == 3 ? 'active' : ''" @click="clearBoard">
                    <p>清空</p>
                </div>
                <div @click="closeVideo">
                    <p>关闭</p>
                </div>
                <div @click="smallVideo" v-show="isElectron">
                    <p>最小化</p>
                </div>
                <div v-if="btnName == '暂停'" class="play" @click="playPause">
                    <p>{{ btnName }}</p>
                </div>
                <div v-else class="stop" @click="playPause">
                    <p>{{ btnName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, watch, onMounted, nextTick, onUnmounted } from "vue";
import isElectronFun from "is-electron";
import { getFileAndPauseByFile } from "./api";
import useVideo, { formateSeconds } from "./hooks/useVideo";
import { downloadFile } from "@/utils/oss";
import Brush from "@/components/brush/index.vue";
import { MutationTypes, store } from "@/store";
export default defineComponent({
    setup() {
        const isElectron = isElectronFun();
        const videoUrl = ref("");
        const btnType = ref(1);
        const childRef = ref<InstanceType<typeof Brush>>();
        const fileSn = ref();
        const isMinimized = ref(false);
        const lastId = ref("");
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
            playPause
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
            store.commit(MutationTypes.SET_IS_SHOW_VIDEO, {
                flag: false,
                info: {}
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
            const { id } = store.state.common.viewVideoInfo;
            if (!id) return;
            isMinimized.value = false;
            if (id === lastId.value) {
                if (btnName.value === "暂停") {
                    videoRef.value!.play();
                }
                return;
            }
            lastId.value = id;
            getFileAndPauseByFile({
                fileID: store.state.common.viewVideoInfo.id
            }).then(async (res) => {
                if (res.resultCode === 200) {
                    const { FilePauses, VideoFile } = res.result;
                    const { Extention, FilePath, FileName, Bucket, SN } = VideoFile;
                    filePauses.value = changeData(FilePauses);
                    fileSn.value = SN;
                    const key = Extention
                        ? `${FilePath}/${FileName}.${Extention}`
                        : `${FilePath}/${FileName}`;
                    const url = await downloadFile(key, Bucket);
                    if (url !== videoUrl.value) {
                        videoUrl.value = url;
                    }
                }
            });
        });

        const openVideoWin = () => {
            isMinimized.value = false;
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

        onMounted(() => {
            if (isElectron) {
                window.electron.ipcRenderer.on("openVideoWin", openVideoWin);
                window.electron.ipcRenderer.on("closeVideoWin", closeVideoWin);
            }
        });

        onUnmounted(() => {
            if (isElectron) {
                window.electron.ipcRenderer.removeListener("openVideoWin", openVideoWin);
                window.electron.ipcRenderer.removeListener("closeVideoWin", closeVideoWin);
            }
        });

        return {
            marks,
            videoUrl,
            clearBoard,
            initVideo,
            btnName,
            btnType,
            videoRef,
            closeVideo,
            smallVideo,
            isMinimized,
            videoTimeUpdate,
            getAudioLength,
            eraserHandle,
            playPause,
            changeVideoTime,
            brushHandle,
            isElectron,
            fileSn,
            childRef,
            formateSeconds
        };
    },
    components: { Brush }
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
    z-index: 9999;
    overflow: hidden;
    background: #fff;
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
    > div:nth-of-type(1) {
        background: url("./../../assets/look/btn_huabi@2x.png");
        background-size: 100% 100%;
    }
    > div:nth-of-type(2) {
        background: url("./../../assets/look/btn_xiangpi@2x.png");
        background-size: 100% 100%;
    }
    > div:nth-of-type(3) {
        background: url("./../../assets/look/btn_qingkong@2x.png");
        background-size: 100% 100%;
    }
    > div:nth-of-type(4) {
        background: url("./../../assets/look/btn_guanbi@2x.png");
        background-size: 100% 100%;
        p {
            color: #fff;
        }
    }
    > div:nth-of-type(5) {
        background: url("./../../assets/look/btn_zuixiaohua@2x.png");
        background-size: 100% 100%;
    }
    > div:nth-of-type(6) {
        width: 120px;
        p {
            color: #fff;
        }
    }
    > div:nth-of-type(6).play {
        background: url("./../../assets/look/btn_zanting@2x.png");
        background-size: 100% 100%;
    }
    > div:nth-of-type(6).stop {
        background: url("./../../assets/look/btn_bofang@2x.png");
        background-size: 100% 100%;
    }
}
</style>
