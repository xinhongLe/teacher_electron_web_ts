<template>
    <div class="resource-view">
        <el-dialog
            class="custom-dialog resource-dialog"
            width="90%"
            :close-on-press-escape="false"
            :model-value="visible"
            @close="close()"
        >
            <template #title>
                <div class="resource-header">
                    <ResourceItem
                        :name="name"
                        :hover="false"
                        v-if="resource"
                        :data="resource"
                        :lessonId="lessonId"
                        @eventEmit="eventEmit"
                    />
                </div>
            </template>
            <div
                class="resource-content"
                :class="{ 'full-screen': isFullScreen }"
            >
                <div class="full-screen-set" @click="setFullScreen()">
                    <img
                        src="@/assets/images/preparation/icon_quanping.png"
                        alt=""
                    />
                </div>
                <ResourceViewList
                    :type="resource?.ResourceShowType"
                    :resource="resource"
                    :data="data"
                    :target="target"
                    :lessonId="lessonId"
                    v-if="visible"
                    :close="close"
                    :isFullScreen="isFullScreen"
                />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { sleep } from "@/utils/common";
import { enterFullscreen, exitFullscreen } from "@/utils/fullscreen";
import {
    defineComponent,
    onMounted,
    onUnmounted,
    PropType,
    provide,
    ref,
    watch,
} from "vue";
import ResourceViewList from "@/views/resourceView/resourceViewList.vue";
import ResourceItem from "../resourceItem.vue";
import { IResourceItem } from "@/api/resource";
import { IViewResourceData } from "@/types/store";

export default defineComponent({
    components: { ResourceViewList, ResourceItem },
    props: {
        target: {
            type: String,
            default: "",
        },
        resource: {
            type: Object as PropType<IResourceItem>,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        lessonId: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        data: {
            type: Object as PropType<IViewResourceData>,
            required: true,
        },
    },
    emits: ["eventEmit", "update:visible", "closeDetail"],
    setup(props, { emit }) {
        const isFullScreen = ref(false);
        const close = () => {
            if (props.resource?.ResourceShowType === 5) {
                emit("closeDetail");
            } else {
                emit("update:visible", false);
            }
        };

        const setFullScreen = async () => {
            isFullScreen.value = !isFullScreen.value;
            if (isFullScreen.value) {
                if (
                    window.electron &&
                    !window.electron.isFullScreen() &&
                    !window.electron.isMac()
                ) {
                    window.electron.setFullScreen();
                    await sleep(300);
                }
                enterFullscreen();
            } else {
                exitFullscreen();
            }
        };

        const checkFullScreen = () => {
            if (!window.electron.isFullScreen() && isFullScreen.value) {
                isFullScreen.value = false;
            }
        };

        onMounted(() => {
            window.addEventListener("resize", checkFullScreen);
        });

        onUnmounted(() => {
            window.removeEventListener("resize", checkFullScreen);
        });

        const eventEmit = (
            command: string,
            data: IResourceItem,
            event?: MouseEvent | TouchEvent
        ) => {
            emit("eventEmit", command, data, event);
        };

        return {
            isFullScreen,
            close,
            setFullScreen,
            eventEmit,
        };
    },
});
</script>

<style lang="scss">
.resource-view {
    .resource-dialog {
        --el-dialog-margin-top: 4vh;
        height: 90vh;
        display: flex;
        flex-direction: column;
        min-height: 0;
        .el-dialog__body {
            background-color: #f5f6fa;
            flex: 1;
            min-height: 0;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            padding: var(--el-dialog-padding-primary);
        }
        .el-dialog__headerbtn {
            right: -30px;
            top: 0;
            background: rgba(255, 255, 255, 0.3);
            border: 1px solid white;
            .el-dialog__close {
                color: white;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.resource-header {
    // padding-right: 30px;
}

.resource-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    &.full-screen {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
    .full-screen-set {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 99;
        cursor: pointer;
    }
}
</style>
