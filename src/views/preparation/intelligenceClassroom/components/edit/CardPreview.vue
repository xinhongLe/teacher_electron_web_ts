<template>
    <div class="left" tabindex="0" :class="{collapse:!collapse}" ref="cardRef">
        <div class="placeholder"/>
        <vue-draggable-next
            tag="div"
            id="card"
            class="card"
            group="folder"
            @end="handleSort"
            v-model="windowCards"
        >
            <transition-group name="folder">
                <div class="folder" v-for="folder in windowCards" :key="folder.ID">
                    <div class="title" @click="folder.Fold = !folder.Fold">
                        <i class="triangle" :class="{rotate:!folder.Fold}"></i>
                        <img class="file-icon" src="@/assets/edit/icon_file.png" alt=""/>
                        <span>{{ folder.Name }}</span>
                        <card-popover :data="folder" @handle="handleCartItem" class="more" @click.stop>
                            <img src="@/assets/edit/icon_file_more.png" alt="" :id="`popover-${folder.ID}`"/>
                        </card-popover>
                    </div>
                    <vue-draggable-next
                        tag="div"
                        group="page"
                        class="pages"
                        v-show="folder.Fold"
                        @end="handleSort"
                        v-model="folder.PageList"
                    >
                        <transition-group name="page">
                            <div
                                class="page"
                                :key="page.ID"
                                v-for="page in folder.PageList"
                                @click="handlePageClick($event,page)"
                                v-contextmenu="() => contextMenus(page)"
                                @mousedown="handleSelect($event,page.ID)"
                            >
                                <div class="page-left">
                                    <p class="index">{{ page.Index }}</p>
                                    <img src="@/assets/edit/icon_donghua.png" alt="" v-if="checkIsHandle(2,page.Json)"/>
                                    <img src="@/assets/edit/icon_shijian.png" alt="" v-if="checkIsHandle(1,page.Json)"/>
                                </div>
                                <div class="page-right" :class="{active:pageId === page.ID}">
                                    <img class="cover" v-if="(page.Type === 20 || page.Type === 16) && page.Url" :src="page.Url" alt=""/>
                                    <template v-else>
                                        <thumbnail-slide
                                            :size="228"
                                            :slide="page.Json"
                                            v-if="[pageType.listen,pageType.element].includes(page.Type)"
                                        />
                                        <div class="view-empty" v-else>{{ page.Name }}</div>
                                    </template>

                                    <template v-if="!page.State">
                                        <img class="down" src="@/assets/edit/icon_yc1.png" alt=""/>
                                        <div class="masks"></div>
                                    </template>

                                    <div class="handle">
                                        <div class="name"
                                             v-if="[pageType.listen,pageType.element].includes(page.Type)">
                                            {{ page.Name }}
                                        </div>
                                        <card-popover :data="page" add @handle="handleCartItem" class="handler-item add">
                                            <img :id="`popover-add-${page.ID}`" src="@/assets/edit/icon_add_hover.png" alt=""/>
                                        </card-popover>

                                        <card-popover :data="page" @handle="handleCartItem" class="handler-item more">
                                            <img :id="`popover-more-${page.ID}`" src="@/assets/edit/icon_more_big.png" alt=""/>
                                        </card-popover>
                                    </div>
                                </div>

                                <img v-if="selectPageIds.includes(page.ID)" class="select-icon" src="@/assets/edit/icon_clicked.png" alt=""/>
                            </div>
                        </transition-group>
                    </vue-draggable-next>
                </div>
            </transition-group>
        </vue-draggable-next>
        <div class="pagination">
            当前页{{ currentPage?.Index || 1 }}/{{ total }}
        </div>
        <div class="shrink" @click="toggleCollapse">
            <el-icon :style="{ transform:'rotate(' + (collapse ? 0 : 180) + 'deg)'}">
                <ArrowLeft/>
            </el-icon>
        </div>
    </div>
</template>

