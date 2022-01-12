<template>
    <div class="home" style="height: 100%">
        <div class="main">
            <div class="top">
                <div class="left">
                    <div class="left-one" @click="go('preparation')">
                        <span>备课</span>
                    </div>
                    <div class="left-two" @click="go('homework')">
                        <span>作业</span>
                    </div>
                </div>
                <div class="right">
                    <Calendar :days="days" :isShowDetailBtn="true">
                        <template v-slot:default="slotProps">
                            <header class="header">
                                <div @click="weekPre" class="week">
                                    <i class="el-icon-arrow-left"></i>上周
                                </div>
                                <div>上课</div>
                                <div class="header-right">
                                    <div class="refresh" @click="slotProps.initSchedules">
                                        <i
                                            class="el-icon-refresh-right"
                                            :style="{marginRight: '4px'}"
                                        ></i
                                        >刷新课表
                                    </div>
                                    <div @click="weekNext" class="week">
                                        下周<i class="el-icon-arrow-right"></i>
                                    </div>
                                </div>
                            </header>
                        </template>
                    </Calendar>
                </div>
            </div>
            <div class="bottom">
                <div class="item" @click="go('report-center')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_baobiao.png"
                            alt=""
                        />
                        <span>报表中心</span>
                    </div>
                </div>
                <div class="item" @click="go('assessment-center')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_kaoshi.png"
                            alt=""
                        />
                        <span>测评中心</span>
                    </div>
                </div>
                <div class="item" @click="go('course-time')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_kehou.png"
                            alt=""
                        />
                        <span>课后延时</span>
                    </div>
                </div>
                <!-- <div class="item" @click="go('preparation-group')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_jitibeike.png"
                            alt=""
                        />
                        <span>集体备课</span>
                    </div>
                </div> -->
                <div class="item" @click="go('')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_zhibo.png"
                            alt=""
                        />
                        <span>直播课堂</span>
                    </div>
                </div>
                <div class="item" @click="go('class-manage')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_xuesheng.png"
                            alt=""
                        />
                        <span>班级管理</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import Calendar from "../../components/calendar/index.vue";

export default defineComponent({
    name: "Home",
    components: {
        Calendar
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const { weekNext, weekPre, initDays, days } = useTime();
        initDays();

        const go = (val: string) => {
            if (val === "") {
                ElMessage.warning({
                    message: "功能建设中 敬请期待"
                });
            } else {
                router.push(`/${val}`);
            }
        };
        const turnToPage = () => {
            // 岳阳云平台内嵌备教端，页面跳转
            if (route.redirectedFrom && window.top && window.top[0] && window.top[0].location && window.top[0].location.origin && (window.top[0].location.origin.indexOf("yueyangyun") > -1 || (window.top[0].location.ancestorOrigins && window.top[0].location.ancestorOrigins[0] && window.top[0].location.ancestorOrigins[0].indexOf("yueyangyun") > -1) || window.top[0].location.origin.indexOf("20.199") > -1)) {
                const path = route.redirectedFrom.path.split("#/")[1] || "";
                router.replace(`${path}`);
            }
        };
        turnToPage();
        return {
            go,
            weekNext,
            weekPre,
            days
        };
    }
});
</script>

<style lang="scss" scoped>
* {
    user-select: none;
}
.home {
    display: flex;
    flex-direction: column;
    min-height: 0px;
    flex: 1;
    .main {
        padding: 20px 20px 20px 20px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0px;
        .header {
            width: 100%;
            height: 50px;
            display: flex;
            padding: 0 20px;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            background: #a0b7ff;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            color: #ffffff;
            .header-right {
                display: flex;
                align-items: center;
                .refresh {
                    font-size: 16px;
                    margin-right: 8px;
                    cursor: pointer;
                }
            }
            .week {
                font-size: 18px;
                font-weight: 400;
                color: #ffffff;
                cursor: pointer;
            }
            div:nth-of-type(2) {
                font-size: 22px;
                font-weight: 800;
                color: #ffffff;
            }
        }
        .top {
            width: 100%;
            display: flex;
            flex: 1;
            min-height: 0px;
            justify-content: space-between;
            padding: 18px 18px 18px 18px;
            .left {
                height: 100%;
                flex: 1;
                padding-right: 28px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                div:hover {
                    margin-top: 0px; /*和hover的margin-top有对比，原无30,现在0，相当于上移了,30px*/
                    box-shadow: 0 0 25px 4px #918f8f; /*盒子阴影*/
                    transition: all 0.5s; /*持续时间*/
                }
                .left-one {
                    position: relative;
                    flex: 1;
                    box-sizing: border-box;
                    margin-bottom: 28px;
                    cursor: pointer;
                    background: url("./../../assets/indexImages/card_beike.png")
                        no-repeat;
                    background-position: center center;
                    background-size: cover;
                    border-radius: 15px;
                    span {
                        position: absolute;
                        top: 10%;
                        left: 6%;
                        font-size: 46px;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                        font-weight: 800;
                        color: #ffffff;
                    }
                }
                .left-two {
                    box-sizing: border-box;
                    position: relative;
                    cursor: pointer;
                    flex: 1;
                    background: url("./../../assets/indexImages/card_zuoye.png")
                        no-repeat;
                    background-position: center center;
                    background-size: cover;
                    border-radius: 15px;
                    img {
                        // width: 100%;
                        height: 100%;
                        border-radius: 15px;
                    }
                    span {
                        position: absolute;
                        top: 10%;
                        left: 6%;
                        font-size: 46px;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                        font-weight: 800;
                        color: #ffffff;
                    }
                }
            }
            .right {
                flex: 2;
                min-width: 300px;
                overflow-y: auto;
            }
        }
        .bottom {
            width: 100%;
            display: flex;
            .item {
                flex: 1;
                .item_div {
                    cursor: pointer;
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    img {
                        width: 100%;
                    }
                    span {
                        position: absolute;
                        top: 18%;
                        left: 20%;
                        z-index: 10;
                        font-size: 1.4vw;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                        font-weight: 800;
                        color: #ffffff;
                    }
                }
                &:first-child {
                    .item_div span {
                        left: 15%;
                    }
                }
            }
            .item:hover {
                img {
                    filter: drop-shadow(0 0 15px #928c8c);
                }
            }
        }
    }
}
</style>
