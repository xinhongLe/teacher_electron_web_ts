<template>
    <div class="home" style="height: 100%">
        <div class="main">
            <div class="top">
                <div class="left" ref="leftBlock">
                    <div class="left-one" @click="go('preparation'), clicKBuryPoint('备课')"
                         :style="!layoutAdjust ? 'flex:1' : ''"
                         :class="getPermission('preparation') ? '' : 'no-permission'"
                    >
                        <span>备课</span>
                    </div>
                    <div class="left-two" :style="!layoutAdjust ? 'flex:1' : ''">
                        <div class="work" @click="go('homework'), clicKBuryPoint('作业')"
                             :class="getPermission('homework') ? '' : 'no-permission'"
                        >
                            <span>作业</span>
                        </div>
                        <div class="wrong-book" @click="go('wrongbook'), clicKBuryPoint('班级错题本')"
                             :class="getPermission('wrongbook') ? '' : 'no-permission'"
                        >
                            <span>班级错题本</span>
                        </div>
                    </div>
                    <div class="bottom-left" v-if="layoutAdjust">
                        <div class="bottom-item">
                            <div class="item" @click="go('resource-center/' + platformId), clicKBuryPoint('资源中心')"
                                 :class="getPermission('resource-center') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/pic_zyzx.png" alt=""/>
                                    <span>资源中心</span>
                                </div>
                            </div>
                            <div class="item" @click="
                            go('assessment-center'),
                            clicKBuryPoint('评测中心')
                        "
                                 :class="getPermission('assessment-center') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/pic_kaoshi_new.png" alt=""/>
                                    <span>测评中心</span>
                                </div>
                            </div>
                            <div class="item" @click="
                            go('composition'), clicKBuryPoint('AI作文')
                        "
                                 :class="getPermission('composition') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/pic_aizw@2x.png" alt=""/>
                                    <span>AI作文</span>
                                </div>
                            </div>
                        </div>
                        <div class="bottom-item">
                            <div class="item" @click="
                            go('pblstudy'), clicKBuryPoint('PBL项目式学习')
                        "
                                 :class="getPermission('pblstudy') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/icon_pbl@2x.png" alt=""/>

                                    <span>PBL项目式学习</span>
                                </div>
                            </div>
                            <div class="item" @click="
                            go('class-manage'), clicKBuryPoint('班级管理')
                        "
                                 :class="getPermission('class-manage') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/icon_xuesheng.png" alt=""/>
                                    <span>班级管理</span>
                                </div>
                            </div>
                            <div class="item" @click="
                            go('report-center'), clicKBuryPoint('报表中心')
                        "
                                 :class="getPermission('report-center') ? '' : 'no-permission'"
                            >
                                <div class="item_div">
                                    <img src="../../assets/indexImages/pic_baobiao_new.png" alt=""/>
                                    <span>报表中心</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right" :class="getPermission('attend-class') ? '' : 'no-permission'" ref="classSchedule"
                     style="flex: 1;">
                    <Calendar ref="calendar" :days="days" :isShowDetailBtn="true" @reLoadLayout="reLayout">
                        <template v-slot:default="slotProps">
                            <header class="header">
                                <div @click="getPermission('attend-class') ? weekPre() : '', clicKBuryPoint('上周')"
                                     class="week flex-align-items">
                                    <el-icon :size="16">
                                        <ArrowLeft/>
                                    </el-icon>
                                    上周
                                </div>
                                <div class="title">上课</div>
                                <div class="header-right">
                                    <div class="refresh flex-align-items"
                                         @click="getPermission('attend-class') ? slotProps.initSchedules : ''">
                                        <el-icon :size="16" :style="{ marginRight: '4px' }">
                                            <RefreshRight/>
                                        </el-icon>
                                        刷新课表
                                    </div>
                                    <div @click="
                                        getPermission('attend-class') ? weekNext() : '', clicKBuryPoint('下周')
                                    " class="week flex-align-items">
                                        下周
                                        <el-icon :size="16">
                                            <ArrowRight/>
                                        </el-icon>
                                    </div>
                                </div>
                            </header>
                        </template>
                    </Calendar>
                </div>
            </div>
            <div class="bottom-bto" v-if="!layoutAdjust">

                <div
                    class="item"
                    @click="go('resource-center/' + platformId), clicKBuryPoint('资源中心')"
                    :class="getPermission('resource-center') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/pic_zyzx.png" alt=""/>
                        <span>资源中心</span>
                    </div>
                </div>
                <div class="item" @click="go('assessment-center'), clicKBuryPoint('评测中心')"
                     :class="getPermission('assessment-center') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/pic_kaoshi_new.png" alt=""/>
                        <span>测评中心</span>
                    </div>
                </div>
                <div class="item" @click="go('composition'), clicKBuryPoint('AI作文')"
                     :class="getPermission('composition') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/pic_aizw@2x.png" alt=""/>
                        <span>AI作文</span>
                    </div>
                </div>
                <div class="item" @click="go('pblstudy'), clicKBuryPoint('PBL项目式学习')"
                     :class="getPermission('pblstudy') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/icon_pbl@2x.png" alt=""/>
                        <span>PBL项目式学习</span>
                    </div>
                </div>

                <div class="item" @click="go('class-manage'), clicKBuryPoint('班级管理')"
                     :class="getPermission('class-manage') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/icon_xuesheng.png" alt=""/>
                        <span>班级管理</span>
                    </div>
                </div>
                <div class="item" @click="go('report-center'), clicKBuryPoint('报表中心')"
                     :class="getPermission('report-center') ? '' : 'no-permission'"
                >
                    <div class="item_div">
                        <img src="../../assets/indexImages/pic_baobiao_new.png" alt=""/>
                        <span>报表中心</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="moreVisible" width="30%" center :show-close="false" :close-on-click-modal="false"
               class="home-cus-dialog" top="37vh">
        <div class="middle-con">
            <!-- <div class="con-card">
                <img src="../../assets/indexImages/pci_jtbk.png" alt="" />
                <p>集体备课</p>
            </div> -->
            <div class="con-card" @click="go(''), clicKBuryPoint('直播课堂')">
                <img src="../../assets/indexImages/pic_zbkt.png" alt=""/>
                <p>直播课堂</p>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="close-btn" @click="moreVisible = false">
                    <img src="../../assets/indexImages/icon_close_white.png" alt=""/>
                    <span>关闭</span>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { ElMessage } from "element-plus";
