<template>
    <el-config-provider :locale="locale">
       <div class="quick-answer-app">
           <!-- 抢答页面-->
           <div class="quickAnswer" v-if="isAnswer">
               <select-class v-if="showSelectClass" :userInfo="userInfo" @openQuickAnswer="openQuickAnswer"></select-class>
               <quick-answer-detail v-else :classList="classList" :currentUserInfo="currentUserInfo"></quick-answer-detail>
           </div>

           <!-- 锁屏管理页面-->
           <div class="quickAnswer"  v-if="!isAnswer">
               <lock-screen :currentUserInfo="currentUserInfo"></lock-screen>
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
import { get, STORAGE_TYPES } from "@/utils/storage";
import { LessonClasses } from "@/types/login";
export default defineComponent({
    components: { LockScreen, QuickAnswerDetail, SelectClass },
    setup() {
        const currentUserInfo = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        const allStudentList = ref<Student[]>([]);

        console.log(currentUserInfo, "currentUserInfo");
        console.log(userInfo, "userInfo");
        console.log(allStudentList.value, "allStudentList");

        const state = reactive({
            isAnswer: true,
            showSelectClass: true,
            classList: [] as LessonClasses[]
        });

        const openQuickAnswer = (classList:LessonClasses[]) => {
            state.classList = classList;
            state.showSelectClass = false;

        };

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList, isAnswer) => {
            state.isAnswer = isAnswer;
            allStudentList.value = studentList;
        });

        return {
            locale: zhCn,
            currentUserInfo,
            userInfo,
            ...toRefs(state),
            openQuickAnswer,
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
