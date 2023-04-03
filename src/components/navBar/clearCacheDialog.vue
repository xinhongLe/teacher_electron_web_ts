<template>
    <Dialog :close="close" :is-show-close-btn="!clearCaching">
        <ClearCacheLoading v-if="clearCaching" :percentage="deleteFileProgress" />
        <ClearCacheSuccess
            :close="close"
            :file-total-size="fileTotalSize"
            v-else-if="clearCacheEnd"
        />
        <div class="container" v-else>
            <div class="tab-list">
                <div
                    class="tab"
                    :class="{ select: selectTab === 0 }"
                    @click="clickTab(0)"
                >
                    手动清理缓存
                </div>
                <div
                    class="tab"
                    :class="{ select: selectTab === 1 }"
                    @click="clickTab(1)"
                >
                    系统自动清理设置
                </div>
            </div>
            <div class="manual-content" v-show="selectTab === 0">
                <div class="content-item">
                    <span class="label">时间范围：</span>
                    <div class="select-warp">
                        <el-select
                            v-model="timeRange"
                            :popper-append-to-body="false"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <span class="label">可释放总空间：</span>
                    <span class="space-size">{{
                        rangeFileList.length === 0
                            ? "无缓存，无需清理"
                            : `${fileTotalSize}M`
                    }}</span>
                </div>
            </div>
            <div class="auto-content" v-show="selectTab === 1">
                <el-radio-group v-model="autoClearSetting">
                    <div>
                        <el-radio :label="0">不自动清理</el-radio>
                    </div>
                    <div>
                        <el-radio :label="1"
                            >自动清理1个月前的缓存文件</el-radio
                        >
                    </div>
                    <div>
                        <el-radio :label="2"
                            >自动清理2个月前的缓存文件</el-radio
                        >
                    </div>
                </el-radio-group>
            </div>
            <div class="footer">
                <span class="btn" @click="close">取消</span>
                <span
                    class="btn"
                    v-if="selectTab === 0"
                    @click="clearCache"
                    :class="{ disable: rangeFileList.length === 0 }"
                    >清除缓存数据</span
                >
                <span class="btn" v-else @click="clickSure">确定</span>
            </div>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "../dialog/index.vue";
import { ref, watchEffect } from "vue";
import moment from "moment";
import { ElMessage } from "element-plus";
import ClearCacheSuccess from "./clearCacheSuccess.vue";
import ClearCacheLoading from "./clearCacheLoading.vue";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import { store } from "@/store";
import useCacheFile from "./hooks/useCacheFile";

const emit = defineEmits(["update:showCacheDialog"]);
const selectTab = ref(0);
const timeRange = ref(0);
const autoClearSetting = ref(0);
const { fileTotalSize, clearCache, getRangeFileList, clearCaching, clearCacheEnd, deleteFileProgress, rangeFileList } = await useCacheFile();

const options = [
    {
        value: 0,
        label: "1个月前"
    },
    {
        value: 1,
        label: "1周前"
    },
    {
        value: 2,
        label: "2周前"
    },
    {
        value: 3,
        label: "不限时间（所有缓存数据全部清除）"
    }
];
const close = () => {
    emit("update:showCacheDialog", false);
};

const clickTab = (tab: number) => {
    selectTab.value = tab;
};

const clickSure = () => {
    set(STORAGE_TYPES.AUTO_CLEAR_SETTING , autoClearSetting.value);
    ElMessage.success("保存成功");
    close();
};

watchEffect(() => {
    const id = store.state.userInfo.id;
    autoClearSetting.value = Number(get(STORAGE_TYPES.AUTO_CLEAR_SETTING)) || 0;
});

watchEffect(async () => {
    if (timeRange.value === 0) {
        getRangeFileList(moment().subtract(1, "months"));
    } else if (timeRange.value === 1) {
        getRangeFileList(moment().subtract(1, "w"));
    } else if (timeRange.value === 2) {
        getRangeFileList(moment().subtract(2, "w"));
    } else if (timeRange.value === 3) {
        getRangeFileList();
    }
});
</script>

<style lang="scss" scoped>
.container {
    .tab-list {
        padding: 0 40px;
        display: flex;
        padding-bottom: 12px;
        border-bottom: 1px solid #f5f6fa;
        align-items: center;
        .tab {
            &:last-child {
                margin-left: 36px;
            }
            font-size: 18px;
            font-weight: 400;
            color: #a7aab4;
            cursor: pointer;
            &.select {
                font-size: 20px;
                font-weight: 600;
                color: #19203d;
                position: relative;
                &::before {
                    content: "";
                    width: 100%;
                    bottom: -12px;
                    position: absolute;
                    height: 3px;
                    background: #4b71ee;
                }
            }
        }
    }
    .manual-content {
        padding: 46px 40px 74px;
        .content-item {
            display: flex;
            align-items: center;
            &:first-child {
                margin-bottom: 24px;
            }
            .label {
                font-size: 16px;
                font-weight: 400;
                color: #5f626f;
                margin-right: 8px;
            }
            .space-size {
                font-size: 24px;
                font-weight: 600;
                color: #4b71ee;
            }
            .select-warp {
                width: 296px;
                :deep(.el-select) {
                    width: 100%;
                }
            }
        }
    }
    .auto-content {
        width: 464px;
        padding: 34px 40px 54px;
    }
    .footer {
        display: flex;
        justify-content: center;
        .btn {
            &:first-child {
                border: 1px solid #e0e2e7;
                width: 120px;
                margin-right: 24px;
            }

            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            font-weight: 400;
            color: #19203d;
            border-radius: 4px;
            height: 40px;
            &:last-child {
                color: #ffffff;
                background: #4b71ee;
                width: 160px;
            }
            &.disable {
                background-color: #bbc9f8;
            }
        }
    }
}
</style>
