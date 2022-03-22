<template>
    <div class="student-box">
        <div>
            <p>
                <span>{{ item.tagName }}</span>
                <span>{{ item.list.length }}</span>
                <img
                    @click="showAll = !showAll"
                    :class="showAll ? '' : 'active'"
                    src="./../../../assets/my-student/arrow_shouqi_blue.png"
                />
                <span @click="showAll = !showAll">{{
                    showAll ? "收起" : "展开"
                }}</span>
            </p>
            <div v-show="showAll">
                <el-row :gutter="20">
                    <el-col
                        :span="6"
                        :lg="4"
                        v-for="(item1) in item.list"
                        :key="item1.StudentID"
                    >
                        <div
                            :class="
                                selectStudentId.includes(item1.StudentID)
                                    ? 'item item-active'
                                    : 'item'
                            "
                            :style="{ cursor: canEdit ? 'pointer' : '' }"
                            @click="checkStudent(item1.StudentID)"
                        >
                            <div v-if="canEdit">
                                <el-checkbox
                                    :model-value="
                                        selectStudentId.includes(
                                            item1.StudentID
                                        )
                                    "
                                    @change="checkStudent(item1.StudentID)"
                                ></el-checkbox>
                            </div>
                            <Avatar :file="item1.HeadPortrait"></Avatar>
                            <div class="content">
                                <p>{{ item1.Name }}</p>
                                <p>{{ item1.Phone }}</p>
                                <p>{{ item1.Account }}</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StudentTag } from "@/types/labelManage";
import { defineComponent, PropType, ref, watch } from "vue";
import Avatar from "@/components/avatar/index.vue";
export default defineComponent({
    name: "studentList",
    props: {
        item: {
            type: Object as PropType<StudentTag>,
            default: () => ({})
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        selectStudent: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const showAll = ref(true);
        const selectStudentId = ref(props.selectStudent);
        watch(
            () => props.selectStudent,
            (v: string[]) => {
                selectStudentId.value = v;
            }
        );
        const checkStudent = (studentId: string) => {
            if (!props.canEdit) {
                return;
            }
            const index = props.selectStudent.indexOf(studentId);
            if (index === -1) {
                selectStudentId.value.push(studentId);
            } else {
                selectStudentId.value.splice(index, 1);
            }
            emit("update: selectStudent", selectStudentId.value);
        };
        return {
            showAll,
            selectStudentId,
            checkStudent
        };
    },
    components: { Avatar }
});
</script>

<style lang="scss" scoped>
.student-box {
    margin-bottom: 16px;
    > div {
        padding: 24px;
        padding-bottom: 0;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e8ebf5;
        > p {
            overflow: hidden;
            margin-bottom: 24px;
            span:nth-of-type(1) {
                float: left;
                font-size: 20px;
                font-weight: 600;
                color: #19203d;
                line-height: 28px;
            }
            span:nth-of-type(2) {
                float: left;
                padding: 0 8px;
                font-size: 12px;
                color: #ffffff;
                line-height: 18px;
                background: #4b71ee;
                border-radius: 26px;
                margin: 5px 8px;
            }
            span:nth-of-type(3) {
                float: right;
                font-size: 14px;
                color: #4b71ee;
                line-height: 20px;
                margin-top: 4px;
                cursor: pointer;
            }
            img {
                float: right;
                width: 11px;
                height: 11px;
                margin-left: 5px;
                margin-top: 9px;
                cursor: pointer;
            }
        }
        > div {
            overflow: hidden;
            .item {
                width: 100%;
                border-radius: 4px;
                border: 1px solid #e0e2e7;
                height: 80px;
                background: #ffffff;
                border-radius: 4px;
                padding: 9px 20px 7px 20px;
                box-sizing: border-box;
                margin-bottom: 16px;
                margin-right: 16px;
                display: flex;
                align-items: center;
                :deep(.el-checkbox) {
                    margin-right: 20px;
                }
                > div {
                    margin-left: 16px;
                    &.content {
                        @include text-ellipsis;
                        flex: 1;
                    }
                    p:nth-of-type(1) {
                        height: 22px;
                        font-size: 16px;
                        font-weight: 500;
                        color: #19203d;
                        line-height: 22px;
                        margin-bottom: 4px;
                        @include text-ellipsis;
                    }
                    p:nth-of-type(2),
                    p:nth-of-type(3) {
                        height: 17px;
                        font-size: 12px;
                        font-weight: 500;
                        color: #727b91;
                        line-height: 17px;
                        margin-bottom: 2px;
                        @include text-ellipsis;
                    }
                }
            }
            .item:nth-of-type(4n-1) {
                margin-right: 16px;
            }
        }
    }
    .active {
        transform: rotate(180deg);
    }
    .item-active {
        background: #ebf4ff !important;
        border: 1px solid #a4c5ff !important;
    }
}
</style>
