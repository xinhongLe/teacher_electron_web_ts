<template>
    <div class="p-layout-menu">
        <BookSelect @onChangeBook="data => onChangeBook(data)" />
        <div class="p-tree-wrapper">
            <div class="p-tree-title">
                <img src="@/assets/images/preparation/icon_ziyuan.png" alt="" />
                全部资源
            </div>
            <div class="tree-content">
                <Tree
                    @onTreeItemChange="selectedCourse"
                    v-model:value="selectedID"
                    :treeData="treeData"
                    :tipTarget="tipTarget"
                    :showClassArrangement="showClassArrangement"
                />
            </div>
        </div>
        <el-button
            class="p-work-schedule"
            :class="showClassArrangement && 'out'"
            @click="updateShowClassArrangement(!showClassArrangement)"
        >
            <div class="work-schedule-text" v-if="showClassArrangement">
                <img src="@/assets/images/preparation/icon_tuichu.svg" />
                退出排课
            </div>
            <div class="work-schedule-text" v-else>
                <img src="@/assets/images/preparation/icon_paike.svg" /> 去排课
            </div>
        </el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BookSelect from "./bookSelect.vue";
import Tree from "./tree/index.vue";
import { ITreeItem } from "./tree/types";
import { IBook } from "@/types/preparation";
import { MutationTypes, useStore } from "@/store";
import useBook from "../hooks/useBook";
import { fetchSchoolLessonList } from "../api";
import { sleep } from "@/utils/common";
export default defineComponent({
    components: { BookSelect, Tree },
    props: {
        showClassArrangement: {
            type: Boolean
        }
    },
    setup(props, { emit }) {
        const store = useStore();
        const updateShowClassArrangement = (flag: boolean) => {
            emit("update:showClassArrangement", flag);
        };

        const { teacherBookChapterList, getTeacherBookChapters } = useBook();

        const treeData = ref<ITreeItem[]>([]);
        const selectedCourse = (value: string, keys: string[]) => {
            console.log(value, keys);
        };
        const selectedID = ref("");

        const onChangeBook = async (data: IBook) => {
            store.commit(
                MutationTypes.SET_SUBJECT_PUBLISHER_BOOK_VALUE,
                [data.id]
            );
            dealBookChapterData(data.id);
        };

        // 操作提示使用
        const tipTarget = ref("");
        const dealBookChapterData = async (id: string) => {
            treeData.value = [];
            tipTarget.value = "";
            await getTeacherBookChapters(id);
            teacherBookChapterList.value.forEach(async item => {
                const res = await fetchSchoolLessonList({
                    chapterID: item.ID
                });
                const treeItem: ITreeItem = {
                    id: item.ID,
                    name: item.Name,
                    children: []
                };
                if (res.resultCode === 200) {
                    treeItem.children = res.result.map(lesson => {
                        return {
                            id: lesson.ID,
                            name: lesson.Name,
                            candrag: true
                        }
                    });
                }
                console.log(tipTarget.value, treeItem.children);
                if (!tipTarget.value && treeItem.children && treeItem.children.length > 0) {
                    tipTarget.value = treeItem.children[0].id;
                }
                treeData.value.push(treeItem);
                await sleep(300)
            });
        };

        return {
            treeData,
            selectedID,
            selectedCourse,
            updateShowClassArrangement,
            onChangeBook,
            tipTarget
        };
    }
});
</script>

<style lang="scss" scoped>
.p-layout-menu {
    background-color: #fff;
    width: 300px;
    display: flex;
    flex-direction: column;
}

.p-tree-wrapper {
    flex: 1;
    min-height: 0;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
}

.tree-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.p-work-schedule {
    background-color: var(--app-color-orange);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px;
    height: 42px;
    .work-schedule-text {
        display: flex;
        align-items: center;
        img {
            margin-right: 5px;
        }
    }
    &.out {
        background-color: var(--app-color-red);
    }
}

.p-tree-title {
    padding: 10px 0;
    border-bottom: 1px solid var(--app-color-border-default);
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    img {
        display: block;
        width: 20px;
        margin-right: 5px;
    }
}
</style>
