<template>
    <div style="height: 100%">
        <div class="video-container">
            <div class="view" v-show="false" ref="viewRef"/>
            <div class="view" ref="viewRefT"/>
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
    defineComponent, nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch
} from "vue";
import TRTC from "trtc-js-sdk";
import {ElMessageBox} from "element-plus";
import {store} from "@/store";
import {getUserSig} from "@/api";
import {clearInterval, setInterval} from "timers";
// 输出 DEBUG 以上日志等级
TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.NONE);
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
    setup(props, {emit}) {
        const viewRef: any = ref<HTMLDivElement>();
        const viewRefT: any = ref<HTMLDivElement>();
        const userId = computed(() => store.state.userInfo.id + "_window");
        const timeList = ref(["00", "00"]);
        const time = ref(0);
        let timer: any;
        const sdkAppId = 1400616494;
        let client: any, localStream: any;
        nextTick(async () => {
            client = TRTC.createClient({
                mode: 'rtc',
                sdkAppId: sdkAppId,
                userId: userId.value,
                userSig: (await (await getUserSig({sdkAppID: sdkAppId, userID: userId.value}))?.result)?.UserSig || "",
                useStringRoomId: true,
            });
            // 1.监听事件
            client.on('stream-added', (event: any) => {
                const remoteStream = event.stream;
                console.log('远端流增加: ' + remoteStream.getId());
                //订阅远端流
                client.subscribe(remoteStream);
            });
            client.on('stream-subscribed', (event: any) => {
                // 远端流订阅成功
                const remoteStream = event.stream;
                // 播放远端流，传入的元素 ID 必须是页面里存在的 div 元素
                remoteStream.play(viewRefT.value as HTMLDivElement);
            });
            // 2.进房成功后开始推流
            try {
                await client.join({roomId: props.roomId});
                localStream = TRTC.createStream({userId: userId.value, audio: true, video: true});
                await localStream.initialize();
                // 播放本地流
                localStream.play(viewRef.value as HTMLDivElement);
                await client.publish(localStream);
                props.projectSuccess()
            } catch (error) {
                console.error(error);
            }
        })
        const close = () => {
            ElMessageBox.confirm("确定要结束投屏吗？", "结束投屏", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                // 停止本地流预览
                localStream.close();
                await client.leave();
                // 退房成功，如果没有调用 client.destroy()，可再次调用 client.join 重新进房开启新的通话
                // 调用 destroy() 结束当前 client 的生命周期
                client.destroy();
                emit("update:isShow", false);
            });
        };

        const enterRoom = async () => {
            timer && clearInterval(timer);
            timer = setInterval(() => {
                time.value++;
                setTimeList();
            }, 1000);
            // await client.join({roomId: props.roomId});

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

        });

        watch(() => props.roomId, enterRoom);

        onUnmounted(() => {
            client.leave();
            clearInterval(timer);
        });

        return {
            timeList,
            close,
            viewRef,
            viewRefT
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
