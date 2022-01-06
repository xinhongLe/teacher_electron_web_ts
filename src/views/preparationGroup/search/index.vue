<template>
    <div class="preparation-group-header">
        <div class="header-panel flex-between-center">
            <span class="header-title">我的集体备课</span>
            <div class="add-btn" @click="editPanel">
                <img src="../../../assets/preparationGroup/icon_add_white.png" alt="" />
                <span>发起集体备课</span>
            </div>
        </div>
        <div class="header-form">
            <el-input
                class="input-theme"
                v-model="formData.preTitle"
                placeholder="搜索集体备课主题"
                @change="submit"
            >
                <template #prefix>
					<img src="../../../assets/preparationGroup/icon_search.png" alt="">
				</template>
                <!-- <template #suffix>
                    <span @click="submit">搜索</span>
                </template> -->
            </el-input>
            <el-date-picker
                class="time-picker"
                v-model="formData.createTime"
                type="daterange"
                start-placeholder="创建开始时间"
                range-separator="~"
                end-placeholder="创建结束时间"
                :default-value="defaultValue"
                :shortcuts="shortcuts"
                @change="submit"
            >
            </el-date-picker>
            <div class="back-select">
                <span>备课状态：</span>
                <el-select
                    v-model="formData.status"
                    placeholder="请选择备课状态"
                    @change="submit"
                >
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="submit">搜索</el-button>
        </div>
        <ShareDetail ref="ShareDialogRef" @submit="submit"></ShareDetail>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import useSubmit from "./useSubmit";
import ShareDetail from "../shareDialog/index.vue";
export default defineComponent({
    name: "head",
    props: {
        reload: {
            type: Function
        }
    },
    setup(props, { emit }) {
        console.log(props);
        console.log(emit);
        const state = reactive({
            defaultValue: [new Date(), new Date()],
            shortcuts: [
                {
                    text: "今天",
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        return [start, end];
                    }
                },
                {
                    text: "最近一周",
                    value: () => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                }
            ]
        });

        const submit = () => {
            emit("requestParams", formData);
        };
        const ShareDialogRef = ref();
        const editPanel = () => {
            ShareDialogRef.value.openDialog();
        };
        const { statusList, formData, formRef } = useSubmit();
        return {
            ...toRefs(state),
            statusList,
            formData,
            formRef,
            submit,
            editPanel,
            ShareDialogRef
        };
    },
    components: { ShareDetail }
});
</script>

<style lang="scss" scoped>
.preparation-group-header {
    width: 100%;
    height: 148px;
    padding: 24px 20px;
    user-select: none;
    background-color: #fff;
    .header-panel {
        .header-title {
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #19203D;
        }
        .add-btn {
            width: 152px;
            height: 40px;
            background: #4B71EE;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                display: inline-block;
                width: 19px;
                height: auto;
            }
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #F5F6FA;
                margin-left: 5px;
            }
        }
    }
    .header-form {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 20px 0;
        .input-theme {
            width: 300px;
            :deep(.el-input__inner) {
                width: 300px;
                padding: 0 45px 0 35px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #19203D;
                &::placeholder {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #D1D3D9;
                }
            }
            :deep(.el-input__prefix) {
                left: 10px;
                img {
                    vertical-align: middle;
                }
            }
            :deep(.el-input__suffix) {
                width: 45px;
                span {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #4B71EE;
                    cursor: pointer;
                }
            }
        }
        :deep(.el-date-editor) {
            margin-left: 32px;
        }
        .back-select {
            margin: 0 32px;
            span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5F626F;
            }
        }
        :deep(.el-button) {
            width: 80px;
            height: 40px;
            background: #4B71EE;
            border: 1px solid #4B71EE;
            border-radius: 4px;
        }
    }
}
</style>
