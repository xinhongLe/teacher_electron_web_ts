<template>
    <div class="summary">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column align="left">
                <template #header> <span style="font-size:18px;font-weight:600;color:#000;">备课总结与反思</span> </template>
                <template #default="scope">
                    <div class="table-left">
                        <img style="" src="@/assets/preparationGroup/icon_word11.png" alt="">
                        {{ scope.row.address }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header> <el-button icon="el-icon-document" style="background-color:#48DBBF;color:#fff;">上传文档</el-button> </template>
                <template #default="scope">
                    {{ scope.row.date }}
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
                <el-pagination
                    :current-page="page.pageNumber"
                    :page-sizes="page.pageChoose"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue-demi";
export default defineComponent({
    setup() {
        const allData = reactive({
            tableData: [
                {
                    date: "林老师 上传于 2021-12-20 20:30",
                    address: "林老师的总结反思.doc"
                },
                {
                    date: "林老师 上传于 2021-12-20 20:30",
                    address: "林老师的总结反思.doc"
                },
                {
                    date: "林老师 上传于 2021-12-20 20:30",
                    address: "林老师的总结反思.doc"
                },
                {
                    date: "林老师 上传于 2021-12-20 20:30",
                    address: "林老师的总结反思.doc"
                }
            ],
            search: ""
        });
        const page = reactive({
            pageNumber: 1, // 当前页
            pageSize: 10, // 每页显示数据
            pageChoose: [10, 20, 30], // 分页配置
            total: 300 // 总数据
        });
        const handleSizeChange = (v) => {
            page.pageSize = v;
        };

        const handleCurrentChange = (v) => {
            page.pageNumber = v;
        };
        return {
            ...toRefs(allData),
            page,
            handleCurrentChange,
            handleSizeChange
        };
    }
});
</script>

<style lang="scss" scoped>
.summary {
    width: 100%;
    height: auto;
    padding: 24px;
    user-select: none;
    background-color: #fff;
    .page {
        height: 25px;
        margin: 15px 0 0 0;
        :deep(.el-pagination) {
            float: right;
        }
    }
}
.table-left{
    display: flex;
    align-items: center;
    img{
        width: 20px;
        height: 28px;
        margin-right: 8px;
    }
}
</style>
