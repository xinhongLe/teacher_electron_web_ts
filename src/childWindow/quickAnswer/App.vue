<template>
    <el-config-provider :locale="locale">
       <div class="quick-answer-app">
           <!-- 抢答页面-->
           <div class="quickAnswer" v-if="isAnswer">
               <select-class v-if="showSelectClass" :yunInfo="yunInfo" :currentUserInfo="currentUserInfo" @openQuickAnswer="openQuickAnswer"></select-class>
               <quick-answer-detail v-if="showQuickAnswer" :classList="classList" :currentUserInfo="currentUserInfo"></quick-answer-detail>
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
import { IYunInfo } from "@/types/login";
import { fetchUserSchedules } from "@/api/timetable";
import moment from "moment";
import { UserInfoState } from "@/types/store";
import { IClassItem } from "@/types/quickAnswer";
export default defineComponent({
    components: { LockScreen, QuickAnswerDetail, SelectClass },
    setup() {
        const currentUserInfo:UserInfoState = get(STORAGE_TYPES.CURRENT_USER_INFO);
        const userInfo = get(STORAGE_TYPES.USER_INFO);
        const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);
        const allStudentList = ref<Student[]>([]);
        console.log(userInfo, "userInfo");
        console.log(yunInfo, "yunInfo");
        console.log(currentUserInfo, "currentUserInfo");

        const state = reactive({
            isAnswer: true,
            showSelectClass: false,
            showQuickAnswer: false,
            classList: [] as IClassItem[]
        });

        const openQuickAnswer = (classList:IClassItem[]) => {
            state.classList = classList;
            state.showSelectClass = false;
            state.showQuickAnswer = true;
        };

        const _fetchUserSchedules = () => {
            const data = {
                StartTime: moment().format("YYYY-MM-DD"),
                EndTime: moment().format("YYYY-MM-DD"),
                TermCode: yunInfo.TermCode,
                SchoolID: currentUserInfo.schoolId,
                TeacherID: currentUserInfo.userCenterUserID
            };
            fetchUserSchedules(data).then(res => {
                if (res.resultCode === 200) {
                    const teacherCourseList = res.result.TeacherCourseList;
                    const time = moment().format("HH:mm:ss");
                    if (teacherCourseList && teacherCourseList.length > 0) {
                        const currentSchedule = teacherCourseList[0].ScheduleDetailData;
                        const ifHaveClass = currentSchedule.find(item => (item.StartTime <= time && time <= item.EndTime)); // 是否正在上课
                        if (ifHaveClass) {
                            state.classList = [{ ClassName: ifHaveClass!.ClassName, ClassId: ifHaveClass!.ClassID }];
                            state.showQuickAnswer = true;
                        } else {
                            state.showSelectClass = true;
                        }
                    } else {
                        state.showSelectClass = true;
                    }
                }
            });
        };
        _fetchUserSchedules();

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList, isAnswer) => {
            state.isAnswer = isAnswer;
            allStudentList.value = studentList;
            console.log(studentList, "studentList-----");
        });

        return {
            locale: zhCn,
            currentUserInfo,
            userInfo,
            yunInfo,
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
