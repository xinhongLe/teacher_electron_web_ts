<template>
    <el-config-provider :locale="locale">
        <div class="container">
            <div class="video-warp">
                <div class="video">
                    <video ref="videoRef" autoplay/>
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
                        v-model="mediaStreamConstraints.deviceId"
                    >
                        <el-option
                            v-for="item in videoList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </div>
                <el-button type="danger" @click="close"> 关闭投影</el-button>
            </div>
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import {ElMessageBox} from "element-plus";
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

export default defineComponent({
    setup() {
        const videoRef = ref<HTMLVideoElement>();
        const videoList = ref<{ label: string; id: string }[]>([]);
        const mediaStreamConstraints = reactive({
            video: {
                width: window.innerHeight - 10,
                height: window.innerHeight - 10
            },
            deviceId: "",
            audio: false
        });

        function gotLocalMediaStream(mediaStream: MediaStream) {
            const localVideo = document.querySelector("video");
            localVideo!.srcObject = mediaStream;
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
            mediaStreamConstraints.deviceId = videoList.value[0]?.id || "";
        }

        const close = () => {
            ElMessageBox.confirm("确定关闭投影吗", "关闭投影", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                window.electron.destroyWindow();
            });
        };

        watch(mediaStreamConstraints, (v) => {
            navigator.mediaDevices.getUserMedia(v).then(gotLocalMediaStream);
        });

        onMounted(async () => {
            navigator.mediaDevices.ondevicechange = () => {
                updateDeviceList();
            };
            await updateDeviceList();
        });

        return {
            videoRef,
            mediaStreamConstraints,
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
                position: absolute;
            }
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
    }
}
</style>
