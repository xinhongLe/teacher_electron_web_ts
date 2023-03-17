
<template>
    <el-dialog :z-index="1000" width="470" v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close center
        :before-close="close">
        <template #title>
            <div class="title pl20">
                {{ '批量导入文件' }}
            </div>
        </template>
        <div class="step">
            <div class="step-item">
                <div class="tag">
                    <div>1</div>
                </div>
                <div class="title">第一步</div>
                <div class="desc">
                    拍摄作文照片，一页一张，尽量保证清晰。
                </div>
                <img class="pic step1" src="../../../assets/composition/pic_step1@2x.png" alt="" />
            </div>
            <div class="step-item">
                <div class="tag">
                    <div>2</div>
                </div>
                <div class="title">第二步</div>
                <div class="desc">
                    将照片文件按顺序命名好，放入到学生姓名+学号命名的文件夹中，最终将全部学生文件夹放入同一个文件夹中。
                </div>
                <img class="pic step2" src="../../../assets/composition/pic_step2@2x.png" alt="" />
            </div>
            <div class="step-item">
                <div class="tag">
                    <div>3</div>
                </div>
                <div class="title">第三步</div>
                <div class="desc">
                    选择导入该文件夹。
                </div>
                <div class="download">
                    <img src="../../../assets/composition/icon_download@2x.png" alt="" />
                    下载导入模版
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer mt20">
                <div>
                    <el-button class="btn" color="#4B71EE" v-loading.fullscreen.lock="loading" @click="confirm">
                        <img src="../../../assets/composition/icon_daoru@2x.png" alt="" />
                        导入
                    </el-button>
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
        Value: '全部',
        Id: 1
    }] as any[]
});
const { form, chapterList } = toRefs(state);

const emit = defineEmits(['cancel', 'openScan', 'save']);

const tagByAi = () => {

}
const close = () => {
    state.form = {
        Title: '',
        Chapter: null
    };
    formRef.value && formRef.value.resetFields();
    dialogVisible.value = false;
    emit('cancel');
};

const confirm = () => {
    emit('openScan')
};

const openDialog = async (info?: any) => {
    dialogVisible.value = true;
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

.step {
    padding-left: 20px;

    &-item {
        position: relative;
        border-left: 1px solid #EAEDEF;
        padding-left: 31px;
        box-sizing: border-box;
        padding-bottom: 10px;
        margin-bottom: 10px;

        &::after {
            content: '';
            position: absolute;
            left: -2.5px;
            bottom: 0;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #CFD3DB;
        }

        &:nth-last-of-type(1) {
            border-left: none;

            &::after {
                width: 0;
                height: 0;
                background-color: transparent;
            }

            .tag {
                &::after {
                    width: 0;
                    height: 0;
                    background-color: transparent;
                }
            }
        }

        .download {
            position: absolute;
            right: 0;
            top: 6px;
            padding: 6px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4B71EE;

            &>img {
                width: 16px;
                height: 16px;
                margin-right: 6px;

            }
        }

        .title {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #A7AAB4;
        }

        .desc {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #19203D;
            line-height: 16px;
            margin-top: 6px;
        }

        .pic {
            margin-top: 12px;
            height: 96px;
            width: auto;
        }

        .tag {
            position: absolute;
            left: -26px;
            top: -10px;
            width: 52px;
            height: 52px;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;

            &>div {
                width: 32px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                border-radius: 50%;
                background: #FFFFFF;
                border: 1px solid #4B71EE;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B71EE;
            }

            &::after {
                content: '';
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: -5px;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #CFD3DB;
            }

        }
    }
}

:deep(.el-dialog__footer) {
    padding-top: 0;
}

.btn {
    width: 148px;

    img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
    }
}
</style>