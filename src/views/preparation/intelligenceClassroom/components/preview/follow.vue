<template>
    <div class="me-follow-box" v-if="videoUrl">
        <video
            class="me-video"
            ref="video"
            @ended="videoEnd()"
            :src="videoUrl"
        ></video>
        <div class="me-pause-box">
            <div
                class="me-pause-item"
                @click="pausePlay($event, index)"
                :class="pauseIndex === index && 'active'"
                v-for="(item, index) in pauseList"
                :key="index"
            ></div>
        </div>
        <div class="me-follow-footer">
            <div class="me-mode-select">
                模式选择：
                <div
                    class="me-mode-item"
                    :class="mode === 0 && 'active'"
                    @click="mode = 0"
                >
                    全文播放
                </div>
                <div
                    class="me-mode-item"
                    :class="mode === 1 && 'active'"
                    @click="mode = 1"
                >
                    自然跟读
                </div>
                <div
                    class="me-mode-item"
                    :class="mode === 2 && 'active'"
                    @click="mode = 2"
                >
                    手动跟读
                </div>
            </div>
            <div class="me-play-btn" @click="playEvent()">
                <i
                    class="me-icon el-icon-video-play"
                    v-if="videoStatus === 0 || videoStatus === 3"
                ></i>
                <i
                    class="me-icon el-icon-video-pause"
                    v-if="videoStatus === 1"
                ></i>
                <i
                    class="me-icon el-icon-refresh-right"
                    v-if="videoStatus === 4"
                ></i>
                <div class="me-audio-box" v-if="videoStatus === 2">
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                    <div class="me-audio-line"></div>
                </div>
                <div v-if="videoStatus === 2" class="me-wait-time">
                    {{ timeCount }}s
                </div>
                {{ ["开始", "暂停", "", "继续", "重播"][videoStatus] }}
            </div>
            <div style="width: 371px"></div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref } from "vue-demi";
export default defineComponent({
    props: {
        source: {
            type: Array,
            default: () => []
        }
    },
    setup() {
        const pauseIndex = ref(0);
        const mode = ref(1);
        const pauseList = ref([]);
        const timeInterval = ref(null);
        const timeCountInterval = ref(null);
        const timeCount = ref(0);
        const isPlaying = ref(false);
        const isEnd = ref(false);
        const videoUrl = ref("");
        return {
            videoUrl,
            pauseIndex,
            mode,
            pauseList,
            timeInterval,
            timeCountInterval,
            timeCount,
            isPlaying,
            isEnd
        };
    }
});
</script>

<style lang="scss" scoped>
.me-follow-box {
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.me-video {
    display: block;
    max-height: calc(100vh - 337px);
    width: 100%;
}

.me-pause-box {
    height: 25px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
}

.me-pause-item {
    flex: 1;
    background-color: #ccd0db;
    margin-right: 2px;
    cursor: pointer;
}

.me-pause-item:last-child {
    margin-right: 0;
}

.me-pause-item.active {
    background-color: #4b71ee;
}

.me-follow-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
}

.me-mode-select {
    display: flex;
    color: #888;
    align-items: center;
}

.me-mode-item {
    padding: 5px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 15px;
    cursor: pointer;
    margin-right: 5px;
}

.me-mode-item.active {
    background-color: #4b71ee;
    color: #fff;
}

.me-play-btn {
    padding: 8px 40px;
    border-radius: 5px;
    background-color: #4b71ee;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    white-space: nowrap;
}

.me-play-btn:active {
    background-color: #839cf0;
}

.me-icon {
    font-size: 26px;
    margin-right: 5px;
    margin-left: -5px;
}

.me-audio-box {
    display: flex;
    align-items: flex-end;
}

.me-audio-line:nth-of-type(0) {
    animation: audio 0.5s linear 0.1s infinite alternate;
}

.me-audio-line:nth-of-type(1) {
    animation: audio 0.5s linear 0.2s infinite alternate;
}

.me-audio-line:nth-of-type(2) {
    animation: audio 0.5s linear 0.5s infinite alternate;
}

.me-audio-line:nth-of-type(4) {
    animation: audio 0.5s linear 0.2s infinite alternate;
}

.me-audio-line:nth-of-type(5) {
    animation: audio 0.5s linear 0.3s infinite alternate;
}

.me-audio-line:nth-of-type(6) {
    animation: audio 0.5s linear 0.1s infinite alternate;
}

.me-audio-line {
    width: 5px;
    height: 20px;
    background-color: #fff;
}

.me-wait-time {
    font-size: 14px;
    position: absolute;
    right: 8px;
}

@keyframes audio {
    from {
        height: 1px;
    }
    to {
        height: 20px;
    }
}
</style>
