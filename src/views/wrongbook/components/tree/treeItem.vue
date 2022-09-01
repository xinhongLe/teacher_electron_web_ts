<template>
    <div
        class="tree-box"
        :class="{
            'no-before': zIndex === 0,
            'no-icon': !(
                (itemData.Children && itemData.Children.length > 0) ||
                zIndex === 0
            ),
        }"
    >
        <div class="tree-item">
            <img
                class="tree-icon"
                v-show="isOpen && value !== itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/icon_shouqi.png"
                @click="isOpen = false"
            />
            <img
                class="tree-icon"
                v-show="isOpen && value === itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/shouqi_blue.png"
                @click="isOpen = false"
            />
            <img
                class="tree-icon"
                v-show="!isOpen && value !== itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/icon_zhankai.png"
                @click="isOpen = true"
            />
            <img
                class="tree-icon"
                v-show="!isOpen && value === itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/icon_zhankai_blue.png"
                @click="isOpen = true"
            />

            <div
                @click="
                    zIndex === 0
                        ? (isOpen = !isOpen)
                        : selectedTreeItem(itemData, keys)
                "
                ref="treeName"
                class="tree-name"
                :class="{ active: value === itemData.Id }"
                :title="itemData.Name"
            >
                <span class="name">{{ itemData.Name }}</span>
                <span class="count">{{ itemData.count }}题</span>
            </div>
            <div
                class="selected-bg"
                :class="{ active: value === itemData.Id }"
                :style="{ width: `calc(100% + ${zIndex * 20}px)` }"
            ></div>
        </div>
        <div class="tree-item-children" :class="{ close: !isOpen }">
            <TreeItem
                :zIndex="zIndex + 1"
                v-for="item in itemData.Children"
                :key="item.Id"
                :itemData="item"
                :value="value"
                :candrag="true"
                :selectedTreeItem="selectedTreeItem"
                :keys="[...keys, item.Id]"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch, reactive } from "vue";
export default defineComponent({
    props: {
        itemData: {
            type: Object,
            required: true,
        },
        zIndex: {
            type: Number,
            required: true,
        },
        keys: {
            type: Array as PropType<string[]>,
            required: true,
        },
        value: String,
        selectedTreeItem: {
            type: Function as PropType<(treeItem: any, keys: string[]) => void>,
            required: true,
        },
    },
    setup(props) {
        const isOpen = ref(true);
        return {
            isOpen,
        };
    },
});
</script>

<style lang="scss" scoped>
.tree-box {
    position: relative;
    &:after {
        content: "";
        display: block;
        position: absolute;
        top: -13px;
        left: -2px;
        bottom: 0;
        border-left: 1px dashed #d9d9d9;
    }
    &:before {
        content: "";
        display: block;
        position: absolute;
        top: 5px;
        left: -2px;
        border-bottom: 1px dashed #d9d9d9;
        border-left: 1px dashed #d9d9d9;
        width: 10px;
        height: 10px;
    }
    &.no-before {
        &:before,
        &:after {
            display: none;
        }
    }
    &.no-icon {
        &:before {
            width: 20px;
        }
        > .tree-item {
            .tree-icon {
                display: none;
            }
            > .tree-name {
                padding: 0 15px;
                display: flex;
                justify-content: space-between;
                .count {
                    font-size: 12px;
                    // color: #a7aab4;
                }
            }
        }
    }
}
.tree-item {
    display: flex;
    align-items: center;
    height: 32px;
    position: relative;
    padding-left: 10px;
    .tree-name {
        color: var(--app-color-text-default);
        font-size: 14px;
        flex: 1;
        min-width: 0;
        // display: flex;
        // align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        padding-right: 15px;
        .count {
            font-size: 12px;
            color: #a7aab4;
        }
        &.active {
            .count {
                color: var(--app-color-primary);
            }
            color: var(--app-color-primary);
        }
    }
    .tree-icon {
        display: block;
        margin-right: 8px;
        width: 16px;
        cursor: pointer;
        visibility: hidden;
        position: relative;
        -webkit-user-drag: none;
        z-index: 1;
        top: -1px;
        &.visible {
            visibility: visible;
        }
    }
    .selected-bg {
        position: absolute;
        background-color: var(--app-color-primary);
        opacity: 0.2;
        border-radius: 2px;
        width: 100%;
        z-index: -1;
        right: 0;
        &.active {
            height: 100%;
        }
    }
}

.tree-item-add {
    color: var(--el-color-primary);
    height: 32px;
    display: flex;
    font-size: 14px;
    align-items: center;
    cursor: pointer;
    width: 64px;
    position: relative;
    z-index: 1;
    margin-left: 20px;
}

.tree-item-children {
    padding-left: 20px;
    display: block;
    //   position: relative;
    // transition: all 1s linear;
    // max-height: 1000px;
    &.close {
        // max-height: 0;
        display: none;
    }
}
</style>
