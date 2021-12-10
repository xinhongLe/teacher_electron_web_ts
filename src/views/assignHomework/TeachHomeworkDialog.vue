<template>
    <div class="add-system-homework">
        <el-dialog
            title="教辅作业"
            :model-value="dialogVisible"
            width="80%"
            center=""
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="0px">
                <p class="title-text">选择版本</p>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item>
                            <el-select
                                v-model="form.publisherValue"
                                placeholder="请选择"
                                @change="handleChange"
                            >
                                <el-option
                                    v-for="item in publisherList"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :value="item.ID"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-select
                                v-model="form.gradeValue"
                                placeholder="请选择"
                                @change="handleChange"
                            >
                                <el-option
                                    v-for="item in gradeList"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :value="item.ID"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <p class="title-text" style="padding-left: 20px">选择教辅及页码</p>
            <div v-if="leftList.length > 0" class="content">
                <div class="content-left">
                    <div>
                        <div
                            :class="[
                                'left-row',
                                activeLeft === index ? 'active' : '',
                            ]"
                            v-for="(item, index) in leftList"
                            :key="item.WorkbookID"
                            @click="activeLeft = index"
                        >
                            <span>{{ item.WorkbookName }}</span>
                            <span v-show="selectListMap[item.WorkbookID] && selectListMap[item.WorkbookID]?.length > 0">{{
                                selectListMap[item.WorkbookID]?.length
                            }}</span>
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <div
                        :class="['right-row']"
                        v-for="(item, index) in rightList"
                        :key="index"
                    >
                        <el-checkbox
                            :model-value="getIsSelect(item)"
                            @change="flag =>  handleRightClick(flag, item)"
                        >
                            {{`${item.UnitName} ${item.WorkbookPaperName} 第${item.PageNumName}页`}}
                        </el-checkbox>
                        <!--            <span class="flag" v-show="index === 0">最近布置过</span>-->
                    </div>
                </div>
            </div>

            <div v-else class="content-no">
                <div>
                    <img
                        src="@/assets/images/homeworkNew/pic_wuneirong@2x.png"
                        alt=""
                    />
                    <p>教研人员正在抓紧更新中...</p>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleConfirm"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {
    Grade,
    Publisher,
    TeachHomework,
    Workbook,
    WorkbookPaper
} from "@/types/assignHomework";
import { ElMessageBox } from "element-plus";
import { defineComponent, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
    fetchGrade,
    fetchPublisherList,
    fetchWorkbookList,
    fetchWorkbookPaper
} from "./api";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const route = useRoute();
        const form = reactive({
            publisherValue: "",
            gradeValue: ""
        });
        const publisherList = ref<Publisher[]>([]);
        const gradeList = ref<Grade[]>([]);
        const leftList = ref<Workbook[]>([]);
        const rightList = ref<WorkbookPaper[]>([]);
        const activeLeft = ref(0);
        const selectListMap = ref<Record<string, TeachHomework[]>>({});

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const handleConfirm = () => {
            handleClose();
            emit("update", Object.values(selectListMap.value).flat());
        };

        const handleChange = () => {
            if (Object.values(selectListMap.value).length === 0) {
                getWorkbookList();
            } else {
                ElMessageBox.confirm("切换书本会移除已选择的教辅, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    selectListMap.value = {};
                    getWorkbookList();
                });
            }
        };

        const getIsSelect = (item: WorkbookPaper) => {
            const { WorkbookID } =
                leftList.value[activeLeft.value];
            if (!selectListMap.value[WorkbookID]) return false;
            const findIndex = selectListMap.value[WorkbookID].findIndex(v => v.WorkbookPaperID === item.WorkbookPaperID);
            return findIndex !== -1;
        };

        const handleRightClick = (flag: boolean, item: WorkbookPaper) => {
            const { WorkbookID, WorkbookName } =
                leftList.value[activeLeft.value];
            const publisherName =
                publisherList.value.find(({ ID }) => form.publisherValue === ID)
                    ?.Name || "";
            const gradeName =
                gradeList.value.find(({ ID }) => form.gradeValue === ID)
                    ?.Name || "";
            const info: TeachHomework = {
                ...item,
                WorkbookName,
                publisherName,
                gradeName,
                students: []
            };
            if (flag) {
                selectListMap.value[WorkbookID]
                    ? selectListMap.value[WorkbookID].push(info)
                    : (selectListMap.value[WorkbookID] = [info]);
            } else {
                const findIndex = selectListMap.value[WorkbookID].findIndex(v => v.WorkbookPaperID === item.WorkbookPaperID);
                selectListMap.value[WorkbookID].splice(findIndex, 1);
            }
        };

        async function getWorkbookPaper() {
            const id = leftList.value[activeLeft.value].WorkbookID;
            const res = await fetchWorkbookPaper({ workbookID: id });
            if (res.resultCode === 200) {
                rightList.value = res.result;
            }
        }

        async function getWorkbookList() {
            const data = {
                subjectID: route.params.subjectId as string,
                publisherID: form.publisherValue,
                albumID: form.gradeValue
            };
            const res = await fetchWorkbookList(data);
            if (res.resultCode === 200) {
                leftList.value = res.result || [];
                if (leftList.value.length > 0) {
                    activeLeft.value = 0;
                    getWorkbookPaper();
                }
            }
        }

        async function getGrade() {
            const res = await fetchGrade();
            if (res.resultCode === 200) {
                gradeList.value = res.result;
                form.gradeValue = res.result[0].ID;
            }
        }

        async function getPublisherList() {
            const res = await fetchPublisherList();
            if (res.resultCode === 200) {
                publisherList.value = res.result;
                form.publisherValue = res.result[0].ID;
                await getGrade();
                await getWorkbookList();
            }
        }

        getPublisherList();

        watch(activeLeft, getWorkbookPaper);

        return {
            handleClose,
            publisherList,
            gradeList,
            activeLeft,
            selectListMap,
            leftList,
            getIsSelect,
            handleRightClick,
            handleConfirm,
            rightList,
            handleChange,
            form
        };
    }
});
</script>

