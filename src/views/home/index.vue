<template>
    <div class="home" style="height: 100%">
        <div class="main">
            <div class="top">
                <div class="left" ref="leftBlock">
                    <div
                        v-if="!layoutAdjust"
                        class="left-one"
                        @click="go('preparation'), clicKBuryPoint('备课')"
                    >
                        <span>备课</span>
                    </div>
                    <div
                        v-if="!layoutAdjust"
                        class="left-two"
                        @click="go('homework'), clicKBuryPoint('作业')"
                    >
                        <span>作业</span>
                    </div>
                    <div class="left-row" v-if="layoutAdjust">
                        <div
                            class="left-one"
                            @click="go('preparation'), clicKBuryPoint('备课')"
                        >
                            <span>备课</span>
                        </div>
                        <div
                            class="left-two"
                            @click="go('homework'), clicKBuryPoint('作业')"
                        >
                            <span>作业</span>
                        </div>
                        <div
                            class="left-three"
                            @click="
                                go('report-center'), clicKBuryPoint('报表中心')
                            "
                        >
                            <span>报表中心</span>
                        </div>
                        <div
                            class="left-four"
                            @click="
                                go('resource-center/' + platformId),
                                    clicKBuryPoint('资源中心')
                            "
                        >
                            <span>资源中心</span>
                        </div>
                    </div>
                    <div class="bottom" v-if="layoutAdjust">
                        <div
                            class="item"
                            @click="
                                go('assessment-center'),
                                    clicKBuryPoint('评测中心')
                            "
                        >
                            <div class="item_div">
                                <img
                                    src="../../assets/indexImages/pic_kaoshi_new.png"
                                    alt=""
                                />
                                <span>测评中心</span>
                            </div>
                        </div>
                        <div
                            class="item"
                            @click="
                                go('wrongbook'), clicKBuryPoint('班级错题本')
                            "
                        >
                            <div class="item_div">
                                <img
                                    src="../../assets/indexImages/card_cuotiben.png"
                                    alt=""
                                />
                                <span>班级错题本</span>
                            </div>
                        </div>
                        <div
                            class="item"
                            @click="
                                go('class-manage'), clicKBuryPoint('班级管理')
                            "
                        >
                            <div class="item_div">
                                <img
                                    src="../../assets/indexImages/icon_xuesheng.png"
                                    alt=""
                                />
                                <span>班级管理</span>
                            </div>
                        </div>
                        <div
                            class="item"
                            @click="go('more-content'), clicKBuryPoint('更多')"
                        >
                            <div class="item_div">
                                <img
                                    src="../../assets/indexImages/icon_more.png"
                                    alt=""
                                />
                                <span>更多</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right" ref="classSchedule">
                    <Calendar
                        ref="calendar"
                        :days="days"
                        :isShowDetailBtn="true"
                    >
                        <template v-slot:default="slotProps">
                            <header class="header">
                                <div
                                    @click="weekPre(), clicKBuryPoint('上周')"
                                    class="week flex-align-items"
                                >
                                    <el-icon :size="16"><ArrowLeft /></el-icon>
                                    上周
                                </div>
                                <div class="title">上课</div>
                                <div class="header-right">
                                    <div
                                        class="refresh flex-align-items"
                                        @click="slotProps.initSchedules"
                                    >
                                        <el-icon
                                            :size="16"
                                            :style="{ marginRight: '4px' }"
                                            ><RefreshRight
                                        /></el-icon>
                                        刷新课表
                                    </div>
                                    <div
                                        @click="
                                            weekNext(), clicKBuryPoint('下周')
                                        "
                                        class="week flex-align-items"
                                    >
                                        下周
                                        <el-icon :size="16"
                                            ><ArrowRight
                                        /></el-icon>
                                    </div>
                                </div>
                            </header>
                        </template>
                    </Calendar>
                </div>
            </div>
            <div class="bottom" v-if="!layoutAdjust">
                <div
                    class="item"
                    @click="go('report-center'), clicKBuryPoint('报表中心')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_baobiao_new.png"
                            alt=""
                        />
                        <span>报表中心</span>
                    </div>
                </div>
                <!-- 2022-7-25 annan -->
                <div
                    class="item"
                    @click="go('resource-center/' + platformId), clicKBuryPoint('资源中心')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_zyzx.png"
                            alt=""
                        />
                        <span>资源中心</span>
                    </div>
                </div>
                <div
                    class="item"
                    @click="go('assessment-center'), clicKBuryPoint('评测中心')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_kaoshi_new.png"
                            alt=""
                        />
                        <span>测评中心</span>
                    </div>
                </div>
                <div
                    class="item"
                    @click="go('wrongbook'), clicKBuryPoint('班级错题本')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/card_cuotiben.png"
                            alt=""
                        />
                        <span>班级错题本</span>
                    </div>
                </div>
                <div
                    class="item"
                    @click="go('class-manage'), clicKBuryPoint('班级管理')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/icon_xuesheng.png"
                            alt=""
                        />
                        <span>班级管理</span>
                    </div>
                </div>
                <div
                    class="item"
                    @click="go('more-content'), clicKBuryPoint('更多')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/icon_more.png"
                            alt=""
                        />
                        <span>更多</span>
                    </div>
                </div>
                <!-- <div
                    class="item"
                    @click="go('course-time'), clicKBuryPoint('课后延时')"
                >
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/icon_kehou_new.png"
                            alt=""
                        />
                        <span>课后延时</span>
                    </div>
                </div> -->
                <!-- <div class="item" @click="go('preparation-group')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/pic_jitibeike.png"
                            alt=""
                        />
                        <span>集体备课</span>
                    </div>
                </div> -->
                <!-- <div class="item" @click="go(''), clicKBuryPoint('直播课堂')">
                    <div class="item_div">
                        <img
                            src="../../assets/indexImages/icon_zhibo_new.png"
                            alt=""
                        />
                        <span>直播课堂</span>
                    </div>
                </div>-->
            </div>
        </div>
    </div>
    <el-dialog
        v-model="moreVisible"
        width="30%"
        center
        :show-close="false"
        :close-on-click-modal="false"
        class="home-cus-dialog"
        top="37vh"
    >
        <div class="middle-con">
            <!-- <div class="con-card">
                <img src="../../assets/indexImages/pci_jtbk.png" alt="" />
                <p>集体备课</p>
            </div> -->
            <div class="con-card" @click="go(''), clicKBuryPoint('直播课堂')">
                <img src="../../assets/indexImages/pic_zbkt.png" alt="" />
                <p>直播课堂</p>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="close-btn" @click="moreVisible = false">
                    <img
                        src="../../assets/indexImages/icon_close_white.png"
                        alt=""
                    />
                    <span>关闭</span>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { ElMessage } from "element-plus";
