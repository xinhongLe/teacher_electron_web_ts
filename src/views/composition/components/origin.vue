<template>
    <div class="origin" style="height: 100%;" v-if="dialogVisible">
        <div class="upper align-center">
            <span>检查原文</span>
            <el-pagination class="pagers" background layout="prev, pager, next" :total="columnPager.total"
                v-model:current-page="columnPager.current" v-model:page-size="columnPager.size"
                @current-change="handleCurrentChange" />
            <div class="top" @click="viewNext">查看下一篇</div>
        </div>

        <div class="box align-center">
            <div class="left">
                <div class="head align-center">
                    <div :class="['img-wrapper', idx === active && 'active']" v-for="(item, idx) in photoList" :key="idx"
                        @click="switchPic(item, idx)">
                        <img :src="item.url" alt="" />
                        <div class="tag">{{ idx + 1 }}</div>
                    </div>
                </div>
                <div class="img-box">
                    <img :src="mainPic" alt="" />
                </div>
            </div>
            <div class="right">
                <div class="head align-center">
                    <div class="title-box">
                        <el-input class="title" maxlength="15" v-model="title" />
                        <div class="time" v-if="state.updateTime">最近修改：{{ state.updateTime }}</div>
                    </div>
                    <!-- <div contenteditable="true">我的母亲</div> -->
                    <div class="author align-center">
                        <span class="name">{{ state.author }}</span>
                        <span class="count">{{ content.length }}字</span>
                    </div>
                </div>
                <div class="words" contenteditable="true" @input="contentInput">
                    {{ content }}
                </div>
            </div>
        </div>
        <div class="bottom align-center">
            <div class="continue align-center" @click="selectContinue">
                <img v-if="!state.isContinue" src="../../../assets/composition/icon_unchecked@2x.png" alt="" />
                <img v-else src="../../../assets/composition/icon_checked@2x.png" alt="" />
                继续检查下一篇
            </div>
            <div class="del" @click="close">退出</div>
            <el-button class="save" color="#4B71EE" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { store } from '@/store';
import { getOssUrl } from '@/utils/oss';
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs } from 'vue';
import { checkContent, getColumnPages, lookNextContent, saveContent } from '../api';

const setRef = ref()
const scanRef = ref()
const dialogVisible = ref(false);

const state = reactive({
    isContinue: false,
    gradeList: [{
        label: '全部',
        value: 0
    }],
    active: 0,
    mainPic: '',
    grade: null,
    content: '',
    title: '',
    author: '',
    stuList: [],
    StudentCompositionId: '',
    updateTime: null,
    columnPageList: [],
    columnPager: {
        total: 0,
        current: 1,
        size: 1
    },
    photoList: [] as any
})

const emit = defineEmits(['close', 'save']);

const { gradeList, grade, columnPager, content, photoList, mainPic, active, stuList, title } = toRefs(state)

const selectContinue = () => {
    state.isContinue = !state.isContinue
}

const handleCurrentChange = (val: number) => {
    getDetail(state.columnPageList[val - 1], true)
}
// 获取分页
const loadAllPages = () => {
    getColumnPages({ StudentCompositionId: state.StudentCompositionId }).then((res: any) => {
        if (res.success) {
            let result = res.result
            state.columnPageList = result.CompositionIds
            state.columnPager.total = result.CompositionIds.length
            state.columnPager.current = result.CompositionIds.findIndex((v: any) => v === result.CurrentCompositionId) + 1
        }
    })
}
const contentInput = (e: any) => {
    console.log('contentInput', e);
    state.content = e.target.innerText
}

const switchPic = (item: any, idx: number) => {
    state.active = idx
    state.mainPic = item.url
}

/**
 * 查看下一篇
 */
const viewNext = () => {
    lookNextContent({ StudentCompositionId: state.StudentCompositionId }).then(async (res: any) => {
        if (res.success) {
            //
            state.columnPager.current = state.columnPager.current + 1
            let result = res.result
            state.StudentCompositionId = result.StudentCompositionId
            state.content = result.Content || ''
            state.title = result.Title
            state.author = result.StudentName
            state.photoList = result.StudentCompositionFile
            state.updateTime = result.UpdateTime || null
            await state.photoList.forEach(async (ele: any, i: number) => {
                const { FileExtention, FilePath, FileMD5, FileBucket } = ele;
                const key = FileExtention
                    ? `${FilePath}/${FileMD5}.${FileExtention}`
                    : `${FilePath}/${FileMD5}`;
                ele.url = await getOssUrl(key, FileBucket)
                if (i === 0) {
                    state.mainPic = ele.url;
                }
            })
            // dialogVisible.value = true
        }
    })
}

