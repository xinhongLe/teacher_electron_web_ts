<template>
    <el-dialog
        title="选择班级"
        :model-value="dialogVisible"
        width="80%"
        :before-close="handleClose"
        center
    >
        <div>
            <el-checkbox-group v-model="checkList">
                <el-row
                    v-for="(item, index) in allClass"
                    :key="index"
                    type="flex"
                    justify="center"
                >
                    <el-col :span="8" v-for="(j, i) in item" :key="i">
                        <el-checkbox :label="j.ID">{{ j.Name }}</el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { HaveClassData, HaveClassWithDefaultBagData } from "@/api";
import { ColData, Schedule } from "@/hooks/useSchedules";
import { store } from "@/store";
import { LessonClasses } from "@/types/login";
import { CourseBag } from "@/types/preparation";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { chunk } from "lodash";
import { defineComponent, inject, PropType, ref } from "vue";
import { addClasses } from "./logic";
export default defineComponent({
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        rowData: {
            type: Object as PropType<Schedule>,
            default: () => ({})
        },
        colData: {
            type: Object as PropType<ColData>,
            default: () => ({})
        },
        courseBag: {
            type: Object as PropType<CourseBag>,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const allClass = ref<LessonClasses[][]>([]);
        const checkList = ref<string[]>([]);

        const updateSchedules = inject("updateSchedules") as () => Promise<void>;

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        const handleConfirm = () => {
            if (checkList.value.length <= 0) {
                ElMessage.error("您没有选择班级，请重试");
            }

            const [startTime, endTime] = props.rowData.fontShowTime!.split("~");
            const classPlanStartTime = `${props.colData.colDate} ${startTime}`;
            const classPlanEndTime = `${props.colData.colDate} ${endTime}`;

            const data = {
                className: props.courseBag.Name,
                classPlanStartTime,
                classPlanEndTime,
                subjectID: store.state.preparation.subjectPublisherBookValue[0],
                classIDs: checkList.value
            };

            const callback = () => {
                handleClose();
                updateSchedules();
            };
            addClasses(props.courseBag.Type!, data as HaveClassWithDefaultBagData | HaveClassData, callback);
        };

        const arr = get(STORAGE_TYPES.USER_INFO).Classes as LessonClasses[];
        allClass.value = chunk(arr, 2);

        return {
            allClass,
            handleClose,
            checkList,
            handleConfirm
        };
    }
});
</script>

<style lang="scss" scoped>

</style>
