<template>
    <div class="summary">
        <el-table :data="tableData" style="width: 100%" :height="autoHeight">
            <el-table-column align="left">
                <template #header> <span style="font-size:18px;font-weight:600;color:#000;">备课总结与反思</span> </template>
                <template #default="scope">
                    <div class="table-left">
                        <img style="" src="@/assets/preparationGroup/icon_word11.png" alt="">
                        {{ scope.row.address }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column  align="right">
                <template #header> <el-button icon="el-icon-document" style="background-color:#48DBBF;color:#fff;">上传文档</el-button> </template>
                <template #default="scope" class="table-right">
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
import { defineComponent, reactive, toRefs, onMounted, nextTick } from "vue-demi";
export default defineComponent({
    setup() {
        const state = reactive({
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
        onMounted(() => {
            nextTick(() => {
                state.autoHeight = state.tableData.length * 60;
            });
        });
        return {
            ...toRefs(state),
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
    padding: 0 24px;
    border-radius: 8px;
    user-select: none;
    background-color: #fff;
    padding-bottom: 50px;
    :deep(.el-button) {
        width: 142px;
        height: 36px;
        border: none;
    }
    .page {
        height: 25px;
        margin: 15px 0 0 0;
        :deep(.el-pagination) {
            float: right;
        }
    }
}
.table-left {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #19203D;
    img{
        width: 20px;
        height: 28px;
        margin-right: 8px;
    }
}
.table-right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5F626F;
}
</style>