// 保存
const save = () => {
    if (state.title.length === 0) {
        ElMessage.error('标题不可为空')
        return
    }
    if (state.title.length > 15) {
        ElMessage.error('标题限制15字')
        return
    }
    let args = { StudentCompositionId: state.StudentCompositionId, Title: state.title, Content: state.content, OperatorId: store.state.userInfo?.userCenterUserID }
    saveContent(args).then(async (res: any) => {
        if (res.success) {
            ElMessage.success('保存成功')
            if (state.isContinue) {
                // 下一个
                viewNext()
            } else {
                close()
            }
            // close()
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
    //
    loadAllPages()
    getDetail(StudentCompositionId)
}

const getDetail = (id: string, isRequestNext?: boolean) => {
    if (isRequestNext) {
        state.StudentCompositionId = id
    }
    checkContent({ StudentCompositionId: id }).then(async (res: any) => {
        if (res.success) {
            let result = res.result
            state.content = result.Content || ''
            state.title = result.Title
            state.author = result.StudentName
            state.photoList = result.StudentCompositionFile
            state.updateTime = result.UpdateTime || null
            await state.photoList.forEach(async (ele: any, i: number) => {
                const { FileExtention, FilePath, FileMD5, FileBucket } = ele;
                const key = FileExtention
                    ? `${FilePath}/${FileMD5}.${FileExtention}`
                    : `${FilePath}/${FileMD5}`;
                ele.url = await getOssUrl(key, FileBucket)
                if (i === 0) {
                    state.mainPic = ele.url;
                }
            })
            dialogVisible.value = true
        }
    })
}

defineExpose({
    openDialog,
})
</script>
<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #fff !important;
    color: #4B71EE !important;
}

:deep(.el-pagination) {

    .btn-next,
    .btn-prev,
    .el-pager li {
        background-color: #4B71EE !important;
        color: #fff !important;
        border: 1px solid rgba(255, 255, 255, 0.5) !important;
        cursor: pointer !important;
    }
}

.origin {
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
    position: relative;
    justify-content: center;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: #4B71EE;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    -webkit-app-region: no-drag;

    &>span {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
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
    overflow-y: auto;
    background-color: #F5F6FA;
    padding: 16px 16px 72px 16px;
    box-sizing: border-box;

    &>div {
        background-color: #fff;
        width: calc(50% - 8px);
        height: 100%;
        border-radius: 4px;
        overflow: hidden;
    }

    .left {
        margin-right: 16px;
        padding: 24px;
        box-sizing: border-box;

        .head {
            padding-bottom: 24px;
            border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);

            .img-wrapper {
                width: 56px;
                height: 56px;
                margin-right: 12px;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;

                &.active {
                    border: 2px solid #4B71EE;
                }

                .tag {
                    position: absolute;
                    left: 4px;
                    bottom: 4px;
                    width: 16px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    background: fade-out($color: #000000, $amount: 0.7);
                    border-radius: 2px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #F5F6FA;
                }

                &>img {
                    width: 100%;
                    height: 100%;

                }
            }
        }

        .img-box {
            padding-top: 24px;
            box-sizing: border-box;
            height: calc(100% - 81px);
            overflow-y: auto;

            img {
                width: 100%;
                height: auto;
                display: block;
            }
        }
    }

    .right {
        padding: 16px 24px;
        box-sizing: border-box;

        .words {
            width: 100%;
            height: calc(100% - 90px);
            overflow: auto;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            line-height: 22px;
            padding: 18px;
            white-space: pre-wrap;
            border-radius: 4px;
            border: 1px solid #E0E2E7;
        }

        .head {
            padding-bottom: 11px;
            border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);
            position: relative;
            justify-content: center;

            .title-box {
                width: fit-content;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .time {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #A7AAB4;
                margin-top: 8px;
            }

            .title {
                min-width: 168px;
                max-width: 300px;
                text-align: center;
                line-height: 48px;
                height: 48px;
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #E0E2E7;
                font-size: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #19203D;

                :deep(.el-input__inner) {
                    text-align: center;
                }
            }

            .author {
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);

                .name {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #A7AAB4;
                    padding-right: 12px;
                    position: relative;
                    border-right: 1px solid #EFF0F3;
                    // &::after{
                    //     content: '';
                    //     position: absolute;
                    //     right: 12px;
                    //     top: 0;
                    //     width: 1px;
                    //     height: 14px;
                    //     background-color: #EFF0F3;
                    // }
                }

                .count {
                    margin-left: 12px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #A7AAB4;
                }
            }
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

    .continue {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-right: 32px;
        cursor: pointer;

        &>img {
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
    }

    .del {
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #FF8181;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FF6B6B;
        cursor: pointer;
    }

    .save {
        width: 100px;
        margin-left: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
    }

}
</style>