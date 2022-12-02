<template>
    <div class="star-container">
        <div class="star-header">
            小组比拼
            <span v-if="!isExpand" class="expand-btn" @click="expand()">展开</span>
        </div>
        <div class="star-list" :class="isExpand && 'expand'">
            <div
                class="team-item"
                v-for="(item, index) in teamArr"
                :key="index"
            >
                <img class="team-award-img" v-if="awardTeam.indexOf(index) > -1" src="./images/pic_metal@2x.png" alt="" srcset="">
                <div class="team-name">{{ index + 1 }}&nbsp;号小组</div>
                <div class="star-box">
                    <div class="star" :class="!isExpand && i > 11 && 'fixed-star'" v-for="(star, i) in item" :key="i">
                        <img
                            :class="
                                actionAnimationStar === `${index}_${i}` &&
                                'star-animation'
                            "
                            :style="{
                                marginLeft:
                                    actionAnimationStar === `${index}_${i}` && i < 11
                                        ? 220 - i * 12 + 'px'
                                        : 0
                            }"
                            :src="starImages[index]"
                            alt=""
                        />
                        <span
                            class="star-num"
                            v-if="item.length - 1 > 0 && item.length - 1 === i"
                            >{{ item.length }}</span
                        >
                    </div>
                </div>
                <div class="add-btn" @click="addStar(item, index)">
                    <img src="./images/icon_add@2x.png" alt="" />
                </div>
            </div>
        </div>
        <div class="star-footer" v-if="isExpand">
            <el-button class="star-btn" type="danger" @click="close()"
                >结束比拼</el-button
            >
            <el-button class="star-btn" @click="minimize()">最小化</el-button>
            <el-popover
                :width="224"
                trigger="click"
            >
                <div class="award-team-list">
                    <div
                        class="award-team-item"
                        :style="{ backgroundColor: teamColors[index] }"
                        v-for="(item, index) in teamArr"
                        :key="index"
                        @click="award(index)"
                    >
                        {{index + 1}}
                    </div>
                </div>
                <template #reference>
                    <div class="award-btn">
                        <img src="./images/pic_metal@2x.png" alt="" />
                        颁奖
                    </div>
                </template>
            </el-popover>
        </div>
    </div>
    <div class="award-animation-container" v-show="awardShow">
        <div class="award-animation" ref="awardAni"></div>
        <div class="award-team-text">第 {{awardTeamShow + 1}} 小组</div>
    </div>
    <!-- <audio controls src="../../assets/teamCompetition/award.mp3" ref="audioRef"></audio> -->
</template>

<script lang="ts">
import { nextTick } from "process";
import { computed, defineComponent, watch, ref } from "vue";
import { animationData } from "./animation/data";
import lottie, { AnimationItem } from "lottie-web";
import { awardAudio } from "./award";

export default defineComponent({
    props: {
        teamNum: {
            type: Number,
            default: 4
        }
    },
    emits: ["expand"],
    setup(props, { emit }) {
        const teamNum = computed(() => props.teamNum);
        const teamArr = ref(
            Array.from(new Array(teamNum.value)).map((item) => [])
        );
        const awardTeam = ref<number[]>([]);
        const isExpand = ref(false);
        const actionAnimationStar = ref("");

        const addStar = (arr: number[], m: number) => {
            playAudio(addStarAudio);
            arr.push(1);
            actionAnimationStar.value = `${m}_${arr.length - 1}`;
            setTimeout(() => {
                actionAnimationStar.value = "";
            }, 100);
        };

        const close = () => {
            window.electron.destroyWindow();
        };

        const minimize = () => {
            isExpand.value = false;
            const size =
                window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            window.electron.setContentSize(300, 244);
            window.electron.setPositionWin(
                size.width - 20 - 300,
                size.height - 300 - 244 - 260
            );
        };

        minimize();

        const expand = () => {
            isExpand.value = true;
            emit("expand");
        };

        const starImages = [
            require("./images/star1@2x.png"),
            require("./images/star2@2x.png"),
            require("./images/star3@2x.png"),
            require("./images/star4@2x.png"),
            require("./images/star5@2x.png"),
            require("./images/star6@2x.png"),
            require("./images/star7@2x.png"),
            require("./images/star8@2x.png"),
            require("./images/star9@2x.png"),
            require("./images/star10@2x.png")
        ];

        const addStarAudio = require("../../assets/teamCompetition/star.mp3");
        const addAwardAudio = awardAudio;

        const awardShow = ref(false);
        const awardAni = ref();
        let awardLottie: AnimationItem | null;
        nextTick(() => {
            awardLottie = lottie.loadAnimation({
                container: awardAni.value,
                renderer: "svg",
                loop: false,
                autoplay: false,
                animationData: animationData
            });
        });

        const awardTeamShow = ref(0);
        const audioRef = ref();
        const award = (i: number) => {
            awardShow.value = true;
            // awardLottie?.play();
            awardLottie?.goToAndPlay(0);
            awardTeamShow.value = i;
            playAudio(addAwardAudio);
            // audioRef.value.play();
            setTimeout(() => {
                awardShow.value = false;
                if (awardTeam.value.indexOf(i) === -1) {
                    awardTeam.value.push(i);
                }
            }, 2000);
        };

        const playAudio = (src: any) => {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            audio.src = src;
            audio.oncanplaythrough = () => {
                audio.play();
            };
            audio.onended = () => {
               audio.remove();
            }

        };

        const teamColors = [
            "#F7D214",
            "#4FCC94",
            "#63D1FA",
            "#FF994E",
            "#E55BF0",
            "#8F32F9",
            "#FF5B40",
            "#7185B3",
            "#81D827",
            "#4B71EE"
        ];

        return {
            teamArr,
            teamNum,
            actionAnimationStar,
            isExpand,
            addStar,
            close,
            minimize,
            expand,
            starImages,
            awardAni,
            award,
            teamColors,
            awardShow,
            awardTeam,
            awardTeamShow,
            audioRef
        };
    }
});
</script>

