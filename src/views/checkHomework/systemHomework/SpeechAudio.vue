<template>
    <div class="speech-audio-box">
        <div
            v-for="(item, index) in audioList"
            :key="index"
            class="speech-audio-item"
        >
            <div class="speech-audio" @click="playAudio(index)" :class="{'audio-red': item.score < 85}">
                <div
                    class="wifi-symbol"
                    :class="playIndex == index ? 'animation' : ''"
                >
                    <div class="first"></div>
                    <div class="wifi-circle second"></div>
                    <div class="wifi-circle third"></div>
                </div>
                <div class="audio-time">{{ item.time }}</div>
            </div>
            <div class="score">{{ item.score }}分</div>
        </div>
        <audio ref="audioRef" :src="speechAudio" :loop="false" />
    </div>
</template>

<script lang="ts">
import { SpeechAssessResult } from "@/types/checkHomework";
import { getOssUrl } from "@/utils/oss";
import { defineComponent, PropType, ref, watch } from "vue";
export default defineComponent({
    props: {
        speechResult: {
            type: Array as PropType<SpeechAssessResult[]>,
            default: () => []
        }
    },

    setup(props) {
        const playIndex = ref<number | null>(null);
        const audioRef = ref<HTMLAudioElement>();
        const audioList = ref<
            {
                time: string;
                url: string;
                score: number;
            }[]
        >([]);
        const speechAudio = ref("");
        const cacheSpeechResult = ref<SpeechAssessResult[]>([]);

        function dealTime(s: number) {
            s = Math.ceil(s / 1000);
            const mm = Math.floor(s / 60);
            const ss = s - mm * 60;
            return (
                mm.toString().padStart(2, "0") +
                ":" +
                ss.toString().padStart(2, "0")
            );
        }

        const dealSpeechText = () => {
            playIndex.value = null;
            audioRef.value && audioRef.value.pause();
            audioList.value = [];
            speechAudio.value = "";
            const speechResult = JSON.parse(
                JSON.stringify(props.speechResult)
            ).reverse() as SpeechAssessResult[];

            speechResult.map(async (item) => {
                const {
                    File: { Extention, FilePath, FileName, Bucket }
                } = item;

                const key = Extention
                    ? `${FilePath}/${FileName}.${Extention}`
                    : `${FilePath}/${FileName}`;
                const url = await getOssUrl(key, Bucket);

                audioList.value.push({
                    time: dealTime(item.Wavetime),
                    score: item.Overall,
                    url
                });
            });
        };

        const playAudio = (i: number) => {
            console.log(audioRef.value?.paused);
            if (!audioRef.value?.paused) {
                playIndex.value = null;
                return audioRef.value!.pause();
            }

            playIndex.value = i;
            speechAudio.value = audioList.value[i].url;
            audioRef.value!.addEventListener("ended", () => {
                // 每次点击播放 监听结束事件 防止莫名情况 没有监听到结束 增加判断 减少执行
                if (playIndex.value != null && speechAudio.value) {
                    playIndex.value = null;
                    speechAudio.value = "";
                }
            });
            setTimeout(() => {
                audioRef.value!.play();
            }, 200);
        };
        watch(
            () => props.speechResult,
            (val) => {
                if (
                    JSON.stringify(val) !==
                    JSON.stringify(cacheSpeechResult.value)
                ) {
                    cacheSpeechResult.value = val;
                    dealSpeechText();
                }
            }
        );

        dealSpeechText();
        return {
            speechAudio,
            audioList,
            playIndex,
            audioRef,
            playAudio
        };
    }
});
</script>

<style lang="scss" scoped>
.speech-audio-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .speech-audio-item {
        &:first-child {
            margin-right: 20px;
        }

        &:last-child {
            margin-right: 0;
        }

        .speech-audio {
            position: relative;
            height: 50px;
            background-color: #34E1B6;
            border-radius: 10px;
            display: flex;
            align-items: center;
            cursor: pointer;
            &.audio-red {
                background-color: #FF6B6B;
            }
        }

        .audio-time {
            margin-left: -18px;
            margin-right: 23px;
            color: #ffffff;
            font-weight: 600;
        }

        .speech-audio:before {
            content: "";
            display: block;
            border: 10px solid;
            border-color: #34E1B6 transparent transparent #34E1B6;
            position: absolute;
            bottom: -10px;
            left: 10px;
        }

        .speech-audio.audio-red:before {
            border-color: #FF6B6B transparent transparent #FF6B6B;
        }

        .wifi-symbol {
            width: 50px;
            height: 50px;
            box-sizing: border-box;
            overflow: hidden;
            transform: rotate(135deg) scale(0.7);
            margin-left: 20px;
        }
        .wifi-circle {
            border: 5px solid #ffffff;
            border-radius: 50%;
            position: absolute;
        }
        .first {
            width: 10px;
            height: 10px;
            background: #ffffff;
            border-radius: 5px;
            position: absolute;
            top: 40px;
            left: 40px;
        }

        .second {
            width: 30px;
            height: 30px;
            top: 30px;
            left: 30px;
        }

        .third {
            width: 45px;
            height: 45px;
            top: 20px;
            left: 20px;
        }

        .wifi-symbol.animation .second {
            animation: fadeInOut 1s infinite 0.2s;
        }

        .wifi-symbol.animation .third {
            animation: fadeInOut 1s infinite 0.4s;
        }

        @keyframes fadeInOut {
            0% {
                opacity: 0; /*初始状态 透明度为0*/
            }
            100% {
                opacity: 1; /*结尾状态 透明度为1*/
            }
        }
    }
    .score {
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        margin-top: 10px;
    }
}
</style>
