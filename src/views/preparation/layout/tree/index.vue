<template>
    <div class="tree-body">
        <TreeItem
            :selectedTreeItem="selectedTreeItem"
            :value="value"
            v-for="item in treeData"
            :zIndex="0"
            :key="item.id"
            :itemData="item"
            :keys="[item.id]"
            :tipTarget="tipTarget"
            :showClassArrangement="showClassArrangement"
        />
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import TreeItem from "./treeItem.vue";
import { ITreeItem } from "./types";
export default defineComponent({
    components: { TreeItem },
    props: {
        treeData: {
            type: Array as PropType<ITreeItem[]>,
            required: true
        },
        value: String,
        showClassArrangement: {
            type: Boolean,
            default: false
        },
        tipTarget: {
            type: String
        }
    },
    setup(props, { emit }) {
        const selectedTreeItem = (treeItem: ITreeItem, keys: string[]) => {
            emit("update:value", treeItem.id);
            emit("onTreeItemChange", treeItem.id, keys);
        };
        return {
            selectedTreeItem
        }
    }
});
</script>

<style lang="scss" scoped>
.tree-body {
    position: relative;
    z-index: 1;
    :deep(.tree-box:last-of-type) {
        &::after {
            border: none;
        }
    }
}
</style>
