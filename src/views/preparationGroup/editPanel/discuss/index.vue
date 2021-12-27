<template>
    <div class="discuss">
        <div class="discuss-head">
            <span class="title">研讨内容</span>
            <div class="discuss-btn">
                <img src="../../../../assets/preparationGroup/editPanel/discuss-btn.png" alt="" />
                <span>新增研讨</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    name: "discuss",
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
.discuss {
    width: 100%;
    min-height: 220px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 20px 24px;
    padding-bottom: 0;
    .discuss-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }
        .discuss-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 142px;
            height: 36px;
            background: #4B71EE;
            border-radius: 4px;
            cursor: pointer;
            img {
                display: inline-block;
                width: 12px;
                height: auto;
            }
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                margin-left: 10px;
            }
        }
    }
}
</style>
