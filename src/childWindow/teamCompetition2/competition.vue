<template>
    <div class="star-container" :class="isExpand && 'expand-container'">
        <div class="star-header">
            <span v-if="isExpand">小组比拼</span>
            <span v-if="!isExpand" class="expand-btn" @click="expand()">展开</span>
        </div>
        <div class="star-list" ref="starBox" :class="!isExpand && 'expand'">
           <div class="item-row" v-for="(item, index) in teamArr" :key="index">
               <div class="item-row-left">
<!--                   <img class="team-award-img" v-if="awardTeam.indexOf(index) > -1" src="./images/pic_metal@2x.png" alt="" srcset="">-->
                   <img @click="addTeam(index)" src="./images/icon_add@2x.png" alt="">
                   <span class="text">{{item.name}}</span>
               </div>
               <div class="team-item" @click="addStar(item.starList, index)">
                   <div class="star-box">
                       <div class="star" v-for="(star, i) in item.starList" :key="i">
                           <img :style="{ width: isExpand ? starHeight + 'px' : '24px' }"
                                :class=" actionAnimationStar === `${index}_${i}` && 'star-animation'"
                                :src="starImages[index]"
                                alt=""
                           />
                       </div>
                       <div class="star" v-if="item.starList.length === 0">
                           <img :style="{ width: isExpand ? starHeight + 'px' : '24px' }" :src="emptyStarImages[index]" alt="" srcset="">
                       </div>
                   </div>
               </div>
               <div class="del-img">
                   <img v-if="item.starList.length === 0" src="./images/icon_jian_disabled.png" alt="">
                   <img @click="delStar(item.starList, index)" v-else style="cursor: pointer" src="./images/icon_jian.png" alt="">
               </div>
           </div>
        </div>
<!--        <div class="open" v-if="isHide" @click.stop="showWindow">-->
<!--            <DoubleLeft />-->
<!--        </div>-->
        <div class="star-footer" v-if="isExpand">
            <el-button type="text" class="star-btn" @click="setBtn">
                <el-icon class="set-icon"><Setting/></el-icon>
                <span>小组比拼设置</span>
            </el-button>
            <el-button class="star-btn" @click="minimize()">最小化</el-button>
            <el-button class="star-btn" type="danger" @click="close()">结束比拼</el-button>
            <el-popover :width="224" trigger="click">
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
        <Fireworks v-if="awardShow" @click="awardShow = false" />
    </div>

    <competition-set
        v-if="visible"
        v-model="visible"
        @addTeam="addTeam"
        @delTeam="delTeam"
        @addStudents="addStudents"
        @delStudents="delStudents"
        :teamArr="teamArr">
    </competition-set>
    <!-- <audio controls src="../../assets/teamCompetition/award.mp3" ref="audioRef"></audio> -->
</template>

<script lang="ts" >
import { nextTick } from "process";
import { computed, defineComponent, watch, ref } from "vue";
import { animationData } from "./animation/data";
import lottie, { AnimationItem } from "lottie-web";
import { awardAudio } from "./award";
// import { DoubleLeft, DoubleRight } from "@icon-park/vue-next";
import Fireworks from "./fireworks.vue";
import CompetitionSet from "./competitionSet.vue";
import { ICurrentSelectClass } from "@/types/store";
import { teamItem } from "./types";
import { Student } from "@/types/labelManage";