<style lang="scss" scoped>
.add-system-homework {
    .title-text {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        margin: 10px 0 20px;
    }
    :deep(.el-dialog__body) {
        padding: 0 0 20px;
        background-color: #f5f6fa;
    }
    :deep(.el-form) {
        padding: 20px 20px 0;
        .el-select {
            width: 100%;
            margin-right: 20px;
        }
    }
    .content {
        display: flex;
        height: 400px;
        border-top: 1px solid #f5f6fa;
        .content-left {
            width: 240px;
            height: 100%;
            overflow-y: auto;
            text-align: center;
            background-color: #fff;
            .left-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 18px;
                height: 60px;
                cursor: pointer;
                span {
                    &:last-of-type {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        font-size: 14px;
                        background-color: #4b71ee;
                        border-radius: 50%;
                        color: #fff;
                    }
                }
            }
            .active {
                color: #4b71ee;
                background-color: #e6ecff;
                box-shadow: inset -4px 0px 0px #4b71ee;
            }
        }
        .content-right {
            flex: 1;
            height: 100%;
            overflow-y: auto;
            margin-left: 20px;
            background-color: #fff;
            .right-row {
                display: flex;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #f5f6fa;
                background-color: #fff;
                .flag {
                    color: #5f626f;
                    font-size: 14px;
                    display: inline-block;
                    margin-left: 20px;
                    padding: 6px;
                    border-radius: 4px;
                    background-color: #eeeff3;
                    color: #5f626f;
                }
            }
        }
    }
    .content-no {
        height: 600px;
        margin: 20px;
        border: 2px dashed #d5d8dd;
        position: relative;
        > div {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            img {
                width: 136px;
                height: 85px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
