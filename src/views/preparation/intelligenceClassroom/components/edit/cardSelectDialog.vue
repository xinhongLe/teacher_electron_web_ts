<template>
    <el-dialog v-model="visible" title="选择弹出卡" width="60%" center @close="close">
        <div class="dia-row">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-cascader v-model="subjectPublisherBookValue" :options="subjectPublisherBookList"
                                 :props="{ value: 'ID', children: 'Children', label: 'Name' }">
                    </el-cascader>
                </el-col>
                <el-col :span="8">
                    <el-select v-model="chaptersValue" placeholder="Select">
                        <el-option v-for="item in chaptersList" :key="item.ID" :label="item.Name" :value="item.ID">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-cascader v-model="winValue" :options="winList"
                                 :props="{ value: 'ID', children: 'Children', label: 'Name' }">
                    </el-cascader>
                </el-col>
            </el-row>
            <div class="dia-card-list">
                <el-tree
                    ref="treeRef"
                    default-expand-all
                    :highlight-current="true"
                    :data="windowCards"
                    :props="defaultProps"
                    show-checkbox
                    @node-click="handleNodeClick"/>
            </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="handleComfirm">确定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, watch, ref } from "vue";
import { IPageValue, ITreeList, ICardList, ICards } from "@/types/home";
import Node from "element-plus/es/components/tree/src/model/node";
import useSelectBookInfo from "@/hooks/useSelectBookInfo";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

interface ICardType {
    [propName: string]: ICards
}

export default defineComponent({
    name: "cardSelectDialog",
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
            require: true
        }
    },
    emits: ["update:dialogVisible", "selectCard"],
    setup(props, { emit }) {
        const visible = computed(() => props.dialogVisible);
        const route = useRoute();
        const treeRef = ref();
        const {
            state, defaultProps, pageValue, _getSubjectPublisherBookList,
            _getChapters, _getWindowCards, _getWinList
        } = useSelectBookInfo();

        const handleNodeClick = (data :IPageValue, Node: Node) => {
            if (Node.level === 2) {
                pageValue.value = data;
            }
        };
        _getSubjectPublisherBookList();

        watch(() => state.subjectPublisherBookValue, (curVal) => {
            const data = { id: curVal[2] };
            _getChapters(data);
        });

        watch(() => state.chaptersValue, (curVal) => {
            _getWinList(curVal);
        });

        watch(() => state.winValue, () => {
            _getWindowCards({ WindowID: `${route.params.winValue}` });
        });

        const handleComfirm = () => {
            const pages: ITreeList[] = treeRef.value && treeRef.value.getCheckedNodes();
            if (!pages || pages.length === 0) {
                return ElMessage({ message: "请先选择页", type: "warning" });
            }

            const cards:ICardType = {};
            pages.forEach((item: ITreeList) => {
                state.windowCards.forEach((i: ICardList) => {
                    i.PageList.some((j: IPageValue) => {
                        if (item.ID === j.ID) {
                            if (cards[i.ID]) {
                                cards[i.ID].slides.push({ id: item.ID, name: item.Name, type: item.Type });
                            } else {
                                cards[i.ID] = {
                                    id: i.ID,
                                    name: i.Name,
                                    slides: [
                                        { id: item.ID, name: item.Name, type: item.Type }
                                    ]
                                };
                            }
                            return true;
                        }
                    });
                });
            });

            const newCards = Object.values(cards);
            emit("selectCard", newCards);
        };

        const close = () => {
            emit("update:dialogVisible", false);
        };

        return {
            ...toRefs(state),
            visible,
            defaultProps,
            pageValue,
            treeRef,
            handleNodeClick,
            close,
            handleComfirm
        };
    }
});

</script>

<style scoped lang="scss">
.dia-row {
    :deep(.el-cascader), :deep(.el-select) {
        width: 100%;
        margin-bottom: 10px;
    }
}

.dia-card-list{
    margin-top: 20px;
    height: 400px;
    overflow-y: auto;
}
</style>
