<template>
    <div class="add-system-homework">
        <el-dialog
            title="系统作业"
            :model-value="dialogVisible"
            width="80%"
            center=""
            :before-close="handleClose"
        >
            <el-form :model="form" :inline="true" label-width="0px">
                <span class="title-text">选择版本</span>
                <el-cascader
                    v-model="form.subjectPublisherBookValue"
                    :props="cascaderProps"
                    :options="subjectPublisherBookList"
                ></el-cascader>
            </el-form>
            <div class="content">
                <div class="content-left">
                    <p class="title-text">单元选择</p>
                    <div>
                        <div
                            :class="[
                                'left-row',
                                activeLeft === index ? 'active' : '',
                            ]"
                            v-for="(item, index) in allList"
                            :key="index"
                            @click="activeLeft = index"
                        >
                            <span>{{ item.Name }} {{ item.Detial }}</span>
                            <span
                                v-show="
                                    selectListMap[item.ID] &&
                                    selectListMap[item.ID]?.length > 0
                                "
                                >{{ selectListMap[item.ID]?.length }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="content-right">
                    <template
                        v-if="
                            allList[activeLeft] &&
                            allList[activeLeft].BagLessons
                        "
                    >
                        <div
                            v-for="(item, index) in allList[activeLeft]
                                .BagLessons"
                            :key="index"
                        >
                            <p class="title-text">{{ item.Name }}</p>
                            <template
                                v-for="item1 in item.BagPapers"
                                :key="item1.PaperID"
                            >
                                <template v-if="item1.HasVideo">
                                    <BagPaperItem
                                        :info="item1"
                                        :type="1"
                                        :index="index"
                                        @choicePaper="choicePaper"
                                        :isSelect="getIsSelect(item1.PaperID, 1)"
                                    />
                                </template>
                                <BagPaperItem
                                    :info="item1"
                                    :index="index"
                                    @choicePaper="choicePaper"
                                    :isSelect="getIsSelect(item1.PaperID, 0)"
                                />
                            </template>
                        </div>
                    </template>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Student, SystemHomework } from "@/types/assignHomework";
import { BagChapter, BagPapers } from "@/types/preparation";
import { getCourseBagType, lookQuestions, lookVideo } from "@/utils";
import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { fetchBagChapter } from "../../preparation/api";
import useBookList from "../hooks/useBookList";
import BagPaperItem from "./BagPaperItem.vue";

export default defineComponent({
    name: "systemHomeworkDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        studentList: {
            type: Array as PropType<Student[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const { cascaderProps, subjectPublisherBookList } = useBookList();
        const form = reactive({
            subjectPublisherBookValue: [] as string[]
        });
        const allList = ref<BagChapter[]>([]);
        const activeLeft = ref(0);
        const selectListMap = reactive<Record<string, SystemHomework[]>>({});

        watch(
            subjectPublisherBookList,
            (v) => {
                form.subjectPublisherBookValue = [
                    v[0].Value,
                    v[0].Children![0].Value,
                    v[0].Children![0].Children![0].Value
                ];
            },
            {
                deep: true
            }
        );
        watch(() => form.subjectPublisherBookValue, getList);

        const handleClose = () => {
            emit("update:dialogVisible", false);
        };

        async function getList() {
            const res = await fetchBagChapter({
                bookID: form.subjectPublisherBookValue[2]
            });
            if (res.resultCode === 200) {
                allList.value = res.result;
            }
        }

        const choicePaper = (
            flag: number,
            item: BagPapers,
            index: number,
            type: number
        ) => {
            const { Name, BagLessons, ID } = allList.value[activeLeft.value];
            const bagLessonsName = BagLessons[index].Name;
            const version = subjectPublisherBookList.value
                .find(
                    ({ Value }) => form.subjectPublisherBookValue[0] === Value
                )
                ?.Children?.find(
                    ({ Value }) => form.subjectPublisherBookValue[1] === Value
                )
                ?.Children?.find(
                    ({ Value }) => form.subjectPublisherBookValue[2] === Value
                )?.Lable as string;
            const info = {
                ...item,
                bagPapersName: Name,
                bagLessonsName,
                type,
                students: [],
                version
            };
            if (flag) {
                selectListMap[ID]
                    ? selectListMap[ID].push(info)
                    : (selectListMap[ID] = [info]);
            } else {
                const findIndex = selectListMap[ID].findIndex(
                    (v) => item.PaperID === v.PaperID && v.type === type
                );
                selectListMap[ID].splice(findIndex, 1);
            }
        };

        const getIsSelect = (id: string, type: number) => {
            const { ID } = allList.value[activeLeft.value];
            if (!selectListMap[ID]) return false;
            const index = selectListMap[allList.value[activeLeft.value].ID].findIndex((v) => id === v.PaperID && v.type === type);
            return index !== -1;
        };

        const submit = () => {
            handleClose();
            emit("updateSystemHomeworkList", Object.values(selectListMap).flat());
        };

        return {
            handleClose,
            subjectPublisherBookList,
            form,
            allList,
            activeLeft,
            lookVideo,
            getCourseBagType,
            lookQuestions,
            choicePaper,
            getIsSelect,
            submit,
            selectListMap,
            cascaderProps
        };
    },
    components: { BagPaperItem }
});
</script>

<style lang="scss" scoped>
.add-system-homework {
    .title-text {
        font-size: 20px;
        font-weight: 600;
        color: #19203d;
        margin: 30px 0;
        margin-right: 20px;
    }
    :deep(.el-form) {
        padding: 0px 20px;
        .el-cascader {
            width: 30%;
            margin-bottom: 20px;
        }
    }
    :deep(.el-dialog__body) {
        padding: 0;
        .content {
            display: flex;
            height: 600px;
            border-top: 1px solid #f5f6fa;
            .content-left {
                width: 240px;
                height: 100%;
                overflow-y: auto;
                text-align: center;
                padding: 0 0 20px;
                .left-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 48px;
                    padding: 0 20px;
                    cursor: pointer;
                    span {
                        &:first-of-type {
                            width: 200px;
                            display: block;
                            text-align: left;
                            white-space: nowrap; /*内容超宽后禁止换行显示*/
                            overflow: hidden; /*超出部分隐藏*/
                            text-overflow: ellipsis;
                        }
                        &:last-of-type {
                            width: 36px;
                            height: 36px;
                            line-height: 36px;
                            font-size: 20px;
                            display: block;
                            background-color: #4b71ee;
                            border-radius: 50%;
                            color: #fff;
                            transform: scale(0.5);
                        }
                    }
                }
                .active {
                    color: #4b71ee;
                    background-color: #e6ecff;
                    box-shadow: inset -4px 0px 0px #4b71ee;
                }
            }
            .content-right {
                flex: 1;
                height: 100%;
                background-color: #f5f6fa;
                padding-left: 20px;
                overflow-y: auto;

                .bg-color {
                    background-color: #e6ecff;
                }
            }
        }
    }
}
</style>
