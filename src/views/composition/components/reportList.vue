
<template>
    <el-dialog :z-index="1000" width="600" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #title>
            <div class="title pl20">
                {{ '发送至乐写作' }}
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="120" />
                <el-table-column prop="name" label="学生姓名" />
                <el-table-column prop="Phone" label="手机号(乐写作账号)" />
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
//
const formRef = ref();
const PaginationRef = ref();

const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    tableData: [
        {
            date: '2016-05-03',
            name: '纳咏龙',
            Phone: '19971608257'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙',
            Phone: '19971608257'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙',
            Phone: '19971608257'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙',
            Phone: '19971608257'
        },
        {
            date: '2016-05-03',
            name: '纳咏龙',
            Phone: '19971608257'
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

const sendShare = () => {
    var input = document.createElement("input"); // 创建input对象
    document.body.appendChild(input);
    input.value = 'https://www.jianshu.com/p/9d552efc8e44'; // 设置复制内容
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