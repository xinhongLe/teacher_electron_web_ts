
<template>
    <el-dialog :z-index="1000" width="450" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #title>
            <div class="title pl20">
                {{ '新建批改' }}
            </div>
        </template>
        <div class="form">
            <el-form ref="formRef" :model="form" :label-width="state.formLabelWidth">
                <el-form-item label="作文名称" prop="Title">
                    <el-input v-model="form.Title" />
                </el-form-item>
                
                <el-form-item label="单元" prop="Chapter">
                    <el-select clearable class="mr8" v-model="form.Chapter" placeholder="请选择">
                        <el-option v-for="item in chapterList" :key="item.Id" :label="item.Value" :value="item.Id">{{
                            item.Value
                        }}</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <el-button color="#4B71EE" :disabled="!form.Title || !form.Chapter" v-loading.fullscreen.lock="loading" @click="confirm">创建并开始录入</el-button>
                </div>
            </div>
        </template>
    </el-dialog>

</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref, toRefs, watch, nextTick } from 'vue';
//
const formRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    formLabelWidth: 70,
    form: {
        Title: '',
        Chapter: null
    },
    chapterList: [{
        Value:'全部',
        Id:1
    }] as any[]
});
const { form, chapterList } = toRefs(state);

const emit = defineEmits(['cancel','openScan', 'save']);

const tagByAi = () => {

}
const close = () => {
    state.form = {
        Title: '',
        Chapter: null
    };
    formRef.value && formRef.value.resetFields()
    dialogVisible.value = false
    emit('cancel')
};

const confirm = () => {
    emit('openScan')
    close()
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

.form {
    padding: 0 20px;
    // overflow-y: auto;
    // height: 500px;
}
:deep(.el-dialog__footer){
    padding-top: 0;
}

:deep(.el-form) {
    .el-form-item__content{
        width: 100%;
        .el-select{
            width: 100%;
        }
    }
    .el-form-item:last-of-type {
        margin-bottom: 22px;
    }
}

:deep(.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover){
    background-color: #D4D6D9;
    border-color: #D4D6D9;
}
</style>