<template>
    <div class="composition" style="height: 100%;">
        <div class="upper align-center">
            <el-select v-model="classId" @change="classChange" placeholder="请选择班级">
                <el-option v-for="item in classList" :key="item.Id" :label="item.Name" :value="item.Id">
                </el-option>
            </el-select>
            <div class="align-center">
                <el-button @click="refresh">
                    刷新
                </el-button>
                <el-button color="#4B71EE" @click="addComposition">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新建批改
                </el-button>
            </div>
        </div>
        <div class="box" v-if="articleList.length === 0">
            <div class="empty">暂无数据 </div>
        </div>
        <div class="box" v-else>
            <div class="article-line align-center" v-for="(item, idx) of articleList" :key="idx"
                @click="openList(item.Id, item.Title)">
                <img src="../../assets/composition/pic_zw@2x.png" alt="" />
                <div class="title">{{ '《' + item.Title + '》' }}</div>
                <div class="grade">{{ item.Name }}</div>
                <div class="count">
                    已完成/已录入：<span class="num">{{ item.CompletedCount }}</span> / {{ item.RecordCount }}
                </div>
                <div class="time">创建日期：{{ item.StartTime }}</div>
            </div>
            <div class="page">
                <Pagination @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    ref="PaginationRef" />
            </div>
        </div>

    </div>

    <!-- 新建作文 -->
    <NewSetup ref="setRef" :class-id="state.classId" :chapter-list="chapterList" @open-scan="openScan" />
    <!-- 录入 -->
    <Scan ref="scanRef" :class-id="state.classId" @open-list="scanOpenList" />
    <!-- 列表 -->
    <List ref="listRef" @typein="listToScan" @refresh="getArticleList" />
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import NewSetup from './components/newSetup.vue'
import Scan from './components/scan.vue'
import List from './components/list.vue'
import Pagination from './components/pagination.vue'
import { store } from '@/store';
import { fetchAllPassage, fetchAllPassageByPage, getClassStuCountByTeacher, getGradeChapterTree } from './api';
import moment from 'moment';
import { IYunInfo } from '@/types/login';
import { get, STORAGE_TYPES } from '@/utils/storage';
import { ElMessage } from 'element-plus';

const setRef = ref()
const scanRef = ref()
const listRef = ref()
const PaginationRef = ref()

const state = reactive({
    classList: [] as any,
    chapterList: [] as any,
    classId: '',
    className: '',
    classCount: 0,
    articleList: [] as any,
    page: {
        PageNumber: 1,
        PageSize: 10
    }
})

const { classList, classId, articleList, chapterList } = toRefs(state)

onMounted(() => {
    // console.log('userinfo:', store.state.userInfo);
    // getArticleList()
    getClassStuCount(true, () => {
        getArticleList()
    })
    getGradeList()
})

const refresh = () => {
    getClassStuCount(false, () => {
        getArticleList()
    })
}

// 列表页去录入
const listToScan = (e: any) => {
    scanRef.value.openDialog({ ...e, classCount: state.classCount })
}

// 班级变更
const classChange = (e: any) => {
    let filt = state.classList.filter((v: any) => v.Id === e)[0]
    state.classId = e
    state.className = filt?.Name
    state.classCount = filt?.StuTotal
    // set('compositionClassId', state.classId)
    localStorage.setItem(
        "compositionClassId",
        state.classId
    );
    getArticleList()
}

/**
 * 获取班级
 */
const getClassStuCount = (isinit = false, cb?: any) => {
    const yunInfo: IYunInfo = get(STORAGE_TYPES.YUN_INFO);

    getClassStuCountByTeacher({
        OrgId: store.state.userInfo?.schoolId,
        UserId: store.state.userInfo?.userCenterUserID,
        SemesterCode: yunInfo.TermCode
    }).then((res: any) => {
        if (res.success) {
            state.classList = res.result || []
            if (state.classList.length > 0) {
                state.classId = isinit ? state.classList[0].Id : state.classId
                state.className = isinit ? state.classList[0].Name : state.className
                localStorage.setItem(
                    "compositionClassId",
                    state.classId
                );
            }else{
                // 没有班级 清空
                state.classId = ''
                state.className = ''
                localStorage.removeItem('compositionClassId')
            }
            if (cb) {
                cb()
            }
        }
    })
}

/**
 * 获取单元
 */
const getGradeList = () => {
    getGradeChapterTree().then((res: any) => {
        if (res.success) {
            state.chapterList = res.result || [];
        }
    })
}


const openScan = (e?: any) => {
    //
    getArticleList()
    //
    scanRef.value.openDialog(e)
}

const openList = (id: string, title?: string) => {
    listRef.value.openDialog({ TeacherCompositionId: id, ClassId: state.classId, Title: title })
}
const scanOpenList = (e: any) => {
    // console.log('scanOpenList ', e);
    openList(e.TeacherCompositionId, e.Title)
}

const addComposition = () => {
    if(!state.classId){
        ElMessage.warning('当前没有班级，无法新建')
        return
    }
    setRef.value.openDialog({ classCount: state.classCount })
}

const getArticleList = () => {
    // 
    fetchAllPassageByPage({ TeacherId: store.state.userInfo?.userCenterUserID, GradeName: state.className, ClassId: state.classId, Pager: state.page }).then((res: any) => {
        if (res.success) {
            let { list = {}, pager } = res.result
            // let list = res.result || []
            if (list.length > 0) {
                list.forEach((ele: any) => {
                    ele.StartTime = moment(ele.StartTime).format('YYYY-MM-DD HH:mm:ss')
                    ele.Name = (state.className || '') + (ele.GradeName || '')
                });
            }
            state.articleList = list
            nextTick(()=>{
                PaginationRef.value.total = pager.Total
            })
        }
    })
}

const handleSizeChange = (val: number) => {
    state.page.PageSize = val;
    getArticleList()
}

const handleCurrentChange = (val: number) => {
    state.page.PageNumber = val;
    getArticleList()
}
</script>
<style lang="scss" scoped>
.page {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.empty {
    text-align: center;
    color: #5F626F;
    margin-top: 60px;
    font-size: 13px;
}

.composition {
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
    width: 100%;
    height: 56px;
    padding: 0 16px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 8px;
    justify-content: space-between;
}

.box {
    height: calc(100% - 50px);
    overflow-y: auto;
    background-color: #fff;
    padding: 12px 16px;
    box-sizing: border-box;

    .article-line {
        width: 100%;
        height: 56px;
        background-color: #F9FAFC;
        padding: 0 16px;
        box-sizing: border-box;
        margin-bottom: 8px;

        &>img {
            width: 20px;
            height: 20px;
            margin-right: 24px;
        }

        .title {
            width: 30%;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            padding-right: 30px;
            box-sizing: border-box;
            // overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .grade {
            width: 25%;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
        }

        .count {
            width: 25%;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;

            .num {
                color: #4B71EE;
            }
        }

        .time {
            width: 20%;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
        }
    }
}
</style>