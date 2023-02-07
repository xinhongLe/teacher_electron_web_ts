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
                alt
                @click="isOpen = false"
            />
            <img
                class="tree-icon"
                v-show="isOpen && value === itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/shouqi_blue.png"
                alt
                @click="isOpen = false"
            />
            <img
                class="tree-icon"
                v-show="!isOpen && value !== itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/icon_zhankai.png"
                alt
                @click="isOpen = true"
            />
            <img
                class="tree-icon"
                v-show="!isOpen && value === itemData.Id"
                :class="{
                    visible: true,
                }"
                src="@/assets/images/preparation/icon_zhankai_blue.png"
                alt
                @click="isOpen = true"
            />
            <div
                class="tip-popover"
                v-if="
                    tipTarget === itemData.Id &&
                    popoverVisible &&
                    showClassArrangement
                "
                :style="{ top: tipOffset.y - 20 + 'px', left: '300px' }"
            >
                <div class="tip-title">拖动【课时】进右侧课表</div>
                <el-button type="primary" size="small" @click="know()"
                    >知道了</el-button
                >
            </div>
            <div
                ref="treeName"
                class="tree-name"
                @click="
                    zIndex === 0
                        ? (isOpen = !isOpen)
                        : selectedTreeItem(itemData, keys)
                "
                :class="{ active: value === itemData.Id }"
                :title="itemData.Name"
                :draggable="!!candrag && showClassArrangement"
                @dragstart="
                    onDragStart($event, {
                        ID: itemData.Id,
                        Name: itemData.Name,
                    })
                "
                @dragend="onDragEnd($event)"
                @drag="onDrag($event)"
            >
                {{ itemData.Name }}
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
                :showClassArrangement="showClassArrangement"
                :tipTarget="tipTarget"
            />
        </div>
    </div>
</template>

<script lang="ts">
import useDrag from "@/hooks/useDrag";
import { getDomOffset } from "@/utils/common";
import { get, set, STORAGE_TYPES } from "@/utils/storage";
import { PropType, defineComponent, ref, watch, reactive } from "vue";
import { ITreeItem } from "./types";
export default defineComponent({
    props: {
        itemData: {
            type: Object as PropType<ITreeItem>,
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
            type: Function as PropType<
                (treeItem: ITreeItem, keys: string[]) => void
            >,
            required: true,
        },
        showClassArrangement: {
            type: Boolean,
            default: false,
        },
        tipTarget: {
            type: String,
        },
        candrag: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const isOpen = ref(true);
        const popoverVisible = ref(false);
        const { onDragStart, onDrag, onDragEnd } = useDrag();
        const treeItemClick = () => {
            // if (props.itemData.children && props.itemData.children.length > 0) {
            //     // 存在下一级 点击展开或收起
            //     isOpen.value = !isOpen.value;
            // } else {
            //     // 最后一级，触发事件回去
            // }
        };

        const treeName = ref();
        const tipOffset = reactive({
            x: 0,
            y: 0,
        });

        watch(
            () => props.showClassArrangement,
            () => {
                if (
                    props.showClassArrangement &&
                    !get(STORAGE_TYPES.DRAGE_COURSE_TO_SCHEDULE)
                ) {
                    const { left, top } = getDomOffset(treeName.value);
                    tipOffset.x = left;
                    tipOffset.y = top;
                    popoverVisible.value = true;
                }
            }
        );

        const know = () => {
            set(STORAGE_TYPES.DRAGE_COURSE_TO_SCHEDULE, "ok");
            popoverVisible.value = false;
        };

        return {
            isOpen,
            popoverVisible,
            treeName,
            tipOffset,
            treeItemClick,
            onDragStart,
            onDrag,
            onDragEnd,
            know,
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
                padding-left: 15px;
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
        &.active {
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

.tip-popover {
    position: fixed;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.16);
    background: #fff;
    display: flex;
    align-items: center;
    z-index: 1;
    left: 20px;
    .tip-title {
        font-weight: 600;
        white-space: nowrap;
        margin-right: 25px;
        display: flex;
        align-items: center;
        font-size: 12px;
    }
    &:after {
        border: 1px solid var(--el-border-color-light);
        background: var(--el-color-white);
        position: absolute;
        width: 10px;
        height: 10px;
        z-index: 1;
        content: " ";
        transform: rotate(45deg);
        border-top-color: transparent;
        border-right-color: transparent;
        bottom: 20px;
        left: -5px;
    }
}
</style>
