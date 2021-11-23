<template>
    <div ref="me-timer-dialog" class="me-timer-dialog" v-show="isshow" v-if="visible" draggable="true"
        @dragend="onDragEnd"
        @dragstart="onDragStart" 
        @drag="onDrag" >
        <div class="me-timer-header">
            <div class="me-timer-little">
                <p>计时器</p>
                <div class="rightbox">
                    <span class="minimize" @click.stop="minimizeHandle">最小化</span>
                    <span class="colse" @click.stop="close"></span>
                </div>
                
            </div>
            <div class="me-timer-tab">
                <span :class="activeIndex == 0 ? 'active' : ''" @click="activeIndex = 0">倒计时</span>
                <span :class="activeIndex == 1 ? 'active' : ''" @click="activeIndex = 1">计时器</span>
            </div>
            <div style="margin:auto;"  v-if="activeIndex == 0">
                <div class="me-timer-count-down" v-show="!isPlay" :class="isPlay ? 'me-timer-count-down-disabled' : ''">
                    <div class="me-timer-count-down-num">
                        <div @click="add(0)">+</div>
                        <div>{{ countDownList[0] }}</div>
                        <div @click="reduce(0)">-</div>
                    </div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(1)">+</div>
                        <div>{{ countDownList[1] }}</div>
                        <div @click="reduce(1)">-</div>
                    </div>
                    <div class="spot">:</div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(2)">+</div>
                        <div>{{ countDownList[2] }}</div>
                        <div @click="reduce(2)">-</div>
                    </div>
                    <div class="me-timer-count-down-num">
                        <div @click="add(3)">+</div>
                        <div>{{ countDownList[3] }}</div>
                        <div @click="reduce(3)">-</div>
                    </div>
                </div>
                <div class="me-timer-count-down me-timer" v-show="isPlay">
                        <div class="me-timer-num">{{ countDownList[0] }}</div>
                        <div class="me-timer-num">{{ countDownList[1] }}</div>
                        <div class="spot">:</div>
                        <div class="me-timer-num">{{ countDownList[2] }}</div>
                        <div class="me-timer-num">{{ countDownList[3] }}</div>
                </div>
            </div>
            
            <div v-else class="me-timer-count-down me-timer">
                <div class="me-timer-num">{{ timeList[0] }}</div>
                <div class="spot">:</div>
                <div class="me-timer-num">{{ timeList[1] }}</div>
            </div>
            <div class="me-timer-btns">
                <div v-if="!ispause">
                    <span  v-if="!isPlay" @click="play('0')">开始</span>
                    <span  v-if="isPlay" @click="stop">暂停</span>
                </div>
                
                <div class="resetbox" v-if="ispause">
                    <span @click="reset">重置</span> 
                    <span @click="play('1')">继续</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        visible:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            activeIndex: 0,
            isPlay: false,
            ispause: false,
            countDownList: [0, 5, 0, 0],
            second: 300,
            timer: null,
            time: 0,
            timeList: ["00", "00"],
            dragInfo: {
                x: 0,
                y: 0
            },
            translate: {
                x: 0,
                y: 0
            }
        }
    },
    watch: {
        activeIndex() {
            this.reset();
        }
    },
    computed:{
        isshow(){
            return this.$store.state.isshowTimer
        }
    },
    methods: {
        minimizeHandle(){
            this.$store.dispatch('changeshowAct',false);
            //1是做减法2是做加法
            if(this.time > 0){
                this.$store.dispatch('saveTimerAct',{time:this.time,alg:2,isPlay:this.isPlay});
            }else{
                this.$store.dispatch('saveTimerAct',{time:this.second,alg:1,isPlay:this.isPlay});
            }
          
           
        },
        onDragStart(e) {
            const transform = this.$refs['me-timer-dialog'].style.transform ? this.$refs['me-timer-dialog'].style.transform.split("(")[1].split(",") : ''
            const x = e.pageX - (transform ? transform[0].split("px")[0] : 0)
            const y = e.pageY - (transform ? transform[1].split("px")[0] : 0)
            this.dragInfo = {
                x,
                y
            }
            const img = new Image();
            img.src = "";
            e.dataTransfer.setDragImage(img, 0, 0);
        },
        onDrag(e) {
            this.$refs['me-timer-dialog'].style.transform = "translate(" + (e.pageX - this.dragInfo.x) + "px," + (e.pageY - this.dragInfo.y) + "px)"
            e.preventDefault();
        },
        onDragEnd(e) {
            this.$refs['me-timer-dialog'].style.transform = "translate(" + (e.pageX - this.dragInfo.x) + "px," + (e.pageY - this.dragInfo.y) + "px)"
        },
        add(index) {
            if(this.isPlay) return;
            if(index == 0 || index == 2) {
                if(this.countDownList[index] < 5) {
                    this.$set(this.countDownList, index, this.countDownList[index] + 1)
                }else{
                    this.$set(this.countDownList, index, 0)
                }
            }else{
                if(this.countDownList[index] < 9) {
                    this.$set(this.countDownList, index, this.countDownList[index] + 1)
                }else{
                    this.$set(this.countDownList, index, 0)
                }
            }
        },
        reduce(index) {
            if(this.isPlay) return;
            if(index == 0 || index == 2) {
                if(this.countDownList[index] < 6 && this.countDownList[index] > 0) {
                    this.$set(this.countDownList, index, this.countDownList[index] - 1)
                }else{
                    this.$set(this.countDownList, index, 5)
                }
            }else{
                if(this.countDownList[index] < 10 && this.countDownList[index] > 0) {
                    this.$set(this.countDownList, index, this.countDownList[index] - 1)
                }else{
                    this.$set(this.countDownList, index, 9)
                }
            }
        },
        play(type) {
            if(this.activeIndex == 0) {
                this.getSecond();
                if(this.second == 0) return;
                if(type === '0'){
                    this.isPlay = true;
                }else if(type === '1'){
                    this.isPlay = true;
                    this.ispause = false
                }
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    if(this.second == 1) {
                        clearInterval(this.timer)
                        this.isPlay = false
                    }
                    this.second --;
                    this.setCountDownList()
                }, 1000)
            }else{
                if(type === '0'){
                    this.isPlay = true;
                }else if(type === '1'){
                    this.isPlay = true;
                    this.ispause = false
                }
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.time ++;
                    this.setTimeList()
                }, 1000)
            }
        },
        stop() {
            this.isPlay = false;
            this.ispause = true;
            this.timer ? clearInterval(this.timer) : ''
        },
        getSecond() {
            this.second = this.countDownList[0] * 600 + this.countDownList[1] * 60 + this.countDownList[2] * 10 + this.countDownList[3] 
        },
        setCountDownList() {
            this.$set(this.countDownList, 0, Math.floor(this.second / 600))
            this.$set(this.countDownList, 1, Math.floor((this.second - this.countDownList[0] * 600) / 60))
            this.$set(this.countDownList, 2, Math.floor((this.second - this.countDownList[0] * 600 - this.countDownList[1] * 60 ) / 10))
            this.$set(this.countDownList, 3, this.second - this.countDownList[0] * 600 - this.countDownList[1] * 60 - this.countDownList[2] * 10)
        },
        setTimeList() {
            // let h = Math.floor(this.time / 600) < 10 ? ('0' + String((Math.floor(this.time / 3600)))) : Math.floor(this.time / 3600)
            // this.$set(this.timeList, 0, h)
            // let m = Math.floor((this.time - h * 600) / 60) < 10 ? ('0' + String(Math.floor((this.time - h * 600) / 60))) : Math.floor((this.time - h * 600) / 60)
            // this.$set(this.timeList, 1, m)
            // let s = (this.time - h * 600 - m * 60) < 10 ? ('0' + String(this.time - h * 600 - m * 60)) : this.time - h * 600 - m * 60
            // this.$set(this.timeList, 2, s)
            let h = Math.floor(this.time / 600) < 10 ? ('0' + String((Math.floor(this.time / 3600)))) : Math.floor(this.time / 3600)
            let m = Math.floor((this.time - h * 600) / 60) < 10 ? ('0' + String(Math.floor((this.time - h * 600) / 60))) : Math.floor((this.time - h * 600) / 60)
            this.$set(this.timeList, 0, m)
            let s = (this.time - h * 600 - m * 60) < 10 ? ('0' + String(this.time - h * 600 - m * 60)) : this.time - h * 600 - m * 60
            this.$set(this.timeList, 1, s)
        },
        close() {
            this.activeIndex = 0;
            this.reset();
            this.$store.dispatch('changeDataAct',false)
        },
        reset() {
            this.isPlay = false;
            this.ispause = false;
            this.timer ? clearInterval(this.timer) : ''
            if(this.activeIndex == 0){
                this.second = 300;
                this.setCountDownList()
            }else{
                this.time = 0;
                this.setTimeList();
            }
        }
    }
}
</script>

