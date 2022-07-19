<script lang="ts" setup>
import { store } from "@/store";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import moment from "moment";
import { computed, ref, watchEffect } from "vue";
import Dialog from "../dialog/index.vue";
import useCacheFile from "./hooks/useCacheFile";
import ClearCacheLoading from "./clearCacheLoading.vue";
import ClearCacheSuccess from "./clearCacheSuccess.vue";

const isShow = ref(false);
const checked = ref(false);
const dateText = ref("");
const id = computed(() => store.state.userInfo.id);
const {
    clearCache,
    clearCacheEnd,
    clearCaching,
    rangeFileList,
    fileTotalSize,
    getRangeFileList,
    fileInfoList,
    deleteFileProgress
} = await useCacheFile();
const close = () => {
    isShow.value = false;
};

const notClear = () => {
    if (checked.value) {
        const time = moment().add("1", "w").format();
        set(STORAGE_TYPES.NEXT_AUTO_CLEAR_TIME + id.value, time);
    }
    close();
};

watchEffect(() => {
    if (!id.value || fileInfoList.value.length === 0) return;
    const autoClearSetting = Number(get(STORAGE_TYPES.AUTO_CLEAR_SETTING + id.value));
    const nextAutoClearTime = get(STORAGE_TYPES.NEXT_AUTO_CLEAR_TIME + id.value);
    const isAfter = moment().isAfter(nextAutoClearTime);
    if ((autoClearSetting === 1 || autoClearSetting === 2) && (!nextAutoClearTime || (nextAutoClearTime && isAfter))) {
        dateText.value = autoClearSetting === 1 ? "1个月前" : "2个月前";
        getRangeFileList(
            autoClearSetting === 1
                ? moment().subtract(1, "months")
                : moment().subtract(2, "months")
        );
        set(STORAGE_TYPES.NEXT_AUTO_CLEAR_TIME + id.value, "");
        isShow.value = rangeFileList.value.length !== 0;
    }
});
</script>

<template>
    <Dialog :close="close" v-if="isShow">
        <ClearCacheLoading
            v-if="clearCaching"
            :percentage="deleteFileProgress"
        />
        <ClearCacheSuccess
            :close="close"
            :file-total-size="fileTotalSize"
            v-else-if="clearCacheEnd"
        />
        <div class="container" v-else>
            <div class="title">清理缓存</div>
            <div class="content-warp">
                <div class="text">
                    系统检测到您<span>{{ dateText }}</span
                    >有缓存文件需要清理
                </div>
                <div class="size-text">
                    缓存文件大小：<span>{{ fileTotalSize }}M</span>
                </div>
                <el-checkbox
                    v-model="checked"
                    label="7天后再提示"
                    size="large"
                ></el-checkbox>
            </div>
            <div class="btn-warp">
                <span class="btn" @click="notClear">暂不清理</span>
                <span class="btn" @click="clearCache">立即清理</span>
            </div>
            <span class="tips"
                >注：您也可以至【主页】-【清理缓存】重新调整【系统自动清理设置】</span
            >
        </div>
    </Dialog>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 464px;
    justify-content: space-between;
    height: 281px;
    .title {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
    }
    .content-warp {
        .text {
            font-size: 16px;
            font-weight: 400;
            color: #5f626f;
            margin-bottom: 20px;
            span {
                color: #4b71ee;
            }
        }
        .size-text {
            font-size: 24px;
            font-weight: 600;
            color: #19203d;
            margin-bottom: 28px;
            span {
                color: #4b71ee;
            }
        }
    }
    .btn-warp {
        display: flex;
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 400;
            color: #19203d;
            cursor: pointer;
            &:first-child {
                width: 120px;
                border: 1px solid #e0e2e7;
                margin-right: 24px;
            }
            &:last-child {
                color: #ffffff;
                background: #4b71ee;
                width: 160px;
            }
        }
    }
    .tips {
        font-size: 12px;
        font-weight: 400;
        color: #a7aab4;
    }
}
</style>