import { defineComponent, onActivated, ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Calendar from "../../components/calendar/index.vue";
import usePageEvent from "@/hooks/usePageEvent";
import isElectron from "is-electron";
import { EVENT_TYPE } from "@/config/event";
import { nextTick } from "process";
import { debounce } from "lodash";
import { get, set, STORAGE_TYPES, storeChange } from "@/utils/storage";
import { getPlatformByOrgId } from "@/api/home";
import { UserInfoState } from "@/types/store";
import useMaximizeWindow from "@/hooks/useMaximizeWindow";
import { store } from "@/store";
import useHome from "@/hooks/useHome";

export default defineComponent({
    name: "Home",
    components: {
        Calendar
    },
    setup() {
        const {
            getUserPermission
        } = useHome();
        const { createBuryingPointFn } = usePageEvent("首页");
        const router = useRouter();
        const route = useRoute();
        const { weekNext, weekPre, initDays, days } = useTime();
        initDays();
        const moreVisible = ref(false); //点击更多的弹框
        const go = (val: string) => {
            if (getPermission(val)) {
                if (val === "") {
                    ElMessage.warning({
                        message: "功能建设中 敬请期待"
                    });
                } else {
                    if (val == "more-content") {
                        moreVisible.value = true;
                        return;
                    }
                    router.push(`/${val}`);
                }
            }
        };
        const appPermission = ref();
        watch(() => store.state.userInfo.schoolId, async () => {
            appPermission.value = await getUserPermission();
            set(STORAGE_TYPES.SET_APP_PERMISSION, appPermission.value);
        }, { deep: true, immediate: true });
        // 获取应用权限
        const getPermission = (val: string) => {
            const nval = val.split("/")[0];
            return appPermission.value && appPermission.value.includes(nval);
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
        });

        const platformId = ref("");
        const getPlatformIdByOrgId = () => {
            const currentUserInfo: UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
            const id = currentUserInfo.schoolId;

            getPlatformByOrgId([{ id }]).then(res => {
                platformId.value = res.result.length > 0 ? res.result[0].platformId : "";
            });
        };

        onMounted(() => {
            getPlatformIdByOrgId();
            storeChange(STORAGE_TYPES.CURRENT_USER_INFO, (value) => {
                // 组织切换 更新PlateformId
                if (value) getPlatformIdByOrgId();
            });
        });

        const leftBlock = ref();
        const classSchedule = ref();
        const layoutAdjust = ref(true);
        let timer: any = null;
        const resize = debounce(() => {
            if (classSchedule.value && route.path === "/home") {
                // 右边边小于一半，没有进行过布局调整，进行布局调整
            }
        }, 200);
        const resizeObserver = new ResizeObserver(resize);
        onMounted(() => {
            if (leftBlock.value) {
                resizeObserver.observe(leftBlock.value);
            }
            window.addEventListener("resize", resize);
            window.addEventListener("resize", reLayout);
        });
        const reLayout = () => {
            if (classSchedule.value && route.path === "/home") {
                const content_dom: HTMLElement = document.querySelector('.main .top .right .calendar .content .content-box') as HTMLElement;
                const content_dom_out: HTMLElement = document.querySelector('.main .top .right .calendar .content') as HTMLElement;
                const col_doms: any = content_dom.children;
                if (col_doms.length) {
                    const colHeight = col_doms.length * col_doms[0].offsetHeight;
                    const contentHeight = content_dom_out.offsetHeight;
                    // console.log('colHeight---contentHeight', colHeight, contentHeight);
                    if (colHeight > contentHeight + 1) {
                        layoutAdjust.value = true
                    } else {
                        layoutAdjust.value = false
                    }
                }

            }
        };
        onUnmounted(() => {
            window.removeEventListener("resize", resize);
            if (leftBlock.value) resizeObserver.unobserve(leftBlock.value);
            window.removeEventListener("resize", reLayout);
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
            useMaximizeWindow,
            days,
            calendar,
            clicKBuryPoint,
            reLayout,
            getPermission,
            moreVisible,
            leftBlock,
            classSchedule,
            layoutAdjust,
            platformId
        };
    }
});
</script>

<style lang="scss" scoped>
* {
    user-select: none;
}

.no-permission {
    opacity: .5;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-image: url("./../../assets/indexImages/icon_lock.png");
        background-size: cover;
        color: #fff;
        width: 40px;
        height: 40px;
    }
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
                //flex: 1;
                width: 38%;
                padding-right: 28px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;


                div:hover {
                    margin-top: 0px;
                    /*和hover的margin-top有对比，原无30,现在0，相当于上移了,30px*/
                    box-shadow: 0 0 25px 4px #918f8f;
                    /*盒子阴影*/
                    transition: all 0.5s;
                    /*持续时间*/
                }

                .left-one {
                    height: 40%;
                    position: relative;
                    //flex: 1;
                    box-sizing: border-box;
                    margin-bottom: 16px;
                    cursor: pointer;
                    background: url("./../../assets/indexImages/card_beike备份.png") no-repeat;
                    background-position: center center;
                    background-size: cover;
                    border-radius: 15px;

                    span {
                        position: absolute;
                        top: 10%;
                        left: 6%;
                        //font-size: 46px;
                        font-size: 3.4vw;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                        font-weight: 800;
                        color: #ffffff;
                    }
                }

                .left-two {
                    height: 36%;
                    // margin-bottom: 28px;
                    //flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:hover {
                        box-shadow: none !important;
                    }

                    // background: url("./../../assets/indexImages/card_zuoye.png") no-repeat;
                    // background-position: center center;
                    // background-size: cover;
                    .work, .wrong-book {
                        position: relative;
                        box-sizing: border-box;
                        cursor: pointer;
                        border-radius: 15px;
                        width: calc(50% - 10px);
                        height: 100%;
                        background: url("./../../assets/indexImages/card_zuoye_half.png") no-repeat;
                        background-position: center center;
                        background-size: cover;

                        span {
                            position: absolute;
                            top: 10%;
                            left: 6%;
                            //font-size: 36px;
                            font-size: 2.4vw;
                            font-family: PingFang-SC-Heavy, PingFang-SC;
                            font-weight: 800;
                            color: #ffffff;
                        }
                    }

                    .wrong-book {
                        background: url("./../../assets/indexImages/card_cuotiben_half.png") no-repeat;
                        background-position: center center;
                        background-size: cover;
                    }

                    .composition-pbl {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        box-sizing: border-box;
                        width: calc(50% - 14px);
                        height: 100%;

                        &:hover {
                            box-shadow: none !important;
                        }

                        .composition, .pbl {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            cursor: pointer;
                            border-radius: 15px;
                            background: url("./../../assets/indexImages/card_zuowen.png") no-repeat;
                            background-position: center center;
                            background-size: cover;
                            margin-bottom: 8px;

                            span {
                                position: absolute;
                                top: 10%;
                                left: 6%;
                                //font-size: 36px;
                                font-size: 1.4vw;
                                font-family: PingFang-SC-Heavy, PingFang-SC;
                                font-weight: 800;
                                color: #ffffff;
                            }
                        }

                        .pbl {
                            margin-bottom: 0;
                            margin-top: 8px;
                            background: url("./../../assets/indexImages/card_pbl.png") no-repeat;
                            background-size: cover;
                        }
                    }


                    img {
                        // width: 100%;
                        height: 100%;
                        border-radius: 15px;
                    }


                }

                .bottom-left {
                    width: 100%;
                    flex: 1;
                    padding-top: 16px;
                    box-shadow: none !important;


                    .bottom-item {
                        display: flex;

                        &:hover {
                            box-shadow: none !important;
                        }

                        &:nth-child(2) {
                            padding-top: 16px;
                        }

                        .item {
                            padding: 16px;
                            flex: 1;
                            box-shadow: none !important;
                            padding-top: 0;
                            padding-bottom: 0;

                            &:last-child {
                                padding-right: 0;
                            }

                            &:nth-child(2) {
                                padding: 0;
                            }

                            &:first-child {
                                padding-left: 0;
                            }

                            &:hover {
                                box-shadow: none;
                            }

                            .item_div {
                                cursor: pointer;
                                position: relative;
                                width: 100%;
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                border-radius: 16px;

                                img {
                                    width: 100%;
                                }

                                span {
                                    position: absolute;
                                    top: 18%;
                                    left: 8%;
                                    z-index: 10;
                                    font-size: 1.4vw;
                                    font-family: PingFang-SC-Heavy, PingFang-SC;
                                    font-weight: 800;
                                    color: #ffffff;
                                }
                            }

                            //&:first-child {
                            //    .item_div span {
                            //        left: 15%;
                            //    }
                            //}
                        }

                        .item:hover {
                            img {
                                filter: drop-shadow(0 0 15px #928c8c);
                            }
                        }
                    }

                }

                .left-three {
                    box-sizing: border-box;
                    position: relative;
                    margin-bottom: 28px;
                    cursor: pointer;
                    flex: 1;
                    background: url("./../../assets/indexImages/pic_baobiao_new.png") no-repeat;
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
                    background: url("./../../assets/indexImages/pic_zyzx.png") no-repeat;
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
                //min-width: 300px;
                // overflow-y: auto;
                // height: 100%;
                //width: 62%;
            }
        }

        .bottom-bto {
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
                    border-radius: 22px;

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

                    &:hover {
                        margin-top: 0px;
                        box-shadow: 0 0 25px 4px #918f8f;
                        transition: all 0.5s;
                    }
                }

                &:first-child {
                    .item_div span {
                        left: 15%;
                    }
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
