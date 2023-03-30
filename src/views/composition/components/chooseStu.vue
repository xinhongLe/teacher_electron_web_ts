
<template>
    <div class="btn" @click="backScan">返回扫码</div>
    <div class="card">
        <div class="card-tit">请选择学生</div>
        <div class="stu-box">
            <div :class="['stu-item', Number(idx) === active && 'active']" v-for="(item, idx) in props.stuList" :key="idx"
                @click="selectStu(item, Number(idx))">
                {{ item.StudentName }} ({{ item.Account }})
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
//
const props = defineProps({
    stuList: {
        type: Object,
        default: () => {
            return []
        }
    },
    current: {
        type: String,
        default: ''
    }
})
//
const state = reactive({
    active: null as any, // 没有默认选中
    formLabelWidth: 70,
    form: {
        Title: '',
        Chapter: null
    },
    chapterList: [{
        Value: '全部',
        Id: 1
    }] as any[]
});
const { form, chapterList, active } = toRefs(state);

const emit = defineEmits(['cancel', 'back', 'afterChoose']);

watch(()=>props.current,(val)=>{
    if(val){
        state.active = props.stuList.findIndex((v:any)=>v.StudentId===props.current)
        console.log('watch:',state.active);
    }
},{
    immediate:true,
    deep:true
})

const selectStu = (item: any, idx: number) => {
    state.active = idx
    emit('afterChoose', { ...item, idx })
}

// const chooseActive = () => {
//     state.active = props.stuList.findIndex((v:any)=>v.StudentId===props.current)
// }

const switchNext = () => {
    // console.log('====================',state.active,props.stuList.length-1);
    
    // if(state.active===props.stuList.length-1){
    //     ElMessage.warning('当前已经是最后一个学生')
    //     return
    // }
    // state.active = state.active + 1
    // emit('afterChoose', { ...props.stuList[state.active], idx: state.active })
}

const backScan = () => {
    emit('back')
}

defineExpose({
    switchNext
})
</script>
<style lang="scss" scoped>
.btn {
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E0E2E7;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #19203D;
    margin-bottom: 16px;
}

.card {
    width: 100%;
    height: calc(100% - 48px);
    background: #FFFFFF;
    border-radius: 4px;

    &-tit {
        width: 230px;
        height: 32px;
        line-height: 32px;
        background: #9FB5FE;
        border-radius: 4px 4px 0px 0px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        text-align: center;
    }

    .stu-box {
        height: calc(100% - 32px);
        overflow-y: auto;
        padding: 0 16px;
        box-sizing: border-box;

        .stu-item {
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
            text-align: left;
            border-bottom: 1px solid fade-out($color: #E0E2E7, $amount: 0.5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:nth-last-of-type(1) {
                border-bottom: none;
            }

            &.active {
                color: #4B71EE;
            }
        }
    }

}
</style>