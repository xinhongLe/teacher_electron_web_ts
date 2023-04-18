<template>
    <div ref="popoverRef">
        <slot></slot>

        <div class="triangle"></div>

        <transition name="fade">
            <div class="operation" v-show="visible" :style="{left:left+10+'px',top:top+'px'}" ref="operationRef">
                <template v-if="!data.ParentID && !flag">
                    <div @click.stop="handleItem(1)">
                        <img src="@/assets/edit/icon_file_add.png" alt=""/>
                        新增文件夹
                    </div>
                    <div @click.stop="handleItem(2)">
                        <img src="@/assets/edit/icon_page_add.png" alt=""/>
                        新增空白页
                    </div>
                    <div @click.stop="handleItem(3)">
                        <img src="@/assets/edit/icon_cmm.png" alt=""/>
                        重命名
                    </div>
                    <div @click.stop="handleItem(8)" class="delete">
                        <img src="@/assets/edit/icon_delete.png" alt=""/>
                        删除
                    </div>
                </template>
                <template v-if="data.ParentID && !flag">
                    <div @click.stop="handleItem(3)">
                        <img src="@/assets/edit/icon_cmm.png" alt=""/>
                        重命名
                    </div>
                    <div @click.stop="handleItem(4)">
                        <img src="@/assets/edit/icon_yc.png" alt=""/>
                        {{ data.State ? "隐藏" : "显示" }}
                    </div>
                    <div @click.stop="handleItem(5)">
                        <img src="@/assets/edit/icon_nt.png" alt=""/>
                        粘贴
                    </div>
                    <div v-show="data.Type !== 20" @click.stop="handleItem(7)">
                        <img src="@/assets/edit/icon_save.png" alt=""/>
                        保存为模板
                        <img class="tips" src="@/assets/edit/icon_help.png" alt="" @click.prevent.stop="handleShowTips($event)"/>
                    </div>
                    <div @click.stop="handleItem(8)" class="delete">
                        <img src="@/assets/edit/icon_delete.png" alt=""/>
                        删除
                    </div>
                </template>
                <template v-if="flag">
                    <div @click.stop="handleItem(2)">
                        <img src="@/assets/edit/icon_file_add.png" alt=""/>
                        新增空白页
                    </div>
                    <div @click.stop="handleItem(9)">
                        <img src="@/assets/edit/icon_page_add.png" alt=""/>
                        新增互动页
                    </div>
                </template>
            </div>
        </transition>

        <teleport to="body">
            <transition name="fade">
                <div class="tips-wrapper" v-if="tipsShow" :style="{left:tipsL+'px',top:tipsT+'px'}">
                    <div class="title">
                        <img src="@/assets/edit/pic_wenti.png" alt=""/>
                        小贴士
                    </div>
                    <p>
                        试试按住Shift键点选多页 <br/>
                        鼠标右击「<i>批量保存为模板</i>」
                    </p>

                    <div class="close-icon" @click="tipsShow = false">
                        <img src="@/assets/edit/icon_guanbi_small.png" alt=""/>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script lang=ts>
import { computed, defineComponent, PropType, onMounted, ref } from "vue";
import { CardProps, PageProps } from "@/views/preparation/intelligenceClassroom/api/props";

export default defineComponent({
    name: "CardPopover",
    props: {
        data: {
            type: Object as PropType<CardProps | PageProps>,
            default: null
        },
        placement: {
            type: String,
            default: "right-start"
        }
    },
    emits: ["handle"],
    setup(props, { emit, attrs, slots }) {
        const handleItem = (type: number) => {
            emit("handle", type, props.data);
        };

        const flag = computed(() => attrs.add === "");
        const popoverRef = ref<HTMLElement>();
        const operationRef = ref<HTMLElement>();

        const left = ref(0);
        const top = ref(0);
        const visible = ref(false);
        const tipsShow = ref(false);
        const tipsL = ref(0);
        const tipsT = ref(0);

        const handleShowTips = (e: MouseEvent) => {
            tipsL.value = e.x + 10;
            tipsT.value = e.y;
            tipsShow.value = true;
        };

        function getElementHeight(element: any) {
            const node = element.cloneNode(true);
            node.style.display = "block";
            node.style.position = "absolute";
            node.style.top = "-100000px";
            document.body.appendChild(node);

            const height = node.offsetHeight;
            document.body.removeChild(node);
            return height;
        }

        onMounted(() => {
            const slot = slots.default && slots.default()[0];
            const slotDom = document.getElementById(slot?.props?.id);
            const height = getElementHeight(operationRef.value);

            popoverRef.value?.addEventListener("mouseenter", function () {
                const t = slotDom?.getBoundingClientRect().top || 0;
                const l = slotDom?.getBoundingClientRect().left || 0;
                left.value = l + (slotDom?.clientWidth || 0);
                top.value = t + height > document.body.clientHeight ? t - height + 15 : t - 15;
                visible.value = true;
            });
            popoverRef.value?.addEventListener("mouseleave", function () {
                visible.value = false;
            });
        });

        return {
            top,
            left,
            flag,
            tipsL,
            tipsT,
            visible,
            tipsShow,
            popoverRef,
            operationRef,
            handleItem,
            handleShowTips
        };
    }
});
</script>

<style scoped lang="scss">
.operation {
    position: fixed;
    width: 162px;
    background: #FFFFFF;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 6px;
    box-sizing: border-box;
    z-index: 9999;

    img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }

    & > div {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 32px;
        padding-left: 10px;

        &:hover {
            background: #F7F8FA;
        }

        &.delete {
            color: #FB5151;
        }
    }
}

.triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 15px 10px 0;
    border-color: transparent transparent transparent transparent;
}

.tips {
    margin-left: 4px;
}

.tips-wrapper {
    width: 222px;
    height: 114px;
    background: rgba(31, 36, 54, 0.9);
    border-radius: 8px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    padding: 16px 20px;
    box-sizing: border-box;
    color: #FFFFFF;

    .title {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        img {
            width: 19px;
            height: 21px;
            margin-right: 8px;
        }
    }

    i {
        color: #2E95FF;
    }

    p {
        line-height: 20px;
    }

    .close-icon {
        width: 10px;
        height: 10px;
        padding: 10px;
        position: absolute;
        right: 15px;
        top: 5px;
        cursor: pointer;
        z-index: 9999;
        box-sizing: border-box;

        img {
            width: 10px;
            height: 10px;
        }
    }
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-enter-to, .fade-leave-from {
    opacity: 1;
}

.fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
}
</style>
