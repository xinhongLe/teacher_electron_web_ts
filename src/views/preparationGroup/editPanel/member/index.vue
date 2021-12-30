<template>
    <div class="member">
        <div class="member-head">
            <div class="title">小组成员<span>({{ memberList.length }})</span></div>
            <div class="btn-edit">
                <img src="../../../../assets/preparationGroup/editPanel/icon_guanli.png" alt="" />
                <span>管理</span>
            </div>
        </div>
        <div v-if="memberList.length > 0">
            <div class="member-list">
                <div class="member-cell" v-for="(item, index) in memberList" :key="index">
                    <img class="file-download" src="../../../../assets/preparationGroup/editPanel/avator_small_back.png" alt="" />
                    <p>{{ item.memberName }}</p>
                </div>
            </div>
            <p class="more" v-if="computedMore">查看更多</p>
        </div>
        <div class="empty" v-else>
            暂无小组成员
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
export default defineComponent({
    name: "member",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            memberList: [
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "张老师"
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "王老师"
                }
            ]
        });

        const submit = () => {
            console.log(1);
        };

        const computedMore = computed(() => {
            const parent = document.querySelectorAll(".member-list");
            console.log(parent);
            const result = state.memberList.length > 5;
            return result;
        });
        return {
            ...toRefs(state),
            computedMore,
            submit
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.member {
    width: 100%;
    min-height: 140px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 24px;
    &-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            display: flex;
            align-items: center;
            span {
                font-size: 14px;
                margin-left: 10px;
            }
        }
        .btn-edit {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
                display: inline-block;
                width: 16px;
                height: auto;
            }
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
                margin-left: 5px;
            }
        }
    }
    .member-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .member-cell {
            margin-right: 32px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            flex-direction: column;
            p {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203D;
                margin-top: 18px;
            }
        }
    }
    .more {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4B71EE;
        text-align: center;
        line-height: 40px;
        margin-top: 20px;
        cursor: pointer;
    }
    .empty {
        width: 100%;
        text-align: center;
        padding: 40px 0 0 0;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5F626F;
    }
}
</style>
