<template>
    <div class="setting-container">
        <div class="setting-header">
            小组比拼
        </div>

        <div class="setting-body">
           小组数量：&nbsp;&nbsp; <el-input-number size="large" class="input-adjust" v-model="teamNum" :min="2" :max="10" />
        </div>

        <div class="setting-btns">
            <el-button class="setting-btn" @click="close">取消</el-button>
            <el-button class="setting-btn start-btn" type="primary" @click="submit">开始</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    emits: ["start", "update:modelValue"],
    setup(props, { emit }) {
        const teamNum = ref(4);

        const close = () => {
            window.electron.destroyWindow();
        };

        const win = window.electron.remote.getCurrentWindow();
        win.setHasShadow(true);

        const submit = () => {
            emit("update:modelValue", teamNum.value);
            emit("start");
        }

        return {
            teamNum,
            close,
            submit
        }
    }
});
</script>

<style scoped>
.setting-container {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #E9ECF0;
}

.setting-header {
    font-size: 16px;
    text-align: center;
    padding: 15px;
    font-weight: 600;
    border-bottom: 1px solid #E9ECF0;
    width: 100%;
}

.setting-body {
    flex: 1;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    width: 272px;
    font-size: 14px;
    color: #5F626F;
}

.setting-btns {
    padding: 12px 16px;
    text-align: right;
    border-top: 1px solid #E9ECF0;
    width: 100%;
}

.setting-btns .setting-btn {
    width: 100px;
}
</style>

<style>
.input-adjust {
    width: 120px !important;
}
.input-adjust .el-input-number__decrease, .input-adjust .el-input-number__increase {
    width: 20px !important;
    height: 20px;
    border-radius: 10px;
    position: absolute;
    top: 9px;
}

.input-adjust .el-input-number__decrease.is-disabled, .input-adjust .el-input-number__increase.is-disabled {
    opacity: .5;
}

.input-adjust .el-input-number__increase {
    right: -36px;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
}

.input-adjust .el-input-number__decrease {
    left: 170px;
    border: 1px solid var(--el-color-danger);
    color: var(--el-color-danger);
}
</style>
