<template>
    <div class="tree-body">
        <TreeItem
            :selectedTreeItem="selectedTreeItem"
            :value="value"
            v-for="item in (treeData as any)"
            :zIndex="0"
            :key="item.Id || item.ChapterId"
            :itemData="item"
            :keys="[item.Id || item.ChapterId]"
        />
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import TreeItem from "./treeItem.vue";
export default defineComponent({
    components: { TreeItem },
    props: {
        treeData: {
            type: Array,
            required: true,
        },
        value: String,
    },
    emits: ["onTreeItemChange", "update:value"],
    setup(props, { emit }) {
        const selectedTreeItem = (treeItem: any, keys: string[]) => {
            emit("update:value", treeItem.Id);
            emit("onTreeItemChange", treeItem, keys);
        };
        return {
            selectedTreeItem,
        };
    },
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
