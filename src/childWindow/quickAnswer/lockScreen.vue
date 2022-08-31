<template>
    <div class="lock-screen">
        <Title title="一卡通锁屏管理" :close="close"></Title>
        <div class="content">
          <div class="row" v-for="(item,i) in classList" :key="i">
              <span>{{item.name}}</span>
              <el-switch v-model="item.check" inactive-text="锁定" />
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import Title from "@/childWindow/answerMachine/title.vue";
export default defineComponent({
    name: "lockScreen",
    components: { Title },
    setup() {
        const state = reactive({
            activeIndex: 0,
            classList: [
                { name: "一年级", check: false },
                { name: "二年级", check: false },
                { name: "三年级", check: false },
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
.lock-screen{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
    border-radius: 12px;
}
.content{
    flex: 1;
    overflow-y: auto;
    padding: 0 40px 40px;
   .row{
       height: 50px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       border-bottom: 1px solid #E9ECF0;
       color: #19203D;
       :deep(.el-switch){
           .el-switch__label.is-active{
               color: #6E6D7A;
           }
       }
   }
}
</style>
