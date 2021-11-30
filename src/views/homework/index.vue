<template>
    <div class="homework-wrapper">
        <header class="flex-between-center">
            <div>
                <el-select
                    style="width: 140px; margin-right: 16px"
                    v-model="form.subject"
                >
                    <el-option
                        v-for="item in subjectList"
                        :label="item.Name"
                        :value="item.ID"
                        :key="item.ID"
                    >
                    </el-option>
                </el-select>
                <el-date-picker
                    v-model="form.date"
                    type="date"
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledDate"
                    @change="getTaskList"
                >
                </el-date-picker>
            </div>
            <div>
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-tickets"
                    @click="handleClick"
                    >布置作业</el-button
                >
                <el-button plain icon="el-icon-refresh" @click="initData"
                    >刷新</el-button
                >
            </div>
        </header>
        <div class="row-line" />
        <div class="class-list">
            <p
                v-for="(item, index) in classList"
                :key="index"
                :class="selectClassId === item.ID ? 'active' : ''"
                @click="selectClassId = item.ID"
            >
                {{ item.Name
                }}<span>({{ homeworkListMap[item.ID]?.length || 0 }})</span>
            </p>
        </div>
        <div class="homework-content">
            <div v-if="subjectList.length > 0" class="table-list">
                <template v-if="Object.keys(homeworkListMap).length !== 0">
                    <template v-if="homeworkListMap[selectClassId]">
                        <HomeworkItem
                            v-for="item in homeworkListMap[selectClassId]"
                            :key="item.HomeworkPaperID"
                            :info="item"
                            @getTaskList="getTaskList"
                        />
                    </template>
                    <template v-else>
                        <div class="no-assign-homework">
                            <img
                                src="@/assets/images/homeworkNew/pic@2x.png"
                                alt=""
                            />
                            <p>此班级在当日没有{{ subjectName }}作业</p>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div class="no-assign-homework">
                        <img
                            src="@/assets/images/homeworkNew/pic@2x.png"
                            alt=""
                        />
                        <p>您还没有布置过{{ subjectName }}作业</p>
                    </div>
                </template>
            </div>
            <div v-else class="table-list-no">
                <div>
                    <img src="@/assets/images/homeworkNew/pic@2x.png" alt="" />
                    <p>您还没有科目</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import useHomework from "./hooks/useHomework";
import HomeworkItem from "./homeworkItem.vue";
export default defineComponent({
    setup() {
        const router = useRouter();
        const {
            subjectList,
            form,
            classList,
            disabledDate,
            homeworkListMap,
            selectClassId,
            getTaskList,
            initData,
            getHasTaskDate
        } = useHomework();
        const subjectName = computed(
            () =>
                subjectList.value.find(({ ID }) => ID === form.subject)
                    ?.Name
        );
        const handleClick = () => {
            router.push({
                path:
                    "/assignHomework/" + form.subject + "/" + subjectName.value
            });
        };
        return {
            subjectList,
            form,
            classList,
            disabledDate,
            homeworkListMap,
            selectClassId,
            getTaskList,
            initData,
            handleClick,
            getHasTaskDate,
            subjectName
        };
    },
    components: { HomeworkItem }
});
</script>

<style lang="scss" scoped>
.homework-wrapper {
    height: 100%;
    header {
        padding: 20px;
    }
    .row-line {
        height: 10px;
        background-color: #f5f6fa;
    }
    .class-list {
        padding: 20px;
        overflow: hidden;
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        p {
            display: flex;
            height: 40px;
            font-size: 16px;
            line-height: 40px;
            padding: 0 20px;
            margin-right: 10px;
            margin-bottom: 10px;
            background: #eff0f4;
            border-radius: 4px;
            cursor: pointer;
            &.active {
                color: #fff;
                background: #4b71ee;
            }
            span {
                font-size: 12px;
                margin-left: 4px;
            }
        }
    }
    .homework-content {
        height: calc(100% - 170px);
        background-color: #fff;
        padding: 0 20px;
        position: relative;
        .no-assign-homework {
            img {
                width: 240px;
                height: 157px;
                display: block;
                margin: auto;
                margin-top: 20vh;
            }
            p {
                margin-top: 16px;
                font-size: 20px;
                color: #5f626f;
                line-height: 28px;
                text-align: center;
            }
        }
        .table-list-no {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            img {
                width: 240px;
                height: 160px;
            }
            p {
                color: #5f626f;
                font-size: 20px;
                text-align: center;
            }
        }
    }
}
</style>
