<template>
    <div class="student-list">
        <div class="student-info" v-for="student in studentList" :key="student.StudentID" :title="student.Name">
            {{ student.Name }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Student } from "@/types/labelManage";
export default defineComponent({
    props: {
        studentList: {
            type: Array as PropType<Student[]>,
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
    width: 110px;
    height: 50px;
    background: #fff;
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
