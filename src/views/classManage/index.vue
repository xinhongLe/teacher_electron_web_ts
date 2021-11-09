<template>
    <div class="my-student">
        <Head/>
        <div class="list-box">
            <GradeList/>
            <StudentList/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Head from "./head/index.vue";
import GradeList from "./gradeList/index.vue";
import StudentList from "./studentList/index.vue";
import { useRoute } from "vue-router";
import useUserInfo from "@/hooks/useUserInfo";

export default defineComponent({
    name: "MyStudent",
    components: {
        Head,
        GradeList,
        StudentList
    },
    setup() {
        const route = useRoute();
        const { queryUserInfoByTeacherId } = useUserInfo();
        if (route.query.teacherId) {
            queryUserInfoByTeacherId(route.query.teacherId as string);
        }
    }
});
</script>

<style lang="scss" scoped>
.my-student {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    .list-box {
        flex: 1;
        width: 100%;
        display: flex;
        background: #f5f6fa;
        justify-content: space-between;
        overflow-y: auto;
    }
}
</style>