<script lang=ts>
import { pageType } from "@/config";
import CardPopover from "./CardPopover.vue";
import { VueDraggableNext } from "vue-draggable-next";
import { computed, defineComponent, onMounted, PropType, ref, watch } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    name: "CardPreview",
    components: { VueDraggableNext, CardPopover },
    emits: ["handle"],
    props: {
        collapse: {
            type: Boolean,
            default: true
        },
        cards: {
            type: Array as PropType<CardProps[]>,
            default: () => []
        },
        pageId: {
            type: String,
            default: ""
        },
        selectPageIds: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const windowCards = ref<CardProps[]>(props.cards);
        const currentPage = computed(() => {
            let allPages: PageProps[] = [];
            windowCards.value.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            return allPages.find(item => item.ID === props.pageId);
        });

        const total = computed(() => {
            let allPages: PageProps[] = [];
            windowCards.value.forEach(item => {
                allPages = allPages.concat(...item.PageList);
            });
            return allPages.length;
        });

        watch(() => props.cards, val => {
            windowCards.value = val;
        }, { deep: true, immediate: true });

        // 判断该PPT有无事件，动画，超链接素材（1-事件，2-动画，3-超链接素材）
        const checkIsHandle = (type: 1 | 2 | 3, json: any) => {
            if (!json) return false;
            if (type === 1) {
                return (json.elements || []).filter((item: any) => item.actions && item.actions.length > 0).length > 0;
            }
            if (type === 2) {
                return json.animations && json.animations.length > 0;
            }
            return false;
        };

        const contextMenus = (page: PageProps) => {
            return [
                {
                    text: "保存模板",
                    subText: "",
                    handler: () => {
                        emit("handle", { type: 6, params: page });
                    }
                },
                {
                    text: "复制",
                    subText: "",
                    handler: () => {
                        emit("handle", { type: 3, params: { type: 6, data: page } });
                    }
                }
            ];
        };

        // 关闭预览窗
        const toggleCollapse = () => {
            emit("handle", { type: 1 });
        };

        // 排序
        const handleSort = () => {
            emit("handle", { type: 2, params: windowCards.value });
        };

        // 悬浮框操作
        const handleCartItem = (type: number, data: PageProps | CardProps) => {
            emit("handle", { type: 3, params: { type, data } });
        };

        // 切换页
        const handlePageClick = (e: KeyboardEvent, page: PageProps) => {
            if (e?.shiftKey || e?.ctrlKey || page.ID === props.pageId) return;
            emit("handle", { type: 4, params: page.ID });
        };

        // 按住shift和ctrl选中
        const handleSelect = (e: KeyboardEvent, id: string) => {
            if (e.shiftKey && e.ctrlKey) return;
            if (!(e.shiftKey || e.ctrlKey)) return;
            emit("handle", { type: 5, params: id });
        };

        const cardRef = ref();
        onMounted(() => {
            if (!cardRef.value) return;

            cardRef.value.addEventListener("keydown", (e: KeyboardEvent) => {
                e.stopPropagation();
                const key = e.code;

                if (e.ctrlKey && key === "KeyC") {
                    emit("handle", { type: 3, params: { type: 6, data: currentPage.value } });
                }
                if (e.ctrlKey && key === "KeyV") {
                    emit("handle", { type: 3, params: { type: 5, data: currentPage.value } });
                }
            });
        });

        return {
            total,
            cardRef,
            pageType,
            handleSort,
            currentPage,
            windowCards,
            handleSelect,
            contextMenus,
            checkIsHandle,
            toggleCollapse,
            handleCartItem,
            handlePageClick

        };
    }
});
</script>

<style scoped lang="scss">
.left {
    width: 280px;
    height: 100%;
    position: relative;
    transition: all 0.5s;

    &.collapse {
        width: 0;
    }

    .placeholder {
        height: 56px;
        box-shadow: inset 0px -1px 0px 0px #EBEFF1;
    }

    .card {
        height: calc(100% - 96px);
        overflow-y: auto;

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

            .more {
                position: absolute;
                right: 0;
                width: 15px;
                height: 30px;
                display: flex;
                align-items: center;

                img {
                    width: 15px;
                    height: 3px;
                }
            }
        }

        .pages {
            transition: 0.5s;

            & .page:last-child {
                margin-bottom: 0;
            }

            .page {
                display: flex;
                margin-bottom: 16px;
                position: relative;
                cursor: pointer;

                .select-icon {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    left: 20px;
                    z-index: 9999;
                }

                .page-left {
                    width: 24px;

                    .index {
                        color: #5D5D5D;
                        font-size: 12px;
                    }

                    img {
                        width: 14px;
                        height: 14px;
                        margin-top: 8px;
                        margin-left: -3px;
                        display: block;
                    }
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

                        .handler-item {
                            display: flex !important;
                        }
                    }

                    &:hover .handler-item {
                        display: flex !important;
                    }

                    .down {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        top: 8px;
                        right: 10px;
                    }

                    .masks {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: rgba(255, 255, 255, 0.5);
                        z-index: 99;
                    }

                    .handle {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        height: 40px;
                        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);

                        .handler-item {
                            position: absolute;
                            align-items: center;
                            justify-content: center;
                            width: 32px;
                            height: 32px;
                            display: none;

                            &.add {
                                right: 75px;
                                bottom: -16px;

                                img {
                                    width: 32px;
                                    height: 32px;
                                    display: block;
                                    z-index: 99;
                                }
                            }

                            &.more {
                                right: 0;
                                bottom: 0;

                                img {
                                    width: 15px;
                                    height: 3px;
                                    display: block;
                                    z-index: 99;
                                }
                            }
                        }
                    }

                    .view-empty {
                        width: 100%;
                        height: 128px;
                        padding: 10px;
                        border: 1px solid #ebeff1;
                        display: flex;
                        align-items: flex-end;
                        background-image: url("../../../../../assets/edit/pic_defaulted.png");
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
    }

    .pagination {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        padding-right: 12px;
        box-sizing: border-box;
        color: #333;
        text-align: right;
    }

    .shrink {
        position: absolute;
        width: 12px;
        height: 64px;
        border-radius: 6px;
        top: 50%;
        margin-top: -32px;
        right: -12px;
        z-index: 99;
        cursor: pointer;
        overflow: hidden;
        background: #414E65;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
