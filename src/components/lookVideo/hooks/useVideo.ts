import { ref, reactive } from "vue";
import { FilePause } from "../api";

function timeEvent(e:string) {
    const time = e;
    const len = time.split(":");
    if (len.length === 3) {
        const hour = time.split(":")[0];
        const min = time.split(":")[1];
        const sec = time.split(":")[2];
        return Number(Number(hour) * 3600) + Number(Number(min) * 60) + Number(sec);
    } else if (len.length === 2) {
        const min = time.split(":")[0];
        const sec = time.split(":")[1];
        return Number(Number(min) * 60) + Number(sec);
    } else {
        const sec = time.split(":")[0];
        return Number(sec);
    }
}

export function formateSeconds(endTime: number) {
    let secondTime = Math.floor(endTime); // 将传入的秒的值转化为Number
    let min = 0; // 初始化分
    let result = "";
    if (secondTime > 60) {
        // 如果秒数大于60，将秒数转换成整数
        min = parseInt(String(secondTime / 60)); // 获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(String(secondTime % 60)); // 获取秒数，秒数取佘，得到整数秒数
    }
    result = `${min.toString().padStart(2, "0")}:${secondTime
        .toString()
        .padStart(2, "0")}`;
    return result;
}

export default () => {
    const filePauses = ref<{time: number, hasView: boolean}[]>([]);
    const marks = ref<Record<number, string>>({});
    const videoRef = ref<HTMLVideoElement>();
    const initVideo = reactive({
        videoLength: 0, // 时长
        currentTime: 0, // 当前播放时间
        lastTime: 0 // 标记时间戳
    });
    const btnName = ref("暂停");

    // 改变视频节点数据
    const changeData = (data: FilePause[]) => {
        if (!data) return [];
        const playPoint = data.map(({ Time }) => {
            marks.value[timeEvent(Time)] = "";
            return {
                time: timeEvent(Time),
                hasView: false
            };
        });
        return playPoint;
    };

    const getAudioLength = () => {
        initVideo.videoLength = videoRef.value!.duration;
    };

    const videoTimeUpdate = () => {
        // 更新视频时间。节流，每秒触发一次
        const nowTime = Date.now();
        const gapTime = 1000;
        if (!initVideo.lastTime || nowTime - initVideo.lastTime > gapTime) {
            if (videoRef.value) {
                const time = videoRef.value.currentTime;
                initVideo.currentTime = time;
                filePauses.value.forEach((e) => {
                // 重置标志
                    if (e.hasView && time < e.time) {
                        e.hasView = false;
                    }
                    // 当视频没有播放过并且时间大于或等于应该播放的时间时暂停，状态改成已播放
                    if (!e.hasView && time >= e.time && e.time !== 0) {
                        e.hasView = true;
                        videoRef.value!.pause();
                        btnName.value = "播放";
                    }
                });
                if (time >= initVideo.videoLength) {
                    btnName.value = "暂停";
                }
            }
            initVideo.lastTime = nowTime;
        }
    };

    const changeVideoTime = (val: number) => {
        videoRef.value && (videoRef.value.currentTime = val);
    };

    const playPause = () => {
        const paused = videoRef.value!.paused;
        if (paused) {
            videoRef.value!.play();
            btnName.value = "暂停";
        } else {
            videoRef.value!.pause();
            btnName.value = "播放";
        }
    };

    return {
        filePauses,
        marks,
        videoRef,
        initVideo,
        btnName,
        getAudioLength,
        videoTimeUpdate,
        playPause,
        changeVideoTime,
        changeData
    };
};
