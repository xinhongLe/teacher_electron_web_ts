<template>
    <div class="p-layout-head">
        <div class="p-head-filter">
            <div class="p-filter-content">
                <div class="my-course-cart" :class="source === 'me' && 'active'" id="myCourseCart" :num="'99+'" @click="source = 'me'">
                    <img src="@/assets/images/preparation/cart.png" alt="" />
                    我的备课包
                </div>
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
                    class="custom-radio-two"
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
                label: "全部"
            },
            {
                value: 2,
                label: "教案"
            },
            {
                value: 3,
                label: "导学案"
            },
            {
                value: 4,
                label: "课件"
            },
            {
                value: 5,
                label: "微课视频"
            },
            {
                value: 6,
                label: "试卷"
            },
            {
                value: 7,
                label: "电子课本"
            },
            {
                value: 8,
                label: "教具"
            },
            {
                value: 9,
                label: "工具"
            },
            {
                value: 10,
                label: "素材"
            },
            {
                value: 11,
                label: "其他"
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
    padding: 15px;
    border-radius: 5px;
    background-color: #fff;
    & + .p-head-filter {
        margin-top: 15px;
    }
}

.p-filter-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
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

.my-course-cart {
    margin-right: 10px;
    border-radius: var(--el-border-radius-base);
    border: 0;
    background: #f5f6fa;
    font-size: 14px;
    padding: 9px 15px 9px 60px;
    position: relative;
    cursor: pointer;
    &.active {
        background-color: #272c42;
        color: #fff;
    }
    &:before {
        content: attr(num);
        display: block;
        padding: 3px;
        border-radius: 15px;
        font-size: 12px;
        color: #fff;
        background: var(--app-color-red);
        position: absolute;
        left: 40px;
        top: -16px;
        z-index: 1;
    }
    img {
        position: absolute;
        top: -16px;
        width: 50px;
        left: 10px;
        display: block;
    }
}

.custom-radio {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: var(--el-border-radius-base);
        border: 0;
        background: #f5f6fa;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #272c42;
    }
    :deep(.el-radio-button--small .el-radio-button__inner) {
        font-size: 14px;
    }
}

.custom-radio-two {
    :deep(.el-radio-button__inner) {
        margin-right: 10px;
        border-radius: 16px;
        border: 0;
        background: #fff;
    }
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        color: #fff;
        box-shadow: none;
        background: #eef2ff;
        color: #4b71ee;
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