<style scoped>
.star-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.star-header {
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    /* background: #eef0f7; */
    color: #848891;
    background: linear-gradient(270deg, rgba(237,244,246,0) 0%, #EDF4F6 100%);
    -webkit-app-region: drag;
    position: relative;
}

.expand-btn {
    -webkit-app-region: no-drag;
    position: absolute;
    right: 15px;
    font-size: 14px;
    color: #4b71ee;
    cursor: pointer;
    top: 13px;
}

.star-list {
    padding: 12px 28px;
    min-height: 0;
    overflow-y: auto;
    flex: 1;
}

.star-list::-webkit-scrollbar {
  display: none;
}

.team-item {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 24px;
    font-size: 14px;
    position: relative;
    margin-bottom: 10px;
}

.expand.star-list {
    padding: 26px 40px 0;
    margin-bottom: 40px;
}

.team-name {
    position: relative;
    font-size: 12px;
    top: 4px;
    width: 54px;
}

.expand .team-name {
    font-size: 14px;
    top: 4px;
    width: 64px;
}

.expand .team-item {
    height: auto;
    min-height: 32px;
}

.expand .star {
    width: auto;
    margin-bottom: 8px;
}

.expand .star img {
    position: relative;
    width: 30px;
}

.expand .star-box {
    flex-wrap: wrap;
}

.star-box {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    margin-left: 12px;
}

.star {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 12px;
}

.star img {
    position: absolute;
    width: 24px;
    display: block;
    transition: 0.3s all ease-in;
    transform: rotateY(0deg);
    margin-left: 0;
}

.star img.star-animation {
    transform: rotateY(540deg);
}

.expand .star img.star-animation {
    margin-left: 0 !important;
}

.add-btn {
    cursor: pointer;
    width: 16px;
    position: relative;
    top: 4px;
}

.expand .add-btn {
    width: 20px;
    top: 2px;
    margin-left: 10px;
}

.fixed-star {
    width: 0;
}

.fixed-star img {
    margin-left: 12px !important;
}

.fixed-star .star-num {
    margin-left: 12px;
}

.add-btn img {
    display: block;
    width: 100%;
}

.star-footer {
    padding: 24px;
    position: relative;
}

.star-footer .star-btn {
    width: 100px;
}

.award-btn {
    position: absolute;
    right: 24px;
    bottom: 24px;
    color: #ef9900;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}

.award-btn img {
    display: block;
    width: 50px;
    margin-bottom: 11px;
}

.star-num {
    position: absolute;
    z-index: 10;
    font-size: 12px;
    color: #fff;
    transform-origin: center;
    transform: scale(.8);
}

.expand .star-num {
    transform: scale(1);
}

.award-animation-container {
    position: fixed;
    z-index: 100000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.award-animation {
    width: 500px;
}

.award-team-list {
    display: flex;
    flex-wrap: wrap;
    width: 210px;
    margin-bottom: -10px;
}

.award-team-item {
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #F7D214;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
}

.team-award-img {
    position: absolute;
    width: 20px;
    left: -25px;
    margin-top: 4px;
    animation: award-show-animation 1s forwards;
}

.expand .team-award-img {
    width: 28px;
    left: -35px;
    margin-top: 0;
}

.award-team-text {
    position: absolute;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    font-weight: 600;
    color: white;
}

@keyframes award-show-animation {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
</style>
