<template>
    <div class="win-preview">
        <div class="shrink" @click="handleIsHideL" :style="{left:lVisit ? '280px':0}">
            <el-icon :style="{ transform:'rotate(' + (lVisit ? 0 : 180) + 'deg)'}">
                <ArrowLeft/>
            </el-icon>
        </div>
        <div class="left" v-if="lVisit">
            <div class="folder" v-for="folder in cards" :key="folder.CardID">
                <div class="title" @click="folder.Fold = !folder.Fold">
                    <i class="triangle" :class="{rotate:!folder.Fold}"></i>
                    <img class="file-icon" src="@/assets/edit/icon_file.png" alt=""/>
                    <span>{{ folder.CardName }}</span>
                </div>
                <div class="pages" v-if="folder.Fold">
                    <div class="page" v-for="page in folder.Pages" :key="page.PageID" @click="handlePage(page.Index)">
                        <div class="page-left">{{ page.Index }}</div>
                        <div class="page-right" :class="{active: page.Index === index+1}">
                            <img
                                alt=""
                                class="cover"
                                v-if="(page.Type === 20 || page.Type === 16) && page.Url" :src="page.Url"
                            />
                            <template v-else>
                                <thumbnail-slide
                                    :size="228"
                                    :slide="page.Json"
                                    v-if="[pageType.listen,pageType.element].includes(page.PageType)"
                                />
                                <div class="view-empty" v-else>{{ page.PageName }}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="center" :style="{width:centerW}">
            <screen-view
                ref="screenRef"
                :inline="true"
                @pagePrev="pagePrev"
                @pageNext="pageNext"
                :slide="currentSlide"
                :is-show-pen-tools="false"
            />
        </div>
        <div class="right" v-if="rVisit">

        </div>
    </div>
</template>

<script lang=ts>
import { computed, defineComponent, PropType, ref } from "vue";
import { CardProps, PageProps } from "./props";
import { ElMessage } from "element-plus";
import { pageType } from "@/config";

export default defineComponent({
    name: "WinPreview",
    props: {
        cards: {
            type: Array as PropType<CardProps[]>,
            default: () => []
        },
        pages: {
            type: Array as PropType<PageProps[]>,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        lVisit: {
            type: Boolean,
            default: true
        },
        rVisit: {
            type: Boolean,
            default: false
        }
    },
    emits: ["update:index", "update:l-visit"],
    setup(props, { emit }) {
        const currentSlide = computed(() => {
            const page = props.pages[props.index];
            return page ? page.Json : {};
        });

        const centerW = computed(() => {
            let w = 0;
            if (props.lVisit) {
                w += 280;
            }
            if (props.rVisit) {
                w += 279;
            }

            return `calc(100% - ${w}px)`;
        });

        const handlePage = (index: number) => {
            emit("update:index", index - 1);
        };

        const screenRef = ref();
        const prevStep = () => {
            screenRef.value && screenRef.value.execPrev();
        };
        const nextStep = () => {
            screenRef.value && screenRef.value.execNext();
        };

        const pagePrev = () => {
            if (props.index === 0) {
                ElMessage.warning("已经第一页了");
                return;
            }
            const index = props.index - 1;
            emit("update:index", index);
        };

        const pageNext = () => {
            if (props.index === props.pages?.length - 1) {
                ElMessage.warning("已经最后一页了");
                return;
            }
            const index = props.index + 1;
            emit("update:index", index);
        };

        const previewHandle = (data: { type: 1 | 2 | 3, e?: MouseEvent, option?: string, value?: number }) => {
            // 工具栏-形状
            if (data.type === 1) {
                screenRef.value.openShape(data.e);
            }
            // 工具栏-画笔
            if (data.type === 2) {
                screenRef.value.openPaintTool(data.e, data.option);
            }
            // 工具栏 画笔配置
            if (data.type === 3) {
                screenRef.value.whiteboardOption(data.option, data.value);
            }
        };

        const handleIsHideL = () => {
            emit("update:l-visit", !props.lVisit);
        };

        return {
            centerW,
            prevStep,
            nextStep,
            pagePrev,
            pageNext,
            pageType,
            screenRef,
            handlePage,
            currentSlide,
            handleIsHideL,
            previewHandle
        };
    }
});
</script>

<style scoped lang="scss">
.win-preview {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    & > div {
        height: 100%;
        background: #FFFFFF;
    }

    .shrink {
        position: absolute;
        width: 12px;
        height: 64px;
        border-radius: 6px;
        top: 50%;
        margin-top: -32px;
        z-index: 99;
        cursor: pointer;
        overflow: hidden;
        background: #414E65;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .left {
        width: 280px;
        overflow-y: auto;
    }

    .center {
        background: #F6F7F8;
    }

    .right {
        width: 279px;
    }
}

.folder {
    margin: 0 16px 0 12px;
    width: calc(100% - 28px);
}

.title {
    height: 44px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    width: 100%;

    .triangle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 3px 0 3px;
        border-color: #414E65 transparent transparent transparent;
        border-radius: 1px;
        transition: 0.5s;
        transform-origin: center;

        &.rotate {
            transform: rotate(-90deg);
        }
    }

    .file-icon {
        height: 14px;
        width: 14px;
        margin: 0 8px 0 5px;
    }
}

.pages {
    transition: all 0.5s;

    & .page:last-child {
        margin-bottom: 0;
    }

    .page {
        display: flex;
        margin-bottom: 16px;
        position: relative;
        cursor: pointer;

        .page-left {
            width: 24px;
            color: #5D5D5D;
            font-size: 12px;
        }

        .page-right {
            flex: 1;
            position: relative;
            width: 228px;
            height: 128px;

            .cover {
                width: 100%;
                height: 100%;
            }

            &.active {
                outline: 2px solid #2E95FF;
            }

            .view-empty {
                width: 100%;
                height: 128px;
                padding: 10px;
                border: 1px solid #ebeff1;
                display: flex;
                align-items: flex-end;
                background-image: url("../../../../assets/edit/pic_defaulted.png");
                background-size: cover;
                background-repeat: no-repeat;
            }

            .name {
                color: #FFFFFF;
                font-size: 12px;
                position: absolute;
                left: 10px;
                bottom: 10px;
            }
        }
    }
}

::v-deep(.slide-list) {
    background-color: #F6F7F8;
}

.collapse-enter-from, .collapse-leave-from {
    width: 280px;
}

.collapse-enter-active, .collapse-leave-active {
    transition: width 10s;
}

.collapse-enter-to, .collapse-leave-to {
    width: 0;
}
</style>
