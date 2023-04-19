
<template>
    <el-dialog :z-index="1000" width="370" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #header>
            <div class="title pl20">
                {{ '选择学生' }}
            </div>
        </template>
        <div class="list">
            <div class="stu-item" v-for="(item, idx) in props.repeatList" :key="idx" @click="selectStu(item)">
                {{ item.StudentName + '(' + item.Account + ')' }}
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <el-button style="width: 120px;" @click="close">取消</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { store } from '@/store';
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
import { addArticle } from '../api';

//
const props = defineProps({
    repeatList: {
        type: Object,
        default: () => {
            return []
        }
    }
})
//
const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({

});
const { } = toRefs(state);

const emit = defineEmits(['cancel', 'select']);

const selectStu = (item: any) => {
    emit('select', item)
    close()
}

const close = () => {
    dialogVisible.value = false
    emit('cancel')
};

const openDialog = async (info?: any) => {
    dialogVisible.value = true
};

defineExpose({
    openDialog,
});
</script>
<style lang="scss" scoped>
.title {
    font-size: 16px;
    font-weight: 600;
}

.list {
    .stu-item {
        width: 320px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: #F9FAFC;
        border-radius: 4px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #19203D;
        margin-bottom: 16px;
        cursor: pointer;
    }
}
</style>