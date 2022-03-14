<script lang="ts" setup>
import { bagKey } from "@/hooks/useBag";
import { ElMessage, ElMessageBox } from "element-plus";
import { pullAllBy } from "lodash";
import { inject, ref } from "vue";
import { delCourseBagTeacher } from "../api";
import ClassBagDialog from "./ClassBagDialog.vue";

const { bagList, selectBag, handleSelectBag } = inject(bagKey)!;

const dialogVisible = ref(false);
const isOperator = inject("isOperator", true);

const delCourse = () => {
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
            }
        })
        .catch(() => {
            ElMessage.info("已取消删除");
        });
};
</script>

<template>
    <div class="title-bar">
        <div class="bag-list" :class="{ 'no-right': !isOperator }">
            <div class="bag-list-scroll">
                <div
                    class="bag"
                    v-for="(bag, index) in bagList"
                    :key="bag?.ID"
                    :class="{ active: bag.ID === selectBag?.ID }"
                    @click="handleSelectBag(bag, index)"
                >
                    {{ bag?.Name }}
                </div>
            </div>
        </div>
        <div class="icon-list-warp" v-if="selectBag?.ID && isOperator">
            <div class="icon-warp" @click="dialogVisible = true">
                <i class="el-icon-edit-outline"></i>
            </div>
            <div class="icon-warp" @click="delCourse">
                <i class="el-icon-delete"></i>
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
    .bag-list {
        height: 100%;
        flex: 1;
        margin-left: 70px;
        min-width: 0;
        .bag-list-scroll {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-x: overlay;
        }
        &.no-right {
            margin-left: 0;
        }
    }
    .bag {
        margin-right: 40px;
        max-width: 120px;
        @include text-ellipsis();
        flex-shrink: 0;
        height: 100%;
        display: flex;
        align-items: center;
        &:last-child {
            margin-right: 0;
        }
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
            &:first-child {
                margin-right: 12px;
            }
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>
