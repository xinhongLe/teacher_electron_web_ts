<template>
    <div class="container">
        <el-dialog v-model="isShow" fullscreen :show-close="false" v-if="isShow">
            <Content v-model:isShow="isShow" :roomId="roomId" :projectSuccess="projectSuccess"/>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watchEffect, watch, h, onUnmounted} from "vue";
import * as mqtt from "mqtt";
import {ElMessage, ElMessageBox, MessageHandler} from "element-plus";
import {store} from "@/store";
import Content from "./Content.vue";
import {clearInterval, setInterval} from "timers";
import {VUE_APP_YUN_API_MQTT} from "@/config";

const imgError = require("@/assets/projection/img_error@2x.png");
let messageHandle: MessageHandler;
export default defineComponent({
    setup() {
        const isShow = ref(false);
        const client = mqtt.connect(VUE_APP_YUN_API_MQTT || "", {
            port: process.env.NODE_ENV === "development" ? 8083 : 0,
            keepalive: 30
        });
        const noSignalCount = ref(0); // 没收到心跳的次数
        const id = computed(() => store.state.userInfo.id);
        const videoProject = computed(() => `videoProject_${id.value}`);
        const videoProjectResult = computed(() => `videoProjectResult_${id.value}`);
        const heartbeat = computed(() => `heartbeat_${id.value}`);
        const heartbeatResult = computed(() => `heartbeatResult_${id.value}`);
        let heartbeatTimer: any;

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
            window.electron.log.info("receive heartbeat result");
            noSignalCount.value = 0;
        };

        const sendHeartbeat = () => {
            heartbeatTimer && clearInterval(heartbeatTimer);
            heartbeatTimer = setInterval(() => {
                if (!isShow.value) return;
                noSignalCount.value < 6 && noSignalCount.value++;
                window.electron.log.info("start send heartbeat");
                client.publish(getPublish(heartbeat.value), "");
            }, 10 * 1000);
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
        });
        watch(noSignalCount, (v) => {
            window.electron.log.info("noSignalCount change", noSignalCount.value);
            if (v === 0) {
                messageHandle && messageHandle.close();
            } else if (v === 3) {
                messageHandle = ElMessage.error({
                    message: "网络卡顿，请等待！",
                    duration: 0
                });
            } else if (v === 6) {
                messageHandle && messageHandle.close();
                ElMessageBox.alert(h("div", {style: "display: flex;flex-direction: column;align-items: center;padding: 40px;"}, [
                    h("img", {src: imgError, style: "width: 144px"}, ""),
                    h("span", {style: "color: #212743;font-size: 20px;margin-top: 20px;"}, "网络断开，请重试!")
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
                clearInterval(heartbeatTimer);
                noSignalCount.value = 0;
                messageHandle && messageHandle.close();
                ElMessageBox.close();
                client.unsubscribe(getSubscribe(heartbeatResult.value));
                client.unsubscribe(getSubscribe(heartbeat.value));
            } else {
                client.subscribe(getSubscribe(heartbeatResult.value));
                client.subscribe(getSubscribe(heartbeat.value));
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
    components: {Content}
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
