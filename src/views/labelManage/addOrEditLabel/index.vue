<template>
    <div>
        <el-dialog
            title="选择标签"
            :model-value="visible"
            width="620px"
            :before-close="handleClose"
        >
            <div class="label-box">
                <p>
                    当前选择<span>{{ selectStudent.length }}</span
                    >人，请选择一个标签
                </p>
                <div>
                    <div
                        :class="tagID === item.ID ? 'active' : ''"
                        v-for="(item, index) in tagList"
                        :key="index"
                        @click="tagID = item.ID"
                    >
                        {{ item.TagName }}
                    </div>
                    <div
                        :class="tagID === '' ? 'active' : ''"
                        @click="tagID = ''"
                    >
                        未标记
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="save">确 定</el-button>
                </span>
            </template>

        </el-dialog>
    </div>
</template>

<script lang="ts">
import useTagList from "@/hooks/useTagList";
import { TagStudentsData } from "@/types/labelManage";
import { get, STORAGE_TYPES } from "@/utils/storage";
import { ElMessage } from "element-plus";
import { defineComponent, PropType, ref } from "vue";
import { useRoute } from "vue-router";
import { tagStudents } from "../api";
export default defineComponent({
    name: "addOrEditLabel",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        selectStudent: {
            type: Array as PropType<string[]>,
            default: () => ([])
        },
        selectSubjectId: {
            type: String,
            default: ""
        }
    },
    setup(props, { emit }) {
        const route = useRoute();
        const tagID = ref<null| string>(null);
        const { tagList, getTagList } = useTagList();
        getTagList();
        const handleClose = () => {
            emit("update:visible", false);
        };

        const save = async () => {
            const data: TagStudentsData = {
                studentIDs: props.selectStudent,
                tagID: tagID.value as string,
                classIDs: [route.params.classId as string],
                teacherId: get(STORAGE_TYPES.USER_INFO).ID,
                subjectID: props.selectSubjectId
            };
            const res = await tagStudents(data);
            if (res.resultCode === 200) {
                ElMessage.success("保存成功！");
                handleClose();
                emit("saveSuccess");
            }
        };

        return {
            handleClose,
            tagID,
            tagList,
            save
        };
    }
});
</script>

<style lang="scss" scoped>
.label-box {
    margin: 10px 18px 0;
    p {
        font-size: 16px;
        color: #19203d;
        line-height: 22px;
        span {
            color: #4b71ee;
        }
    }
    > div {
        margin-top: 20px;
        div {
            display: inline-block;
            padding: 7px 35px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e0e2e7;
            font-size: 14px;
            color: #5f626f;
            line-height: 20px;
            margin-right: 16px;
            margin-bottom: 16px;
        }
        .active {
            background: #e6ecff;
            color: #4b71ee;
            border: 1px solid #98aef6;
        }
    }
}
</style>