import { defineComponent, onActivated, ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Calendar from "../../components/calendar/index.vue";
import usePageEvent from "@/hooks/usePageEvent";
import isElectron from "is-electron";
import { EVENT_TYPE } from "@/config/event";
import { nextTick } from "process";
import { debounce } from "lodash";
import { get, STORAGE_TYPES, storeChange } from "@/utils/storage";
import { getPlatformByOrgId } from "@/api/home";
import { UserInfoState } from "@/types/store";

export default defineComponent({
    name: "Home",
    components: {
        Calendar,
    },
    setup() {
        const { createBuryingPointFn } = usePageEvent("首页");
        const router = useRouter();
        const route = useRoute();
        const { weekNext, weekPre, initDays, days } = useTime();
        initDays();
        const moreVisible = ref(false); //点击更多的弹框
        const go = (val: string) => {
            if (val === "") {
                ElMessage.warning({
                    message: "功能建设中 敬请期待",
                });
            } else {
                if (val == "more-content") {
                    moreVisible.value = true;
                    return;
                }
                router.push(`/${val}`);
            }
        };
        //首页点击埋点事件
        const clicKBuryPoint = (name: string) => {
            createBuryingPointFn(EVENT_TYPE.PageClick, name, name);
        };
        const turnToPage = () => {
            // 岳阳云平台内嵌备教端，页面跳转
            if (
                route.redirectedFrom &&
                window?.top &&
                (window?.top[0]?.location.origin.indexOf("yueyangyun") > -1 ||
                    window?.top[0]?.location?.ancestorOrigins[0].indexOf(
                        "yueyangyun"
                    ) > -1 ||
                    window?.top[0]?.location?.origin.indexOf("localhost") > -1)
            ) {
                const path = route.redirectedFrom.path.split("#/")[1] || "";
                router.replace(`${path}`);
            }
        };
        turnToPage();

        //定义悬浮球的点击事件，悬浮球埋点需求
        const suspensionClick = () => {
            createBuryingPointFn(EVENT_TYPE.PageClick, "智课助手", "智课助手");
        };

        const calendar = ref();
        onActivated(() => {
            calendar.value.initSchedules(resize);
            // nextTick(resize);
        });

        const platformId = ref("");
        const getPlatformIdByOrgId = () => {
            const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
            const id = currentUserInfo.schoolId;

            getPlatformByOrgId([{ id }]).then(res => {
                platformId.value = res.result.length > 0 ? res.result[0].platformId : "";
            });
        }

        onMounted(() => {
            getPlatformIdByOrgId();
            storeChange(STORAGE_TYPES.CURRENT_USER_INFO, (value) => {
                // 组织切换 更新PlateformId
                if (value) getPlatformIdByOrgId();
            });
        });

        const leftBlock = ref();
        const classSchedule = ref();
        const layoutAdjust = ref(false);
        let timer: any = null;
        const resize = debounce(() => {
            if (classSchedule.value && route.path === "/home") {
                // 右边边小于一半，没有进行过布局调整，进行布局调整
                // if (classSchedule.value.clientWidth < window.innerWidth * 0.4) {
                //     layoutAdjust.value = true;
                // }

                if (layoutAdjust.value) {
                    if (leftBlock.value.clientWidth < window.innerWidth * 0.4) {
                        layoutAdjust.value = false;
                    }
                } else {
                    if (leftBlock.value.clientWidth > window.innerWidth * 0.6) {
                        layoutAdjust.value = true;
                    }
                }

                nextTick(() => {
                    calendar.value.resize();

                    // 2s后再次重新计算，降低误差出现
                    if (timer) clearTimeout(timer);
                    timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        calendar.value.resize();
                    }, 2000);
                });
            }
        }, 200);
        const resizeObserver = new ResizeObserver(resize);
        onMounted(() => {
            if (leftBlock.value) {
                resizeObserver.observe(leftBlock.value);
            }
            window.addEventListener("resize", resize);
        });

        onUnmounted(() => {
            window.removeEventListener("resize", resize);
            if (leftBlock.value) resizeObserver.unobserve(leftBlock.value);
        });

        onMounted(() => {
            if (isElectron()) {
                //注册悬浮球点击事件
                window.electron.ipcRenderer.on(
                    "suspensionClick",
                    suspensionClick
                );
            }
        });
        onUnmounted(() => {
            if (isElectron()) {
                //销毁悬浮球点击事件
                window.electron.ipcRenderer.removeListener(
                    "suspensionClick",
                    suspensionClick
                );
            }
        });
        return {
            go,
            weekNext,
            weekPre,
            days,
            calendar,
            clicKBuryPoint,
            moreVisible,
            leftBlock,
            classSchedule,
            layoutAdjust,
            platformId
        };
    },
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
    background-color: #e9efff;

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
            height: 64px;
            display: flex;
            padding: 0 20px;
            justify-content: space-between;
            align-items: center;
            font-size: 20px;
            background: linear-gradient(270deg, #709dff 0%, #5a80f7 100%);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            color: #ffffff;
            margin-bottom: 16px;

            .header-right {
                display: flex;
                align-items: center;

                .refresh {
                    font-size: 14px;
                    margin-right: 8px;
                    cursor: pointer;
                }
            }

            .title {
                font-size: 32px;
                color: #ffffff;
                font-weight: 600;
            }

            .week {
                font-size: 14px;
                font-weight: 400;
                color: #ffffff;
                cursor: pointer;
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

                .left-row {
                    display: flex;
                    flex-wrap: wrap;
                    flex: 1;
                    .left-one,
                    .left-two,
                    .left-three,
                    .left-four {
                        flex: auto;
                        width: calc(50% - 14px);
                    }

                    .left-two,
                    .left-four {
                        margin-bottom: 28px;
                        margin-left: 28px;
                    }

                    &:hover {
                        box-shadow: none;
                    }
                }

                .bottom {
                    .item {
                        padding: 14px;
                        padding-top: 0;
                        padding-bottom: 0;
                        &:last-child {
                            padding-right: 0;
                        }
                        &:first-child {
                            padding-left: 0;
                        }
                        &:hover {
                            box-shadow: none;
                        }
                        .item_div {
                            border-radius: 15px;
                        }
                    }
                    &:hover {
                        box-shadow: none;
                    }
                }

                div:hover {
                    margin-top: 0px;
                    /*和hover的margin-top有对比，原无30,现在0，相当于上移了,30px*/
                    box-shadow: 0 0 25px 4px #918f8f;
                    /*盒子阴影*/
                    transition: all 0.5s;
                    /*持续时间*/
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
                    // margin-bottom: 28px;
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
                .left-three {
                    box-sizing: border-box;
                    position: relative;
                    margin-bottom: 28px;
                    cursor: pointer;
                    flex: 1;
                    background: url("./../../assets/indexImages/pic_baobiao_new.png")
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
                .left-four {
                    box-sizing: border-box;
                    position: relative;
                    cursor: pointer;
                    flex: 1;
                    background: url("./../../assets/indexImages/pic_zyzx.png")
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
                // flex: 2;
                min-width: 300px;
                // overflow-y: auto;
                // height: 100%;
            }
        }

        .bottom {
            width: 100%;
            display: flex;

            .item {
                padding: 16px;
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
                        left: 10%;
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
<style lang="scss">
.home-cus-dialog {
    position: relative;
    border-radius: 16px;
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        padding: 70px 0;
        .middle-con {
            display: flex;
            justify-content: space-around;
            align-items: center;
            .con-card {
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                p {
                    margin-top: 13px;
                    font-size: 20px;
                    text-align: center;
                    font-family: HarmonyOS_Sans_SC_Medium;
                    color: #0c234f;
                }
            }
        }
    }

    .el-dialog__footer {
        position: relative;
        padding: 0;

        .dialog-footer {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 3.5rem;
            .close-btn {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 150px;
                height: 45px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                border: 2px solid #ffffff;
                margin: auto;
                span {
                    font-size: 17px;
                    font-family: HarmonyOS_Sans_SC_Bold;
                    color: #ffffff;
                    line-height: 29px;
                    padding-left: 5px;
                }
            }
        }
    }
}
</style>
