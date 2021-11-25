<template>
    <div class="assign-homework-wrapper">
        <header>
            <p>{{ $route.params.subjectName }}</p>
        </header>
        <div class="row-line"></div>
        <div class="assign-homework-content">
            <div>
                <p class="title-class">布置对象</p>
                <div class="class-wrapper">
                    <el-button
                        plain
                        @click="openHomeworkDialog('classDialog')"
                        >{{ classList.length > 0 ? "重选" : "选择" }}</el-button
                    >
                    <div class="class-content">
                        <p v-for="(item, index) in classList" :key="index">
                            {{ item.ClassName }}
                            <span>班级人数：{{ item.Students.length }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p class="title-class">作业内容</p>
                <div class="content-wrapper">
                    <div>
                        <el-button
                            plain
                            icon="el-icon-plus"
                            @click="openHomeworkDialog('commonHomeworkDialog')"
                            >普通作业</el-button
                        >
                        <el-button
                            plain
                            type="primary"
                            icon="el-icon-plus"
                            @click="openHomeworkDialog('systemHomeworkDialog')"
                            >系统作业</el-button
                        >
                        <el-button
                            plain
                            type="warning"
                            icon="el-icon-plus"
                            @click="openHomeworkDialog('teachHomeworkDialog')"
                            >教辅作业</el-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <el-button type="primary" @click="submit">立即发送</el-button>
        </footer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    setup() {
        const classList = ref([]);

        return {
            classList
        };
    }
});
</script>

<style lang="scss" scoped>
.assign-homework-wrapper {
    height: 100%;
    header {
        padding: 20px;
        p {
            font-size: 32px;
            font-weight: 600;
            color: #19203d;
        }
    }
    .row-line {
        height: 10px;
        background-color: #f5f6fa;
    }
    .assign-homework-content {
        height: calc(100% - 152px);
        overflow-y: auto;
        padding: 20px;
        > div {
            display: flex;
            margin-bottom: 30px;
            .title-class {
                width: 100px;
                font-size: 20px;
                font-weight: 600;
                color: #19203d;
                text-align: center;
                margin-right: 20px;
                padding-top: 8px;
            }
            .class-wrapper {
                flex: 1;
                .class-content {
                    margin-top: 10px;
                    > p {
                        width: 100%;
                        height: 56px;
                        line-height: 56px;
                        background: #f9fafc;
                        border-radius: 4px;
                        padding: 0 20px;
                        margin-bottom: 10px;
                        span {
                            display: inline-block;
                            margin-left: 40px;
                        }
                    }
                }
            }
            .content-wrapper {
                flex: 1;
                .homework-row {
                    display: flex;
                    width: 100%;
                    height: 56px;
                    line-height: 56px;
                    background: #f9fafc;
                    border-radius: 4px;
                    padding: 0 20px;
                    margin-top: 10px;
                    .first-col {
                        width: 40%;
                        align-items: center;
                        display: flex;
                        .indexNumber {
                            font-size: 22px;
                            color: #4b71ee;
                        }
                        .attributebox {
                            width: 60%;
                            margin-left: auto;
                            .attributetype {
                                display: inline-block;
                                width: 80px;
                                text-align: center;
                            }
                        }
                        p {
                            font-weight: 600;
                        }
                        span {
                            margin-left: 12px;
                        }
                        .type {
                            color: #4b71ee;
                        }
                        img {
                            width: 20px;
                            height: 20px;
                            margin: 0 12px;
                        }
                    }
                    .el-icon-edit {
                        color: #4b71ee;
                        margin-left: 12px;
                    }
                }
                .btns {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
    footer {
        margin-top: 15px;
        text-align: center;
    }
}
</style>
