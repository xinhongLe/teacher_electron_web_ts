<script lang="ts" setup>
import { bagKey } from "@/hooks/useBag";
import useSwiper from "@/hooks/useSwiper";
import { ElMessage, ElMessageBox } from "element-plus";
import { isEmpty, pullAllBy } from "lodash";
import { inject, ref, watch } from "vue";
import { delCourseBagTeacher } from "../api";
import ClassBagDialog from "./ClassBagDialog.vue";

const { bagList, selectBag, handleSelectBag, classContentList } = inject(bagKey)!;

const { slideNext, slidePrev, isDisableNext, isDisablePrev, isShowSlideBtn, translateX, listWarpRef, swiperItemRefs, swiperRef, slideIndex } = useSwiper();

const dialogVisible = ref(false);
const isOperator = inject("isOperator", true);

watch(bagList, () => {
    slideIndex.value = 0;
    translateX.value = 0;
});

const delCourse = () => {
    if (bagList.value.length === 1) {
        return;
    }
    ElMessageBox.confirm(
        `确认要删除此课包[${selectBag.value?.Name}]?`,
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
    )
        .then(async () => {
            const res = await delCourseBagTeacher({
                id: selectBag.value?.ID || ""
            });
            if (res.resultCode === 200) {
                ElMessage.success("删除成功!");
                pullAllBy(bagList.value, [{ ID: selectBag.value?.ID }], "ID");
                if (!isEmpty(bagList.value)) {
                    handleSelectBag(bagList.value[0], 0);
                } else {
                    classContentList.value = [];
                    selectBag.value = undefined;
                }
            }
        })
        .catch(() => {
            ElMessage.info("已取消删除");
        });
};
</script>

<template>
    <div class="title-bar">
        <div class="bag-list-swiper-warp" :class="{ 'no-right': !isOperator }">
            <div class="slide-btn prev" :class="{ hidden: !isShowSlideBtn, 'disable': isDisablePrev }" @click="slidePrev">
                <el-icon><ArrowLeft /></el-icon>
            </div>
            <div class="bag-list-warp" ref="listWarpRef">
                <div class="bag-list-swiper" ref="swiperRef" :style="{'transform': `translateX(-${translateX}px)`}">
                    <div
                        class="bag"
                        v-for="(bag, index) in bagList"
                        :key="bag?.ID"
                        :class="{ active: bag.ID === selectBag?.ID }"
                        @click="handleSelectBag(bag, index)"
                        :ref="swiperItemRefs.set"
                    >
                        <span class="name" :class="{ active: bag.ID === selectBag?.ID }" :title="bag?.Name">{{ bag?.Name }}</span>
                    </div>
                </div>
            </div>
            <div class="slide-btn next" :class="{ hidden: !isShowSlideBtn, 'disable': isDisableNext }" @click="slideNext">
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>
        <div class="icon-list-warp" v-if="selectBag?.ID && isOperator">
            <div class="icon-warp" @click="dialogVisible = true">
                <el-icon><Edit /></el-icon>
            </div>
            <div class="icon-warp" @click="delCourse" :class="{'disable': bagList.length === 1}">
                <el-icon><Delete /></el-icon>
            </div>
        </div>
    </div>
    <ClassBagDialog
        v-model:dialogVisible="dialogVisible"
        v-if="dialogVisible"
        :isEdit="true"
        :lessonOrBagValue="selectBag"
    />
</template>

<style lang="scss" scoped>
.title-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background: #c7eedb;
    font-size: 18px;
    font-weight: 600;
    color: #759c92;
    position: relative;
    flex-shrink: 0;
    .bag-list-swiper-warp {
        flex: 1;
        display: flex;
        justify-content: center;
        overflow: hidden;
        margin-left: 70px;
        height: 100%;
        align-items: center;
        padding: 0 12px;
        &.no-right {
            margin-left: 0;
        }
        .slide-btn {
            height: 28px;
            width: 20px;
            border-radius: 4px;
            background-color: var(--app-color-primary);
            flex-shrink: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;

            &.disable {
                color: #A7AAB4;
                background-color: #eff0f4;
            }
            &.hidden {
                visibility: hidden;
            }
            &.next {
                margin-left: 12px;
            }
            &.prev {
                margin-right: 12px;
            }
        }
        .bag-list-warp {
            height: 100%;
            display: flex;
            align-items: center;
            overflow: hidden;
            flex: 1;
            .bag-list-swiper {
                display: flex;
                transition: transform 0.3s;
                margin: 0 auto;
            }
        }
    }
    .bag {
        padding-right: 40px;
        @include text-ellipsis();
        flex-shrink: 0;
        height: 100%;
        line-height: 40px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        .name {
            max-width: 120px;
            @include text-ellipsis();
            &.active {
                color: var(--app-color-dark);
                position: relative;
                &::before {
                    position: absolute;
                    content: "";
                    height: 3px;
                    width: 100%;
                    bottom: 0;
                    background-color: var(--app-color-primary);
                }
            }
        }
        &:last-child {
            padding-right: 0;
        }

    }
    .icon-list-warp {
        padding-right: 10px;
        display: flex;
        align-items: center;
        .icon-warp {
            width: 24px;
            height: 24px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            &.disable {
                color: #ccc;
                cursor: default;
            }
            &:first-child {
                margin-right: 12px;
            }
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>
