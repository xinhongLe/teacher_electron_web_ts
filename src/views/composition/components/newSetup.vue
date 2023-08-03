
<template>
    <el-dialog :z-index="1000" width="450" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #header>
            <div class="title pl20">
                {{ '新建批改' }}
            </div>
        </template>
        <div class="form">
            <el-form ref="formRef" :model="form" :label-width="state.formLabelWidth">
                <el-form-item label="作文名称" prop="Title">
                    <el-input maxlength="15" show-word-limit v-model="form.Title" />
                </el-form-item>

                <el-form-item label="单元" prop="Chapter">
                <!-- <el-select clearable class="mr8" v-model="form.Chapter" placeholder="请选择">
                        <el-option v-for="item in chapterList" :key="item.Id" :label="item.Value" :value="item.Id">{{
                            item.Value
                        }}</el-option>
                            </el-select> -->
                    <el-cascader v-model="cascaderVal" @change="cascaderChange" :options="chapterList" :props="props1" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <el-button color="#4B71EE" :disabled="!form.Title || !form.GradeId" v-loading.fullscreen.lock="loading"
                        @click="confirm">创建并开始录入</el-button>
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
const props1 = {
    //   checkStrictly: true,
    value: 'Id',
    label: 'Value',
    children: 'Chapters'
}
//
const props = defineProps({
    classId:{
        type: String,
        default: ''
    },
    chapterList: {
        type: Object,
        default: () => {
            return []
        }
    }
})
//
const formRef = ref();
const loading = ref(false);
const dialogVisible = ref(false);
const state = reactive({
    formLabelWidth: 70,
    cascaderVal: null,
    classCount: 0,
    form: {
        Title: '',
        GradeId: null,
        ChapterId: null
    },
    // chapterList: [{
    //     Value:'全部',
    //     Id:1
    // }] as any[]
});
const { form, cascaderVal } = toRefs(state);

const cascaderChange = (val: any) => {
    let [grade, chapter] = val || [];
    state.form.GradeId = grade || null;
    state.form.ChapterId = chapter || null;
}

const emit = defineEmits(['cancel', 'openScan', 'save']);

const tagByAi = () => {

}
const close = () => {
    state.cascaderVal = null;
    state.form = {
        Title: '',
        GradeId: null,
        ChapterId: null
    };
    formRef.value && formRef.value.resetFields()
    dialogVisible.value = false
    emit('cancel')
};

const confirm = () => {
    addArticle({
        Title: state.form.Title,
        TeacherId: store.state.userInfo?.userCenterUserID,
        GradeId: state.form.GradeId,
        ClassId: props.classId,
        ChapterId: state.form.ChapterId
    }).then((res: any) => {
        if (res.success) {
            ElMessage.success('创建成功')
            setTimeout(() => {
                emit('openScan',{TeacherCompositionId: res.result,Title: state.form.Title,classCount:state.classCount})
                close()
            }, 500);
        }
    })

};

const openDialog = async (info?: any) => {
    state.classCount = info?.classCount
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

:deep(.el-dialog__footer) {
    padding-top: 0;
}

:deep(.el-form) {
    .el-form-item__content {
        width: 100%;

        .el-select {
            width: 100%;
        }

        .el-cascader {
            width: 100%;
        }
    }

    .el-form-item:last-of-type {
        margin-bottom: 22px;
    }
}

:deep(.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover) {
    background-color: #D4D6D9;
    border-color: #D4D6D9;
}
</style>