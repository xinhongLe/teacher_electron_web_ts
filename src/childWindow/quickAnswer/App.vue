<template>
    <el-config-provider :locale="locale">
        <select-class v-if="false"></select-class>
        <quick-answer-detail></quick-answer-detail>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Student } from "@/types/labelManage";
import SelectClass from "./selectClass.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import QuickAnswerDetail from "@/childWindow/quickAnswer/quickAnswerDetail.vue";
export default defineComponent({
    components: { QuickAnswerDetail, SelectClass },
    setup() {
        const allStudentList = ref<Student[]>([]);

        const state = reactive({

        });

        const close = () => {
            window.electron.destroyWindow();
        };

        window.electron.ipcRenderer.on("sendAllStudentList", (_, studentList) => {
            allStudentList.value = studentList;
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
.quickAnswer{
}
</style>
