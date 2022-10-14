<template>
    <div class="table-box">
        <div class="table">
            <el-table
                :data="
                    studentList.slice(
                        (page.pageNumber - 1) * page.pageSize,
                        page.pageNumber * page.pageSize
                    )
                "
                height="100%"
            >
                <el-table-column fixed>
                    <template v-slot="scope">
                        <div class="item" v-if="scope.row">
                            <Avatar :file="scope.row.HeadPortrait" :size="54"></Avatar>
                            <div>
                                <p>{{ scope.row.Name }}</p>
                                <p>{{ scope.row.Phone }}</p>
                                <p>{{ scope.row.Account }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="province"
                    :label="item.subjectName"
                    v-for="(item, index) in subjectList"
                    :key="index"
                >
                    <template #header>
                        <div class="header-text">
                            <img
                                v-if="item.subjectName === '数学'"
                                src="./../../../assets/my-student/icon_shuxue.png"
                            />
                            <img
                                v-if="item.subjectName === '英语'"
                                src="./../../../assets/my-student/icon_yingwen.png"
                            />
                            <!-- <img
                                v-if="item.subjectName === '拼音'"
                                src="./../../../assets/my-student/icon_pinying.png"
                            /> -->
                            <img
                                v-if="item.subjectName === '语文'"
                                src="./../../../assets/my-student/icon_yuwen.png"
                            />
                            <span>{{ item.subjectName }}</span>
                        </div>
                    </template>
                    <template v-slot="scope">
                        <Label
                            v-if="scope.row.SubjectsInfo"
                            :info="scope.row.SubjectsInfo.find(v => item.subjectId === v.SubjectID)"
                            :subjectId="item.subjectId"
                        ></Label>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination
                :current-page="page.pageNumber"
                :page-sizes="page.pageChoose"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="studentList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import { ALL_SUBJECT_LIST } from "@/config";
import { TagStudent } from "@/types/labelManage";
import { defineComponent, PropType, reactive } from "vue";
import Avatar from "@/components/avatar/index.vue";
import Label from "./Label.vue";
export default defineComponent({
    name: "AllStudentList",
    props: {
        studentList: {
            type: Array as PropType<TagStudent[]>,
            default: () => []
        }
    },
    setup() {
        const page = reactive({
            pageNumber: 1,
            pageSize: 10,
            pageChoose: [10, 20, 30] // 分页配置
        });
        const subjectList = ALL_SUBJECT_LIST;
        const handleSizeChange = (v: number) => {
            page.pageSize = v;
        };
        const handleCurrentChange = (v: number) => {
            page.pageNumber = v;
        };
        return {
            page,
            subjectList,
            handleSizeChange,
            handleCurrentChange
        };
    },
    components: { Avatar, Label }
});
</script>

<style lang="scss" scoped>
.table-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    .table {
        flex: 1;
        overflow-y: auto;
    }
    .header-text {
        font-size: 18px;
        font-weight: 600;
        color: #19203d;
        line-height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
    }
    .pagination {
        background: #fff;
        height: 48px;
        text-align: right;
        padding-top: 10px;
    }
}
.item {
    width: 100%;
    border-radius: 4px;
    height: 80px;
    border-radius: 4px;
    padding: 9px 20px 7px 20px;
    box-sizing: border-box;
    margin-right: 16px;
    display: flex;
    align-items: center;
    > div {
        margin-left: 16px;
        p:nth-of-type(1) {
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #19203d;
            line-height: 22px;
            margin-bottom: 4px;
        }
        p:nth-of-type(2),
        p:nth-of-type(3) {
            height: 17px;
            font-size: 12px;
            font-weight: 500;
            color: #727b91;
            line-height: 17px;
            margin-bottom: 2px;
        }
    }
}
.item:nth-of-type(4n-1) {
    margin-right: 16px;
}
</style>