export default defineComponent({
    props: {
        teamNum: {
            type: Number,
            default: 4
        }
    },
    components: { CompetitionSet, Fireworks },
    emits: ["expand"],
    setup(props, { emit }) {
        const win = window.electron.remote.getCurrentWindow();
        if (window.electron.isMac()) win.setHasShadow(false);

        const starBox = ref();

        const teamNum = computed(() => props.teamNum);
        // const teamArr = ref(
        //     Array.from(new Array(teamNum.value)).map((item) => [])
        // );
        const teamArr = ref<teamItem[]>([
            { name: "小组1", starList: [], studentList: [] },
            { name: "小组2", starList: [], studentList: [] },
            { name: "小组3", starList: [], studentList: [] },
            { name: "小组4", starList: [], studentList: [] }
        ]);
        const awardTeam = ref<number[]>([]);
        const isExpand = ref(true);
        const actionAnimationStar = ref("");

        const addTeam = (index:number) => {
            teamArr.value.splice(index + 1, 0, { name: "", starList: [], studentList: [] });
        };

        const delTeam = (index:number) => {
            teamArr.value.splice(index, 1);
        };

        const addStudents = (index:number, list: Student[]) => {
            teamArr.value[index].studentList = list;
        };

        const delStudents = (ids:string[]) => {
            teamArr.value = teamArr.value.map((item:teamItem) => {
                item.studentList = item.studentList.filter(j => (!(ids.includes(j.StudentID))));
                return item;
            });
        };

        const addStar = (arr: number[], m: number) => {
            playAudio(addStarAudio);
            arr.push(1);
            actionAnimationStar.value = `${m}_${arr.length - 1}`;
            setTimeout(() => {
                actionAnimationStar.value = "";
            }, 100);

            if (arr.length % 10 === 1 && !isExpand.value) {
                minimize(true);
            }
        };

        const delStar = (arr: number[], m: number) => {
            arr.splice(0, 1);
        };

        const close = () => {
            window.electron.destroyWindow();
        };

        const minimize = (updateHeight?: boolean) => {
            isExpand.value = false;
            const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
            let height = 60 + teamArr.value.length * 34;
            teamArr.value.forEach(item => {
                height += Math.floor(item.starList.length / 10) * 24;
            });
            window.electron.setContentSize(320, height);
            const top = size.height - 100 - height - 260;
            const [x, y] = window.electron.getPositionWin();
            window.electron.setPositionWin(
                updateHeight ? x : size.width - 20 - 320,
                updateHeight ? y : top > 0 ? top : 20
            );
            if (window.electron.isMac()) win.setHasShadow(false);
        };

        // minimize();

        const expand = () => {
            isExpand.value = true;
            emit("expand");
            if (window.electron.isMac()) win.setHasShadow(true);
            setTimeout(() => {
                starHeight.value = ((starBox.value.clientHeight - 26) / 10 - 10);
            }, 1000);
        };

        const starImages = [
            require("./images/star_fill1@2x.png"),
            require("./images/star_fill2@2x.png"),
            require("./images/star_fill10@2x.png"),
            require("./images/star_fill7@2x.png"),
            require("./images/star_fill5@2x.png"),
            require("./images/star_fill6@2x.png"),
            require("./images/star_fill9@2x.png"),
            require("./images/star_fill4@2x.png"),
            require("./images/star_fill3@2x.png"),
            require("./images/star_fill8@2x.png")
        ];

        const emptyStarImages = [
            require("./images/star_border1@2x.png"),
            require("./images/star_border2@2x.png"),
            require("./images/star_border10@2x.png"),
            require("./images/star_border7@2x.png"),
            require("./images/star_border5@2x.png"),
            require("./images/star_border6@2x.png"),
            require("./images/star_border9@2x.png"),
            require("./images/star_border4@2x.png"),
            require("./images/star_border3@2x.png"),
            require("./images/star_border8@2x.png")
        ];

        const addStarAudio = require("../../assets/teamCompetition/star.mp3");
        const addAwardAudio = awardAudio;

        const awardShow = ref(false);
        const awardAni = ref();
        let awardLottie: AnimationItem | null;
        const starHeight = ref(40);
        nextTick(() => {
            awardLottie = lottie.loadAnimation({
                container: awardAni.value,
                renderer: "svg",
                loop: true,
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
            // setTimeout(() => {
            // awardShow.value = false;
            if (awardTeam.value.indexOf(i) === -1) {
                awardTeam.value.push(i);
            }
            // }, 2000);
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
            };
        };

        const teamColors = [
            "#FFAD00",
            "#00D978",
            "#003BFF",
            "#FF2400",
            "#EC00FF",
            "#7700FF",
            "#78FF00",
            "#A68873",
            "#00E9FF",
            "#3E5384"
        ];

        const visible = ref(false);
        const setBtn = () => {
            visible.value = true;
        };

        // const isHide = ref(false);
        // const hideWindow = () => {
        //     isHide.value = true;
        //     const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
        //     const position = window.electron.getPositionWin();
        //     window.electron.setPositionWin(size.width - 30, position[1]);
        // };

        // const showWindow = () => {
        //     isHide.value = false;
        //     const size = window.electron.remote.screen.getPrimaryDisplay().workAreaSize;
        //     const position = window.electron.getPositionWin();
        //     window.electron.setPositionWin(size.width - 20 - 300, position[1]);
        // };

        return {
            visible,
            teamArr,
            // teamNum,
            actionAnimationStar,
            isExpand,
            setBtn,
            addTeam,
            delTeam,
            addStudents,
            delStudents,
            addStar,
            delStar,
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
            audioRef,
            // isHide,
            // hideWindow,
            // showWindow,
            emptyStarImages,
            starBox,
            starHeight
        };
    }
});
</script>

<style scoped lang="scss">
.star-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.star-container.expand-container {
    background-color: #fff;
    border: 1px solid #E9ECF0;
}

.star-header {
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    font-weight: 600;
    /* background: #eef0f7; */
    color: #848891;
    /* background: linear-gradient(270deg, rgba(237,244,246,0) 0%, #EDF4F6 100%); */
    -webkit-app-region: drag;
    position: relative;
    height: 46px;
}

.star-header .icon {
    -webkit-app-region: no-drag;
    position: absolute;
    left: 15px;
    font-size: 16px;
    color: #888888;
    cursor: pointer;
    top: 16px;
    z-index: 1;
}

.open {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    color: #888;
    z-index: 10;
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
    padding: 12px 28px 40px;
    min-height: 0;
    overflow-y: auto;
    flex: 1;
}
.item-row{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 40px 10px 20px;
    border: 1px solid #F5F6FA;
    margin-bottom: 10px;
    .item-row-left {
        display: flex;
        align-items: center;
       img{
           width: 16px;
           height: 16px;
           margin-right: 10px;
           cursor: pointer;
       }
        .text{
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC_Bold;
            color: #19203D;
            font-weight: bold;
        }
    }
}

.star-list::-webkit-scrollbar {
  display: none;
}

.team-item {
    display: flex;
    align-items: flex-start;
    flex: 1;
    min-width: 0;
    width: 100%;
    font-size: 14px;
    position: relative;
    margin-bottom: 10px;
    transform: rotateY(180deg);
}

.expand {
    padding: 0px 0 0 22px;
    .item-row {
        padding: 0px 28px 0px 0px ;
        border: none;
        margin-bottom: 0px;
    }
    .del-img{
        bottom: 9px;
    }
}

.star-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: 12px;
}

.star {
    display: flex;
    align-items: center;
    justify-content: center;
}

.star img {
    display: block;
    transition: 1s all ease-in;
    transform: rotateY(0deg);
    margin-left: 0;
    opacity: 1;
}

.del-img{
    position: absolute;
    right: 20px;
    bottom: 24px;
   img{
       width: 16px;
       height: 16px;
   }
}

.expand .star img {
    /* width: 40px; */
}

.star img.star-animation {
    transform: rotate(540deg) translateX(200px) scale(2);
    opacity: 0.2;
}

.star-footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    position: relative;
}

.star-footer .star-btn {
    width: 100px;
}

.set-icon{
    font-size: 12px;
    margin-right: 2px;
    margin-top: 2px;
    .icon {
        width:16px;
        height:16px;
    }
}

.award-btn {
    position: absolute;
    left: 24px;
    bottom: 10px;
    color: #ef9900;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
}

.award-btn img {
    display: block;
    width: 75px;
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
    width: 50%;
    max-height: 80%;
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
    margin-top: -10px;
    top: 50%;
}

.award-team-text {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 64px;
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
