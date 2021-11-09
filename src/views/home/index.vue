<template>
        <div class="home" style="height: 100%">
        <div class="main">
            <div class="top">
                <div class="left">
                    <div class="left-one" @click="go('preparation')">
                        <img src="@/assets/indexImages/card_beike.png" alt="" />
                        <span>备课</span>
                    </div>
                    <div class="left-two" @click="go('homeworkNew')">
                        <img src="@/assets/indexImages/card_zuoye.png" alt="" />
                        <span>作业</span>
                    </div>
                </div>
                <div class="right">
                    <Calendar />
                </div>
            </div>
            <div class="bottom">
                <div class="item" @click="go('report-center')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_baobiao.png"
                            alt=""
                        />
                        <span>报表中心</span>
                    </div>
                </div>
                <div class="item" @click="go('')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_kaoshi.png"
                            alt=""
                        />
                        <span>考试中心</span>
                    </div>
                </div>
                <div class="item" @click="go('')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_kaoshi.png"
                            alt=""
                        />
                        <span>课时延后</span>
                    </div>
                </div>
                <div class="item" @click="go('')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_zhibo.png"
                            alt=""
                        />
                        <span>直播课堂</span>
                    </div>
                </div>
                <div class="item" @click="go('class-manage')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_xuesheng.png"
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
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Calendar from "./calendar/index.vue";

export default defineComponent({
    components: {
        Calendar
    },
    setup() {
        const router = useRouter();
        const go = (val: string) => {
            if (val === "") {
                ElMessage.warning({
                    message: "功能建设中 敬请期待"
                });
            } else {
                router.push(`/${val}`);
            }
        };
        return {
            go
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
        .top {
            width: 100%;
            display: flex;
            flex: 1;
            min-height: 0px;
            padding: 18px 18px 18px 18px;
            .left {
                height: 100%;
                padding-right: 28px;
                div img:hover {
                    margin-top: 0px; /*和hover的margin-top有对比，原无30,现在0，相当于上移了,30px*/
                    box-shadow: 0 0 25px 4px #918f8f; /*盒子阴影*/
                    transition: all 0.5s; /*持续时间*/
                }
                .left-one {
                    height: 50%;
                    position: relative;
                    box-sizing: border-box;
                    padding-bottom: 14px;
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
                .left-two {
                    height: 50%;
                    box-sizing: border-box;
                    position: relative;
                    padding-top: 14px;
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
                flex: 1;
                min-width: 0px;
                overflow-y: auto;
            }
        }
        .bottom {
            width: 100%;
            display: flex;
            .item {
                width: 25%;
                padding: 20px;
                background-image: none;
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
                        left: 12%;
                        z-index: 10;
                        font-size: 32px;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                        font-weight: 800;
                        color: #ffffff;
                    }
                }
            }
            .item:nth-of-type(1):hover {
                background-image: url(../../assets/indexImages/shadow_small_1.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: 0px 0px;
            }
            .item:hover {
                background-image: url(../../assets/indexImages/shadow_small_2_hover@2x.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: 0px 0px;
            }
        }
    }
}
</style>
