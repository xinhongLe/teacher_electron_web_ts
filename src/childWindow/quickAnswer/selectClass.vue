<template>
    <div class="box">
        <Title title="选择班级" :close="close"></Title>
        <div class="content">
            <div class="left">
                <div :class="['leftRow', activeIndex === i ? 'active' : '']" v-for="(item, i) in leftList" :key="i">
                    <el-checkbox v-model="item.check" :label="item.name" size="large" />
                </div>
            </div>
            <div class="right">
                <el-checkbox v-for="(item, i) in rightList" :key="i" v-model="item.check" :label="item.name" size="large" />
            </div>
        </div>
        <div class="footer">
            <el-button>取消</el-button>
            <el-button type="primary">确定</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Title from "@/childWindow/answerMachine/title.vue";
export default defineComponent({
    name: "selectClass",
    components: { Title },
    setup() {
        const state = reactive({
            activeIndex: 0,
            leftList: [
                { name: "一年级", check: false },
                { name: "二年级", check: false },
                { name: "三年级", check: false }
            ],
            rightList: [
                { name: "一年级", check: false },
                { name: "二年级", check: false },
                { name: "三年级", check: false }
            ]
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        return {
            ...toRefs(state),
            close
        };
    }
});
</script>

<style scoped lang="scss">
.box{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
}
.content{
    display: flex;
    flex: 1;
    .left{
        width: 160px;
        height: 100%;
        overflow-y: auto;
        padding: 20px 0;
        border-right: 1px solid #E9ECF0;;
        .leftRow{
            cursor: pointer;
            height: 36px;
            padding: 0px 20px;
            line-height: 36px;
            &:hover{
                background-color: #ecf5ff;
            }
        }
        .active{
            background: #E6ECFF;
            :deep(.el-checkbox__label){
                color: #4B71EE;
            }
        }
    }
    .right{
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
}
.footer{
    width: 100%;
    padding: 20px 0;
    text-align: center;
}

</style>
