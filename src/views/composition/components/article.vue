<template>
    <div class="article" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            <div class="back" @click="close">
                <img src="../../../assets/composition/icon_back@2x.png" alt="" />
            </div>
            <!-- <el-pagination background layout="prev, pager, next" :total="1000" /> -->
            <!-- <div class="top">查看下一篇</div> -->
        </div>

        <div class="box">
            <div class="card">
                <div class="words">{{content.length}}字</div>
                <div class="title">{{title}}</div>
                <div class="author">{{state.author}}</div>
                <div class="content">
                    {{content}}
                </div>
            </div>
        </div>
        <div class="bottom align-center">
            <div class="view" @click="close">查看报告</div>
            <div class="export" @click="exportPDF">导出为pdf</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import moment from 'moment';
import { reactive, ref, toRefs } from 'vue';
import { downloadPDF, lookContent } from '../api';

const setRef = ref()
const scanRef = ref()
const dialogVisible = ref(false)

const state = reactive({
    popoverVisible: false,
    gradeList: [{
        label: '全部',
        value: 0
    }],
    grade: null,
    title: '',
    author:'',
    stuList: [],
    StudentCompositionId: '',
    content: ''
})

const emit = defineEmits(['close', 'save']);

const { gradeList, grade,content, stuList, title } = toRefs(state)

// exportPDF
const exportPDF = () => {
    downloadPDF({StudentCompositionId: state.StudentCompositionId}).then((res: any) => {
        if (res) {
            let blob = new Blob([res]);
            let objectUrl = window.URL.createObjectURL(blob); //生成一个url
            const a = document.createElement('a');
            const filename = moment().format('YYYY-MM-DD') + '.pdf';
            a.download = filename;
            a.href = objectUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            ElMessage({ type: 'success', message: '下载成功' });
        }
    })
}

// 关闭
const close = () => {
    dialogVisible.value = false
    emit('close')
}

const openDialog = async (info?: any) => {
    const { StudentCompositionId } = info
    state.StudentCompositionId = StudentCompositionId
    getDetail(StudentCompositionId)
}

const getDetail = (id: string) => {
    lookContent({ StudentCompositionId: id }).then(async (res: any) => {
        if (res.success) {
            let result = res.result
            state.content = result.Content || ''
            state.title = result.Title || ''
            state.author = result.StudentName || ''
            dialogVisible.value = true
        }
    })
}

defineExpose({
    openDialog,
})
</script>
<style lang="scss" scoped>
.article {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 888;
    display: flex;
    flex-direction: column;
    min-height: 0px;
    flex: 1;
    background-color: #F5F6FA;
}

.align-center {
    display: flex;
    align-items: center;
}

.upper {
    justify-content: center;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: #3AD393;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    position: relative;

    .back {
        position: absolute;
        left: 0;
        top: 0;
        padding: 16px;
        cursor: pointer;

        &>img {
            width: 24px;
            height: 24px;
        }
    }

    .top {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 102px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
    }
}


.box {
    height: calc(100% - 56px);
    background-color: #F5F6FA;
    padding: 16px 16px 72px 16px;
    box-sizing: border-box;

    .card {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: #fff;
        position: relative;
        padding: 24px 67px;
        box-sizing: border-box;

        .title {
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            text-align: center;
        }

        .author {
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #A7AAB4;
            margin-bottom: 32px;
            margin-top: 16px;
            text-align: center;
        }

        .content {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            line-height: 22px;
            white-space: pre-wrap;
            display: flex;
            justify-content: center;
        }

        .words {
            position: absolute;
            right: 30px;
            top: 30px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #A7AAB4;
        }
    }


}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #FFFFFF;
    justify-content: flex-end;
    padding: 0 16px;
    box-sizing: border-box;

    .view {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E0E2E7;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        cursor: pointer;
    }

    .export {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #4B71EE;
        margin-left: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4B71EE;
    }

}
</style>