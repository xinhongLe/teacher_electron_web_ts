<template>
    <div class="composition" style="height: 100%;">
        <div class="upper align-center">
            <el-select v-model="grade" placeholder="请选择班级">
                <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button color="#4B71EE" @click="addComposition">
                <el-icon>
                    <Plus />
                </el-icon>
                新建批改
            </el-button>
        </div>
        <div class="box">
            <div class="article-line align-center" v-for="(item, idx) of articleList" :key="idx">
                <img src="../../assets/composition/pic_zw@2x.png" alt="" />
                <div class="title">{{ '《' + item.Title + '》' }}</div>
                <div class="grade">{{ item.Grade }}</div>
                <div class="count">
                    已完成/已录入：<span class="num">{{ item.Count }}</span> /16
                </div>
                <div class="time">创建日期：{{ item.Time }}</div>
            </div>
        </div>
    </div>

    <!-- 新建作文 -->
    <NewSetup ref="setRef" @open-scan="openScan" />
    <!-- 录入 -->
    <Scan ref="scanRef" @open-list="openList" />
    <!-- 列表 -->
    <List ref="listRef" />
</template>
<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import NewSetup from './components/newSetup.vue'
import Scan from './components/scan.vue'
import List from './components/list.vue'

const setRef = ref()
const scanRef = ref()
const listRef = ref()

const state = reactive({
    gradeList: [{
        label: '全部',
        value: 0
    }],
    grade: null,
    articleList: [{
        Title: '我的中国心',
        Grade: '三年级 第4单元',
        Count: 10,
        Total: 16,
        Time: '2023-2-21-17:10'
    },
    {
        Title: '我的中国心',
        Grade: '三年级 第4单元',
        Count: 10,
        Total: 16,
        Time: '2023-2-21-17:10'
    },
    {
        Title: '我的中国心',
        Grade: '三年级 第4单元',
        Count: 10,
        Total: 16,
        Time: '2023-2-21-17:10'
    },
    {
        Title: '我的中国心',
        Grade: '三年级 第4单元',
        Count: 10,
        Total: 16,
        Time: '2023-2-21-17:10'
    },
    {
        Title: '我的中国心',
        Grade: '三年级 第4单元',
        Count: 10,
        Total: 16,
        Time: '2023-2-21-17:10'
    }]
})

const { gradeList, grade, articleList } = toRefs(state)

const openScan = () => {
    scanRef.value.openDialog()
}

const openList = ()=>{
    listRef.value.openDialog()
}

const addComposition = () => {
    setRef.value.openDialog()
}
</script>
<style lang="scss" scoped>
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
            overflow: hidden;
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