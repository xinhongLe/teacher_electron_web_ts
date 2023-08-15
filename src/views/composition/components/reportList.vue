
<template>
    <el-dialog :z-index="1000" width="600" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #header>
            <div class="title pl20">
                {{ '发送至乐写作' }}
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="120" />
                <el-table-column prop="StudentName" label="学生姓名" />
                <el-table-column prop="Phone" label="手机号(乐写作账号)" />
            </el-table>
        </div>
        <div class="page">
            <span class="count">共{{total}}篇</span>
            <Pagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                ref="PaginationRef" />
        </div>

        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <div class="share" @click="sendShare">
                        <img src="../../../assets/composition/icon_share@2x.png" alt="" />
                        分享报告链接
                    </div>
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
import { searchStudentListForReport, sendReportWithOneKey, shareReportUrl } from '../api';
//
const PaginationRef = ref();

const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    tableData: [],
    total:0,
    shareUrl:'',
    flag:'',
    formLabelWidth: 70,
    TeacherCompositionId: null,
    page: {
        PageNumber: 1,
        PageSize: 10
    }
});
const { tableData,total } = toRefs(state);

const emit = defineEmits(['cancel', 'save','success']);

const close = () => {
    state.flag = ''
    state.page.PageNumber = 1
    state.TeacherCompositionId = null
    dialogVisible.value = false
    emit('cancel')
};

const confirm = () => {
    if(state.tableData.length===0){
        ElMessage.warning('没有可提交内容')
        return
    }
    sendReportWithOneKey({
        TeacherCompositionId: state.TeacherCompositionId,
        FlagForBatch: state.flag
    }).then((res: any) => {
        if (res.success) {
            ElMessage.success('操作成功')
            emit('success')
            close()
        }
    })
};

const sendShare = () => {
    var input = document.createElement("input"); // 创建input对象
    document.body.appendChild(input)
    input.value = state.shareUrl// 'https://www.jianshu.com/p/9d552efc8e44'; // 设置复制内容
    input.focus();
    input.select();
    if (document.execCommand("copy")) {
        document.execCommand("copy");
    }
    input.blur();
    document.body.removeChild(input);
    ElMessage({ type: "success", message: "已复制分享链接" });
}

const openDialog = async (info?: any) => {
    let {TeacherCompositionId} = info
    state.TeacherCompositionId = TeacherCompositionId
    queryData()
    // 获取分享链接
    getShareUrl()
};

const getShareUrl = ()=>{
    shareReportUrl({TeacherCompositionId: state.TeacherCompositionId}).then((res: any) => {
        if (res.success) {
            state.shareUrl = res.result.Url
        }
    })
}

const queryData = (cb?:any) => {
    let flag = new Date().getTime() + '-' + state.TeacherCompositionId
    state.flag = flag
    searchStudentListForReport({
        TeacherCompositionId: state.TeacherCompositionId,
        FlagForBatch: flag,
        Pager: state.page
    }).then((res: any) => {
        if (res.success) {
            let {list = [],pager} = res.result
            state.tableData = list
            dialogVisible.value = true
            nextTick(() => {
                if (PaginationRef.value) {
                    PaginationRef.value.total = pager.Total
                }
            })
            state.total = pager.Total
            if(cb){
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

.dialog-footer {
    &>div {
        position: relative;
    }
}

.share {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4B71EE;
    padding: 8px 0;
    cursor: pointer;

    &>img {
        width: 12px;
        height: 12px;
        margin-right: 6px;
    }
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