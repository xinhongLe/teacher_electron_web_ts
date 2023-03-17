
<template>
    <el-dialog :z-index="1000" width="450" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #title>
            <div class="title pl20">
                {{ '批改列表' }}
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="180" />
                <el-table-column prop="name" label="学生姓名" />
            </el-table>
        </div>
        <div class="page">
            <span class="count">共38篇</span>
            <Pagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                ref="PaginationRef" />
        </div>

        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <el-button style="width: 120px;" @click="close">取消</el-button>
                    <el-button style="width: 120px;" color="#4B71EE" v-loading.fullscreen.lock="loading"
                        @click="confirm">确认</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import Pagination from './pagination.vue'
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
//
const formRef = ref();
const PaginationRef = ref();

const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    tableData: [
        {
            date: '2016-05-03',
            name: '纳咏龙'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙'
        }],
    formLabelWidth: 70,
    form: {
        Title: '',
        Chapter: null
    },
    page: {
        PageNumber: 1,
        PageSize: 10
    },
    chapterList: [{
        Value: '全部',
        Id: 1
    }] as any[]
});
const { form, tableData, chapterList } = toRefs(state);

const emit = defineEmits(['cancel', 'save']);

const close = () => {
    dialogVisible.value = false
    emit('cancel')
};

const confirm = () => {
    close()
};

const openDialog = async (info?: any) => {
    dialogVisible.value = true
};

const queryData = () => {
    loading.value = true
    // let [start, end] = props.form.SubmitDate || [null,null]
    // getAppealLogList({
    //     Phone: props.form.Phone,
    //     StartDate: start ? moment(start).format('YYYY-MM-DD') : null,
    //     EndDate: end ? moment(end).format('YYYY-MM-DD'): null,
    //     Pager: state.page
    // }).then((res: any) => {
    //     loading.value = false
    //     if (res.success) {
    //         const { list = [], pager } = res.result
    //         if (list.length > 0) {
    //             list.forEach((ele:any, i:number) => {
    //                 ele.NickName = ele.NickName || '--'
    //             })
    //         }
    //         state.tableData = list
    //         PaginationRef.value.total = pager.Total;
    //     }
    // })
}

const handleSizeChange = (val: number) => {
    // page.value.pageSize = val
    state.page.PageSize = val;
    // queryData()
}

const handleCurrentChange = (val: number) => {
    // page.value.pageNumber = val
    state.page.PageNumber = val;
    // queryData()
}
defineExpose({
    openDialog,
});
</script>
<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-weight: 600;
}

.page {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;

    .count {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #A7AAB4;
    }
}
</style>