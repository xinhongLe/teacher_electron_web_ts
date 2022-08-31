<template>
    <el-config-provider :locale="locale">
       <div class="quick-answer-app">
           <!-- 抢答页面-->
           <div class="quickAnswer" v-if="isAnswer">
               <select-class v-if="false"></select-class>
               <quick-answer-detail></quick-answer-detail>
           </div>

           <!-- 锁屏管理页面-->
           <div class="quickAnswer"  v-else>
               <lock-screen></lock-screen>
           </div>
       </div>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Student } from "@/types/labelManage";
import SelectClass from "./selectClass.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import QuickAnswerDetail from "@/childWindow/quickAnswer/quickAnswerDetail.vue";
import LockScreen from "@/childWindow/quickAnswer/lockScreen.vue";
export default defineComponent({
    components: { LockScreen, QuickAnswerDetail, SelectClass },
    setup() {
        const allStudentList = ref<Student[]>([]);

        const state = reactive({
            isAnswer: false
        });

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList, isAnswer) => {
            state.isAnswer = isAnswer;
            allStudentList.value = studentList;
            console.log(allStudentList, "---");
        });

        return {
            locale: zhCn,
            ...toRefs(state),
            close
        };
    }
});
</script>

<style scoped lang="scss">
.quick-answer-app{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.4);
}
.quickAnswer{
    width: 620px;
    height: 420px;
}
</style>
