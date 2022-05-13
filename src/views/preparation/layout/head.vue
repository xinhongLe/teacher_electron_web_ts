<template>
    <div class="p-layout-head">
        <div class="p-head-filter">
            <div class="p-filter-content">
                <el-radio-group
                    class="custom-radio"
                    v-model="source"
                    size="small"
                    @change="onSourceChange"
                >
                    <el-radio-button v-for="item in sourceList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="p-control-btns">
                <el-button size="small" type="primary">&nbsp;&nbsp;&nbsp;<el-icon size="12"><plus /></el-icon>&nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;</el-button>
                <img class="refresh-btn" src="@/assets/images/preparation/icon_shuaxin_rest.svg" alt="">
            </div>
        </div>
        <div class="p-head-filter">
            <div class="p-filter-content">
                <el-radio-group
                    class="custom-radio"
                    v-model="type"
                    size="small"
                    @change="onTypeChange"
                >
                    <el-radio-button v-for="item in typeList" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Plus, Refresh } from "@element-plus/icons-vue";

export default defineComponent({
    components: { Plus, Refresh },
    setup() {
        const source = ref("");
        const sourceList = ref([
            {
                value: "",
                label: "全部资源"
            },
            {
                value: 2,
                label: "系统资源"
            },
            {
                value: 3,
                label: "校本资源"
            },
            {
                value: 4,
                label: "我的资源"
            }
        ]);
        const onSourceChange = () => {
            //
        };

        const type = ref("");
        const typeList = ref([
            {
                value: "",
                label: "全部类型"
            },
            {
                value: 2,
                label: "教案"
            },
            {
                value: 3,
                label: "课件"
            },
            {
                value: 4,
                label: "作业"
            }
        ]);
        const onTypeChange = () => {
            //
        };

        return {
            source,
            sourceList,
            onSourceChange,
            type,
            typeList,
            onTypeChange
        }
    }
});
</script>

<style lang="scss" scoped>
.p-layout-head {
    padding: 20px;
}

.p-head-filter {
    display: flex;
    align-items: center;
    &+.p-head-filter {
        margin-top: 15px;
    }
}

.p-filter-content {
    flex: 1;
    min-width: 0;
}

.p-control-btns {
    display: flex;
    align-items: center;
    :deep(.el-icon) {
        position: relative;
        top: 1px;
    }

    .refresh-btn {
        display: block;
        width: 16px;
        margin-left: 30px;
        cursor: pointer;
    }
}

.custom-radio {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: var(--el-border-radius-base);
        border: 1px solid #dcdfe6;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        background-color: #fff;
        color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary);
        box-shadow: none;
    }
}
</style>
