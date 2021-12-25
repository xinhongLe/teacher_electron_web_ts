<template>
    <div class="preparation-group-card" v-for="(item, index) in cardList" :key="index">
        <div class="left">
            <img class="cover" src="../../../assets/preparationGroup/pic_source_default.png" alt="备课图片">
            <div class="card-box">
                <p class="card-title">
                    <span class="title">{{ item.preTitle }}</span>
                    <span :class="`status status-${item.status}`">{{ switchStatus(item.status) }}</span>
                </p>
                <div class="card-detail">
                    <div>
                        <img src="../../../assets/preparationGroup/icon_ren.png" alt="创建人">
                        <span>创建人：{{ item.createrName }}</span>
                    </div>
                    <div>
                        <img src="../../../assets/preparationGroup/icon_renshu.png" alt="创建人">
                        <span>小组人数：{{ item.teacherCount }}人</span>
                    </div>
                </div>
                <div class="card-detail">
                    <div>
                        <img src="../../../assets/preparationGroup/icon_shijian.png" alt="创建人">
                        <span>创建时间：{{ item.createTime }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div>
                <div class="delete-btn">
                    <img src="../../../assets/preparationGroup/icon_delete.png" alt="删除">
                </div>
                <el-button type="primary" plain>进入研讨</el-button>
            </div>
            <p>您可以<span class="blue">生成邀请链接</span>， 发送至小组成员</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import useSubmit from "../search/useSubmit";
export default defineComponent({
    name: "card",
    props: {
        cardList: {
            type: Array
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            loading: false
        });

        const switchStatus = (status: number) => {
            return statusList.filter((v) => {
                return v.value === status;
            })[0].label;
        };
        const { statusList } = useSubmit();
        return {
            ...toRefs(state),
            statusList,
            switchStatus
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.preparation-group-card {
    width: 100%;
    height: 182px;
    background: #fff;
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
        display: flex;
        align-items: center;
        .cover {
            display: inline-block;
            width: 200px;
            height: auto;
            background: #DBEDFF;
            border-radius: 4px;
            margin-right: 24px;
        }
        .card-box {
            .card-title {
                margin-bottom: 10px;
                .title {
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #19203D;
                }
                .status {
                    display: inline-block;
                    width: auto;
                    min-width: 64px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    text-align: center;
                    margin-left: 12px;
                    &-1 {
                        background: #E9EDF0;
                        color: #B2B8BE;
                    }
                    &-2 {
                        background: #F5A10E;
                        color: #fff;
                    }
                }
            }
            .card-detail {
                display: flex;
                align-items: center;
                line-height: 30px;
                > div {
                    display: flex;
                    align-items: center;
                    width: 300px;
                }
                img {
                    display: inline-block;
                    width: 12px;
                    height: auto;
                    margin-right: 5px;
                }
                span {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5F626F;
                }
            }
        }
    }
    .right {
        > div {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 16px;
        }
        .delete-btn {
            width: 36px;
            height: 36px;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #E0E2E7;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            cursor: pointer;
        }
        ::v-deep(.el-button) {
            width: 120px;
            height: 36px;
            border-radius: 4px;
            border: 1px solid #4B71EE;
            color: #4B71EE;
            background: #fff;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4B71EE;
            padding: 0;
        }
        ::v-deep(.el-button--primary.is-plain:hover) {
            color: #fff;
            background: #4B71EE;
        }
        p {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
            .blue {
                color: #4B71EE;
                cursor: pointer;
            }
        }
    }
}
</style>