<style scoped>
    .me-timer-dialog {
        width: 800px;
        height: 500px;
        background: rgb(22, 18, 53);
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 99;
    }
    .me-timer-header{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .me-timer-little{
        background: rgb(44, 10, 122);
        display: flex;
        margin: 0;
        height: 60px;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
    }
    .me-timer-little>p  {
        font-size: 16px;
        text-align: center;
        color: #FFFFFF;
    }
    .rightbox{
        display: flex;
    }
    .colse{
        display: inline-block;
        position: relative;
        width: 50px;
        height: 30px;
        background: #666;
    }
    .colse::before,
    .colse::after {
        position: absolute;
        content: ' ';
        background-color: #ffffff;
        left: 25px;
        top: 5px;
        width: 2px;
        height: 20px;
    }
    .colse::before {
        transform: rotate(45deg);
    }
    .colse::after {
        transform: rotate(-45deg);
    }

    .minimize{
        display: inline-block;
        width: 50px;
        height: 30px;
        background: #666;
        color: #FFFFFF;
        text-align: center;
        line-height: 30px;
        margin-right: 16px;
    }

    .me-timer-tab {
        margin: 40px auto;
        display: flex;
        width: 200px;
        height: 30px;
        line-height: 30px;
        justify-content: space-between;
        border-radius: 4px;
    }
    .me-timer-tab span {
        width: 45%;
        display: block;
        text-align: center;
        color: rgb(221, 221, 221);
        font-size: 14px;
        border: 1px solid rgb(76, 74, 102);
        border-radius: 6px;
    }
    .me-timer-tab .active {
        color: #fff;
        background: #2a59da;
    }
    .me-timer-count-down {
        width: 480px;
        display: flex;
        height: 180px;
        margin: auto;
    }
    .me-timer-count-down-num {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        width: 100px;
        align-items: center;
        background: linear-gradient(180deg, rgba(238, 238, 238, 0) 0%, #2c294d 49%, rgba(13, 25, 58, 0) 100%);
    }
    .me-timer-count-down-num div:nth-of-type(1), .me-timer-count-down-num div:nth-of-type(3) {
        width: 48px;
        user-select: none;
        height: 28px;
        text-align: center;
        line-height: 28px;
        font-size: 20px;
        border: 1px solid #ddd;
        border-radius: 22px;
        color: #FFFFFF;
    }
    .me-timer-count-down-num div:nth-of-type(2){
        flex: 1;
        user-select: none;
        width: 100%;
        color: #FFFFFF;
        font-size: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
  
    .me-timer-count-down .spot {
        font-size: 80px;
        line-height: 200px;
        flex: 1;
        margin-top: -15px;
        text-align: center;
        color: #FFFFFF;
    }
    .me-timer-btns {
        width: 100%;
        height: 80px;
        display: flex;
        padding: 0 200px;
        justify-content: center;
        align-items: center;
        background: rgb(44, 10, 122);
    }
    .resetbox{
        flex: 1;
         display: flex;
         justify-content: space-between;
    }
    .me-timer-btns span {
        display: inline-block;
        width: 120px;
        height: 40px;
        background: #077ce9;
        font-size: 16px;
        color: rgb(252, 250, 250);
        text-align: center;
        line-height: 40px;
    }
    .me-timer-btns i {
        border: 1px solid rgba(0, 0, 0, .1);
        border-radius: 50%;
        width: 110px;
        height: 110px;
        margin-top: -40px;
        display: flex;
        background: #fff;
        justify-content: center;
        align-items: center;
    }

    .me-timer {
        align-items: center;
        width: 240px;
        padding-bottom: 20px;
        box-sizing: border-box;
    }
    .me-timer .me-timer-num {
        font-size: 92px;
        color: #f8f6f6;
    }
    .me-timer .spot {
        font-size: 70px;
        margin-top: -15px;
    }
</style>