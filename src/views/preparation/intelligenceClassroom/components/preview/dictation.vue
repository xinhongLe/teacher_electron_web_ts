<template>
    <div class="dictation-box">
        <div class="header">
            <img src="../../images/bg_tittle.png" />
            <div class="select-btn" @click="openSelect" v-if="showSetting">
                <img src="../../images/icon_setting.png" />
                <span>听写设置</span>
            </div>
        </div>
        <div class="content" v-if="isShowAnswer">
            <div
                :class="{ active: index === nowReadingIndex ? true : false }"
                v-for="(item, index) in audioList"
                :key="index"
                @click="play(index)"
            >
                <p>{{ item.name }}</p>
                <div v-if="item.isPlay">
                    <img src="../../images/icon_volume_notice_small.png" />
                    <span>正在播报...</span>
                </div>
                <img src="../../images/icon_over.png" />
            </div>
        </div>
        <div class="content content1" v-else>
            <div
                :class="{ active: index === nowReadingIndex ? true : false }"
                v-for="(item, index) in audioList"
                :key="index"
            >
                <p v-if="!item.isPlay">{{ index + 1 }}</p>
                <div v-else>
                    <img src="../../images/icon_volume_notice_small.png" />
                    <span>正在播报...</span>
                </div>
                <img src="../../images/icon_over.png" />
            </div>
        </div>
        <div class="footer">
            <div class="num">
                <span>每个字词播报</span>
                <div>
                    <span
                        :class="{ active: readingTimes == 1 ? true : false }"
                        @click="readingTimes = 1"
                        >1遍</span
                    >
                    <span
                        :class="{ active: readingTimes == 2 ? true : false }"
                        @click="readingTimes = 2"
                        >2遍</span
                    >
                </div>
            </div>
            <div class="btns">
                <div class="btn" v-if="playStatus === 1" @click="play(0)">
                    <img src="../../images/icon_start.png" />
                    <span>开始听写</span>
                </div>
                <div
                    class="btn"
                    v-if="playStatus === 3"
                    @click="play(nowReadingIndex)"
                >
                    <img src="../../images/icon_start.png" />
                    <span>继续听写</span>
                </div>
                <div class="btn btn1" v-if="playStatus === 2" @click="pause()">
                    <img src="../../images/icon_zanting.png" />
                    <span>暂停</span>
                </div>
                <div
                    class="btn btn2"
                    v-if="playStatus === 4"
                    @click="startPlay(0)"
                >
                    <img src="../../images/icon_restart.png" />
                    <span>重新播报</span>
                </div>
                <img
                    src="../../images/btn_xianshidaan.png"
                    v-if="!isShowAnswer"
                    @click="isShowAnswer = true"
                />
                <img
                    src="../../images/btn_yincangdaan.png"
                    v-else
                    @click="isShowAnswer = false"
                />
            </div>
        </div>
        <!-- <Select :visible.sync="showSelect" :audioList.sync="audioList"></Select> -->
    </div>
</template>
<script>
import { defineComponent, onMounted, watch } from "vue-demi";
import dictation from "../../hooks/dictation";
import { downloadFile } from "@/utils/oss";
export default defineComponent({
    props: {
        source: {
            type: Array,
            default: () => []
        },
        showSetting: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const {
            playStatus,
            audioList,
            readingTimes,
            delayTime,
            nowReadingIndex,
            timer,
            audio,
            showSelect,
            isShowAnswer,
            openSelect
        } = dictation();
        const initAudioList = (source) => {
            audioList.value = JSON.parse(JSON.stringify(source));
            audioList.value.forEach(
                (e) => (e.readingTimes = readingTimes.value)
            );
        };
        const startPlay = (index) => {
            audioList.value.forEach(
                (e) => (e.readingTimes = readingTimes.value)
            );
            console.log(audioList, "11111111111111");
            play(index);
        };
        onMounted(() => {
            audio.value = new Audio();
            initAudioList(props.source);
        });
        const play = (index) => {
            console.log(timer.value, "121212");
            clearTimeout(timer.value);
            timer.value = setTimeout(async () => {
                playStatus.value = 2;
                nowReadingIndex.value = index;
                audioList.value.map((v, i) => {
                    // this.$set(this.audioList[i], "isPlay", false);
                    console.log(v, i);
                });
                // this.$set(this.audioList[index], "isPlay", true);
                if (!audioList.value[index].url) {
                    debugger;
                    const obj = audioList.value[index];
                    audioList.value[index]["url"] = await downloadFile(
                        obj.fileName + "." + obj.extention,
                        obj.bucket
                    );
                }
                audio.value.src = this.audioList[index].url;
                audio.value.pause();
                audio.value.play();
                audio.value.onended = () => {
                    // this.$set(this.audioList[index], "isPlay", false);
                    if (
                        index === audioList.value.length - 1 &&
                        audioList.value[index].readingTimes === 1
                    ) {
                        playStatus.value = 4;
                        nowReadingIndex.value = "";
                        return;
                    }
                    timer.value = setTimeout(() => {
                        if (audioList.value[index].readingTimes === 2) {
                            audioList.value[index].readingTimes = 1;
                            play(nowReadingIndex.value);
                        } else {
                            play(nowReadingIndex.value + 1);
                        }
                    }, delayTime.value);
                };
            }, 300);
        };
        watch(
            () => props.source,
            () => {
                initAudioList(props.source);
            }
        );
        return {
            playStatus,
            audioList,
            readingTimes,
            delayTime,
            nowReadingIndex,
            timer,
            audio,
            showSelect,
            isShowAnswer,
            openSelect,
            startPlay,
            play
        };
    }
});
</script>

