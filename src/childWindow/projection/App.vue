<template>
    <el-config-provider :locale="locale">
        <div class="container">
            <div class="video-warp">
                <div class="video">
                    <video ref="videoRef" autoplay/>
                    <canvas class="camera-photo" ref="photoCanvasRef"></canvas>

                    <div class="photo-view" v-if="photoSrc">
                        <img
                            @mousewheel="handleMousewheelScreen"
                            @mousedown="onMove"
                            @touchstart="$event => touchStartListener($event, true)"
                            @touchend="touchEndListener"
                            @touchmove="$event => touchMoveListener($event, true)"
                            ref="photoRef"
                            :style="{
                                transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`
                            }"
                            :src="photoSrc"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="camera-select">
                    <img
                        src="@/assets/images/suspension/icon_shexiangtou@2x.png"
                    />
                    <span class="text">摄像头:</span>
                    <el-select
                        placeholder="请选择摄像头"
                        v-model="deviceId"
                    >
                        <el-option
                            v-for="item in videoList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>

                    <el-button class="camera-photo-btn" type="primary" @click="photo">{{ photoSrc ? '重拍' : '拍照' }}</el-button>
                    <el-button class="camera-photo-btn" type="primary" @click="imageRotate" v-if="photoSrc">旋转</el-button>
                </div>
                <el-button type="danger" @click="close"> 关闭投影</el-button>
            </div>
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import {ElMessageBox} from "element-plus";
import {defineComponent, onMounted, ref, toRefs, watch} from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { nextTick } from "process";
import useTransform from "@/hooks/useTransform";
let currentMediaStream: MediaStream | null = null;

export default defineComponent({
    setup() {
        const videoRef = ref<HTMLVideoElement>();
        const photoCanvasRef = ref<HTMLCanvasElement>();
        const photoContext = ref<CanvasRenderingContext2D | null>(null);
        const videoList = ref<{ label: string; id: string }[]>([]);
        const deviceId = ref("");
        const photoSrc = ref("");
        let streamWidth = 1280;
        let streamHeight = 720;

        nextTick(() => {
            if (photoCanvasRef.value) {
                const width = photoCanvasRef.value.clientWidth;
                const height = photoCanvasRef.value.clientHeight;
                photoCanvasRef.value.style.width = `${width}px`;
                photoCanvasRef.value.style.height = `${height}px`;

                const dpr = window.devicePixelRatio;
                photoCanvasRef.value.width = width * dpr;
                photoCanvasRef.value.height = height * dpr;
                photoContext.value = photoCanvasRef.value.getContext("2d", {
                    willReadFrequently: true
                }) as CanvasRenderingContext2D;
                photoContext.value?.scale(dpr, dpr);
            }
        });

        function gotLocalMediaStream(mediaStream: MediaStream) {
            closeCamera();
            const localVideo = document.querySelector("video");
            localVideo!.srcObject = mediaStream;
            currentMediaStream = mediaStream;
            streamWidth = mediaStream.getVideoTracks()[0].getSettings().width || 1280;
            streamHeight = mediaStream.getVideoTracks()[0].getSettings().height || 720;
        }

        async function updateDeviceList() {
            const list: { label: string; id: string }[] = [];
            const devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    list.push({
                        label: device.label,
                        id: device.deviceId
                    });
                }
            });
            videoList.value = list;
            deviceId.value = videoList.value[0]?.id || "";
        }

        const close = () => {
            ElMessageBox.confirm("确定关闭投影吗", "关闭投影", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                closeCamera();
                window.electron.destroyWindow();
            });
        };

        const closeCamera = () => {
            // 关闭摄像头
            if (currentMediaStream) {
                currentMediaStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };

        const photo = () => {
            if (photoSrc.value) {
                openCamera(deviceId.value);
                photoSrc.value = "";
                resetTransform();
                return;
            }
            if (photoCanvasRef.value && photoContext.value && videoRef.value) {
                const videoWidth = videoRef.value.clientWidth;
                const videoHeight = videoRef.value.clientHeight;
                const ratio = streamHeight / streamWidth;
                let dw = streamWidth;
                let dh = streamHeight;
                // 宽度作为标准
                if (videoWidth * ratio <= videoHeight) {
                    dw = videoWidth;
                    dh = videoHeight;
                } else {
                    dw = videoHeight / ratio;
                    dh = videoHeight;
                }

                photoCanvasRef.value.style.width = `${dw}px`;
                photoCanvasRef.value.style.height = `${dh}px`;

                const dpr = window.devicePixelRatio;
                photoCanvasRef.value.width = dw * dpr;
                photoCanvasRef.value.height = dh * dpr;
                photoContext.value = photoCanvasRef.value.getContext("2d", {
                    willReadFrequently: true
                }) as CanvasRenderingContext2D;
                photoContext.value.scale(dpr, dpr);
                
                photoContext.value.drawImage(
                    videoRef.value,
                    0,
                    0,
                    dw,
                    dh
                );
                photoSrc.value = photoCanvasRef.value.toDataURL("image/png");
                photoContext.value.clearRect(
                    0,
                    0,
                    dw,
                    dh
                );

                closeCamera();
            }
        };

        const imageRotate = () => {
            rightRotate();
        };

        const photoRef = ref();
        const {
            transform,
            leftRotate,
            rightRotate,
            onMove,
            onZoomIn,
            onZoomOut,
            isShowResetBtn,
            resetTransform,
            handleMousewheelScreen,
            touchStartListener,
            touchEndListener,
            touchMoveListener
        } = useTransform(photoRef);

        const openCamera = (deviceId: string) => {
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { min: 1280, ideal: 1920 },
                    height: { min: 720, ideal: 1080 },
                    deviceId
                },
                audio: false
            }).then(gotLocalMediaStream);
        };

        watch(deviceId, openCamera);

        onMounted(async () => {
            navigator.mediaDevices.ondevicechange = () => {
                updateDeviceList();
            };
            await updateDeviceList();
        });

        return {
            photo,
            onMove,
            handleMousewheelScreen,
            touchStartListener,
            touchEndListener,
            touchMoveListener,
            photoSrc,
            ...toRefs(transform),
            imageRotate,
            photoRef,
            videoRef,
            photoCanvasRef,
            deviceId,
            videoList,
            locale: zhCn,
            close
        };
    }
});
</script>

<style lang="scss">
html {
    font-size: 10px;
}

body {
    margin: 0;
    user-select: none;
    overflow: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background: #cfe1ff;

    .video-warp {
        padding: 5px 5px 0 5px;
        flex: 1;

        .video {
            position: relative;
            overflow: hidden;
            height: 100%;
            background: #eef4ff;
            border: 1px solid #a4c4f9;

            video {
                width: 100%;
                max-height: 100%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .camera-photo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
    
    .photo-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 101;
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            display: block;
            transform-origin: center center;
            user-select: none;
            -webkit-user-drag: none;
        }
    }

    .footer {
        height: 70px;
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;

        .camera-select {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;

            .text {
                color: #0d0e11;
                font-size: 14px;
                margin-left: 5px;
                margin-right: 5px;
            }

            img {
                width: 36px;
            }
        }

        .camera-photo-btn {
            margin-left: 20px;
        }
    }
}
</style>
