<template>
    <div class="student-list">
        <div class="empty" v-if="studentList.length === 0">
            <img src="@/assets/my-student/pic_noclass@2x.png" />
            <p>暂无学生</p>
        </div>
        <div class="list" v-else>
            <el-row :gutter="16">
                <Studente
                    v-for="item in studentList"
                    :key="item.ID"
                    :item="item"
                />
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useStudentList from "./useStudentList";
import Studente from "./Studente.vue";

export default defineComponent({
    name: "StudentList",
    components: { Studente },
    setup() {
        const { studentList } = useStudentList();
        return {
            studentList
        };
    }
});
</script>

<style lang="scss" scoped>
    .student-list {
        flex: 1;
        padding: 24px;
        overflow-y: scroll;
        .list {
            :deep(.el-col-5) {
                max-width: 19.833333%;
                flex: 0 0 19.833333%;
            }
        }
        .empty {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: #5f626f;
            img {
                width: 230px;
                height: 156px;
                margin-bottom: 36px;
            }
        }
    }
</style>
