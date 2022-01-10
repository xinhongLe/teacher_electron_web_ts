<template>
    <div class="container">
        <el-dialog v-model="isShow" fullscreen :show-close="false" v-if="isShow">
            <Content v-model:isShow="isShow" :roomId="roomId" :projectSuccess="projectSuccess"/>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect, watch, h, onUnmounted } from "vue";
import * as mqtt from "mqtt";
import { ElMessage, ElMessageBox, MessageHandle } from "element-plus";
import { store } from "@/store";
import Content from "./Content.vue";
import { clearTimeout, setTimeout } from "timers";
const imgError = require("@/assets/projection/img_error@2x.png");

export default defineComponent({
    setup() {
        const isShow = ref(false);
        const client = mqtt.connect("wss://recognition.aixueshi.top/mqtt", {
            keepalive: 30
        });
        const noSignalCount = ref(0); // 没收到心跳的次数
        const id = computed(() => store.state.userInfo.id);
        const videoProject = computed(() => `videoProject_${id.value}`);
        const videoProjectResult = computed(() => `videoProjectResult_${id.value}`);
        const heartbeat = computed(() => `heartbeat_${id.value}`);
        const heartbeatResult = computed(() => `heartbeatResult_${id.value}`);
        let heartbeatResultTimer: any;
        let heartbeatTimer: any;
        let messageHandle:MessageHandle;

        const roomId = ref("");

        const getSubscribe = (topic: string) => {
            return topic + "_mobile";
        };

        const getPublish = (topic: string) => {
            return topic + "_pc";
        };

        const projectSuccess = () => {
            client.publish(getPublish(videoProjectResult.value), "1");
            sendHeartbeat();
        };

        const dealVideoProjectTopic = (infoString: string) => {
            const info: {
                    IsEnd: boolean;
                    roomID: string;
                } = JSON.parse(infoString);
            if (!info.IsEnd) {
                roomId.value = info.roomID;
                isShow.value = true;
            } else {
                isShow.value = false;
            }
        };

        const dealHeartbeatTopic = () => {
            client.publish(getPublish(heartbeatResult.value), "");
        };

        const dealHeartbeatResultTopic = () => {
            clearTimeout(heartbeatResultTimer);
            noSignalCount.value = 0;
            sendHeartbeat();
        };

        const sendHeartbeat = () => {
            heartbeatTimer = setTimeout(() => {
                client.publish(getPublish(heartbeat.value), "");
                heartbeatResultTimer = setTimeout(() => {
                    if (!isShow.value) return;
                    noSignalCount.value <= 6 && noSignalCount.value++;
                    sendHeartbeat();
                }, 5 * 1000);
            }, 5 * 1000);
        };

        client.on("connect", function (err) {
            window.electron.log.info("client connect", err);
        });

        client.on("error", (err) => {
            window.electron.log.info("client error", err);
        });

        client.on("message", function (topic, message) {
            // message is Buffer
            const infoString = message.toString();
            if (topic === getSubscribe(videoProject.value)) {
                dealVideoProjectTopic(infoString);
            } else if (topic === getSubscribe(heartbeat.value)) {
                dealHeartbeatTopic();
            } else if (topic === getSubscribe(heartbeatResult.value)) {
                dealHeartbeatResultTopic();
            }
        });

        watchEffect(() => {
            if (!id.value) return;
            client.subscribe(getSubscribe(videoProject.value));
            client.subscribe(getSubscribe(videoProjectResult.value));
            client.subscribe(getSubscribe(heartbeatResult.value));
            client.subscribe(getSubscribe(heartbeat.value));
            client.subscribe(getPublish(videoProject.value));
        });

        watch(noSignalCount, (v) => {
            if (v === 0) {
                messageHandle && messageHandle.close();
            } else if (v === 3) {
                messageHandle = ElMessage.error({
                    message: "网络卡顿，请等待！",
                    duration: 0
                });
            } else if (v === 6) {
                messageHandle && messageHandle.close();
                ElMessageBox.alert(h("div", { style: "display: flex;flex-direction: column;align-items: center;padding: 40px;" }, [
                    h("img", { src: imgError, style: "width: 144px" }, ""),
                    h("span", { style: "color: #212743;font-size: 20px;margin-top: 20px;" }, "网络断开，请重试!")
                ]), {
                    showClose: false,
                    center: true,
                    confirmButtonText: "确定"
                }).then(() => {
                    isShow.value = false;
                });
            }
        });

        watch(isShow, (v) => {
            if (!v) {
                const info = {
                    IsEnd: true,
                    roomID: roomId.value
                };
                client.publish(getPublish(videoProject.value), JSON.stringify(info));
                clearTimeout(heartbeatResultTimer);
                clearTimeout(heartbeatTimer);
                noSignalCount.value = 0;
                messageHandle && messageHandle.close();
            }
        });

        onUnmounted(() => {
            client.end();
        });

        return {
            isShow,
            projectSuccess,
            roomId
        };
    },
    components: { Content }
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog) {
        -webkit-app-region: no-drag;
    }
    :deep(.el-dialog__header) {
        display: none;
    }
    :deep(.el-dialog__body) {
        height: 100%;
    }
}
</style>
