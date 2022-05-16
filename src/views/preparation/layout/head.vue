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
                    <el-radio-button
                        v-for="item in sourceList"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio-button
                    >
                </el-radio-group>
            </div>
            <div class="p-control-btns">
                <el-button
                    size="small"
                    type="primary"
                    @click="uploadResourceOpen = true"
                >
                    &nbsp;&nbsp;&nbsp;
                    <el-icon :size="12"><plus /></el-icon>
                    &nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </el-button>
                <img
                    class="refresh-btn"
                    src="@/assets/images/preparation/icon_shuaxin_rest.svg"
                    alt=""
                />
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
                    <el-radio-button
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio-button
                    >
                </el-radio-group>
            </div>
        </div>

        <el-dialog
            custom-class="custom-dialog"
            v-model="uploadResourceOpen"
            center
            title="上传资源"
            width="550px"
        >
            <el-form class="custom-form" :model="form" label-width="100px">
                <el-form-item label="资源：">
                    <el-button
                        type="primary"
                        size="small"
                        style="font-size: 14px"
                    >
                        &nbsp;&nbsp;&nbsp;
                        <el-icon :size="14"><upload /></el-icon>
                        &nbsp;上&nbsp;传&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-button>
                </el-form-item>
                <el-form-item label="资源名称：">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="类型：">
                    <el-radio-group
                        class="custom-radio"
                        v-model="form.type"
                        size="small"
                    >
                        <el-radio-button
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{ item.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="目录：">
                    <div class="select-box">
                        <el-select
                            class="select-half"
                            v-model="form.book"
                            placeholder="选择书册"
                        >
                            <el-option
                                v-for="item in bookList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>

                        <el-select
                            class="select-half"
                            v-model="form.chapter"
                            placeholder="选择章节"
                        >
                            <el-option
                                v-for="item in chapterList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                    <el-button class="add-btn" type="default">
                        新增目录
                    </el-button>
                </el-form-item>
                <el-form-item label="难易程度：">
                    <el-select
                        v-model="form.degree"
                        placeholder="请选择"
                        class="select-block"
                    >
                        <el-option
                            v-for="item in chapterList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="关联知识点：">
                    <el-select
                        class="select-block"
                        v-model="form.knowledge"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in chapterList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setbookSelectOpen = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="setBook()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { Plus, Refresh, Upload } from "@element-plus/icons-vue";

export default defineComponent({
    components: { Plus, Refresh, Upload },
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

        const form = reactive({
            name: "",
            type: "",
            book: "",
            chapter: "",
            degree: "",
            knowledge: ""
        });

        const bookList = ref([
            {
                value: 1,
                label: "数学"
            },
            {
                value: 2,
                label: "语文"
            }
        ]);

        const chapterList = ref([
            {
                value: 1,
                label: "第一章"
            },
            {
                value: 2,
                label: "第二章"
            }
        ]);

        const uploadResourceOpen = ref(false);

        return {
            source,
            sourceList,
            onSourceChange,
            type,
            typeList,
            onTypeChange,
            form,
            bookList,
            chapterList,
            uploadResourceOpen
        };
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
    & + .p-head-filter {
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
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.custom-form {
    :deep(.el-form-item) {
        margin-bottom: 15px;
    }
    :deep(.el-icon) {
        position: relative;
        top: 1px;
    }
}

.select-box {
    display: flex;
    justify-content: space-between;
    .select-half {
        width: 47%;
    }
}

.select-block {
    width: 100%;
}

.add-btn {
    width: 100%;
    margin-top: 15px;
}
</style>
