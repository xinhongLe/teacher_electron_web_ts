<template>
    <div class="head">
        <div class="title">班级管理</div>
        <div class="right">
            <div class="form-warp">
                <el-form :model="form" :inline="true">
                    <el-form-item>
                        <el-input
                            v-model="form.studentName"
                            prefix-icon="el-icon-search"
                            placeholder="请输入要搜索的学生"
                        >
                            <template #append>
                                <el-button @click="searchStudent"
                                    >搜索</el-button
                                >
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span class="btn" @click="goLabel">管理标签</span>
            <span class="btn" @click="showAddStudent = true">添加学生</span>
        </div>
        <AddStudent v-model:visible="showAddStudent" v-if="showAddStudent"/>
    </div>
</template>

<script lang="ts">
import { MutationTypes, store } from "@/store";
import { defineComponent, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AddStudent from "../addStudent/index.vue";

export default defineComponent({
    name: "Head",
    setup() {
        const showAddStudent = ref(false);
        const route = useRoute();
        const router = useRouter();
        const form = reactive({
            studentName: ""
        });
        const searchStudent = () => {
            store.commit(MutationTypes.UPDATE_SEARCH_STUDENT, form.studentName);
        };
        const goLabel = () => {
            const id = store.state.myStudent.selectClassInfo.ID;
            if (route.name === "wpf班级管理") {
                router.push("/label-no-header/" + id);
            } else {
                router.push("/label/" + id);
            }
        };

        return {
            form,
            searchStudent,
            goLabel,
            showAddStudent
        };
    },
    components: { AddStudent }
});
</script>

<style lang="scss" scoped>
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        padding: 0 24px;
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #19203d;
        }
        .right {
            display: flex;
            align-items: center;
            .form-warp {
                margin-top: 22px;
                margin-right: 14px;
            }
            :deep( .el-input-group__append) {
                background: none;
                font-size: 14px;
                font-weight: 500;
                color: #4b71ee;
                line-height: 38px;
            }
            .btn {
                width: 160px;
                height: 38px;
                border-radius: 4px;
                border: 1px solid #98AEF6;
                font-size: 16px;
                color: #4B71EE;
                line-height: 38px;
                text-align: center;
                margin-right: 24px;
                cursor: pointer;
                &:last-child {
                    margin-right: 0;
                    color: #fff;
                    background: #4B71EE;
                    border: #4B71EE;
                }
            }
        }
    }
</style>
