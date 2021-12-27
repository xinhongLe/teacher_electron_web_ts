<template>
    <div class="member">
        <p class="title">小组成员<span>(7)</span></p>
        <div class="member-list">
            <div class="member-cell" v-for="(item, index) in memberList" :key="index">
                <img class="file-download" src="../../../../assets/preparationGroup/editPanel/avator_small_back.png" alt="" />
                <p>{{ item.memberName }}</p>
            </div>
        </div>
        <p class="more">查看更多</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
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
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
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
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
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
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                },
                {
                    memberIcon: "../../../../assets/preparationGroup/editPanel/avator_small_back.png",
                    memberName: "李老师"
                }
            ]
        });

        const submit = () => {
            console.log(1);
        };

        const add = () => {
            console.log(1);
        };
        return {
            ...toRefs(state),
            submit,
            add
        };
    },
    components: { }
});
</script>

<style lang="scss" scoped>
.member {
    width: 100%;
    min-height: 220px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 24px;
    padding-bottom: 0;
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
                margin-top: 9px;
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
}
</style>
