<template>
    <div style="height: 100%">
        <div class="video-container">
            <div class="view" ref="viewRef" />
        </div>
        <div class="btn-warp">
            <span class="circle"></span>
            <div class="time">{{ timeList.join(":") }}</div>
            <el-button type="danger" class="btn" @click="close">
                结束投屏
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    ref
} from "vue";
import TRTCCloud, { TRTCAppScene } from "trtc-electron-sdk";
import { TRTCParams, TRTCRoleType } from "trtc-electron-sdk/liteav/trtc_define";
import { ElMessageBox } from "element-plus";
import { store } from "@/store";
import { getUserSig } from "@/api";
import { clearInterval, setInterval } from "timers";
export default defineComponent({
    props: {
        roomId: {
            type: String,
            default: ""
        },
        projectSuccess: {
            type: Function,
            required: true
        }
    },
    setup(props, { emit }) {
        const viewRef = ref<HTMLDivElement>();
        const trtcCloud = new TRTCCloud();
        const userId = computed(() => store.state.userInfo.id + "_window");
        const timeList = ref(["00", "00"]);
        const time = ref(0);
        let timer: any;
        const sdkAppId = 1400616494;

        const onError = (err: unknown) => {
            window.electron.log.error("onEnterRoom error:", err);
        };

        const onEnterRoom = (result: number) => {
            window.electron.log.info("onEnterRoom result:", result);
            if (result > 0) {
                props.projectSuccess();
            }
        };

        const onUserVideoAvailable = (userId: string, available: unknown) => {
            window.electron.log.info("onUserVideoAvailable available:", available);
            if (available === 1) {
                trtcCloud.startRemoteView(userId, viewRef.value!);
            }
        };

        const close = () => {
            ElMessageBox.confirm("确定要结束投屏吗？", "结束投屏", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                // center: true
            }).then(() => {
                emit("update:isShow", false);
            });
        };

        trtcCloud.on("onError", onError);
        trtcCloud.on("onEnterRoom", onEnterRoom);
        trtcCloud.on("onUserVideoAvailable", onUserVideoAvailable);

        const enterRoom = async () => {
            const param = new TRTCParams();
            param.sdkAppId = sdkAppId;
            param.strRoomId = props.roomId;
            param.userId = userId.value;
            param.userSig = (await (await getUserSig({ sdkAppID: sdkAppId, userID: userId.value }))?.result)?.UserSig || "";
            param.role = TRTCRoleType.TRTCRoleAudience; // 设置角色为“观众”
            trtcCloud.enterRoom(param, TRTCAppScene.TRTCAppSceneVideoCall);
        };

        function setTimeList() {
            const h = Number(
                Math.floor(time.value / 600) < 10
                    ? "0" + String(Math.floor(time.value / 3600))
                    : Math.floor(time.value / 3600)
            );
            const m = String(
                Math.floor((time.value - h * 600) / 60) < 10
                    ? "0" + String(Math.floor((time.value - h * 600) / 60))
                    : Math.floor((time.value - h * 600) / 60)
            );
            timeList.value[0] = m;
            const s = String(
                time.value - h * 600 - Number(m) * 60 < 10
                    ? "0" + String(time.value - h * 600 - Number(m) * 60)
                    : time.value - h * 600 - Number(m) * 60
            );
            timeList.value[1] = s;
        }

        onMounted(() => {
            enterRoom();
            timer = setInterval(() => {
                time.value++;
                setTimeList();
            }, 1000);
        });

        onUnmounted(() => {
            trtcCloud.exitRoom();
            clearInterval(timer);
        });

        return {
            timeList,
            close,
            viewRef
        };
    }
});
</script>

<style lang="scss" scoped>
.video-container {
    height: 100%;
    .view {
        height: 100%;
    }
}
.btn-warp {
    position: absolute;
    display: flex;
    align-items: center;
    top: 5px;
    right: 20px;
    .circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff6b6b;
        margin-right: 8px;
    }
    .time {
        color: #19203d;
        font-size: 20px;
        margin-right: 24px;
    }
}
</style>
