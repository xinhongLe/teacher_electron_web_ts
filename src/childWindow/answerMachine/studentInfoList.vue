<template>
    <div class="student-list">
        <div class="student-info" v-for="student in studentList" :key="student.StudentID" :title="student.StudentName">
            {{ student.StudentName }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Student } from "@/types/labelManage";
export default defineComponent({
    props: {
        studentList: {
            type: Array as PropType<{StudentID:string, StudentName:string}[]>,
            default: () => []
        }
    },
    setup() {
        return {};
    }
});
</script>

<style lang="scss" scoped>
.student-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.student-info {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 40px;
    background: #F5F6FA;
    border-radius: 4px;
    color: #19203d;
    font-size: 14px;
    @include text-ellipsis;
    margin-right: 10px;
    &:nth-child(10n+0) {
        margin-right: 0;
    }
    &:nth-child(n+11) {
        margin-top: 10px;
    }
}
</style>
