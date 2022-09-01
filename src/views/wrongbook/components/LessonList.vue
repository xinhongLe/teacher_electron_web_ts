<template>
    <div class="lessonlist">
        <h3>求倍数的实际应用</h3>
        <div class="wrongbook-list">
            <div class="list-item" v-for="(item, index) in 10">
                <div class="item-content">
                    <div class="item-index">{{ index + 1 }}</div>
                    <div class="item-title">
                        <div class="wrongtype">单选题</div>
                        <div class="content">
                            <p class="title">先数一数，再照样子涂一涂</p>
                            <p class="desc">知识点：倍的认识</p>
                        </div>
                    </div>
                    <div class="item-middle">
                        <div
                            class="frequency"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <p class="title">出现频次</p>
                            <p class="count">1次</p>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">最近完成率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 3 ||
                                props.currentWrongType == 4
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">最近错误率</p>
                                <div class="rate">
                                    <span> 20% </span>
                                    <!-- <div class="arrow">
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest1.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div> -->
                                    <div class="arrowtwo">
                                        <img
                                            src="~@/assets/images/wrongbook/arrow_next_rest.png"
                                            alt=""
                                        />
                                        <div class="bg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">完成率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div>
                        <div
                            class="ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <el-progress
                                :show-text="false"
                                type="circle"
                                :percentage="25"
                                :width="40"
                            />
                            <div class="content">
                                <p class="title">平均错误率</p>
                                <p class="rate">90%</p>
                            </div>
                        </div>
                        <div
                            class="wrong-ratedata"
                            v-if="
                                props.currentWrongType == 1 ||
                                props.currentWrongType == 2
                            "
                        >
                            <p class="title">分层错误率</p>
                            <!-- <span>暂未分层</span> -->
                            <p class="text">A3%，B暂无学生，C暂无学生</p>
                        </div>
                    </div>
                </div>

                <div class="item-operate">
                    <div class="operate-btn">
                        <img
                            src="~@/assets/images/wrongbook/icon_voice.png"
                            alt=""
                        />
                        <span>讲解题目</span>
                    </div>
                    <div class="operate-btn">
                        <img
                            src="~@/assets/images/wrongbook/icon_tonglei.png"
                            alt=""
                        />
                        <span>查看同类题</span>
                    </div>
                    <div
                        class="operate-btn"
                        @click="openWrongDetails('isshowdetails')"
                    >
                        <img
                            src="~@/assets/images/wrongbook/icon_tmxq.png"
                            alt=""
                        />
                        <span>题目详情</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="paginations">
        <el-pagination
            v-model:currentPage="pagers.currentPage"
            v-model:page-size="pagers.pageSize"
            :page-sizes="[100, 200, 300, 400]"
            :background="true"
            layout=" prev, pager, next, sizes, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script lang="ts" setup>
import { state } from "@/store/modules/state";
import { ref, defineEmits, defineProps } from "vue";
const props = defineProps({
    currentWrongType: {
        type: Number,
        default: null,
        required: true,
    },
});
const emit = defineEmits(["openWrongDetails"]);
//分页参数
const pagers = ref({
    currentPage: 1,
    pageSize: 10,
});
//分页改变
const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`);
};
//分页改变
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`);
};
//打开错题本详情页
const openWrongDetails = (data?: any) => {
    console.log(123);
    emit("openWrongDetails", data);
};
</script>
<style lang="scss" scoped>
.lessonlist {
    height: calc(100% - 48px);
    background-color: #fff;
    padding: 16px;
    overflow: auto;
    h3 {
        font-size: 18px;
        font-family: HarmonyOS_Sans_SC_Bold;
        font-weight: bold;
        color: #19203d;
    }
    .wrongbook-list {
        margin-top: 14px;
        .list-item {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background: #f9fafc;
            width: 100%;
            padding: 14px 18px;
            margin-bottom: 10px;
            .item-content {
                display: flex;
                align-items: center;
                width: 70%;
                .item-index {
                    font-size: 16px;
                    color: #19203d;
                    font-weight: bold;
                }
                .item-title {
                    display: flex;
                    align-items: center;
                    margin-left: 18px;
                    .wrongtype {
                        width: 50px;
                        // height: 20px;
                        padding: 4px;
                        border-radius: 2px;
                        border: 1px solid rgba(75, 113, 238, 0.3);
                        font-size: 13px;
                        color: #4b71ee;
                    }
                    .content {
                        margin-left: 18px;
                        .title {
                            font-size: 16px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #19203d;
                            width: 170px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .desc {
                            padding-top: 6px;
                            font-size: 14px;
                            font-family: HarmonyOS_Sans_SC;
                            color: #a7aab4;
                        }
                    }
                }
                .item-middle {
                    margin-left: 68px;
                    display: flex;
                    align-items: center;
                    .frequency {
                        margin-right: 26px;
                        .title {
                            color: #5f626f;
                        }
                        .count {
                            color: #19203d;
                            padding-top: 6px;
                        }
                    }
                    .ratedata {
                        display: flex;
                        align-items: center;
                        margin-right: 26px;
                        justify-content: flex-start;
                        .content {
                            margin-left: 14px;
                            color: #5f626f;
                        }
                        .rate {
                            color: #19203d;
                            padding-top: 6px;
                            display: flex;
                            .arrow {
                                position: relative;
                                img {
                                    position: absolute;
                                    bottom: 0px;
                                    left: 3px;
                                }
                                .bg {
                                    width: 1px;
                                    height: 9px;
                                    border: 1px solid #2ee18e;
                                    position: absolute;
                                    top: 1px;
                                    left: 5px;
                                }
                            }
                            .arrowtwo {
                                position: relative;
                                img {
                                    position: absolute;
                                    top: 0px;
                                    left: 4px;
                                }
                                .bg {
                                    width: 1px;
                                    height: 9px;
                                    border: 1px solid #ff6b6b;
                                    position: absolute;
                                    bottom: 1px;
                                    left: 5px;
                                }
                            }
                        }
                    }
                    .wrong-ratedata {
                        .title {
                            color: #5f626f;
                        }
                        .text {
                            color: #19203d;
                            padding-top: 6px;
                        }
                    }
                }
            }
            .item-operate {
                display: flex;
                align-items: center;
                .operate-btn {
                    display: flex;
                    align-items: center;
                    margin-left: 24px;
                    span {
                        font-size: 15px;
                        padding-left: 4px;
                        color: #4b71ee;
                    }
                }
            }
        }
    }
}
.paginations {
    text-align: right;
    padding: 0 16px;
}
</style>
