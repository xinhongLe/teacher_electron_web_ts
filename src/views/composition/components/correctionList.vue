
<template>
    <el-dialog :z-index="1000" width="450" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #header>
            <div class="title pl20">
                {{ '批改列表' }}
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="100" />
                <el-table-column prop="StudentName" label="学生姓名" />
                <el-table-column prop="Phone" label="手机号(乐写作账号)" />
            </el-table>
        </div>
        <div class="page">
            <span class="count">共{{ total }}篇</span>
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
import { correctWithOneKey, searchStudentListForCorrect } from '../api';
//
const PaginationRef = ref();

const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    tableData: [],
    total: 0,
    flag: '',
    TeacherCompositionId: null,
    formLabelWidth: 70,
    page: {
        PageNumber: 1,
        PageSize: 10
    }
});
const { tableData, total } = toRefs(state);

const emit = defineEmits(['cancel', 'success']);

const close = () => {
    state.flag = ''
    state.TeacherCompositionId = null
    dialogVisible.value = false
    emit('cancel')
};

const confirm = () => {
    if (state.tableData.length === 0) {
        ElMessage.warning('没有可提交内容')
        return
    }
    correctWithOneKey({
        TeacherCompositionId: state.TeacherCompositionId,
        FlagForBatch: state.flag
    }).then((res: any) => {
        if (res.success) {
            // 1-已开始批改;2-批次信息已过期，请重新请求获取学生列表;3-批次信息已变更，请重新请求获取学生列表
            let result = res.result;
            if (result.Status === 1) {
                ElMessage.success(`提交成功，预计${result.Minute}分钟内完成批改`)
                emit('success')
                close()
            } else if (result.Status === 2) {
                ElMessage.error('批次信息已过期，请重新请求获取学生列表')
            } else {
                ElMessage.error('批次信息已变更，请重新请求获取学生列表')
            }
        }
    })
};

const openDialog = async (info?: any) => {
    let { TeacherCompositionId } = info
    state.TeacherCompositionId = TeacherCompositionId
    queryData()
};

const queryData = (cb?: any) => {
    let flag = new Date().getTime() + '-' + state.TeacherCompositionId
    state.flag = flag
    searchStudentListForCorrect({
        TeacherCompositionId: state.TeacherCompositionId,
        FlagForBatch: flag,
        Pager: state.page
    }).then((res: any) => {
        if (res.success) {
            let { list = [], pager } = res.result
            if (list.length > 0) {
                list.forEach((ele: any) => {
                    ele.Phone = ele.Phone || '--'
                })
            }
            state.tableData = list
            dialogVisible.value = true
            nextTick(() => {
                if (PaginationRef.value) {
                    PaginationRef.value.total = pager.Total
                }
            })
            state.total = pager.Total
            if (cb) {
                cb()
            }
        }
    })
}

const handleSizeChange = (val: number) => {
    state.page.PageSize = val;
    queryData()
}

const handleCurrentChange = (val: number) => {
    state.page.PageNumber = val;
    queryData()
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