<style lang="scss" scoped>
.dictation-box {
    min-height: 0;
    flex: 1;
    display: flex;
    background-color: #fff;
    flex-direction: column;
    height: 100%;
}

.dictation-box .header > img {
    width: 298px;
    margin: 20px 0 0 44px;
    float: left;
}

.dictation-box .header .select-btn {
    width: 137px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #98aef6;
    float: right;
    margin: 23px 20px 23px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.dictation-box .header .select-btn img {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.dictation-box .header .select-btn span {
    font-size: 16px;
    color: #4b71ee;
    line-height: 40px;
}

.dictation-box .content {
    background: url("../../images/bg_blue.png");
    background-size: 100% 100%;
    flex: 1;
    min-height: 0;
    padding: 50px;
    box-sizing: border-box;
    margin: 0 20px;
    overflow: auto;
    padding-bottom: 10px;
    text-align: center;
}

.dictation-box .content > div {
    background: url("../../images/bg_card.png");
    background-size: 100% 100%;
    height: 112px;
    width: calc((100% - 120px) / 4);
    margin-bottom: 30px;
    float: left;
    margin-right: 40px;
    position: relative;
    cursor: pointer;
    user-select: none;
}

.dictation-box .content > div:nth-of-type(4n) {
    margin-right: 0px;
}

.dictation-box .content > div p {
    font-size: 36px;
    color: #19203d;
    line-height: 50px;
    margin: 0 auto;
    padding-top: 23px;
}

.dictation-box .content > div p {
    font-size: 44px;
    line-height: 54px;
    padding-top: 26px;
}

.dictation-box .content > div div {
    display: flex;
    justify-content: center;
    align-content: center;
}

.dictation-box .content > div > img {
    width: 42px;
    position: absolute;
    top: 30px;
    right: 16px;
    display: none;
}

.dictation-box .content > div:last-of-type img {
    display: block;
}

.dictation-box .content1 > div:last-of-type > img {
    /* display: none; */
}

.dictation-box .content > div div img {
    width: 20px;
    margin-right: 4px;
}

.dictation-box .content1 > div div img {
    width: 40px;
    margin-top: 33px;
}

.dictation-box .content1 > div div span {
    font-size: 28px;
    font-weight: 600;
    color: #12aaff;
    line-height: 40px;
    margin-top: 33px;
}

.dictation-box .content > div span {
    font-size: 16px;
    font-weight: 600;
    color: #12aaff;
    line-height: 20px;
}

.dictation-box .content .active:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 112px;
    border-radius: 14px;
    border: 4px solid #88d4ff;
    left: -4px;
    top: -4px;
}

.footer {
    height: 80px;
    position: relative;
}

.footer .btns {
    display: flex;
    width: 100%;
    justify-content: center;
}

.footer .btns > img {
    width: 64px;
    height: 64px;
    margin: 8px 0 0 24px;
    cursor: pointer;
    user-select: none;
}

.footer .btn {
    width: 264px;
    float: left;
    height: 64px;
    background: url("../../images/btn_blue.png");
    margin: 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
}

.footer .btn1 {
    background: url("../../images/btn_zanting.png");
}

.footer .btn2 {
    background: url("../../images/btn_restart.png");
}

.footer .btn img {
    width: 19px;
    margin-right: 8px;
    height: 23px;
}

.footer .btn1 img {
    width: 20px;
    height: 20px;
}

.footer .btn2 img {
    width: 28px;
}

.footer .btn span {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    line-height: 33px;
}

.footer .num {
    position: absolute;
    top: 24px;
    left: 20px;
}

.footer .num > span {
    float: left;
    font-size: 14px;
    color: #19203d;
    line-height: 32px;
    float: left;
}

.footer .num > div {
    margin-left: 12px;
    float: left;
    width: 120px;
    height: 30px;
    background: #f5f6fa;
    border-radius: 4px;
    border: 1px solid #e0e2e7;
    font-size: 14px;
    color: #5f626f;
    line-height: 30px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    user-select: none;
}

.footer .num > div span {
    text-align: center;
    float: left;
    display: block;
    flex: 1;
}

.footer .num > div .active {
    width: 58px;
    height: 30px;
    background: #4b71ee;
    border-radius: 3px;
    color: #fff;
}
</style>
